import { build, isActivePath, useNavigateTo } from "react-routes-forge";
import { useLocation } from "react-router-dom";
import { PATHS } from "../paths";

export default function Search() {
  const navigate = useNavigateTo();
  const location = useLocation();

  const isSearchActive = isActivePath(location.pathname, PATHS.SEARCH);

  const handleStrictMode = () => {
    try {
      build("/users/:id", {}, undefined, { strict: true });
    } catch (e) {
      alert(`Strict mode caught: ${(e as Error).message}`);
    }
  };

  return (
    <div>
      <h1>Search</h1>

      <p>Search active: {isSearchActive ? "yes" : "no"}</p>

      <h3>Query string — array values</h3>
      <button
        onClick={() =>
          navigate(build(PATHS.SEARCH, {}, { q: "react", tags: ["admin", "moderator"] }))
        }
      >
        Search "react" with tags=admin&tags=moderator
      </button>

      <h3>Query string — null/undefined values are dropped</h3>
      <button
        onClick={() =>
          navigate(build(PATHS.SEARCH, {}, { q: "hello", sort: "asc", filter: undefined, ref: null }))
        }
      >
        Search "hello" (null/undefined params dropped)
      </button>

      <h3>Strict mode — RangeError on missing param</h3>
      <button onClick={handleStrictMode}>
        Trigger strict mode (missing :id)
      </button>

      <h3>Hash fragment</h3>
      <button
        onClick={() =>
          navigate(build("/users/:id", { id: 7 }, { tab: "info" }, { hash: "details" }))
        }
      >
        Navigate to /users/7?tab=info#details
      </button>

    </div>
  );
}
