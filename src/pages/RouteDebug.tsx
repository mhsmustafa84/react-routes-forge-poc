import {
  flattenRoutes,
  joinPaths,
  getParamNames,
  extractParamsFromPath,
  matchPath,
  build,
  buildPath,
  extractParamNames,
  isDynamic,
} from "react-routes-forge";
import { PATHS } from "../paths";

const DEMO_JOIN = [
  { label: 'joinPaths("/users", "edit", ":id")', result: joinPaths("/users", "edit", ":id") },
  { label: 'joinPaths("/api/", "/v1/", "/users")', result: joinPaths("/api/", "/v1/", "/users") },
  { label: 'joinPaths("", "home")', result: joinPaths("", "home") },
];

const DEMO_PARAM_NAMES = [
  { label: 'getParamNames("/users/:id")', result: getParamNames("/users/:id") },
  { label: 'getParamNames("/posts/:postId/comments/:commentId")', result: getParamNames("/posts/:postId/comments/:commentId") },
  { label: 'getParamNames("/users/edit/:id")', result: getParamNames("/users/edit/:id") },
  { label: 'getParamNames("/products/:category/:productId")', result: getParamNames("/products/:category/:productId") },
  { label: 'getParamNames("/static")', result: getParamNames("/static") },
];

const DEMO_EXTRACT = [
  { label: 'extractParamsFromPath("/users/:id", "/users/42")', result: JSON.stringify(extractParamsFromPath("/users/:id", "/users/42")) },
  { label: 'extractParamsFromPath("/posts/:postId/comments/:commentId", "/posts/5/comments/12")', result: JSON.stringify(extractParamsFromPath("/posts/:postId/comments/:commentId", "/posts/5/comments/12")) },
  { label: 'extractParamsFromPath("/users/:id", "/roles/42") (no match)', result: JSON.stringify(extractParamsFromPath("/users/:id", "/roles/42")) },
  { label: 'extractParamsFromPath("/products/:category/:productId", "/products/electronics/99")', result: JSON.stringify(extractParamsFromPath("/products/:category/:productId", "/products/electronics/99")) },
];

const DEMO_IS_DYNAMIC = [
  { label: 'isDynamic("/users/:id")', result: String(isDynamic("/users/:id")) },
  { label: 'isDynamic("/profile/:section?")', result: String(isDynamic("/profile/:section?")) },
  { label: 'isDynamic("/users")', result: String(isDynamic("/users")) },
  { label: 'isDynamic("/")', result: String(isDynamic("/")) },
];

const DEMO_BUILD_PATH = [
  { label: 'buildPath("/users/:id", { id: 42 })', result: buildPath("/users/:id", { id: 42 }) },
  { label: 'buildPath("/users/:id", {}, undefined, { strict: true })', result: "throws RangeError" },
  { label: 'buildPath("/profile/:section?", {})', result: buildPath("/profile/:section?", {}) },
  { label: 'buildPath("/profile/:section?", { section: "settings" })', result: buildPath("/profile/:section?", { section: "settings" }) },
];

const DEMO_EXTRACT_PARAM_NAMES = [
  { label: 'extractParamNames("/users/:id")', result: JSON.stringify(extractParamNames("/users/:id")) },
  { label: 'extractParamNames("/profile/:section?")', result: JSON.stringify(extractParamNames("/profile/:section?")) },
  { label: 'extractParamNames("/posts/:postId/comments/:commentId")', result: JSON.stringify(extractParamNames("/posts/:postId/comments/:commentId")) },
  { label: 'extractParamNames("/static")', result: JSON.stringify(extractParamNames("/static")) },
];

const DYNAMIC_TEMPLATE = PATHS.USERS.EDIT as unknown as string;
const STRING_GOTCHAS = [
  { label: `typeof PATHS.USERS.EDIT`, result: JSON.stringify(typeof DYNAMIC_TEMPLATE) },
  { label: `String(PATHS.USERS.EDIT)`, result: String(DYNAMIC_TEMPLATE) },
  { label: `\`\${PATHS.USERS.EDIT}\``, result: `${DYNAMIC_TEMPLATE}` },
  { label: `PATHS.USERS.EDIT == "/users/edit/:id"`, result: String(DYNAMIC_TEMPLATE == "/users/edit/:id") },
  { label: `PATHS.USERS.EDIT === "/users/edit/:id"`, result: String(DYNAMIC_TEMPLATE === "/users/edit/:id") },
  { label: `PATHS.USERS.EDIT.valueOf()`, result: DYNAMIC_TEMPLATE.valueOf() },
];

const DEMO_MATCH = [
  { label: 'matchPath("/users/:id").test("/users/42")', result: String(matchPath("/users/:id").test("/users/42")) },
  { label: 'matchPath("/users/:id").test("/users/42/posts")', result: String(matchPath("/users/:id").test("/users/42/posts")) },
  { label: 'matchPath("/users/:id").exec("/users/42")', result: JSON.stringify(matchPath("/users/:id").exec("/users/42")?.slice(1) ?? []) },
  { label: 'matchPath("/posts/:postId/comments/:commentId").exec("/posts/7/comments/99")', result: JSON.stringify(matchPath("/posts/:postId/comments/:commentId").exec("/posts/7/comments/99")?.slice(1) ?? []) },
];

export default function RouteDebug() {
  const flat = flattenRoutes(PATHS);
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
          <p><strong>{flat.length}</strong> routes registered</p>
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
          <thead><tr><th>Call</th><th>Result</th></tr></thead>
          <tbody>
            {DEMO_JOIN.map((d) => (
              <tr key={d.label}><td><code>{d.label}</code></td><td><code>{d.result}</code></td></tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "3. getParamNames() — Extract param names",
        <table className="debug-table">
          <thead><tr><th>Call</th><th>Result</th></tr></thead>
          <tbody>
            {DEMO_PARAM_NAMES.map((d) => (
              <tr key={d.label}><td><code>{d.label}</code></td><td><code>{JSON.stringify(d.result)}</code></td></tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "4. extractParamsFromPath() — Reverse param extraction",
        <table className="debug-table">
          <thead><tr><th>Call</th><th>Result</th></tr></thead>
          <tbody>
            {DEMO_EXTRACT.map((d) => (
              <tr key={d.label}><td><code>{d.label}</code></td><td><code>{d.result}</code></td></tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "5. matchPath() — Template to RegExp",
        <table className="debug-table">
          <thead><tr><th>Call</th><th>Result</th></tr></thead>
          <tbody>
            {DEMO_MATCH.map((d) => (
              <tr key={d.label}><td><code>{d.label}</code></td><td><code>{d.result}</code></td></tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "6. isDynamic() — Check if a path contains params",
        <table className="debug-table">
          <thead><tr><th>Call</th><th>Result</th></tr></thead>
          <tbody>
            {DEMO_IS_DYNAMIC.map((d) => (
              <tr key={d.label}><td><code>{d.label}</code></td><td><code>{d.result}</code></td></tr>
            ))}
          </tbody>
        </table>,
      )}

      {section(
        "7. buildPath() — Low-level path builder",
        <>
          <p className="note">Core function powering <code>build()</code> and <code>.build()</code></p>
          <table className="debug-table">
            <thead><tr><th>Call</th><th>Result</th></tr></thead>
            <tbody>
              {DEMO_BUILD_PATH.map((d) => (
                <tr key={d.label}><td><code>{d.label}</code></td><td><code>{d.result}</code></td></tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "8. extractParamNames() — Low-level param name extraction",
        <>
          <p className="note">Core function powering <code>getParamNames()</code>. Also handles <code>:param?</code> (optional) syntax.</p>
          <table className="debug-table">
            <thead><tr><th>Call</th><th>Result</th></tr></thead>
            <tbody>
              {DEMO_EXTRACT_PARAM_NAMES.map((d) => (
                <tr key={d.label}><td><code>{d.label}</code></td><td><code>{d.result}</code></td></tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "9. String object gotcha — Dynamic routes are not primitives",
        <>
          <p className="note">
            Dynamic routes are <code>String</code> <em>objects</em> (not string primitives).
            Use <code>==</code> or <code>String()</code> / template literal — never <code>===</code>.
          </p>
          <table className="debug-table">
            <thead><tr><th>Expression</th><th>Result</th></tr></thead>
            <tbody>
              {STRING_GOTCHAS.map((d) => (
                <tr key={d.label}><td><code>{d.label}</code></td><td><code>{d.result}</code></td></tr>
              ))}
            </tbody>
          </table>
        </>,
      )}

      {section(
        "10. .paramNames on dynamic routes",
        <ul>
          {flat.filter(r => r.path.includes(":")).map((r) => (
            <li key={r.key}>
              <code>{r.key}</code> → <code>{r.path}</code> → params: <code>{JSON.stringify(getParamNames(r.path))}</code>
            </li>
          ))}
        </ul>,
      )}

      {section(
        "11. build() standalone — query strings + strict mode",
        <>
          <table className="debug-table">
            <thead><tr><th>Call</th><th>Result</th></tr></thead>
            <tbody>
              <tr>
                <td><code>build(PATHS.SEARCH, &#123;&#125;, &#123; q: "react", tags: ["admin", "moderator"] &#125;)</code></td>
                <td><code>{build(PATHS.SEARCH, {}, { q: "react", tags: ["admin", "moderator"] })}</code></td>
              </tr>
              <tr>
                <td><code>build(PATHS.USERS.ROOT, &#123;&#125;, &#123; sort: "asc", filter: undefined, ref: null &#125;)</code></td>
                <td><code>{build(PATHS.USERS.ROOT, {}, { sort: "asc", filter: undefined, ref: null })}</code></td>
              </tr>
              <tr>
                <td><code>build("/users/:id", &#123;&#125;, undefined, &#123; strict: true &#125;)</code></td>
                <td><code className="strict-err">throws RangeError — missing :id</code></td>
              </tr>
              <tr>
                <td><code>build("/users/:id", &#123; id: 5 &#125;, undefined, &#123; hash: "profile" &#125;)</code></td>
                <td><code>{build("/users/:id", { id: 5 }, undefined, { hash: "profile" })}</code></td>
              </tr>
              <tr>
                <td><code>build("/users/:id", &#123; id: 5 &#125;, &#123; tab: "info" &#125;, &#123; hash: "details" &#125;)</code></td>
                <td><code>{build("/users/:id", { id: 5 }, { tab: "info" }, { hash: "details" })}</code></td>
              </tr>
            </tbody>
          </table>
        </>,
      )}
    </div>
  );
}
