import { defineRoutes } from "react-routes-forge";

export const PATHS = defineRoutes({
  HOME: "/",
  USERS: {
    ROOT: "/users",
    // Note: static routes (/users/add) MUST be placed before dynamic routes (/users/:id)
    // to prevent shadowing warnings in development mode.
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
  NEXT: "/next",
  FILES: {
    ROOT: "/files",
    /** Splat route — captures the rest of the path (including `/`) into `*`. */
    DETAILS: "/files/*",
  },
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
