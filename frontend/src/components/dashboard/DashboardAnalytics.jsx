import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  useVendorAdvancedAnalytics,
  getAdvancedAnalytics,
} from "../../services/dashboard/dashboardService";
import AdvancedMetricCard from "./AdvancedMetricCard";
import AnalyticsCardSkeleton from "./AnalyticsCardSkeleton";
import DashboardErrorState from "./DashboardErrorState";
import DashboardEmptyState from "./DashboardEmptyState";

/* --------------------------------------------------------------------------
   DashboardAnalytics — the eight-metric business overview strip. One React
   Query call powers eight premium stat cards; skeletons mirror the exact
   card dimensions, failures render an inline retry, and a missing payload
   keeps the section visible with an empty state. No metrics are computed
   on the client — the backend sends value + comparison for each one.
   -------------------------------------------------------------------------- */

export default function DashboardAnalytics() {
  const { data, isSuccess, isLoading, isError, refetch } = useVendorAdvancedAnalytics();

  const analytics = useMemo(
    () => (isSuccess ? getAdvancedAnalytics(data) : null),
    [isSuccess, data],
  );
  const metrics = analytics?.metrics ?? [];

  return (
    <div aria-label="Advanced analytics" className="space-y-5">
      {isLoading && (
        <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-full">
              <AnalyticsCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <DashboardErrorState
          icon={<BarChart3 className="h-6 w-6" strokeWidth={2} />}
          title="Couldn't load analytics"
          hint="Your business statistics are temporarily unavailable. Retry to refresh them."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && metrics.length === 0 && (
        <DashboardEmptyState
          icon={<BarChart3 className="h-6 w-6" strokeWidth={1.75} />}
          title="No analytics available"
          hint="Once your catalog and orders start generating activity, your key metrics will appear here."
        />
      )}

      {!isLoading && !isError && metrics.length > 0 && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.key}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex h-full"
            >
              <AdvancedMetricCard metric={metric} delay={i} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
