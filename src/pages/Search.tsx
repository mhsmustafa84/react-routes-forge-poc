import { useEffect, useState } from "react";
import { build, isActivePath, extractQueryFromPath } from "react-routes-forge";
import type { QueryParams } from "react-routes-forge";
import { useNavigateTo, useTypedSearchParams } from "react-routes-forge/hooks";
import { useLocation } from "react-router-dom";
import { PATHS } from "../paths";

const TAG_OPTIONS = ["react", "typescript", "security", "admin", "moderator"];

const toStr = (v: unknown): string =>
  v == null ? "" : Array.isArray(v) ? String(v[0] ?? "") : String(v);

const toTagList = (v: unknown): string[] =>
  v == null ? [] : Array.isArray(v) ? v.map(String) : [String(v)];

type Snippet = {
  title: string;
  code: string;
  result: string;
  run: () => void;
};

export default function Search() {
  const navigate = useNavigateTo();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>(["react"]);
  const [sort, setSort] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const c = extractQueryFromPath(location.search, { coerceBooleans: true });
    setQuery(toStr(c.q));
    setSort(toStr(c.sort));
    setActive(c.active === true);
    const urlTags = toTagList(c.tags).filter((t) => TAG_OPTIONS.includes(t));
    setTags(urlTags.length ? urlTags : ["react"]);
  }, [location.search]);

  const params: QueryParams = {
    q: query.trim() || undefined,
    tags,
    sort: sort || undefined,
    active: active || undefined,
  };
  const url = build(PATHS.SEARCH, {}, params);

  const isSearchActive = isActivePath(location.pathname, PATHS.SEARCH);
  const parsed = extractQueryFromPath(location.search);
  const parsedCoerced = extractQueryFromPath(location.search, {
    coerceBooleans: true,
  });
  const parsedTyped = extractQueryFromPath(location.search, {
    coerceBooleans: true,
    coerceNumbers: true,
  });

  const [typedQuery, setTypedQuery] = useTypedSearchParams({
    coerceBooleans: true,
    coerceNumbers: true,
  });

  const toggleTag = (tag: string) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );

  const runSearch = () => navigate(url);
  const clear = () => navigate(PATHS.SEARCH);

  const handleStrictMode = () => {
    try {
      build("/users/:id", {}, undefined, { strict: true });
    } catch (e) {
      alert(`Strict mode caught: ${(e as Error).message}`);
    }
  };

  const snippets: Snippet[] = [
    {
      title: "Array values",
      code: `build(PATHS.SEARCH, {}, { q: "react", tags: ["admin", "moderator"] })`,
      result: build(
        PATHS.SEARCH,
        {},
        { q: "react", tags: ["admin", "moderator"] },
      ),
      run: () =>
        navigate(
          build(PATHS.SEARCH, {}, { q: "react", tags: ["admin", "moderator"] }),
        ),
    },
    {
      title: "null / undefined dropped",
      code: `build(PATHS.SEARCH, {}, { q: "hello", sort: "asc", filter: undefined, ref: null })`,
      result: build(
        PATHS.SEARCH,
        {},
        { q: "hello", sort: "asc", filter: undefined, ref: null },
      ),
      run: () =>
        navigate(
          build(
            PATHS.SEARCH,
            {},
            { q: "hello", sort: "asc", filter: undefined, ref: null },
          ),
        ),
    },
    {
      title: "Boolean values",
      code: `build(PATHS.SEARCH, {}, { active: true, draft: false })`,
      result: build(PATHS.SEARCH, {}, { active: true, draft: false }),
      run: () =>
        navigate(build(PATHS.SEARCH, {}, { active: true, draft: false })),
    },
    {
      title: "Hash fragment",
      code: `build("/users/:id", { id: 7 }, { tab: "info" }, { hash: "details" })`,
      result: build(
        "/users/:id",
        { id: 7 },
        { tab: "info" },
        { hash: "details" },
      ),
      run: () =>
        navigate(
          build("/users/:id", { id: 7 }, { tab: "info" }, { hash: "details" }),
        ),
    },
    {
      title: "Strict mode",
      code: `build("/users/:id", {}, undefined, { strict: true })`,
      result: "throws RangeError",
      run: handleStrictMode,
    },
  ];

  return (
    <div>
      <h1>Search</h1>
      <p>
        Build a query string with <code>build()</code>, navigate, then read it
        back with <code>extractQueryFromPath()</code> — the round trip.
      </p>

      <section className="search-card" aria-label="Query builder">
        <div className="search-row">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, tags, anything…"
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          <button className="btn-primary" onClick={runSearch}>
            Run search
          </button>
        </div>

        <div className="search-row search-row--chips">
          <span className="search-label">Tags</span>
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              className={tags.includes(tag) ? "chip chip--active" : "chip"}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="search-row search-row--controls">
          <label className="search-control">
            <span className="search-label">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">default</option>
              <option value="asc">ascending</option>
              <option value="desc">descending</option>
            </select>
          </label>
          <label className="search-control search-control--toggle">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span>Active only</span>
          </label>
          <span className="search-status">
            <code>isActivePath = {isSearchActive ? "yes" : "no"}</code>
          </span>
        </div>

        <p className="search-label">Built URL (live)</p>
        <pre className="url-preview">{url}</pre>
        <button onClick={clear}>Clear query params</button>
        <button
          onClick={() =>
            setTypedQuery({ q: "typed", page: 2, active: true }, { replace: true })
          }
        >
          setTypedQuery(&#123; q: "typed", page: 2, active: true &#125;)
        </button>
      </section>

      <section className="debug-section" aria-label="Read back">
        <h3>Reading the current URL back</h3>
        <table className="debug-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>location.search</code>
              </td>
              <td>
                <code>{location.search || "(empty)"}</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>extractQueryFromPath(location.search)</code>
              </td>
              <td>
                <code>{JSON.stringify(parsed)}</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>extractQueryFromPath(location.search, &#123; coerceBooleans: true &#125;)</code>
              </td>
              <td>
                <code>{JSON.stringify(parsedCoerced)}</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>extractQueryFromPath(location.search, &#123; coerceBooleans: true, coerceNumbers: true &#125;)</code>
              </td>
              <td>
                <code>{JSON.stringify(parsedTyped)}</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>useTypedSearchParams(&#123; coerceBooleans: true, coerceNumbers: true &#125;)[0]</code>
              </td>
              <td>
                <code>{JSON.stringify(typedQuery)}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-label="Query string behaviors">
        <h3>Query string behaviors</h3>
        <div className="snippet-stack">
          {snippets.map((s) => (
            <div className="snippet-card" key={s.title}>
              <h4>{s.title}</h4>
              <pre className="snippet-code">{s.code}</pre>
              <p className="snippet-result">
                → <code>{s.result}</code>
              </p>
              <button className="btn-secondary" onClick={s.run}>
                Run demo
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
