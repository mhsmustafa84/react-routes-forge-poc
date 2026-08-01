import { build, isActivePath } from "react-routes-forge";
import { useNavigateTo } from "react-routes-forge/hooks";
import { useLocation, useSearchParams } from "react-router-dom";
import { PATHS } from "../paths";

export default function Search() {
  const navigate = useNavigateTo();
  const location = useLocation();
  const [searchParams] = useSearchParams();

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
          navigate(
            build(
              PATHS.SEARCH,
              {},
              { q: "react", tags: ["admin", "moderator"] },
            ),
          )
        }
      >
        Search "react" with tags=admin&tags=moderator
      </button>

      <h3>Query string — null/undefined values are dropped</h3>
      <button
        onClick={() =>
          navigate(
            build(
              PATHS.SEARCH,
              {},
              { q: "hello", sort: "asc", filter: undefined, ref: null },
            ),
          )
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
          navigate(
            build(
              "/users/:id",
              { id: 7 },
              { tab: "info" },
              { hash: "details" },
            ),
          )
        }
      >
        Navigate to /users/7?tab=info#details
      </button>

      <h3>Reading query params back from the URL</h3>
      <p className="note">
        The buttons above build query strings with <code>build()</code> and
        navigate to them. <code>useSearchParams</code> (react-router) reads them
        back — proving the round trip.
      </p>
      {searchParams.size === 0 ? (
        <p className="note">No query params in the current URL yet.</p>
      ) : (
        <ul>
          {[...searchParams.entries()].map(([key, value]) => (
            <li key={`${key}=${value}`}>
              <code>{key}</code> = <code>{value}</code>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate(PATHS.SEARCH)}>Clear query params</button>
    </div>
  );
}
