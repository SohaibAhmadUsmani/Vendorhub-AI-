import React from "react";

/* --------------------------------------------------------------------------
   DashboardRightSidebar — the sticky rail column of the dashboard grid.
   Groups secondary widgets (AI insights, vendor health, quick actions) into
   a single semantic aside with a consistent 32px gap rhythm.
   -------------------------------------------------------------------------- */

export default function DashboardRightSidebar({ children, className = "" }) {
  return (
    <aside
      aria-label="Insights and actions"
      className={`flex h-full w-full min-w-0 flex-col space-y-6 xl:w-[340px] xl:min-w-[340px] xl:max-w-[340px] xl:shrink-0 ${className}`}
    >
      {children}
    </aside>
  );
}