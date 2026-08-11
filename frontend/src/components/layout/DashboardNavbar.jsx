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
  selectNotificationCount,
  selectOverviewUser,
} from "../../redux/dashboardSlice";
import { useNotifications } from "../../contexts/NotificationContext";
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
  const notificationCount = useSelector(selectNotificationCount);
  const overviewUser = useSelector(selectOverviewUser);
  const { notifications, loading, error, unreadCount, markRead, markAllRead, refreshNotifications } = useNotifications();

  const [user, setUser] = useState(null);
  const role = user?.role ? String(user.role).toLowerCase() : "buyer";
  const PROFILE_MENU_BY_ROLE = {
    buyer: [
      {
        label: "View Profile",
        path: "/buyer/vendors",
        icon: UserRound,
      },
      {
        label: "Settings",
        path: "/buyer/settings",
        icon: Settings,
      },
    ],

    vendor: [
      {
        label: "View Profile",
        path: "/vendor/profile",
        icon: UserRound,
      },
      {
        label: "Settings",
        path: "/vendor/settings",
        icon: Settings,
      },
    ],

    admin: [
      {
        label: "Manage Users",
        path: "/admin/users",
        icon: UserRound,
      },
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
  };
  const PROFILE_MENU =
    PROFILE_MENU_BY_ROLE[role] || PROFILE_MENU_BY_ROLE.buyer;

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to read logged-in user:", error);
      setUser(null);
    }
  }, []);


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

    if (role === "buyer") {
      navigate(
        q
          ? `/buyer/ai-search?q=${encodeURIComponent(q)}`
          : "/buyer/ai-search"
      );
    }
  };
  /* ------------------------------ Dropdowns ----------------------------- */
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const bellRef = useRef(null);
  const profileRef = useRef(null);
  useClickOutside(bellRef, () => setBellOpen(false), bellOpen);
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

  const feed = notifications.slice(0, 5);

  const handleNotificationSelect = async (item) => {
    setBellOpen(false);
    if (item.unread) {
      await markRead(item.id);
    }
    if (item.link) {
      navigate(item.link);
    } else {
      navigate('/buyer/notifications');
    }
  };

  function handleSignOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login", { replace: true });
  }

  const handleLogout = handleSignOut;

  const messagesPath = {
    buyer: "/buyer/messages",
    vendor: "/vendor/messages",
    admin: "/admin/dashboard",
  }[role];

  const notificationsPath = {
    buyer: "/buyer/notifications",
    vendor: "/vendor/notifications",
    admin: "/admin/dashboard",
  }[role];

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
            <div className="group flex h-12 items-center gap-2.5 rounded-2xl border border-[#EEF1F6] bg-white px-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)] transition-all duration-200 focus-within:border-[var(--primary-purple)] focus-within:ring-4 focus-within:ring-[var(--primary-purple)]/20">
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
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md text-xs"
                >
                  ✕
                </button>
              )}
              <kbd className="hidden shrink-0 rounded-md border border-[#EEF1F6] bg-[#F8FAFC] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-light)] lg:block">
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
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary-purple)] to-[var(--accent-cyan)] px-1 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  role="menu"
                  aria-label="Notifications menu"
                  className="absolute right-0 mt-2.5 w-[min(380px,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-2xl shadow-black/15 z-50"
                >
                  {/* Premium Dark Header Banner */}
                  <div 
                    className="relative px-5 py-4 text-white overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #1A1838 0%, #151D30 60%, #0B1021 100%)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    {/* Dot Grid overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundSize: '16px 16px',
                        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)'
                      }} 
                    />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                          <Bell size={16} className="text-[#A78BFA]" />
                        </div>
                        <div>
                          <p className="font-heading text-sm font-extrabold text-white tracking-tight">
                            Activity Feed & Alerts
                          </p>
                          <p className="text-[11px] text-white/85 font-mono">
                            Real-time platform notifications
                          </p>
                        </div>
                      </div>
                      {unreadCount > 0 && (
                        <span className="flex items-center gap-1.5 rounded-full bg-[#6C5CE7]/30 border border-[#6C5CE7]/50 px-2.5 py-0.5 text-[10px] font-bold text-[#C4B5FD]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
                          {unreadCount} Unread
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notification List Container */}
                  <div className="max-h-[340px] overflow-y-auto bg-white">
                    {loading && (
                      <div className="space-y-2.5 p-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="skeleton-block h-14 w-full rounded-xl" />
                        ))}
                      </div>
                    )}

                    {error && (
                      <p className="px-4 py-8 text-center text-xs font-medium text-[var(--text-muted)]">
                        Couldn't load notifications.
                      </p>
                    )}

                    {!loading && !error && feed.length === 0 && (
                      <div className="px-4 py-10 text-center">
                        <Sparkles size={24} className="mx-auto text-[var(--primary-purple)]/60 mb-2" />
                        <p className="text-xs font-semibold text-[var(--text-primary)]">
                          You're all caught up!
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          No pending alerts or messages.
                        </p>
                      </div>
                    )}

                    {!loading && !error && feed.length > 0 && (
                      <ul className="divide-y divide-[#EEF1F6]">
                        {feed.map((n) => {
                          const Icon = NOTIFICATION_ICONS[n.type] ?? Sparkles;
                          const colorRail = n.type === 'rfq' 
                            ? '#6C5CE7' 
                            : n.type === 'order' 
                            ? '#0EA5E9' 
                            : n.type === 'message' 
                            ? '#10B981' 
                            : '#F59E0B';
                            
                          return (
                            <li
                              key={n.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => handleNotificationSelect(n)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  handleNotificationSelect(n);
                                }
                              }}
                              style={{ borderLeft: `3.5px solid ${colorRail}` }}
                              className="flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-all hover:bg-[#F8FAFC]"
                            >
                              <span 
                                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                                style={{
                                  backgroundColor: `${colorRail}15`,
                                  color: colorRail
                                }}
                              >
                                <Icon size={15} strokeWidth={2.2} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2">
                                  <span className="truncate text-[13px] font-bold text-[var(--text-primary)]">
                                    {n.title}
                                  </span>
                                  <span className="shrink-0 font-mono text-[10px] font-medium text-[var(--text-muted)]">
                                    {timeAgo(n.time)}
                                  </span>
                                </span>
                                {n.message && (
                                  <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-[var(--text-muted)]">
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

                  {/* Clean Footer Link */}
                  <div className="border-t border-[#EEF1F6] bg-[#F8FAFC] px-4 py-3 text-center">
                    <Link
                      to={notificationsPath}
                      onClick={() => setBellOpen(false)}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--primary-purple)] hover:underline"
                    >
                      View All Activity & Notifications →
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
                  {user?.role
                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                    : "User"}
                </span>
              </span>
              <ChevronDown
                size={15}
                className={`hidden shrink-0 text-[var(--text-muted)] transition-transform duration-200 md:block ${profileOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-[#EEF1F6] bg-white p-1.5 shadow-xl shadow-slate-200/50"
                  role="menu"
                >
                  <div className="border-b border-[#EEF1F6] px-3 py-2">
                    <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                      {user?.name ?? "Logged-in User"}
                    </p>
                    <p className="truncate text-[11px] text-[var(--text-muted)]">
                      {user?.email ?? ""}
                    </p>
                  </div>
                  {PROFILE_MENU.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-main)]"
                    >
                      <item.icon
                        size={15}
                        className="text-[var(--text-muted)]"
                      />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-[#DC2626] transition-colors hover:bg-red-50 cursor-pointer"
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