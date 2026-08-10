import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  FileText,
  ShoppingCart,
  Mail,
  Sparkles,
  X,
} from "lucide-react";
import VendorHubLogo from "./VendorHubLogo";
import Avatar from "./Avatar";
import {
  fetchOverview,
  selectOverview,
  selectOverviewUser,
  selectNotificationCount,
} from "../../redux/dashboardSlice";
import { useApi, NOTIFICATIONS_PATH, getNotifications } from "../../services/dashboardService";
import useClickOutside from "../../hooks/useClickOutside";

/* --------------------------------------------------------------------------
   DashboardNavbar — 74px white top navigation bar.
   Left: hamburger + brand. Center: large rounded search pill (Ctrl+/ focus
   shortcut, focus glow, Enter deep-links into AI Search for Module 4).
   Right: notification bell with live unread count + feed dropdown, then the
   profile chip (avatar, company name, Verified Vendor subtitle, chevron) with
   dropdown. Identity/notification values are API/Redux driven. Hairline
   bottom border + extremely subtle shadow.
   -------------------------------------------------------------------------- */

const NOTIFICATION_ICONS = {
  rfq: FileText,
  order: ShoppingCart,
  message: Mail,
  system: Bell,
};

function timeAgo(value) {
  if (!value) return "now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short" }).format(date);
}

export default function DashboardNavbar({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const overview = useSelector(selectOverview);
  const user = useSelector(selectOverviewUser);
  const notificationCount = useSelector(selectNotificationCount);

  useEffect(() => {
    if (overview.status === "idle") dispatch(fetchOverview());
  }, [overview.status, dispatch]);

  /* ------------------------------- Search ------------------------------- */
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    if (!mobileSearchOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSearchOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    setMobileSearchOpen(false);
    navigate(q ? `/buyer/ai-search?q=${encodeURIComponent(q)}` : "/buyer/ai-search");
  };

  /* ------------------------------ Dropdowns ----------------------------- */
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const bellRef = useRef(null);
  const profileRef = useRef(null);
  useClickOutside(bellRef, () => setBellOpen(false), bellOpen);
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

  const notificationsQ = useApi(NOTIFICATIONS_PATH);
  const notifications = useMemo(
    () => (notificationsQ.status === "success" ? getNotifications(notificationsQ.data) : []),
    [notificationsQ.status, notificationsQ.data],
  );
  const feed = notifications.slice(0, 5);

  const PROFILE_MENU = [
    { label: "View Profile", path: "/buyer/vendors", icon: UserRound },
    { label: "Settings", path: "/buyer/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-30 h-[74px] shrink-0 border-b border-[#EEF1F6] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex h-full items-center gap-3 px-4 sm:px-6">
        {/* ------------------------------ Left ------------------------------ */}
        <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)]"
          >
            <Menu size={20} />
          </button>
          <div className="hidden shrink-0 overflow-hidden sm:block">
            <VendorHubLogo size="small" showTagline={false} lightMode />
          </div>
        </div>

        {/* ------------------------------ Center ------------------------------ */}
        <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex">
          <form onSubmit={submitSearch} role="search" className="w-full max-w-xl">
            <div className="group flex h-12 items-center gap-2.5 rounded-2xl border border-[#EEF1F6] bg-white px-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)] transition-all duration-200 focus-within:border-[var(--primary-purple)] focus-within:shadow-[0_0_0_4px_rgba(108,99,255,0.12)]">
              <Search
                size={17}
                className="shrink-0 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--primary-purple)]"
                strokeWidth={2.2}
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search suppliers, products, RFQs..."
                aria-label="Search suppliers, products, RFQs"
                className="w-full min-w-0 bg-transparent text-[13px] font-medium text-[var(--text-primary)] outline-none placeholder:text-[var(--text-light)]"
              />
              <kbd className="hidden shrink-0 rounded-md border border-[#EEF1F6] bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-light)] lg:block">
                Ctrl /
              </kbd>
            </div>
          </form>
        </div>

        {/* ------------------------------ Right ------------------------------ */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Mobile search trigger */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
            aria-controls="mobile-dashboard-search"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)] md:hidden"
          >
            {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Notifications */}
          <div ref={bellRef} className="relative">
            <button
              type="button"
              onClick={() => setBellOpen((v) => !v)}
              aria-label="Notifications"
              aria-haspopup="menu"
              aria-expanded={bellOpen}
              className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)]"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary-purple)] to-[var(--accent-cyan)] px-1 text-[9px] font-bold text-white shadow-sm">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  role="menu"
                  aria-label="Notifications menu"
                  className="absolute right-0 mt-2 w-[min(360px,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-2xl shadow-black/10"
                >
                  <div className="flex items-center justify-between border-b border-[#EEF1F6] px-4 py-3">
                    <p className="font-heading text-sm font-bold text-[var(--text-primary)]">
                      Notifications
                    </p>
                    {notificationCount > 0 && (
                      <span className="rounded-full bg-[var(--primary-purple-light)] px-2 py-0.5 text-[10px] font-bold text-[var(--primary-purple)]">
                        {notificationCount} unread
                      </span>
                    )}
                  </div>

                  <div className="max-h-[320px] overflow-y-auto">
                    {notificationsQ.status === "loading" && (
                      <div className="space-y-2 p-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="skeleton-block h-12 w-full rounded-xl" />
                        ))}
                      </div>
                    )}

                    {notificationsQ.status === "error" && (
                      <p className="px-4 py-8 text-center text-xs font-medium text-[var(--text-muted)]">
                        Couldn't load notifications.
                      </p>
                    )}

                    {notificationsQ.status === "success" && feed.length === 0 && (
                      <p className="px-4 py-8 text-center text-xs font-medium text-[var(--text-muted)]">
                        You're all caught up. 🎉
                      </p>
                    )}

                    {notificationsQ.status === "success" && feed.length > 0 && (
                      <ul className="divide-y divide-[#EEF1F6]/80">
                        {feed.map((n) => {
                          const Icon = NOTIFICATION_ICONS[n.type] ?? Sparkles;
                          return (
                            <li
                              key={n.id}
                              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--primary-purple-light)]/40"
                            >
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-purple-light)] text-[var(--primary-purple)]">
                                <Icon size={15} strokeWidth={2} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="truncate text-[13px] font-semibold text-[var(--text-primary)]">
                                    {n.title}
                                  </span>
                                  <span className="shrink-0 text-[10px] font-medium text-[var(--text-muted)]">
                                    {timeAgo(n.time)}
                                  </span>
                                </span>
                                {n.message && (
                                  <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-[var(--text-muted)]">
                                    {n.message}
                                  </span>
                                )}
                              </span>
                              {n.unread && (
                                <span
                                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--primary-purple)]"
                                  aria-label="Unread"
                                />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="border-t border-[#EEF1F6] px-4 py-2.5">
                    <Link
                      to="/buyer/messages"
                      onClick={() => setBellOpen(false)}
                      className="block text-center text-xs font-bold text-[var(--primary-purple)] transition-opacity hover:opacity-80"
                    >
                      Open inbox
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Profile menu"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              className="flex cursor-pointer items-center gap-2.5 rounded-full border border-transparent py-1.5 pl-1.5 pr-1 transition-colors hover:border-[#EEF1F6] hover:bg-[var(--bg-main)]"
            >
              <Avatar name={user?.name} src={user?.avatar} size={38} />
              <span className="hidden min-w-0 text-left leading-tight md:block">
                <span className="block truncate max-w-[11rem] text-[13px] font-bold text-[var(--text-primary)]">
                  {user?.name ?? "Loading…"}
                </span>
                <span className="block truncate max-w-[11rem] text-[11px] font-medium text-[var(--text-muted)]">
                  {user?.role ?? "Verified Vendor"}
                </span>
              </span>
              <ChevronDown
                size={15}
                className={`hidden shrink-0 text-[var(--text-muted)] transition-transform duration-200 md:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  role="menu"
                  aria-label="Profile menu"
                  className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white p-1.5 shadow-2xl shadow-black/10"
                >
                  {user && (
                    <div className="border-b border-[#EEF1F6] px-3 py-2.5">
                      <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">
                        {user.name}
                      </p>
                      {user.email && (
                        <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">
                          {user.email}
                        </p>
                      )}
                    </div>
                  )}
                  {PROFILE_MENU.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)]"
                    >
                      <item.icon size={15} strokeWidth={2} />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-[#DC2626] transition-colors hover:bg-red-50"
                  >
                    <LogOut size={15} strokeWidth={2} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search row — expandable full-width search on < md viewports */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            id="mobile-dashboard-search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[#EEF1F6] bg-white md:hidden"
          >
            <form onSubmit={submitSearch} role="search" className="px-4 py-3 sm:px-6">
              <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-[var(--primary-purple)] bg-white px-4 shadow-[0_0_0_4px_rgba(108,99,255,0.12)]">
                <Search
                  size={17}
                  className="shrink-0 text-[var(--primary-purple)]"
                  strokeWidth={2.2}
                />
                <input
                  type="search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search suppliers, products, RFQs..."
                  aria-label="Search suppliers, products, RFQs"
                  className="w-full min-w-0 bg-transparent text-[13px] font-medium text-[var(--text-primary)] outline-none placeholder:text-[var(--text-light)]"
                />
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)]"
                >
                  <X size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}