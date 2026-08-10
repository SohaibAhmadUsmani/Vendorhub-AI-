import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  MessageSquare,
  ShoppingCart,
  Users,
  Bookmark,
  Package,
  MessageCircle,
  FileSignature,
  Files,
  BarChart3,
  Wallet,
  Settings,
  ChevronDown,
  X,
  LogOut,
  UserRound,
} from "lucide-react";
import VendorHubLogo from "./VendorHubLogo";
import Avatar from "./Avatar";
import useClickOutside from "../../hooks/useClickOutside";

/* --------------------------------------------------------------------------
   DashboardSidebar — dark violet gradient, icon-rail navigation shell.
   Desktop defaults to a compact 88px icon-only rail (icons centered inside
   rounded squares); a single hover or the navbar toggle expands it to the
   full 240px width with labels. The active item is a large violet rounded
   rectangle. Bottom holds the Settings shortcut + the authenticated profile
   card. On mobile (<1024px) it becomes an off-canvas drawer with a blurred
   backdrop. All labels, icons, routes and profile values are data-driven.
   -------------------------------------------------------------------------- */

const NAV_GROUPS_BY_ROLE = {
  buyer: [
    {
      items: [
        {
          label: "Dashboard",
          path: "/buyer/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      items: [
        {
          label: "AI Search",
          path: "/buyer/ai-search",
          icon: Sparkles,
        },
        {
          label: "RFQs",
          path: "/buyer/rfqs",
          icon: FileText,
        },
        {
          label: "Quotes",
          path: "/buyer/quotes",
          icon: MessageSquare,
        },
        {
          label: "Orders",
          path: "/buyer/orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      items: [
        {
          label: "Vendors",
          path: "/buyer/vendors",
          icon: Users,
        },
        {
          label: "Saved Vendors",
          path: "/buyer/saved-vendors",
          icon: Bookmark,
        },
        {
          label: "Product Catalog",
          path: "/buyer/product-catalog",
          icon: Package,
        },
      ],
    },
    {
      items: [
        {
          label: "Messages",
          path: "/buyer/messages",
          icon: MessageCircle,
        },
        {
          label: "Contracts",
          path: "/buyer/contracts",
          icon: FileSignature,
        },
        {
          label: "Documents",
          path: "/buyer/documents",
          icon: Files,
        },
      ],
    },
    {
      items: [
        {
          label: "Analytics",
          path: "/buyer/analytics",
          icon: BarChart3,
        },
        {
          label: "Spend Summary",
          path: "/buyer/spend-summary",
          icon: Wallet,
        },
      ],
    },
  ],

  vendor: [
    {
      items: [
        {
          label: "Dashboard",
          path: "/vendor/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      items: [
        {
          label: "Company Profile",
          path: "/vendor/profile",
          icon: UserRound,
        },
        {
          label: "Products",
          path: "/vendor/products",
          icon: Package,
        },
        {
          label: "Certifications",
          path: "/vendor/certifications",
          icon: FileSignature,
        },
        {
          label: "Pricing",
          path: "/vendor/pricing",
          icon: Wallet,
        },
      ],
    },
    {
      items: [
        {
          label: "Received RFQs",
          path: "/vendor/rfqs",
          icon: FileText,
        },
        {
          label: "Quotations",
          path: "/vendor/quotes",
          icon: MessageSquare,
        },
        {
          label: "Orders",
          path: "/vendor/orders",
          icon: ShoppingCart,
        },
      ],
    },
    {
      items: [
        {
          label: "Messages",
          path: "/vendor/messages",
          icon: MessageCircle,
        },
        {
          label: "Documents",
          path: "/vendor/documents",
          icon: Files,
        },
        {
          label: "Analytics",
          path: "/vendor/analytics",
          icon: BarChart3,
        },
        {
          label: "Notifications",
          path: "/vendor/notifications",
          icon: Sparkles,
        },
      ],
    },
  ],

  admin: [
    {
      items: [
        {
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      items: [
        {
          label: "Manage Users",
          path: "/admin/users",
          icon: Users,
        },
        {
          label: "Verify Vendors",
          path: "/admin/vendors",
          icon: UserRound,
        },
        {
          label: "Categories",
          path: "/admin/categories",
          icon: Package,
        },
      ],
    },
    {
      items: [
        {
          label: "Reports",
          path: "/admin/reports",
          icon: FileText,
        },
        {
          label: "Subscriptions",
          path: "/admin/subscriptions",
          icon: Wallet,
        },
        {
          label: "Fraud Monitoring",
          path: "/admin/fraud-monitoring",
          icon: FileSignature,
        },
      ],
    },
    {
      items: [
        {
          label: "Platform Analytics",
          path: "/admin/analytics",
          icon: BarChart3,
        },
      ],
    },
  ],
};

const NavItemInner = React.memo(function NavItemInner({ item, showLabels, isActive, rail }) {
  return (
    <>
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${showLabels ? "h-11 w-11" : "h-12 w-12"
          } ${rail && isActive
            ? "bg-gradient-to-br from-[#7C6CF0] to-[#5A4AE8] text-white shadow-lg shadow-black/40 ring-1 ring-white/20"
            : rail
              ? "bg-white/[0.04] text-[#C9BDFF] group-hover:bg-white/10 group-hover:text-white group-hover:scale-105"
              : ""
          } ${!rail && isActive ? "text-white" : !rail ? "text-[#C9BDFF] group-hover:text-white" : ""}`}
      >
        <item.icon size={20} strokeWidth={2.1} />
        {rail && isActive && (
          <span className="absolute -left-3 h-6 w-1 rounded-r-full bg-white/90" />
        )}
      </span>
      {showLabels && <span className="ml-3 truncate text-[13px] font-semibold">{item.label}</span>}
    </>
  );
});

const NavItem = React.memo(function NavItem({ item, showLabels, onNavigate }) {
  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      title={!showLabels ? item.label : undefined}
      aria-label={item.label}
      className={({ isActive }) =>
        `group relative flex items-center rounded-2xl text-sm transition-all duration-200 cursor-pointer ${showLabels ? "justify-start" : "justify-center"
        } ${showLabels ? "px-3 py-2" : "px-0 py-1"
        } ${isActive
          ? showLabels
            ? "bg-gradient-to-r from-[#6C63FF] to-[#7C6CF0] text-white shadow-lg shadow-[#6C63FF]/30"
            : "text-white"
          : "text-[#C7BDFF] hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <NavItemInner item={item} showLabels={showLabels} isActive={isActive} rail={!showLabels} />
      )}
    </NavLink>
  );
});

export default function DashboardSidebar({
  collapsed,
  mobileOpen,
  isMobile,
  onCloseMobile,
}) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to read logged-in user:", error);
    }
  }, []);
  const role = user?.role || "buyer";
  const profilePath = {
  buyer: "/buyer/vendors",
  vendor: "/vendor/profile",
  admin: "/admin/users",
}[role];

  const navGroups =
    NAV_GROUPS_BY_ROLE[role] || NAV_GROUPS_BY_ROLE.buyer;

  const [hovered, setHovered] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

  const expandedLabel = !collapsed || hovered; // desktop expanded / labels
  const showLabels = isMobile ? true : expandedLabel;

  const width = isMobile ? "w-[288px]" : expandedLabel ? "w-[240px]" : "w-[88px]";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setProfileOpen(false);

    if (isMobile) {
      onCloseMobile();
    }

    navigate("/login", { replace: true });
  };
  return (
    <>
      {/* Mobile drawer backdrop */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCloseMobile}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`z-50 flex h-screen flex-col overflow-hidden bg-gradient-to-b from-[#251B5E] via-[#1D144A] to-[#150D3A] text-[#C9BDFF] transition-all duration-300 ${isMobile
          ? `fixed top-0 left-0 ${width} shadow-2xl ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
          : `sticky top-0 shrink-0 ${width}`
          }`}
        aria-label="Primary navigation"
      >
        {/* Brand */}
        <div
          className={`flex shrink-0 items-center border-b border-white/10 pb-5 ${showLabels ? "justify-between px-4 pt-6" : "justify-center px-2 pt-6"
            }`}
        >
          {showLabels ? (
            <VendorHubLogo size="small" showTagline={false} lightMode={false} />
          ) : (
            <VendorHubLogo size="small" iconOnly lightMode={false} />
          )}

          {isMobile && mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9A8CFF] transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* Navigation — centered icon rail / expanded list */}
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4" aria-label="Sidebar sections">
          <div className={`flex flex-col gap-1 ${showLabels ? "" : "items-center"}`}>
            {navGroups.map((group, gi) => (
              <React.Fragment key={gi}>
                {gi > 0 && <div className="my-2 h-px w-9 bg-white/10 mx-auto" aria-hidden="true" />}
                {group.items.map((item) => (
                  <NavItem
                    key={item.path}
                    item={item}
                    showLabels={showLabels}
                    onNavigate={isMobile ? onCloseMobile : undefined}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </nav>

        {/* Bottom — Settings shortcut + profile */}
        <div className="mt-auto shrink-0 border-t border-white/10 p-3">
          <div className={showLabels ? "space-y-2" : "flex flex-col items-center gap-2"}>
            {/* Settings shortcut */}
            <NavLink
              to={`/${role}/settings`}
              onClick={isMobile ? onCloseMobile : undefined}
              aria-label="Settings"
              title={!showLabels ? "Settings" : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl transition-all duration-200 ${showLabels ? "justify-start gap-3 px-3 py-2" : "justify-center h-12 w-12"
                } ${isActive
                  ? "bg-white/10 text-white"
                  : "text-[#9A8CFF] hover:bg-white/10 hover:text-white hover:scale-105"
                }`
              }
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl">
                <Settings size={20} strokeWidth={2.1} />
              </span>
              {showLabels && <span className="text-[13px] font-semibold">Settings</span>}
            </NavLink>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={profileOpen && showLabels}
                title={!showLabels ? user?.name ?? "Profile" : undefined}
                className={`flex w-full items-center rounded-2xl p-2.5 transition-colors hover:bg-white/10 cursor-pointer ${showLabels ? "gap-3" : "justify-center"
                  } ${profileOpen ? "bg-white/10" : ""}`}
              >
                <Avatar name={user?.name} src={user?.avatar} size={showLabels ? 36 : 34} />
                {showLabels && (
                  <span className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-[13px] font-bold text-white">
                      {user?.name ?? "Loading…"}
                    </span>
                    <span className="block truncate text-[11px] font-medium text-[#9A8CFF]">
                      {user?.role ?? "Vendor"}
                    </span>
                  </span>
                )}
                {showLabels && (
                  <ChevronDown
                    size={15}
                    className={`shrink-0 text-[#9A8CFF] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              <AnimatePresence>
                {profileOpen && showLabels && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    role="menu"
                    aria-label="Profile menu"
                    className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-2xl border border-white/10 bg-[#1D144A] p-1.5 shadow-2xl shadow-black/50"
                  >
                    {user && (
                      <div className="border-b border-white/10 px-3 py-2.5">
                        <p className="truncate text-[13px] font-bold text-white">{user.name}</p>
                        {user.email && (
                          <p className="mt-0.5 truncate text-[11px] text-[#C9BDFF]">{user.email}</p>
                        )}
                      </div>
                    )}
                    <Link
                      to={profilePath}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-[#C9BDFF] transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <UserRound
                        size={15}
                        className="text-[#9A8CFF]"
                        strokeWidth={2}
                      />
                      View Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-[#FCA5A5] transition-colors hover:bg-red-500/10"
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
      </aside>
    </>
  );
}