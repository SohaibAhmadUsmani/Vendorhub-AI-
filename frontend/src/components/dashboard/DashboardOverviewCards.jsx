import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { DollarSign, FileQuestion } from "lucide-react";
import { getRoleRoute } from "../../utils/routeUtils";
import { fetchOverview, selectOverview } from "../../redux/dashboardSlice";
import OverviewCard from "./OverviewCard";
import OverviewCardSkeleton from "./OverviewCardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";
import DashboardErrorState from "./DashboardErrorState";

/* --------------------------------------------------------------------------
   DashboardOverviewCards — KPI row (4 cards). Metric cards come straight
   from the Redux dashboard slice (GET /api/dashboard/overview). Skeletons
   while loading; a failed request shows one inline error card with retry;
   an empty payload keeps the grid with an elegant placeholder. The card
   grid is never removed.
   -------------------------------------------------------------------------- */

export default function DashboardOverviewCards() {
  const dispatch = useDispatch();
  const { status, data } = useSelector(selectOverview);
  const metrics = data?.metrics ?? [];

  if (status === "error") {
    return (
      <section aria-label="Key metrics" className="dash-card flex flex-col p-5 sm:p-6">
        <DashboardErrorState
          icon={<DollarSign className="h-6 w-6" strokeWidth={2} />}
          title="Couldn't load your key metrics"
          hint="Your KPIs are temporarily unavailable. Retry and they'll come right back."
          onRetry={() => dispatch(fetchOverview())}
        />
      </section>
    );
  }

  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 gap-[5px] sm:grid-cols-2 xl:grid-cols-4"
    >
      {(status === "loading" || status === "idle") &&
        Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <OverviewCardSkeleton />
          </motion.div>
        ))}

      {status === "success" && metrics.length === 0 && (
        <div className="dash-card sm:col-span-2 xl:col-span-4">
          <DashboardEmptyState
            icon={<FileQuestion className="h-6 w-6" strokeWidth={2} />}
            title="No dashboard data available yet"
            hint="Start receiving RFQs and orders and your key metrics will appear here."
            action={{ label: "Create RFQ", to: getRoleRoute("rfqs") }}
            compact
          />
        </div>
      )}

      {status === "success" &&
        metrics.length > 0 &&
        metrics.map((metric, i) => (
          <OverviewCard key={metric.id} metric={metric} delay={i} />
        ))}
    </section>
  );
}