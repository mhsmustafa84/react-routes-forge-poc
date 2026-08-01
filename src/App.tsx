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
import NotFound from "./pages/NotFound";
import Breadcrumbs from "./components/Breadcrumbs";
import "./App.css";

function NavButton({ label, path }: { label: string; path: string }) {
  const navigate = useNavigateTo();
  const active = useActivePath(path, { exact: false });

  return (
    <button className={active ? "active" : ""} onClick={() => navigate(path)}>
      {label}
    </button>
  );
}

function NavBar() {
  const items: [string, string][] = [
    ["Home", PATHS.HOME],
    ["Users", PATHS.USERS.ROOT],
    ["Posts", PATHS.POSTS.ROOT],
    ["Products", PATHS.PRODUCTS.ROOT],
    ["Files", PATHS.FILES.ROOT],
    ["Search", PATHS.SEARCH],
    ["Profile", PATHS.PROFILE.ROOT],
    ["Debug", PATHS.DEBUG],
  ];

  return (
    <nav className="navbar" aria-label="Primary">
      {items.map(([label, path]) => (
        <NavButton key={path} label={label} path={path} />
      ))}
    </nav>
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
        <NavBar />
      </header>
      <div className="app-body">
        <Breadcrumbs />
        <main>
          <Routes>
            <Route path={PATHS.HOME} element={<Home />} />
            <Route path={PATHS.USERS.ROOT} element={<UserList />} />
            <Route path={PATHS.USERS.ADD} element={<AddUser />} />
            <Route path={PATHS.USERS.DETAILS} element={<UserDetail />} />
            <Route path={PATHS.USERS.EDIT} element={<UserEdit />} />
            <Route path={PATHS.POSTS.ROOT} element={<PostList />} />
            <Route path={PATHS.POSTS.DETAILS} element={<PostDetail />} />
            <Route path={PATHS.PRODUCTS.ROOT} element={<ProductList />} />
            <Route path={PATHS.PRODUCTS.DETAILS} element={<ProductDetail />} />
            <Route path={PATHS.FILES.ROOT} element={<FileList />} />
            <Route path={PATHS.FILES.DETAILS} element={<FileDetail />} />
            <Route path={PATHS.SEARCH} element={<Search />} />
            <Route path={PATHS.PROFILE.ROOT} element={<Profile />} />
            <Route path={PATHS.PROFILE.DETAILS} element={<Profile />} />
            <Route path={PATHS.DEBUG} element={<RouteDebug />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
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

export default App;
