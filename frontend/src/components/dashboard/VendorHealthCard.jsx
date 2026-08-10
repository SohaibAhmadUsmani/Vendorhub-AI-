import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, ArrowUpRight } from "lucide-react";
import { useVendorHealth, getVendorHealth } from "../../services/dashboard/dashboardService";
import VendorHealthMetric from "./VendorHealthMetric";
import VendorHealthSkeleton from "./VendorHealthSkeleton";
import VendorHealthEmptyState from "./VendorHealthEmptyState";
import DashboardErrorState from "./DashboardErrorState";

/* --------------------------------------------------------------------------
   VendorHealthCard — right-rail health panel. The backend computes every
   metric (Profile Completion, Response Time, On-Time Delivery, Customer
   Satisfaction, Order Completion); this card only renders the values with
   animated gradient bars. "View Details" deep-links to the Vendor Analytics
   page. Skeletons, error + retry and an empty state keep the widget intact.
   -------------------------------------------------------------------------- */

export default function VendorHealthCard() {
  const { data, isSuccess, isLoading, isError, refetch } = useVendorHealth();
  const health = isSuccess ? getVendorHealth(data) : null;
  const metrics = useMemo(() => health?.metrics ?? [], [health]);
  const hasMetrics = metrics.some((m) => m.value != null);

  return (
    <section className="dash-card flex flex-col p-5 sm:p-6" aria-label="Vendor Health">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-cyan-light)] text-[var(--accent-cyan)]">
            <HeartPulse className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold tracking-tight text-[var(--text-primary)]">
              Vendor Health
            </h2>
            <p className="text-[13px] font-medium text-[var(--text-muted)]">
              Reliability indicators
            </p>
          </div>
        </div>
        <Link
          to="/buyer/vendor-analytics"
          className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-[var(--accent-cyan)] transition hover:bg-[var(--accent-cyan-light)]"
          aria-label="View vendor health details"
        >
          View Details
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="mt-4 flex-1">
        {isLoading && <VendorHealthSkeleton />}

        {isError && (
          <DashboardErrorState
            icon={<HeartPulse className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load vendor health"
            hint="Your reliability indicators are temporarily unavailable. Retry to refresh."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && !hasMetrics && <VendorHealthEmptyState />}

        {!isLoading && !isError && hasMetrics && (
          <div className="space-y-3.5">
            {metrics.map((metric, i) => (
              <VendorHealthMetric key={metric.key} metric={metric} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
