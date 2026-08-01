import { Link } from "react-router-dom";
import { build } from "react-routes-forge";
import { PATHS } from "../paths";

const FILES = [
  { path: "reports/2026/q1", label: "Q1 2026 Report" },
  { path: "reports/2026/q1/financials", label: "Q1 Financials (nested)" },
  { path: "docs/api.md", label: "API docs" },
];

export default function FileList() {
  return (
    <div>
      <h1>Files</h1>
      <p>
        Splat route <code>{PATHS.FILES.DETAILS}</code> — captures the rest of
        the path into a single <code>{"*"}</code> param.{" "}
        <code>PATHS.FILES.DETAILS.paramNames</code> ={" "}
        <code>{JSON.stringify(PATHS.FILES.DETAILS.paramNames)}</code>
      </p>
      <ul className="product-list">
        {FILES.map((f) => (
          <li key={f.path}>
            <Link to={PATHS.FILES.DETAILS.build({ "*": f.path })}>
              {f.label}
            </Link>{" "}
            <code>{PATHS.FILES.DETAILS.build({ "*": f.path })}</code>
          </li>
        ))}
      </ul>
      <p>
        Missing splat value drops the <code>/*</code> suffix:{" "}
        <code>{build("/files/*", {})}</code> (via standalone <code>build()</code>)
      </p>
    </div>
  );
}
