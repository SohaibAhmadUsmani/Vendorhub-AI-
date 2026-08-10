import React from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardContainer from "./DashboardContainer";

/* --------------------------------------------------------------------------
   DashboardContent — scrollable main content column. Wraps <Outlet /> in a
   subtle fade/slide page transition keyed by the current route path, so each
   navigation animates in without a full layout remount. 24px page padding
   per the global design system.
   -------------------------------------------------------------------------- */

export default function DashboardContent({ children }) {
  const { pathname } = useLocation();

  return (
    <main className="flex-1 p-5 sm:p-7 xl:p-8">
      <DashboardContainer>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </DashboardContainer>
    </main>
  );
}