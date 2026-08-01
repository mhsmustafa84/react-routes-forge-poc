import { getBreadcrumbs } from "react-routes-forge";
import type { BreadcrumbOptions } from "react-routes-forge";
import { useLocation } from "react-router-dom";
import { useNavigateTo } from "react-routes-forge/hooks";
import { PATHS } from "../paths";

const labelOptions: BreadcrumbOptions = {
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
  const crumbs = getBreadcrumbs(PATHS, location.pathname, labelOptions);

  if (crumbs.length <= 1) return null;

  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={crumb.key}>
          {i > 0 && <span className="sep">/</span>}
          {crumb.isCurrent ? (
            <span className="current">{crumb.label}</span>
          ) : (
            <button className="crumb-link" onClick={() => navigate(crumb.path)}>
              {crumb.label}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}
