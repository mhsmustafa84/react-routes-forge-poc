import { Link, useLocation } from "react-router-dom";
import {
  useRouteParams,
  useResolvedPath,
  useNavigateTo,
} from "react-routes-forge/hooks";
import { isActivePath, extractParamsFromPath } from "react-routes-forge";
import { PATHS } from "../paths";

export default function FileDetail() {
  const location = useLocation();
  const navigate = useNavigateTo();
  const params = useRouteParams(PATHS.FILES.DETAILS);
  const extracted = extractParamsFromPath("/files/*", location.pathname);
  const resolved = useResolvedPath("/files/*", params);

  return (
    <div>
      <h1>File Detail</h1>
      <p>
        Splat captured by <code>useRouteParams(PATHS.FILES.DETAILS)</code> (type
        inferred from the route): <code>{JSON.stringify(params)}</code>
      </p>
      <p>
        Back-extracted via <code>extractParamsFromPath("/files/*", path)</code>:{" "}
        <code>{JSON.stringify(extracted)}</code>
      </p>
      <p>
        Resolved via <code>useResolvedPath()</code>: <code>{resolved}</code>
      </p>
      <p>
        <code>isActivePath(path, PATHS.FILES.DETAILS)</code>:{" "}
        {isActivePath(location.pathname, PATHS.FILES.DETAILS) ? "yes" : "no"}
      </p>
      <button onClick={() => navigate(PATHS.FILES.ROOT)}>Back to Files</button>
      <Link to={PATHS.FILES.ROOT}>Files link</Link>
    </div>
  );
}
