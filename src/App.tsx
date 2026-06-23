import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  FiCalendar,
  FiColumns,
  FiFolder,
  FiInbox,
  FiMenu,
  FiMoon,
  FiSearch,
  FiSun,
} from "react-icons/fi";
import { useUIStore } from "./store/uiStore";
import { useTaskStore } from "./store/taskStore";
import { useProjectStore } from "./store/projectStore";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Inbox",
  "/today": "Today",
  "/projects": "Projects",
  "/kanban": "Kanban",
  "/calendar": "Calendar",
};

const ROUTE_SUBTITLES: Record<string, string> = {
  "/": "Capture tasks and organize your workflow.",
  "/today": "Focus on what needs attention now.",
  "/projects": "Manage work across your projects.",
  "/kanban": "Track progress across every stage.",
  "/calendar": "See deadlines at a glance.",
};

const NAV_ITEMS = [
  { path: "/", label: "Inbox", icon: FiInbox },
  { path: "/today", label: "Today", icon: FiSun },
  { path: "/projects", label: "Projects", icon: FiFolder },
  { path: "/kanban", label: "Kanban", icon: FiColumns },
  { path: "/calendar", label: "Calendar", icon: FiCalendar },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const { searchQuery, setSearchQuery, darkMode, toggleDarkMode, sidebarOpen, toggleSidebar } =
    useUIStore();
  const { init, tasks } = useTaskStore();
  const { init: initProjects } = useProjectStore();
  const location = useLocation();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(val), 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    init();
    initProjects();
  }, [init, initProjects]);

  useEffect(() => {
    document.body.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const pageTitle = ROUTE_LABELS[location.pathname] ?? "Todo Pro";
  const pageSubtitle =
    ROUTE_SUBTITLES[location.pathname] ?? "Focus, schedule, and complete your tasks.";

  const today = todayKey();
  const inboxCount = tasks.filter((t) => !t.projectId && !t.completed).length;
  const todayCount = tasks.filter(
    (t) => t.dueDate && t.dueDate.slice(0, 10) <= today && !t.completed
  ).length;

  const navBadge = (path: string) => {
    if (path === "/" && inboxCount > 0) return inboxCount;
    if (path === "/today" && todayCount > 0) return todayCount;
    return null;
  };

  return (
    <div className={`app-shell${sidebarOpen ? "" : " sidebar-collapsed"}`}>
      <aside className="app-sidebar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <FiSun />
          </div>
          <div>
            <h2>Todo Pro</h2>
            <p>Offline-ready planner</p>
          </div>
        </div>

        <nav aria-label="Main navigation">
          <p className="nav-section-label">Views</p>
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const badge = navBadge(item.path);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      isActive ? "nav-link nav-link-active" : "nav-link"
                    }
                  >
                    <Icon className="nav-icon" aria-hidden="true" />
                    <span className="nav-label">{item.label}</span>
                    {badge !== null && <span className="nav-badge">{badge}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="app-main">
        <header className="top-bar">
          <div className="top-bar-left">
            <button
              className="button-icon"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <FiMenu />
            </button>
            <div>
              <h1 className="top-bar-title">{pageTitle}</h1>
              <p className="page-subtitle">{pageSubtitle}</p>
            </div>
          </div>

          <div className="top-actions">
            <div className="search-wrap">
              <FiSearch className="search-icon" aria-hidden="true" />
              <input
                className="search-input"
                placeholder="Search tasks…"
                value={localSearch}
                onChange={handleSearchChange}
                aria-label="Search tasks"
              />
            </div>
            <button
              className="button-icon theme-toggle"
              onClick={toggleDarkMode}
              aria-label="Toggle colour theme"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
