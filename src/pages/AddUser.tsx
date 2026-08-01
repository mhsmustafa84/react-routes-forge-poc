import { useState } from "react";
import { useNavigateTo } from "react-routes-forge/hooks";
import { PATHS } from "../paths";

export default function AddUser() {
  const navigate = useNavigateTo();
  const [name, setId] = useState("");

  return (
    <div>
      <h1>Add User</h1>
      <p>
        Static route under the <code>USERS</code> group:{" "}
        <code>{PATHS.USERS.ADD}</code>
      </p>
      <label>
        New user name:{" "}
        <input
          value={name}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. Alex"
        />
      </label>
      <br />
      <button
        onClick={() =>
          navigate(
            PATHS.USERS.DETAILS.build({ id: 101 }, { from: "add", name }),
          )
        }
      >
        Create user 101 and view details (with query)
      </button>
      <button onClick={() => navigate(PATHS.USERS.ROOT)}>Back to Users</button>
    </div>
  );
}
