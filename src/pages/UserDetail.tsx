import { extractParamsFromPath } from "react-routes-forge";
import { useNavigateTo, useRouteParams } from "react-routes-forge/hooks";
import { PATHS } from "../paths";

export default function UserDetail() {
  const { id } = useRouteParams<"/users/:id">();
  const navigateTo = useNavigateTo();

  const extracted = extractParamsFromPath("/users/:id", `/users/${id}`);

  return (
    <div>
      <h1>User Detail</h1>
      <p>User ID: {id}</p>
      <p>
        Param extracted via <code>extractParamsFromPath()</code>:{" "}
        <code>{JSON.stringify(extracted)}</code>
      </p>
      <button
        onClick={() => navigateTo(PATHS.USERS.EDIT.build({ id: Number(id) }))}
      >
        Edit
      </button>
      <br />
      <button onClick={() => navigateTo(PATHS.USERS.ROOT)}>
        Back to Users
      </button>
    </div>
  );
}
