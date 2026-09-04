import { useState } from "react";
import { PATHS } from "../paths";

type SimulatedHistoryEntry = {
  path: string;
  type: "push" | "replace" | "prefetch";
  options?: { scroll?: boolean; replace?: boolean };
  timestamp: string;
};

type DemoQuery = {
  tab: string;
  page: number;
};

export default function NextDemo() {
  const [activeTab, setActiveTab] = useState<"hooks" | "rsc" | "simulator">("hooks");
  const [logs, setLogs] = useState<SimulatedHistoryEntry[]>([
    {
      path: "/users",
      type: "push",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [currentPath, setCurrentPath] = useState("/users");
  const [searchParams, setSearchParams] = useState<DemoQuery>({
    tab: "active",
    page: 1,
  });

  const addLog = (
    type: "push" | "replace" | "prefetch",
    path: string,
    options?: { scroll?: boolean; replace?: boolean },
  ) => {
    setLogs((prev) => [
      {
        path,
        type,
        options,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 9),
    ]);
    if (type !== "prefetch") {
      setCurrentPath(path);
    }
  };

  return (
    <div>
      <div className="next-hero">
        <span className="hero-kicker">Subpath Export: react-routes-forge/next</span>
        <h1>Next.js First-Class Integration</h1>
        <p className="hero-sub">
          Full isomorphic routing parity for Next.js 13+ (App Router) and Pages Router.
          Use the same typed route definitions in both React Server Components and interactive Client Components.
        </p>
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === "hooks" ? "active" : ""}`}
          onClick={() => setActiveTab("hooks")}
        >
          Client Hooks
        </button>
        <button
          className={`tab-btn ${activeTab === "rsc" ? "active" : ""}`}
          onClick={() => setActiveTab("rsc")}
        >
          Server Components (RSC)
        </button>
        <button
          className={`tab-btn ${activeTab === "simulator" ? "active" : ""}`}
          onClick={() => setActiveTab("simulator")}
        >
          Interactive Next.js Simulator
        </button>
      </div>

      {activeTab === "hooks" && (
        <div className="tab-content">
          <section className="debug-section">
            <h3>Hooks exported from <code>react-routes-forge/next</code></h3>
            <p className="note">
              These client hooks mirror the React Router hooks API, but are backed directly by Next.js's{" "}
              <code>next/navigation</code> (<code>useRouter</code>, <code>usePathname</code>, <code>useParams</code>, and <code>useSearchParams</code>).
            </p>

            <table className="debug-table">
              <thead>
                <tr>
                  <th>Hook</th>
                  <th>Underlying Next.js API</th>
                  <th>Key Features</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>useActivePath(template, options?)</code></td>
                  <td><code>usePathname()</code></td>
                  <td>
                    Checks if the current route matches a template. Supports <code>exact</code> (default <code>true</code>)
                    and <code>caseSensitive</code>.
                  </td>
                </tr>
                <tr>
                  <td><code>useNavigateTo()</code></td>
                  <td><code>useRouter()</code></td>
                  <td>
                    Typed navigation function. Supports Next.js <code>NavigateOptions</code> (<code>replace</code>, <code>scroll</code>)
                    and exposes <code>navigateTo.prefetch(path, options)</code>.
                  </td>
                </tr>
                <tr>
                  <td><code>useRouteParams(route)</code></td>
                  <td><code>useParams()</code></td>
                  <td>
                    Typed params extraction. Inferred directly from <code>PATHS.USERS.DETAILS</code> or by generic template type.
                  </td>
                </tr>
                <tr>
                  <td><code>useTypedSearchParams&lt;T&gt;(options?)</code></td>
                  <td><code>useSearchParams()</code> + <code>useRouter()</code></td>
                  <td>
                    Full state query hook with <code>coerceBooleans</code> and <code>coerceNumbers</code>.
                    Updater accepts <code>(newQuery, &#123; replace, scroll &#125;)</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="debug-section">
            <h3>Code Example: Client Navigation in Next.js</h3>
            <pre className="snippet-code">{`"use client";

import {
  useActivePath,
  useNavigateTo,
  useRouteParams,
  useTypedSearchParams,
  type NavigateOptions,
} from "react-routes-forge/next";
import { PATHS } from "@/lib/paths";

type SearchFilters = { q?: string; page?: number; active?: boolean };

export function UserNavigation() {
  const isUsersActive = useActivePath(PATHS.USERS.ROOT, { exact: false });
  const navigateTo = useNavigateTo();
  const { id } = useRouteParams(PATHS.USERS.DETAILS);
  const [query, setQuery] = useTypedSearchParams<SearchFilters>({
    coerceNumbers: true,
    coerceBooleans: true,
  });

  // Next.js hover prefetching
  const handleHover = () => {
    navigateTo.prefetch(PATHS.USERS.ROOT);
  };

  const handleEdit = (userId: number) => {
    // Uses Next.js scroll control & replace options
    navigateTo(PATHS.USERS.EDIT.build({ id: userId }), { scroll: false });
  };

  return (
    <nav>
      <button
        className={isUsersActive ? "active" : ""}
        onMouseEnter={handleHover}
        onClick={() => navigateTo(PATHS.USERS.ROOT)}
      >
        Users
      </button>
      <button onClick={() => setQuery({ page: (query.page ?? 1) + 1 }, { scroll: false })}>
        Next Page ({query.page ?? 1})
      </button>
    </nav>
  );
}`}</pre>
          </section>
        </div>
      )}

      {activeTab === "rsc" && (
        <div className="tab-content">
          <section className="debug-section">
            <h3>Server Components &amp; Isomorphic Architecture</h3>
            <p className="note">
              Because the core API of <code>react-routes-forge</code> has zero runtime DOM or browser dependencies,
              your <code>PATHS</code> tree and all path-building functions are <strong>100% server-compatible</strong>.
            </p>

            <ul className="rsc-points">
              <li>
                <strong>No "use client" Needed</strong> for <code>defineRoutes</code>, <code>.build()</code>, <code>.buildRelative()</code>, or query helpers.
              </li>
              <li>
                <strong>Zero Bundle Overhead</strong> on the client when building URLs inside Server Components.
              </li>
              <li>
                <strong>Next.js &lt;Link href=&#123;...&#125;&gt;</strong> works directly with <code>.build()</code> or static route strings.
              </li>
              <li>
                <strong>Metadata &amp; Redirects</strong>: Generate canonical URLs or call <code>redirect(PATHS.LOGIN)</code> safely on the server.
              </li>
            </ul>

            <pre className="snippet-code">{`// app/users/[id]/page.tsx (React Server Component)
import Link from "next/link";
import { redirect } from "next/navigation";
import { PATHS } from "@/lib/paths";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: \`User Profile - \${id}\`,
    alternates: {
      canonical: PATHS.USERS.DETAILS.build({ id }, undefined, { locale: "en" }),
    },
  };
}

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await fetchUser(id);

  if (!user) {
    redirect(PATHS.USERS.ROOT);
  }

  return (
    <div>
      <h1>{user.name}</h1>
      {/* Type-safe Next.js Link */}
      <Link href={PATHS.USERS.EDIT.build({ id })}>Edit User</Link>
      <Link href={PATHS.USERS.ROOT}>Back to Users</Link>
    </div>
  );
}`}</pre>
          </section>
        </div>
      )}

      {activeTab === "simulator" && (
        <div className="tab-content">
          <section className="debug-section">
            <h3>Next.js App Router Simulator</h3>
            <p className="note">
              Simulate how <code>useNavigateTo()</code>, prefetching, and <code>useTypedSearchParams()</code> behave in a Next.js App Router environment.
            </p>

            <div className="simulator-card">
              <div className="sim-status">
                <div>
                  <strong>Simulated Location:</strong> <code>{currentPath}</code>
                </div>
                <div>
                  <strong>Search Params:</strong> <code>{JSON.stringify(searchParams)}</code>
                </div>
              </div>

              <div className="sim-controls">
                <h4>Simulated Actions</h4>
                <div className="sim-btn-group">
                  <button
                    className="btn-primary"
                    onClick={() =>
                      addLog("push", PATHS.USERS.DETAILS.build({ id: 42 }), { scroll: true })
                    }
                    onMouseEnter={() =>
                      addLog("prefetch", PATHS.USERS.DETAILS.build({ id: 42 }))
                    }
                  >
                    Hover to Prefetch &amp; Click: User 42 (scroll: true)
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() =>
                      addLog("replace", PATHS.PRODUCTS.DETAILS.build({ category: "tech", productId: 101 }), {
                        replace: true,
                        scroll: false,
                      })
                    }
                  >
                    Router.replace: Product 101 (scroll: false)
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => {
                      const next = { ...searchParams, page: Number(searchParams.page ?? 1) + 1 };
                      setSearchParams(next);
                      addLog("push", `${currentPath}?tab=${next.tab}&page=${next.page}`, {
                        scroll: false,
                      });
                    }}
                  >
                    Update Query: page + 1
                  </button>
                </div>
              </div>

              <div className="sim-logs">
                <h4>Simulated Next.js Router Event Log</h4>
                <table className="debug-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Event</th>
                      <th>Target Path</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i}>
                        <td>{log.timestamp}</td>
                        <td>
                          <span className={`badge badge--${log.type}`}>{log.type}</span>
                        </td>
                        <td><code>{log.path}</code></td>
                        <td>
                          {log.options ? JSON.stringify(log.options) : "default"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
