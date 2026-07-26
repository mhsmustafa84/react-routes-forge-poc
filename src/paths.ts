import { defineRoutes } from "react-routes-forge";

export const PATHS = defineRoutes({
  HOME: "/",
  USERS: {
    ROOT: "/users",
    ADD: "/users/add",
    EDIT: "/users/edit/:id",
    DETAILS: "/users/:id",
  },
  POSTS: {
    ROOT: "/posts",
    DETAILS: "/posts/:postId/comments/:commentId",
  },
  SEARCH: "/search",
  DEBUG: "/debug",
  PRODUCTS: {
    ROOT: "/products",
    DETAILS: "/products/:category/:productId",
  },
  PROFILE: {
    ROOT: "/profile",
    /** Optional :section? param — matches both /profile and /profile/settings */
    DETAILS: "/profile/:section?",
  },
} as const);
