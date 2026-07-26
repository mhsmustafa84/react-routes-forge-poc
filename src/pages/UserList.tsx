import { useNavigateTo } from "react-routes-forge";
import { PATHS } from "../paths";

export default function UserList() {
  const navigate = useNavigateTo();

  return (
    <div>
      <h1>Users</h1>
      <p>
        Dynamic route param names:{" "}
        <code>{JSON.stringify(PATHS.USERS.EDIT.paramNames)}</code>{" "}
        (from <code>PATHS.USERS.EDIT.paramNames</code>)
      </p>
      <button onClick={() => navigate(PATHS.USERS.ADD)}>Add User</button>
      <button onClick={() => navigate(PATHS.USERS.DETAILS.build({ id: 1 }))}>
        View User 1
      </button>
      <button onClick={() => navigate(PATHS.USERS.EDIT.build({ id: 42 }))}>
        Edit User 42
      </button>
    </div>
  );
}
