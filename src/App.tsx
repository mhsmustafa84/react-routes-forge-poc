import { Routes, Route, useLocation } from "react-router-dom";
import { isActivePath, useNavigateTo } from "react-routes-forge";
import { PATHS } from "./paths";
import Home from "./pages/Home";
import UserList from "./pages/UserList";
import UserDetail from "./pages/UserDetail";
import UserEdit from "./pages/UserEdit";
import PostList from "./pages/PostList";
import PostDetail from "./pages/PostDetail";
import Search from "./pages/Search";
import RouteDebug from "./pages/RouteDebug";
import Profile from "./pages/Profile";
import Breadcrumbs from "./components/Breadcrumbs";
import "./App.css";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigateTo();

  const link = (label: string, path: string) => (
    <button
      key={path}
      className={isActivePath(location.pathname, path, { exact: false }) ? "active" : ""}
      onClick={() => navigate(path)}
    >
      {label}
    </button>
  );

  return (
    <nav className="navbar">
      {link("Home", PATHS.HOME)}
      {link("Users", PATHS.USERS.ROOT)}
      {link("Posts", PATHS.POSTS.ROOT)}
      {link("Search", PATHS.SEARCH)}
      {link("Profile", PATHS.PROFILE.ROOT)}
      {link("Debug", PATHS.DEBUG)}
    </nav>
  );
}

function App() {
  return (
    <div className="app">
      <NavBar />
      <Breadcrumbs />
      <main>
        <Routes>
          <Route path={PATHS.HOME} element={<Home />} />
          <Route path={PATHS.USERS.ROOT} element={<UserList />} />
          <Route path={PATHS.USERS.ADD} element={<div>Add User</div>} />
          <Route path={PATHS.USERS.DETAILS} element={<UserDetail />} />
          <Route path={PATHS.USERS.EDIT} element={<UserEdit />} />
          <Route path={PATHS.POSTS.ROOT} element={<PostList />} />
          <Route path={PATHS.POSTS.DETAILS} element={<PostDetail />} />
          <Route path={PATHS.SEARCH} element={<Search />} />
          <Route path={PATHS.PROFILE.ROOT} element={<Profile />} />
          <Route path={PATHS.PROFILE.DETAILS} element={<Profile />} />
          <Route path={PATHS.DEBUG} element={<RouteDebug />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
