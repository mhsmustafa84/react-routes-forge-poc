import { useNavigateTo } from "react-routes-forge";
import { PATHS } from "../paths";

export default function NotFound() {
  const navigate = useNavigateTo();

  return (
    <div>
      <h1>404 — Page not found</h1>
      <p>
        Catch-all route using the React Router <code>*</code> wildcard. There is
        no matching entry in <code>PATHS</code>.
      </p>
      <button onClick={() => navigate(PATHS.HOME)}>Back home</button>
    </div>
  );
}
