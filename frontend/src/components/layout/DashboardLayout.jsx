import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import DashboardContent from "./DashboardContent";

/* --------------------------------------------------------------------------
   DashboardLayout — global application shell.
   Desktop: fixed left sidebar (expanded ↔ icon rail) + sticky navbar +
   scrollable content column. Tablet/mobile (<1024px): the sidebar becomes an
   off-canvas drawer toggled by the navbar hamburger, with a blurred backdrop.
   Body scroll is locked while the drawer is open so background content stays
   put. Routing stays untouched — pages render through <Outlet />.
   -------------------------------------------------------------------------- */

const MOBILE_QUERY = "(max-width: 1023px)";

export default function DashboardLayout() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY).matches : false,
  );
  const [collapsed, setCollapsed] = useState(false); // desktop icon rail
  const [mobileOpen, setMobileOpen] = useState(false); // <1024px drawer

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
    return undefined;
  }, [mobileOpen]);

  /* Close the mobile drawer with the Escape key (keyboard operability). */
  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const handleToggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] bg-grid-pattern">
      <DashboardSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <DashboardNavbar onToggleSidebar={handleToggleSidebar} />
        <DashboardContent>
          <Outlet />
        </DashboardContent>
      </div>
    </div>
  );
}