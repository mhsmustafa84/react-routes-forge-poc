import { Routes, Route, useLocation } from "react-router-dom";
import { isActivePath } from "react-routes-forge";
import { useNavigateTo } from "react-routes-forge/hooks";
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
import Search from "./pages/Search";
import RouteDebug from "./pages/RouteDebug";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Breadcrumbs from "./components/Breadcrumbs";
import "./App.css";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigateTo();

  const link = (label: string, path: string) => (
    <button
      key={path}
      className={
        isActivePath(location.pathname, path, { exact: false }) ? "active" : ""
      }
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
      {link("Products", PATHS.PRODUCTS.ROOT)}
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
          <Route path={PATHS.USERS.ADD} element={<AddUser />} />
          <Route path={PATHS.USERS.DETAILS} element={<UserDetail />} />
          <Route path={PATHS.USERS.EDIT} element={<UserEdit />} />
          <Route path={PATHS.POSTS.ROOT} element={<PostList />} />
          <Route path={PATHS.POSTS.DETAILS} element={<PostDetail />} />
          <Route path={PATHS.PRODUCTS.ROOT} element={<ProductList />} />
          <Route path={PATHS.PRODUCTS.DETAILS} element={<ProductDetail />} />
          <Route path={PATHS.SEARCH} element={<Search />} />
          <Route path={PATHS.PROFILE.ROOT} element={<Profile />} />
          <Route path={PATHS.PROFILE.DETAILS} element={<Profile />} />
          <Route path={PATHS.DEBUG} element={<RouteDebug />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
