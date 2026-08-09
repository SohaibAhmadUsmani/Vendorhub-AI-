import React from "react";
import AIInsightsCard from "../dashboard/AIInsightsCard";
import VendorHealthCard from "../dashboard/VendorHealthCard";
import QuickActionsCard from "../dashboard/QuickActionsCard";

/* --------------------------------------------------------------------------
   RightSidebar — the dashboard's intelligence rail. Composes the AI insights
   feed, vendor health indicators and quick actions into the fixed right
   column of the dashboard grid. Every widget stays fully independent and
   data-driven (React Query / Redux) with its own loading, error and empty
   states — the sidebar never collapses.
   -------------------------------------------------------------------------- */

export default function RightSidebar() {
  return (
    <aside className="min-w-0 space-y-6 xl:col-span-3" aria-label="Dashboard insights">
      <AIInsightsCard />
      <VendorHealthCard />
      <QuickActionsCard />
    </aside>
  );
}
