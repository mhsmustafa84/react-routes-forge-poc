import { useNavigateTo } from "react-routes-forge/hooks";
import { PATHS } from "../paths";

const FEATURES = [
  { title: "Splat routes", path: PATHS.FILES.ROOT, label: "Files" },
  { title: "Typed route builders", path: PATHS.USERS.ROOT, label: "Users" },
  { title: "Query string handling", path: PATHS.SEARCH, label: "Search" },
  { title: "Live API reference", path: PATHS.DEBUG, label: "Debug" },
];

export default function Home() {
  const navigate = useNavigateTo();

  return (
    <div>
      <section className="hero">
        <p className="hero-kicker">Type-safe routing for React</p>
        <h1 className="hero-title">
          define once,
          <br />
          navigate with <span className="hero-accent">confidence</span>
        </h1>
        <p className="hero-sub">
          Every route lives in a single source of truth. Path builders, query
          params, and active matching are inferred from your route map — so a
          typo is a compile error, not a runtime bug.
        </p>
        <div className="hero-actions">
          <button className="hero-cta" onClick={() => navigate(PATHS.DEBUG)}>
            Explore the demo
          </button>
          <button
            className="hero-secondary"
            onClick={() => navigate(PATHS.PRODUCTS.ROOT)}
          >
            See typed builders
          </button>
        </div>
      </section>

      <section className="feature-grid" aria-label="Demo areas">
        {FEATURES.map((f) => (
          <button key={f.path} className="feature-card" onClick={() => navigate(f.path)}>
            <h3>{f.title}</h3>
            <p>
              <code>{f.path}</code>
            </p>
            <span className="feature-link">{f.label} →</span>
          </button>
        ))}
      </section>
    </div>
  );
}
