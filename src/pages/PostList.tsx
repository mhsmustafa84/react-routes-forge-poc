import { Link } from "react-router-dom";
import { useNavigateTo } from "react-routes-forge/hooks";
import { PATHS } from "../paths";

export default function PostList() {
  const navigate = useNavigateTo();

  return (
    <div>
      <h1>Posts</h1>
      <button
        onClick={() =>
          navigate(PATHS.POSTS.DETAILS.build({ postId: 5, commentId: 12 }))
        }
      >
        View Post 5, Comment 12 (via useNavigateTo)
      </button>
      <p>
        Same path rendered as a <code>&lt;Link&gt;</code>:{" "}
        <Link to={PATHS.POSTS.DETAILS.build({ postId: 6, commentId: 1 })}>
          View Post 6, Comment 1
        </Link>
      </p>
    </div>
  );
}
