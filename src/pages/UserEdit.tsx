import { useNavigateTo, useRouteParams } from "react-routes-forge/hooks";
import { PATHS } from "../paths";

export default function UserEdit() {
  const { id } = useRouteParams<"/users/edit/:id">();
  const navigate = useNavigateTo();

  return (
    <div>
      <h1>Edit User</h1>
      <p>Editing user ID: {id}</p>
      <button onClick={() => navigate(PATHS.USERS.ROOT)}>Back to Users</button>
    </div>
  );
}
