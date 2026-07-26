import { useNavigateTo, useRouteParams, useResolvedPath } from "react-routes-forge";
import { PATHS } from "../paths";

export default function PostDetail() {
  const { postId, commentId } = useRouteParams<"/posts/:postId/comments/:commentId">();
  const navigate = useNavigateTo();
  const resolvedUrl = useResolvedPath(
    "/posts/:postId/comments/:commentId",
    { postId: Number(postId), commentId: Number(commentId) },
    { highlight: "true" },
    { hash: "discussion" },
  );

  return (
    <div>
      <h1>Post Detail</h1>
      <p>Post ID: {postId}</p>
      <p>Comment ID: {commentId}</p>
      <p>
        Resolved URL via <code>useResolvedPath()</code> (with query + hash):{" "}
        <code>{resolvedUrl}</code>
      </p>
      <button onClick={() => navigate(PATHS.POSTS.ROOT)}>Back to Posts</button>
    </div>
  );
}
