import { Link } from "react-router-dom";
import { isActivePath, extractParamsFromPath } from "react-routes-forge";
import { useRouteParams } from "react-routes-forge/hooks";
import { useLocation } from "react-router-dom";
import { PATHS } from "../paths";

export default function ProductDetail() {
  const location = useLocation();
  const { category, productId } =
    useRouteParams<"/products/:category/:productId">();
  const extracted = extractParamsFromPath(
    "/products/:category/:productId",
    location.pathname,
  );
  const isActive = isActivePath(location.pathname, PATHS.PRODUCTS.DETAILS, {
    exact: true,
  });

  return (
    <div>
      <h1>Product Detail</h1>
      <p>
        Category: <strong>{category}</strong> / Product ID:{" "}
        <strong>{productId}</strong>
      </p>
      <p>
        Back-extracted via <code>extractParamsFromPath()</code>:{" "}
        <code>{JSON.stringify(extracted)}</code>
      </p>
      <p>
        <code>isActivePath(path, PATHS.PRODUCTS.DETAILS)</code>:{" "}
        {isActive ? "yes" : "no"}
      </p>
      <p>
        Typed link back to the list:{" "}
        <Link to={PATHS.PRODUCTS.ROOT}>All products</Link>
      </p>
    </div>
  );
}
