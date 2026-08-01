# react-routes-forge-poc

A proof-of-concept (POC) app demonstrating every feature of [`react-routes-forge`](https://github.com/mhsmustafa84/react-routes-forge) — a type-safe route definition library for React.

All routes, hooks, and utility functions are exercised with real, navigable examples so you can see (and inspect) the behaviour at runtime.

---

## Project map

```
src/
├── paths.ts              ← Single source of truth for every route
├── App.tsx               ← Router config, nav bar, breadcrumbs
├── App.css
├── components/
│   └── Breadcrumbs.tsx   ← getBreadcrumbs() + custom labelResolver
├── pages/
│   ├── Home.tsx          ← useNavigateTo()
│   ├── UserList.tsx      ← .build() + .paramNames + <Link>
│   ├── UserDetail.tsx    ← useRouteParams + extractParamsFromPath()
│   ├── UserEdit.tsx      ← useRouteParams (edit/:id)
│   ├── AddUser.tsx       ← static route in a group + typed .build() with query
│   ├── PostList.tsx      ← .build() multi-param + <Link>
│   ├── PostDetail.tsx    ← useRouteParams + useResolvedPath() + hash
│   ├── ProductList.tsx   ← multi-param .build() rendered as <Link>s
│   ├── ProductDetail.tsx ← useRouteParams (2 params) + isActivePath
│   ├── Search.tsx        ← build() with arrays, null-drop, strict mode, hash, round-trip read
│   ├── Profile.tsx       ← Optional param (:param?) demo
│   ├── NotFound.tsx      ← catch-all `*` route
│   └── RouteDebug.tsx    ← Live reference for every utility function
```

---

## App routes

| Path | Page | What it demonstrates |
|---|---|---|
| `/` | Home | Static path, `useNavigateTo()` |
| `/users` | UserList | `.build()`, `.paramNames` property, `<Link>` with built paths |
| `/users/:id` | UserDetail | `useRouteParams`, `extractParamsFromPath()` |
| `/users/edit/:id` | UserEdit | `useRouteParams` with edit pattern |
| `/users/add` | AddUser | Static path + route group nesting, typed `.build()` with query |
| `/posts` | PostList | Multi-param `.build()` + `<Link>` |
| `/posts/:postId/comments/:commentId` | PostDetail | `useRouteParams` (2 params), `useResolvedPath()` with query + hash |
| `/products` | ProductList | Multi-param `.build({ category, productId })` rendered as `<Link>`s |
| `/products/:category/:productId` | ProductDetail | `useRouteParams` (2 params), `extractParamsFromPath()`, `isActivePath()` |
| `/search` | Search | `build()` standalone, array queries, null-drop, strict mode, hash, round-trip read-back |
| `/profile` | Profile | Optional `:param?` — no section defaults |
| `/profile/:section?` | Profile | Optional param matched, `.build()` with section |
| `/debug` | RouteDebug | **Live reference** for every export |
| `*` | NotFound | Catch-all — no matching `PATHS` entry |

---

## Features demonstrated

### Core API

| Export | Location | What |
|---|---|---|
| `defineRoutes()` | `src/paths.ts` | Builds the typed `PATHS` object from a nested route map |
| `.build(params, query?, opts?)` | `UserList`, `PostList`, `Profile` | Resolves a dynamic path into a concrete URL |
| `.paramNames` | `UserList`, `RouteDebug` | Lists the `:param` names expected by a dynamic route |
| `build(template, params, query?, opts?)` | `Search`, `RouteDebug` | Standalone path resolver (no `defineRoutes` needed) |
| `buildPath(template, params, query?, opts?)` | `RouteDebug` | Low-level path builder powering `build()` and `.build()` |
| `isActivePath(path, template, opts?)` | `App.tsx` nav, `Search`, `Profile` | Checks if a URL matches a route template |
| `extractParamsFromPath(template, path)` | `UserDetail`, `RouteDebug` | Pulls param values back out of a resolved URL |
| `extractParamNames(template)` | `RouteDebug` | Low-level param name extraction (supports `:param?`) |
| `joinPaths(...segments)` | `RouteDebug` | Joins and normalizes path segments |
| `getParamNames(template)` | `RouteDebug` | Lists `:param` names from a template string |
| `flattenRoutes(routes)` | `RouteDebug` | Walks the PATHS tree → flat array (sitemaps, duplicate detection) |
| `getBreadcrumbs(routes, path, opts?)` | `Breadcrumbs` component | Generates breadcrumb trail with resolved params |
| `matchPath(template)` | `RouteDebug` | Converts a template into an anchored RegExp |
| `isDynamic(path)` | `RouteDebug` | Returns `true` if the path contains any `:param` |

### React hooks

| Hook | Location | What |
|---|---|---|
| `useRouteParams<T>()` | `UserDetail`, `UserEdit`, `PostDetail`, `Profile` | Typed `useParams` — infer param names from the template string |
| `useNavigateTo()` | Almost every page + `App.tsx` nav | Typed `useNavigate` — accepts resolved path + `{ replace, state }` |
| `useResolvedPath(template, params, query?, opts?)` | `PostDetail` | Resolves a path without navigating (supports splat/optional params via `generatePath`) |

### Advanced features

| Feature | Where to see it |
|---|---|
| **Optional param segments** (`:param?`) | `Profile` page at `/profile/:section?` — matches both `/profile` and `/profile/settings` |
| **Array query values** | `Search` page — `tags=["admin", "moderator"]` serialized as repeated keys |
| **null/undefined query drop** | `Search` page — `filter: undefined, ref: null` silently removed from URL |
| **Query on static paths** | `Search`, `RouteDebug` — `build(PATHS.USERS.ROOT, {}, { sort: "asc" })` |
| **Strict mode** | `Search` (try/catch alert), `RouteDebug` (throws `RangeError`) |
| **Hash fragments** | `PostDetail` (`#discussion`), `Search` (`#details`), `RouteDebug` |
| **String object gotcha** | `RouteDebug` §9 — `===` fails, `==` / `${}` / `String()` work |
| **Custom labelResolver** | `Breadcrumbs` component — `BreadcrumbOptions.labelResolver` |

---

## Live playground: `/debug`

The **Debug** page at [`/debug`](http://localhost:5173/debug) is a live, interactive reference that runs every `react-routes-forge` utility function and displays the output. It covers:

1. `flattenRoutes()` — full tree + duplicate detection
2. `joinPaths()` — 3 examples with different slash patterns
3. `getParamNames()` — 5 template strings
4. `extractParamsFromPath()` — matching and non-matching paths
5. `matchPath()` — `.test()` and `.exec()` with captured groups
6. `isDynamic()` — static, dynamic, and optional-param paths
7. `buildPath()` — core builder with strict mode and optional params
8. `extractParamNames()` — including `:param?` optional syntax
9. String object gotcha — `typeof`, `===` vs `==`, coercion
10. `.paramNames` across every dynamic route in the app
11. `build()` — array queries, null-drop, strict mode, hash fragments

Open it and click around — every result updates with the app's actual routes.

---

## Patterns used in this POC

### 1. Define routes (`src/paths.ts`)

```ts
import { defineRoutes } from "react-routes-forge";

export const PATHS = defineRoutes({
  HOME: "/",
  USERS: {
    ROOT: "/users",
    EDIT: "/users/edit/:id",
    DETAILS: "/users/:id",
  },
  PROFILE: {
    ROOT: "/profile",
    DETAILS: "/profile/:section?",  // optional param
  },
} as const);
```

`as const` is required — it preserves the literal string types that power `.build()`'s compile-time param checking.

### 2. Use in `<Route>` — no change needed

```tsx
<Route path={PATHS.USERS.EDIT} element={<EditUser />} />
```

Static and dynamic paths work the same way. Templates with `:param` segments work directly.

### 3. Navigate — static vs dynamic

```tsx
navigate(PATHS.HOME);                              // static → '/'
navigate(PATHS.USERS.EDIT.build({ id: 42 }));      // dynamic → '/users/edit/42'
navigate(PATHS.PROFILE.DETAILS.build({ section: "settings" })); // optional → '/profile/settings'
navigate(PATHS.PROFILE.DETAILS.build({}));          // optional → '/profile'
```

Built paths drop straight into react-router `<Link>`s (see `ProductList`):

```tsx
<Link to={PATHS.PRODUCTS.DETAILS.build({ category: "books", productId: 3 })}>
  The TypeScript Handbook
</Link>
```

### 4. Extract params from the URL

```tsx
const { id } = useRouteParams<"/users/:id">();     // typed — no casting needed
const params = extractParamsFromPath("/users/:id", "/users/42"); // { id: "42" }
```

### 5. Add query strings to any path

```tsx
// On a static path (no .build()) — use the standalone build():
navigate(build(PATHS.SEARCH, {}, { q: "react", tags: ["admin", "moderator"] }));
// → '/search?q=react&tags=admin&tags=moderator'

// On a dynamic path — .build() accepts query as 2nd arg:
navigate(PATHS.USERS.DETAILS.build({ id: 42 }, { tab: "billing" }));
// → '/users/42?tab=billing'
```

### 6. Add a new route

```tsx
// 1. Add to paths.ts
ORDERS: {
  ROOT: "/orders",
  DETAILS: "/orders/:orderId",
}

// 2. Create the page
export default function OrderDetail() {
  const { orderId } = useRouteParams<"/orders/:orderId">();
  return <div>Order {orderId}</div>;
}

// 3. Register in App.tsx
<Route path={PATHS.ORDERS.DETAILS} element={<OrderDetail />} />

// 4. Navigate
navigate(PATHS.ORDERS.DETAILS.build({ orderId: 99 }));
```

The entire flow is type-checked — a typo in a param name is a compile error, not a runtime bug.

---

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and browse the pages. The nav bar highlights the active route. Breadcrumbs show parent/child relationships. The Debug page at `/debug` is a live reference for every utility.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + Vite production build |
| `npm run lint` | Run oxlint |
| `npm run preview` | Preview the production build |

---

## Tech stack

- [React](https://react.dev) 19
- [Vite](https://vitejs.dev) 8
- [react-routes-forge](https://www.npmjs.com/package/react-routes-forge) 1.2
- [react-router-dom](https://reactrouter.com) 7
- [TypeScript](https://www.typescriptlang.org) 6
