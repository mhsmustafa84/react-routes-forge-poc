import { useLocation } from "react-router-dom";
import { isActivePath } from "react-routes-forge";
import { useRouteParams, useNavigateTo } from "react-routes-forge/hooks";
import { PATHS } from "../paths";

export default function Profile() {
  const params = useRouteParams<"/profile/:section?">();
  const navigate = useNavigateTo();
  const location = useLocation();

  return (
    <div>
      <h1>Profile</h1>
      <p>
        Route template: <code>/profile/:section?</code> (optional param with{" "}
        <code>?</code>)
      </p>
      <p>
        Extracted params: <code>{JSON.stringify(params)}</code>
        {params.section ? (
          <>
            {" "}
            — section "<strong>{params.section}</strong>" matched
          </>
        ) : (
          <> — no section provided (param is optional)</>
        )}
      </p>
      <p>
        Matches <code>/profile</code>:{" "}
        {isActivePath(location.pathname, PATHS.PROFILE.DETAILS) ? "yes" : "no"}
      </p>
      <nav>
        <button onClick={() => navigate(PATHS.PROFILE.ROOT)}>
          /profile (no section)
        </button>
        <button
          onClick={() =>
            navigate(PATHS.PROFILE.DETAILS.build({ section: "settings" }))
          }
        >
          /profile/settings
        </button>
        <button
          onClick={() =>
            navigate(PATHS.PROFILE.DETAILS.build({ section: "security" }))
          }
        >
          /profile/security
        </button>
      </nav>
      <br />
      <button onClick={() => navigate(PATHS.HOME)}>Home</button>
    </div>
  );
}
