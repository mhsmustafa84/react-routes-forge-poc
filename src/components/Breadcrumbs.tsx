import { getBreadcrumbs, build } from "react-routes-forge";
import type { BreadcrumbOptions } from "react-routes-forge";
import { useLocation } from "react-router-dom";
import { useNavigateTo } from "react-routes-forge/hooks";
import { PATHS } from "../paths";
import { useLocale } from "../context/LocaleContext";

const labelOptions: BreadcrumbOptions = {
  labels: {
    "PRODUCTS.ROOT": "Shop",
    "PRODUCTS.DETAILS": "Item",
    "FILES.DETAILS": "File",
    "POSTS.DETAILS": "Comment",
  },
  labelResolver: (key) => {
    const parts = key.split(".");
    const last = parts[parts.length - 1]!;
    if (last === "ROOT")
      return parts.length > 1 ? parts[parts.length - 2]! : "Home";
    return last.charAt(0) + last.slice(1).toLowerCase();
  },
};

export default function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigateTo();
  const { locale } = useLocale();
  
  const strippedPath = locale 
    ? location.pathname.replace(`/${locale}`, '') || '/' 
    : location.pathname;

  const crumbs = getBreadcrumbs(PATHS, strippedPath, labelOptions);

  if (crumbs.length <= 1) return null;

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      {crumbs.map((crumb, i) => {
        return (
          <span key={crumb.key}>
            {i > 0 && <span className="sep">/</span>}
            {crumb.isCurrent ? (
              <span className="current">{crumb.label}</span>
            ) : (
              <button className="crumb-link" onClick={() => navigate(build(crumb.path as any, {}, undefined, { locale }))}>
                {crumb.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
