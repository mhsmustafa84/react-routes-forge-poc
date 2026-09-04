import { useState } from "react";
import {
  defineRoutes,
  flattenRoutes,
  joinPaths,
  getParamNames,
  extractParamsFromPath,
  extractQueryFromPath,
  matchPath,
  build,
  buildPath,
  extractParamNames,
  appendQuery,
  isDynamic,
  isActivePath,
  getBreadcrumbs,
  clearPathCache,
  devWarn,
} from "react-routes-forge";
import type { RouteTree } from "react-routes-forge";
import { useResolvedPath } from "react-routes-forge/hooks";
import { PATHS } from "../paths";

const DEMO_JOIN = [
  {
    label: 'joinPaths("/users", "edit", ":id")',
    result: joinPaths("/users", "edit", ":id"),
  },
  {
    label: 'joinPaths("/api/", "/v1/", "/users")',
    result: joinPaths("/api/", "/v1/", "/users"),
  },
  { label: 'joinPaths("", "home")', result: joinPaths("", "home") },
];

const DEMO_PARAM_NAMES = [
  { label: 'getParamNames("/users/:id")', result: getParamNames("/users/:id") },
  {
    label: 'getParamNames("/posts/:postId/comments/:commentId")',
    result: getParamNames("/posts/:postId/comments/:commentId"),
  },
  {
    label: 'getParamNames("/users/edit/:id")',
    result: getParamNames("/users/edit/:id"),
  },
  {
    label: 'getParamNames("/products/:category/:productId")',
    result: getParamNames("/products/:category/:productId"),
  },
  { label: 'getParamNames("/static")', result: getParamNames("/static") },
];

const DEMO_EXTRACT = [
  {
    label: 'extractParamsFromPath("/users/:id", "/users/42")',
    result: JSON.stringify(extractParamsFromPath("/users/:id", "/users/42")),
  },
  {
    label:
      'extractParamsFromPath("/posts/:postId/comments/:commentId", "/posts/5/comments/12")',
    result: JSON.stringify(
      extractParamsFromPath(
        "/posts/:postId/comments/:commentId",
        "/posts/5/comments/12",
      ),
    ),
  },
  {
    label: 'extractParamsFromPath("/users/:id", "/roles/42") (no match)',
    result: JSON.stringify(extractParamsFromPath("/users/:id", "/roles/42")),
  },
  {
    label:
      'extractParamsFromPath("/products/:category/:productId", "/products/electronics/99")',
    result: JSON.stringify(
      extractParamsFromPath(
        "/products/:category/:productId",
        "/products/electronics/99",
      ),
    ),
  },
];

const DEMO_IS_DYNAMIC = [
  { label: 'isDynamic("/users/:id")', result: String(isDynamic("/users/:id")) },
  {
    label: 'isDynamic("/profile/:section?")',
    result: String(isDynamic("/profile/:section?")),
  },
  { label: 'isDynamic("/users")', result: String(isDynamic("/users")) },
  { label: 'isDynamic("/")', result: String(isDynamic("/")) },
];

const DEMO_BUILD_PATH = [
  {
    label: 'buildPath("/users/:id", { id: 42 })',
    result: buildPath("/users/:id", { id: 42 }),
  },
  {
    label: 'buildPath("/users/:id", {}, undefined, { strict: true })',
    result: "throws RangeError",
  },
  {
    label: 'buildPath("/profile/:section?", {})',
    result: buildPath("/profile/:section?", {}),
  },
  {
    label: 'buildPath("/profile/:section?", { section: "settings" })',
    result: buildPath("/profile/:section?", { section: "settings" }),
  },
];

const DEMO_EXTRACT_PARAM_NAMES = [
  {
    label: 'extractParamNames("/users/:id")',
    result: JSON.stringify(extractParamNames("/users/:id")),
  },
  {
    label: 'extractParamNames("/profile/:section?")',
    result: JSON.stringify(extractParamNames("/profile/:section?")),
  },
  {
    label: 'extractParamNames("/posts/:postId/comments/:commentId")',
    result: JSON.stringify(
      extractParamNames("/posts/:postId/comments/:commentId"),
    ),
  },
  {
    label: 'extractParamNames("/static")',
    result: JSON.stringify(extractParamNames("/static")),
  },
];

const STRING_GOTCHAS = [
  { label: `typeof PATHS.HOME`, result: JSON.stringify(typeof PATHS.HOME) },
  {
    label: `typeof PATHS.USERS.EDIT`,
    result: JSON.stringify(typeof PATHS.USERS.EDIT),
  },
  { label: `PATHS.HOME === "/"`, result: String(PATHS.HOME === "/") },
  {
    label: `PATHS.USERS.EDIT === "/users/edit/:id"`,
    result: String(PATHS.USERS.EDIT === "/users/edit/:id"),
  },
  { label: `String(PATHS.USERS.EDIT)`, result: String(PATHS.USERS.EDIT) },
  { label: `\`\${PATHS.USERS.EDIT}\``, result: `${PATHS.USERS.EDIT}` },
  {
    label: `new Map([[PATHS.HOME, "home"]]).get(PATHS.HOME)`,
    result: JSON.stringify(
      new Map([[PATHS.HOME, "home"]]).get(PATHS.HOME) ?? null,
    ),
  },
  {
    label: `build("/foo", {}) — plain template via build()`,
    result: build("/foo", {}),
  },
  {
    label: `getParamNames("/users/:id") — plain template`,
    result: JSON.stringify(getParamNames("/users/:id")),
  },
];

const DEMO_MATCH = [
  {
    label: 'matchPath("/users/:id").test("/users/42")',
    result: String(matchPath("/users/:id").test("/users/42")),
  },
  {
    label: 'matchPath("/users/:id").test("/users/42/posts")',
    result: String(matchPath("/users/:id").test("/users/42/posts")),
  },
  {
    label: 'matchPath("/users/:id").exec("/users/42")',
    result: JSON.stringify(
      matchPath("/users/:id").exec("/users/42")?.slice(1) ?? [],
    ),
  },
  {
    label:
      'matchPath("/posts/:postId/comments/:commentId").exec("/posts/7/comments/99")',
    result: JSON.stringify(
      matchPath("/posts/:postId/comments/:commentId")
        .exec("/posts/7/comments/99")
        ?.slice(1) ?? [],
    ),
  },
];

const DEMO_SPLAT = [
  {
    label: 'build("/files/*", { "*": "reports/2026/q1" })',
    result: build("/files/*", { "*": "reports/2026/q1" }),
  },
  {
    label: 'build("/files/*", { "*": "a b/c?d" })',
    result: build("/files/*", { "*": "a b/c?d" }),
  },
  {
    label: 'build("/files/*", {}) (splat dropped)',
    result: build("/files/*", {}),
  },
  {
    label: 'extractParamsFromPath("/files/*", "/files/a/b")',
    result: JSON.stringify(extractParamsFromPath("/files/*", "/files/a/b")),
  },
  {
    label: 'isActivePath("/files/a/b/c", "/files/*")',
    result: String(isActivePath("/files/a/b/c", "/files/*")),
  },
  { label: 'isDynamic("/files/*")', result: String(isDynamic("/files/*")) },
  {
    label: 'getParamNames("/files/*")',
    result: JSON.stringify(getParamNames("/files/*")),
  },
];

const DEMO_APPEND_QUERY = [
  {
    label: 'appendQuery("/users?tab=list", { page: 2 })',
    result: appendQuery("/users?tab=list", { page: 2 }),
  },
  {
    label: 'appendQuery("/users#top", { tab: "list" })',
    result: appendQuery("/users#top", { tab: "list" }),
  },
  {
    label: 'appendQuery("/users", { active: true })',
    result: appendQuery("/users", { active: true }),
  },
  {
    label: 'appendQuery("/users", { tag: ["a", "b"] })',
    result: appendQuery("/users", { tag: ["a", "b"] }),
  },
];

const DEMO_EXTRACT_QUERY = [
  {
    label: 'extractQueryFromPath("/users/42?tab=profile&tag=a&tag=b")',
    result: JSON.stringify(
      extractQueryFromPath("/users/42?tab=profile&tag=a&tag=b"),
    ),
  },
  {
    label:
      'extractQueryFromPath("/search?active=true", { coerceBooleans: true })',
    result: JSON.stringify(
      extractQueryFromPath("/search?active=true", { coerceBooleans: true }),
    ),
  },
  {
    label: 'extractQueryFromPath("/plain")',
    result: JSON.stringify(extractQueryFromPath("/plain")),
  },
];

const DEMO_ACTIVE = [
  {
    label: 'isActivePath("/Users/42", "/users/:id")',
    result: String(isActivePath("/Users/42", "/users/:id")),
  },
  {
    label: 'isActivePath("/Users/42", "/users/:id", { caseSensitive: true })',
    result: String(
      isActivePath("/Users/42", "/users/:id", { caseSensitive: true }),
    ),
  },
  {
    label: 'isActivePath("/users/42/", "/users/:id")',
    result: String(isActivePath("/users/42/", "/users/:id")),
  },
  {
    label: 'isActivePath("/users", "/users/:id")',
    result: String(isActivePath("/users", "/users/:id")),
  },
  {
    label: 'isActivePath("/users", "/users/:id", { exact: false })',
    result: String(isActivePath("/users", "/users/:id", { exact: false })),
  },
  {
    label: 'isActivePath("/users", "/users/") (template trailing slash)',
    result: String(isActivePath("/users", "/users/")),
  },
  {
    label:
      'isActivePath("/users/42/posts", "/users/:id", { caseSensitive: true }) (partial opts)',
    result: String(
      isActivePath("/users/42/posts", "/users/:id", { caseSensitive: true }),
    ),
  },
  {
    label:
      'isActivePath("/users/42/posts", "/users/:id", { caseSensitive: false })',
    result: String(
      isActivePath("/users/42/posts", "/users/:id", { caseSensitive: false }),
    ),
  },
];

const DEMO_BREADCRUMBS = [
  {
    label: 'getBreadcrumbs(PATHS, "/users/edit/42")',
    result: JSON.stringify(getBreadcrumbs(PATHS, "/users/edit/42")),
  },
  {
    label: 'getBreadcrumbs(PATHS, "/posts/7/comments/99")',
    result: JSON.stringify(getBreadcrumbs(PATHS, "/posts/7/comments/99")),
  },
  {
    label: 'getBreadcrumbs(PATHS, "/products/electronics/1")',
    result: JSON.stringify(getBreadcrumbs(PATHS, "/products/electronics/1")),
  },
];

const DEMO_SUFFIX = [
  {
    label: 'getParamNames("/files/:name.json")',
    result: JSON.stringify(getParamNames("/files/:name.json")),
  },
  {
    label: 'build("/files/:name.json", { name: "report" })',
    result: build("/files/:name.json", { name: "report" }),
  },
  {
    label: 'isActivePath("/files/report.json", "/files/:name.json")',
    result: String(isActivePath("/files/report.json", "/files/:name.json")),
  },
  {
    label: 'extractParamsFromPath("/files/:name.json", "/files/report.json")',
    result: JSON.stringify(
      extractParamsFromPath("/files/:name.json", "/files/report.json"),
    ),
  },
  {
    label: 'build("/files/:name", { name: "report.json" })',
    result: build("/files/:name", { name: "report.json" }),
  },
  {
    label:
      'buildPath("/files/:name.json", { name: "report" }, undefined, { strict: true })',
    result: buildPath("/files/:name.json", { name: "report" }, undefined, {
      strict: true,
    }),
  },
];

const DEMO_MATCH_OPTIONS = [
  {
    label: 'matchPath("/users/:id", { end: false }).test("/users/42/posts")',
    result: String(
      matchPath("/users/:id", { end: false }).test("/users/42/posts"),
    ),
  },
  {
    label: 'matchPath("/users/:id", { end: false }).test("/users/42")',
    result: String(matchPath("/users/:id", { end: false }).test("/users/42")),
  },
  {
    label: 'matchPath("/Users", { caseSensitive: true }).test("/users")',
    result: String(matchPath("/Users", { caseSensitive: true }).test("/users")),
  },
  {
    label: 'matchPath("/Users").test("/users")',
    result: String(matchPath("/Users").test("/users")),
  },
];

const DEMO_STATIC_BUILD = [
  { label: "PATHS.HOME.build()", result: PATHS.HOME.build() },
  {
    label: 'PATHS.SEARCH.build({ q: "react", page: 1 })',
    result: PATHS.SEARCH.build({ q: "react", page: 1 }),
  },
  {
    label: 'PATHS.FILES.ROOT.build({ sort: "name" })',
    result: PATHS.FILES.ROOT.build({ sort: "name" }),
  },
  { label: "typeof PATHS.HOME", result: JSON.stringify(typeof PATHS.HOME) },
  { label: 'PATHS.HOME == "/"', result: String(PATHS.HOME == "/") },
  { label: "clearPathCache()", result: "cleared caches" },
];

const DEMO_ROUTE_TREE: RouteTree = {
  HOME: "/",
  USERS: { ROOT: "/users", EDIT: "/users/edit/:id" },
};

const DEMO_BUILD_RELATIVE = [
  { label: "PATHS.HOME.buildRelative()", result: PATHS.HOME.buildRelative() },
  {
    label: "PATHS.USERS.ROOT.buildRelative()",
    result: PATHS.USERS.ROOT.buildRelative(),
  },
  {
    label: "PATHS.USERS.EDIT.buildRelative({ id: 42 })",
    result: PATHS.USERS.EDIT.buildRelative({ id: 42 }),
  },
  {
    label:
      'PATHS.POSTS.DETAILS.buildRelative({ postId: 7, commentId: 42 }, { tab: "all" }, { hash: "reply" })',
    result: PATHS.POSTS.DETAILS.buildRelative(
      { postId: 7, commentId: 42 },
      { tab: "all" },
      { hash: "reply" },
    ),
  },
  {
    label: 'PATHS.PROFILE.DETAILS.buildRelative({ section: "settings" })',
    result: PATHS.PROFILE.DETAILS.buildRelative({ section: "settings" }),
  },
  {
    label: 'PATHS.FILES.DETAILS.buildRelative({ "*": "docs/readme" })',
    result: PATHS.FILES.DETAILS.buildRelative({ "*": "docs/readme" }),
  },
];

const DEMO_LOCALE = [
  {
    label:
      'build(PATHS.USERS.DETAILS, { id: 42 }, undefined, { locale: "en-US" })',
    result: build(PATHS.USERS.DETAILS, { id: 42 }, undefined, {
      locale: "en-US",
    }),
  },
  {
    label: 'build(PATHS.SEARCH, {}, { q: "forge" }, { locale: "/fr/" })',
    result: build(PATHS.SEARCH, {}, { q: "forge" }, { locale: "/fr/" }),
  },
  {
    label:
      'PATHS.PRODUCTS.DETAILS.build({ category: "audio", productId: 88 }, undefined, { locale: "de", hash: "specs" })',
    result: PATHS.PRODUCTS.DETAILS.build(
      { category: "audio", productId: 88 },
      undefined,
      { locale: "de", hash: "specs" },
    ),
  },
  {
    label:
      'PATHS.USERS.EDIT.buildRelative({ id: 10 }, undefined, { locale: "es" })',
    result: PATHS.USERS.EDIT.buildRelative({ id: 10 }, undefined, {
      locale: "es",
    }),
  },
];

const DEMO_NESTED_QUERY = [
  {
    label:
      'appendQuery("/search", { filter: { category: "books", rating: 5 }, page: 1 })',
    result: appendQuery("/search", {
      filter: { category: "books", rating: 5 },
      page: 1,
    }),
  },
  {
    label:
      'extractQueryFromPath("/search?filter[category]=books&filter[rating]=5&page=1", { coerceNumbers: true })',
    result: JSON.stringify(
      extractQueryFromPath(
        "/search?filter[category]=books&filter[rating]=5&page=1",
        {
          coerceNumbers: true,
        },
      ),
    ),
  },
  {
    label:
      'extractQueryFromPath("/items?settings[active]=true&settings[retries]=3", { coerceBooleans: true, coerceNumbers: true })',
    result: JSON.stringify(
      extractQueryFromPath("/items?settings[active]=true&settings[retries]=3", {
        coerceBooleans: true,
        coerceNumbers: true,
      }),
    ),
  },
];

const DEMO_BREADCRUMBS_LABELS = [
  {
    label:
      'getBreadcrumbs(PATHS, "/users/edit/42", { labels: { "USERS.ROOT": "Community", "USERS.EDIT": "Update Profile" } })',
    result: JSON.stringify(
      getBreadcrumbs(PATHS, "/users/edit/42", {
        labels: { "USERS.ROOT": "Community", "USERS.EDIT": "Update Profile" },
      }),
    ),
  },
];

export default function RouteDebug() {
  const [shadowWarning, setShadowWarning] = useState<string | null>(null);
  const flat = flattenRoutes(PATHS);
  const resolvedExample = useResolvedPath(PATHS.POSTS.DETAILS, {
    postId: 7,
    commentId: 42,
  });
  const paths = flat.map((r) => r.path);
  const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);

  const section = (title: string, children: React.ReactNode) => (
    <div className="debug-section">
      <h3>{title}</h3>
      {children}
    </div>
  );

  return (
    <div>
      <h1>Route Debug</h1>
      <p>Demonstrating all react-routes-forge utility functions</p>

      {section(
        "1. flattenRoutes() — Full route tree",
        <>
          <pre className="debug-json">{JSON.stringify(flat, null, 2)}</pre>
          <p>
            <strong>{flat.length}</strong> routes registered
          </p>
          {dupes.length > 0 && (
            <p className="warn">Duplicate paths found: {dupes.join(", ")}</p>
          )}
          {dupes.length === 0 && (
            <p className="ok">No duplicate paths detected</p>
          )}
        </>,
      )}

      {section(
        "2. joinPaths() — Path joining",
        <table className="debug-table">
          <thead>
            <tr>
              <th>Call</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_JOIN.map((d) => (
              <tr key={d.label}>
                <td>
                  <code>{d.label}</code>
                </td>
                <td>
                  <code>{d.result}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "3. getParamNames() — Extract param names",
        <table className="debug-table">
          <thead>
            <tr>
              <th>Call</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_PARAM_NAMES.map((d) => (
              <tr key={d.label}>
                <td>
                  <code>{d.label}</code>
                </td>
                <td>
                  <code>{JSON.stringify(d.result)}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "4. extractParamsFromPath() — Reverse param extraction",
        <table className="debug-table">
          <thead>
            <tr>
              <th>Call</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_EXTRACT.map((d) => (
              <tr key={d.label}>
                <td>
                  <code>{d.label}</code>
                </td>
                <td>
                  <code>{d.result}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "5. matchPath() — Template to RegExp",
        <>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_MATCH.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">
            Options: <code>end</code> (exact match, default true) and{" "}
            <code>caseSensitive</code> (default false).
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_MATCH_OPTIONS.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "6. isDynamic() — Check if a path contains params",
        <table className="debug-table">
          <thead>
            <tr>
              <th>Call</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_IS_DYNAMIC.map((d) => (
              <tr key={d.label}>
                <td>
                  <code>{d.label}</code>
                </td>
                <td>
                  <code>{d.result}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "7. buildPath() — Low-level path builder",
        <>
          <p className="note">
            Core function powering <code>build()</code> and{" "}
            <code>.build()</code>
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_BUILD_PATH.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "8. extractParamNames() — Low-level param name extraction",
        <>
          <p className="note">
            Core function powering <code>getParamNames()</code>. Also handles{" "}
            <code>:param?</code> (optional) syntax.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_EXTRACT_PARAM_NAMES.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "9. Routes are genuine primitive strings",
        <>
          <p className="note">
            Route values from <code>defineRoutes()</code> are plain primitive
            strings — <code>typeof</code> is <code>"string"</code> and strict
            equality (<code>===</code>) against the template works, so they're
            safe as <code>Map</code> keys and can be passed straight to{" "}
            <code>navigate()</code> / <code>&lt;Link to&gt;</code>.{" "}
            <code>.build()</code> and <code>.paramNames</code> are attached to{" "}
            <code>String.prototype</code> at runtime, so the standalone{" "}
            <code>build()</code> / <code>getParamNames()</code> helpers work on
            any plain template string too.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Expression</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {STRING_GOTCHAS.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "10. .paramNames on dynamic routes",
        <ul>
          {flat
            .filter((r) => r.path.includes(":"))
            .map((r) => (
              <li key={r.key}>
                <code>{r.key}</code> → <code>{r.path}</code> → params:{" "}
                <code>{JSON.stringify(getParamNames(r.path))}</code>
              </li>
            ))}
        </ul>,
      )}

      {section(
        "11. build() standalone — query strings + strict mode",
        <>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>
                    build(PATHS.SEARCH, &#123;&#125;, &#123; q: "react", tags:
                    ["admin", "moderator"] &#125;)
                  </code>
                </td>
                <td>
                  <code>
                    {build(
                      PATHS.SEARCH,
                      {},
                      { q: "react", tags: ["admin", "moderator"] },
                    )}
                  </code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>
                    build(PATHS.USERS.ROOT, &#123;&#125;, &#123; sort: "asc",
                    filter: undefined, ref: null &#125;)
                  </code>
                </td>
                <td>
                  <code>
                    {build(
                      PATHS.USERS.ROOT,
                      {},
                      { sort: "asc", filter: undefined, ref: null },
                    )}
                  </code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>
                    build("/users/:id", &#123;&#125;, undefined, &#123; strict:
                    true &#125;)
                  </code>
                </td>
                <td>
                  <code className="strict-err">
                    throws RangeError — missing :id
                  </code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>
                    build("/users/:id", &#123; id: 5 &#125;, undefined, &#123;
                    hash: "profile" &#125;)
                  </code>
                </td>
                <td>
                  <code>
                    {build("/users/:id", { id: 5 }, undefined, {
                      hash: "profile",
                    })}
                  </code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>
                    build("/users/:id", &#123; id: 5 &#125;, &#123; tab: "info"
                    &#125;, &#123; hash: "details" &#125;)
                  </code>
                </td>
                <td>
                  <code>
                    {build(
                      "/users/:id",
                      { id: 5 },
                      { tab: "info" },
                      { hash: "details" },
                    )}
                  </code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>
                    build("/search", &#123;&#125;, &#123; active: true, draft:
                    false &#125;)
                  </code>
                </td>
                <td>
                  <code>
                    {build("/search", {}, { active: true, draft: false })}
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </>,
      )}

      {section(
        "12. Splat (`/*`) segments",
        <>
          <p className="note">
            A trailing <code>/*</code> captures the rest of the path into a
            single <code>{"*"}</code> param. Slashes are preserved, other
            special characters are encoded, and a missing splat value drops the
            suffix. Try the <em>Files</em> page.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_SPLAT.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "13. appendQuery() — merge query params into an existing path",
        <table className="debug-table">
          <thead>
            <tr>
              <th>Call</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_APPEND_QUERY.map((d) => (
              <tr key={d.label}>
                <td>
                  <code>{d.label}</code>
                </td>
                <td>
                  <code>{d.result}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "14. extractQueryFromPath() — parse a query string back into an object",
        <table className="debug-table">
          <thead>
            <tr>
              <th>Call</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_EXTRACT_QUERY.map((d) => (
              <tr key={d.label}>
                <td>
                  <code>{d.label}</code>
                </td>
                <td>
                  <code>{d.result}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "15. isActivePath() — NavLink-style matching (case-insensitive, trailing slash)",
        <>
          <p className="note">
            Options are defaulted individually, so a partial options object
            (e.g. only <code>{"{ caseSensitive: true }"}</code>) keeps the
            documented <code>exact: true</code> default instead of silently
            falling back to prefix matching.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ACTIVE.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "16. RouteTree type — annotate a plain route map",
        <>
          <p className="note">
            <code>RouteTree</code> types a plain object for{" "}
            <code>defineRoutes()</code>: each key is a path string or a nested
            tree.
          </p>
          <pre className="debug-json">
            {JSON.stringify(DEMO_ROUTE_TREE, null, 2)}
          </pre>
        </>,
      )}

      {section(
        "17. Static suffix params — :name.json",
        <>
          <p className="note">
            Param names are restricted to <code>[A-Za-z0-9_]</code> (matching
            React Router), so a static suffix stays a literal —{" "}
            <code>/files/:name.json</code> extracts <code>name</code>, leaving{" "}
            <code>.json</code> untouched.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_SUFFIX.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "18. Static routes now have .build() — query/hash only",
        <>
          <p className="note">
            Every route gets a <code>.build()</code> helper. Static routes take
            a query object (no params); dynamic routes take params. Both are
            genuine primitive strings, so strict equality works and they can be{" "}
            passed directly to <code>navigate()</code> /{" "}
            <code>&lt;Link to&gt;</code>. See section 9 for primitive-string
            details.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_STATIC_BUILD.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => clearPathCache()}>Clear path cache</button>
          <button
            onClick={() =>
              devWarn("devWarn() demo — this only shows outside production")
            }
          >
            Trigger devWarn()
          </button>
        </>,
      )}

      {section(
        "19. useResolvedPath() — resolve a template against params",
        <>
          <p className="note">
            <code>useResolvedPath(template, params)</code> mirrors{" "}
            <code>buildPath()</code> as a hook. See also{" "}
            <code>useActivePath()</code> (nav highlighting) and{" "}
            <code>useTypedSearchParams()</code> (Search page). All hooks work
            identically with <code>react-router-dom</code> (v6/v7) and{" "}
            <code>react-router</code> (v6/v7).
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>
                    useResolvedPath(PATHS.POSTS.DETAILS, &#123; postId: 7,
                    commentId: 42 &#125;)
                  </code>
                </td>
                <td>
                  <code>{resolvedExample}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </>,
      )}

      {section(
        "20. getBreadcrumbs() — depth-ordered breadcrumb trail",
        <>
          <p className="note">
            <code>getBreadcrumbs()</code> walks the <code>PATHS</code> tree and
            returns every ancestor of the current path, sorted by route depth
            (segment count — not string length) so the most general crumb comes
            first and the current page is last. The header breadcrumb bar uses
            the same helper with a custom <code>labelResolver</code>.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_BREADCRUMBS.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "21. .buildRelative() — Relative path building (New in v1.5 / v1.6)",
        <>
          <p className="note">
            <code>.buildRelative()</code> resolves routes exactly like{" "}
            <code>.build()</code>, but strips leading slashes and normalizes the
            root path <code>"/"</code> to <code>"."</code>. Available on both
            static and dynamic routes as well as plain templates.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_BUILD_RELATIVE.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "22. locale option in BuildPathOptions — Clean path localization (New in v1.5 / v1.6)",
        <>
          <p className="note">
            The <code>locale</code> option in <code>BuildPathOptions</code>{" "}
            prepends a localized segment (e.g., <code>"en-US"</code> or{" "}
            <code>"/fr/"</code>) to the path and handles slash normalization
            automatically. Works seamlessly with <code>build()</code>,{" "}
            <code>.build()</code>, and <code>.buildRelative()</code>.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_LOCALE.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "23. Route Shadowing Detection — Warning on shadowed static routes (New in v1.6)",
        <>
          <p className="note">
            In development, <code>defineRoutes()</code> automatically detects if
            a static route is shadowed by a dynamic parameter route defined
            before it (e.g. <code>DETAILS: "/items/:id"</code> defined before{" "}
            <code>NEW: "/items/new"</code>). Static routes should always be
            defined before dynamic routes.
          </p>
          <button
            onClick={() => {
              const originalWarn = console.warn;
              let captured = "";
              console.warn = (...args: unknown[]) => {
                captured = args.map(String).join(" ");
                originalWarn(...args);
              };
              try {
                defineRoutes({
                  ITEMS: {
                    DETAILS: "/items/:id",
                    NEW: "/items/new", // Shadowed by /items/:id!
                  },
                } as const);
              } finally {
                console.warn = originalWarn;
              }
              setShadowWarning(
                captured || "Shadowing warning logged to dev console.",
              );
            }}
          >
            Trigger Shadowing Detection Check
          </button>
          {shadowWarning && (
            <div className="demo-alert">
              <strong>Captured Warning:</strong> <code>{shadowWarning}</code>
            </div>
          )}
        </>,
      )}

      {section(
        "24. Deep Query Object Nesting & Number Coercion (New in v1.5 / v1.6)",
        <>
          <p className="note">
            <code>appendQuery()</code> supports deep nested objects via bracket
            notation (e.g. <code>filter[category]=books</code>).
            <code>extractQueryFromPath()</code> parses them back into structured
            objects, and <code>coerceNumbers: true</code> converts numeric
            strings to real JavaScript numbers.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_NESTED_QUERY.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "25. Breadcrumbs labels Map — Direct label overrides (New in v1.5 / v1.6)",
        <>
          <p className="note">
            <code>getBreadcrumbs()</code> accepts an optional{" "}
            <code>labels</code> map in <code>BreadcrumbOptions</code>. Static
            keys take precedence over <code>labelResolver</code>, allowing
            specific route labels to be overridden directly.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Call</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_BREADCRUMBS_LABELS.map((d) => (
                <tr key={d.label}>
                  <td>
                    <code>{d.label}</code>
                  </td>
                  <td>
                    <code>{d.result}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "26. Next.js Integration (react-routes-forge/next) — Isomorphic Routing Parity (New in v1.5 / v1.6)",
        <>
          <p className="note">
            <code>react-routes-forge</code> provides full first-class support
            for Next.js App Router and Pages Router via the{" "}
            <code>react-routes-forge/next</code> entrypoint.
          </p>
          <table className="debug-table">
            <thead>
              <tr>
                <th>Export</th>
                <th>Target / Hook</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>useActivePath()</code>
                </td>
                <td>
                  Next.js <code>usePathname()</code>
                </td>
                <td>
                  Active route highlighting with exact/caseSensitive options.
                </td>
              </tr>
              <tr>
                <td>
                  <code>useNavigateTo()</code>
                </td>
                <td>
                  Next.js <code>useRouter()</code>
                </td>
                <td>
                  Navigation helper; returned function also exposes{" "}
                  <code>.prefetch(path)</code>.
                </td>
              </tr>
              <tr>
                <td>
                  <code>useRouteParams()</code>
                </td>
                <td>
                  Next.js <code>useParams()</code>
                </td>
                <td>
                  Fully typed parameter extraction by passing route object or
                  template generic.
                </td>
              </tr>
              <tr>
                <td>
                  <code>useTypedSearchParams()</code>
                </td>
                <td>
                  <code>useSearchParams()</code> + <code>useRouter()</code>
                </td>
                <td>
                  Strongly typed query state with <code>coerceBooleans</code>{" "}
                  and <code>coerceNumbers</code>.
                </td>
              </tr>
              <tr>
                <td>
                  <code>NavigateOptions</code>
                </td>
                <td>Type</td>
                <td>
                  <code>&#123; replace?: boolean; scroll?: boolean &#125;</code>
                </td>
              </tr>
              <tr>
                <td>Server Components</td>
                <td>Isomorphic core</td>
                <td>
                  <code>PATHS = defineRoutes(...)</code> and{" "}
                  <code>.build()</code> work in Server Components without{" "}
                  <code>"use client"</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </>,
      )}
    </div>
  );
}
