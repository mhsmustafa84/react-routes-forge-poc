import { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigateTo, useActivePath } from "react-routes-forge/hooks";
import { PATHS } from "./paths";
import Home from "./pages/Home";
import UserList from "./pages/UserList";
import UserDetail from "./pages/UserDetail";
import UserEdit from "./pages/UserEdit";
import AddUser from "./pages/AddUser";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import FileList from "./pages/FileList";
import FileDetail from "./pages/FileDetail";
import Search from "./pages/Search";
import RouteDebug from "./pages/RouteDebug";
import Profile from "./pages/Profile";
import NextDemo from "./pages/NextDemo";
import NotFound from "./pages/NotFound";
import Breadcrumbs from "./components/Breadcrumbs";
import "./App.css";
import { useLocation } from "react-router";
import { isActivePath, build } from "react-routes-forge";
import { useLocale } from "./context/LocaleContext";

function NavButton({
  label,
  path,
  onNavigate,
}: {
  label: string;
  path: string;
  onNavigate?: () => void;
}) {
  const navigate = useNavigateTo();
  const location = useLocation();
  const { locale } = useLocale();

  // Stripped path for active check
  const strippedPath = locale
    ? location.pathname.replace(`/${locale}`, "") || "/"
    : location.pathname;

  const active =
    useActivePath(path, { exact: true }) ||
    isActivePath(strippedPath, path, { exact: true });

  return (
    <button
      className={active ? "active" : ""}
      onClick={() => {
        navigate(build(path as any, {}, undefined, { locale }));
        onNavigate?.();
      }}
    >
      {label}
    </button>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);

  const items: [string, string][] = [
    ["Home", PATHS.HOME],
    ["Users", PATHS.USERS.ROOT],
    ["Posts", PATHS.POSTS.ROOT],
    ["Products", PATHS.PRODUCTS.ROOT],
    ["Files", PATHS.FILES.ROOT],
    ["Search", PATHS.SEARCH],
    ["Profile", PATHS.PROFILE.ROOT],
    ["Next.js", PATHS.NEXT],
    ["Debug", PATHS.DEBUG],
  ];

  const close = () => setOpen(false);

  return (
    <div className="nav-wrapper">
      <button
        className="nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        aria-controls="nav-menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
        <span className="nav-toggle-bar" />
      </button>
      <nav
        id="nav-menu"
        className={`navbar${open ? " navbar--open" : ""}`}
        aria-label="Primary"
      >
        {items.map(([label, path]) => (
          <NavButton key={path} label={label} path={path} onNavigate={close} />
        ))}
      </nav>
    </div>
  );
}

function LocaleSwitcher() {
  const { locale, setLocale, supportedLocales } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const activeLocale = locale || "en";
  const localeLabels: Record<string, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
  };

  const handleSelect = (loc: string) => {
    setLocale(loc === "en" ? undefined : loc);
    setIsOpen(false);
  };

  return (
    <div className="locale-switcher" ref={menuRef}>
      <button
        className="locale-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch language"
        aria-expanded={isOpen}
      >
        <span className="locale-icon">🌍</span>
        <span className="locale-label">
          {localeLabels[activeLocale] || activeLocale.toUpperCase()}
        </span>
        <svg
          className={`locale-chevron ${isOpen ? "open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="locale-menu">
          {supportedLocales.map((loc) => (
            <button
              key={loc}
              className={`locale-option ${activeLocale === loc ? "active" : ""}`}
              onClick={() => handleSelect(loc)}
            >
              {localeLabels[loc] || loc.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            R
          </span>
          <div className="brand-text">
            <span className="brand-name">react-routes-forge</span>
            <span className="brand-tag">Type-safe routes · POC playground</span>
          </div>
        </div>
        <div className="header-actions">
          <LocaleSwitcher />
          <NavBar />
        </div>
      </header>
      <div className="app-body">
        <Breadcrumbs />
        <main>
          <AppRoutes />
        </main>
        <footer className="app-footer">
          Built with <code>react-routes-forge</code> ·{" "}
          <a href="https://github.com/mhsmustafa84/react-routes-forge">
            view source
          </a>
        </footer>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { locale } = useLocale();

  const p = (path: string) => {
    if (!locale) return path;
    if (path === "/") return `/${locale}`;
    return `/${locale}${path}`;
  };

  return (
    <Routes>
      <Route path={p(PATHS.HOME)} element={<Home />} />
      <Route path={p(PATHS.USERS.ROOT)} element={<UserList />} />
      <Route path={p(PATHS.USERS.ADD)} element={<AddUser />} />
      <Route path={p(PATHS.USERS.DETAILS)} element={<UserDetail />} />
      <Route path={p(PATHS.USERS.EDIT)} element={<UserEdit />} />
      <Route path={p(PATHS.POSTS.ROOT)} element={<PostList />} />
      <Route path={p(PATHS.POSTS.DETAILS)} element={<PostDetail />} />
      <Route path={p(PATHS.PRODUCTS.ROOT)} element={<ProductList />} />
      <Route path={p(PATHS.PRODUCTS.DETAILS)} element={<ProductDetail />} />
      <Route path={p(PATHS.FILES.ROOT)} element={<FileList />} />
      <Route path={p(PATHS.FILES.DETAILS)} element={<FileDetail />} />
      <Route path={p(PATHS.SEARCH)} element={<Search />} />
      <Route path={p(PATHS.PROFILE.ROOT)} element={<Profile />} />
      <Route path={p(PATHS.PROFILE.DETAILS)} element={<Profile />} />
      <Route path={p(PATHS.NEXT)} element={<NextDemo />} />
      <Route path={p(PATHS.DEBUG)} element={<RouteDebug />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
