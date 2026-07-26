import { useNavigateTo } from "react-routes-forge";
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
        View Post 5, Comment 12
      </button>
    </div>
  );
}
