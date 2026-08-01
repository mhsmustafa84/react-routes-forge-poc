import { Link } from "react-router-dom";
import { PATHS } from "../paths";

const PRODUCTS = [
  { category: "electronics", productId: 1, name: "Headphones" },
  { category: "electronics", productId: 2, name: "Keyboard" },
  { category: "books", productId: 3, name: "The TypeScript Handbook" },
  { category: "books", productId: 4, name: "Clean Code" },
];

export default function ProductList() {
  return (
    <div>
      <h1>Products</h1>
      <p>
        Multi-param route <code>{PATHS.PRODUCTS.DETAILS}</code> with{" "}
        <code>{JSON.stringify(PATHS.PRODUCTS.DETAILS.paramNames)}</code> built via{" "}
        <code>.build(&#123; category, productId &#125;)</code> and rendered as{" "}
        <code>&lt;Link&gt;</code>s.
      </p>
      <ul className="product-list">
        {PRODUCTS.map((p) => (
          <li key={p.productId}>
            <Link to={PATHS.PRODUCTS.DETAILS.build(p)}>{p.name}</Link>{" "}
            <code>
              {PATHS.PRODUCTS.DETAILS.build(p)}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}
