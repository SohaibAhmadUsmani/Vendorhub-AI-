import React from "react";

/* --------------------------------------------------------------------------
   DashboardStates — re-exports the canonical state kit (skeletons, empty
   and error states). Kept as a convenience surface for widgets that were
   built against it; new widgets import DashboardSkeleton,
   DashboardEmptyState and DashboardErrorState directly.
   -------------------------------------------------------------------------- */

export { SkeletonRows, SkeletonChart, KpiSkeleton, SkeletonBlock } from "./DashboardSkeleton";
export { default as EmptyState } from "./DashboardEmptyState";
export { default as ConnectionState } from "./DashboardErrorState";

/* Keep a default export for any import that does not use named imports. */
export default function DashboardStates() {
  return null;
}
