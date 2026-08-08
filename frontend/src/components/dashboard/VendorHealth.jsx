import React from "react";
import { HeartPulse } from "lucide-react";
import { VENDOR_HEALTH_PATH, useApi, getVendorHealth } from "../../services/dashboardService";
import { SkeletonRows, ConnectionState, EmptyState } from "./DashboardStates";
import VendorHealthMetric from "./VendorHealthMetric";

/* --------------------------------------------------------------------------
   Vendor Health — reliability indicators as a polished metrics card. Every
   metric row renders a colored icon, label, count-up percentage, an animated
   8px gradient bar and a backend-provided detail line. Design is
   presentation only; labels and values come straight from the backend
   (Profile/Response/On-Time Delivery/Satisfaction/Completion).
   -------------------------------------------------------------------------- */

export default function VendorHealth() {
  const { status, data, refetch } = useApi(VENDOR_HEALTH_PATH);
  const health = status === "success" ? getVendorHealth(data) : null;
  const hasMetrics = health?.metrics?.some((m) => m.value != null);

  return (
    <section
      className="dash-card flex w-full flex-col p-5 sm:p-6"
      aria-label="Vendor Health"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="icon-tile bg-[var(--pastel-pink)] text-[#DB2777]">
            <HeartPulse className="h-6 w-6" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
              Vendor Health
            </h2>
            <p className="truncate text-[13px] font-medium text-[var(--text-muted)]">
              Reliability at a glance
            </p>
          </div>
        </div>
        {health?.overallScore != null && (
          <span className="shrink-0 rounded-full bg-[var(--bg-main)] px-2.5 py-1 text-xs font-bold text-[var(--text-secondary)] tabular-nums ring-1 ring-[var(--border-card)]">
            {health.overallScore}% overall
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        {status === "loading" && <SkeletonRows rows={5} />}

        {status === "error" && (
          <div className="flex flex-1">
            <ConnectionState
              title="Health unreachable"
              hint="We couldn't load your vendor health indicators."
              onRetry={refetch}
            />
          </div>
        )}

        {status === "success" && !hasMetrics && (
          <div className="flex flex-1">
            <EmptyState
              icon={<HeartPulse className="h-6 w-6" strokeWidth={1.75} />}
              title="No health data yet."
              hint="Health indicators will populate as your vendor data is verified."
              onRetry={refetch}
            />
          </div>
        )}

        {status === "success" && hasMetrics && (
          <div className="flex flex-1 flex-col justify-center gap-4">
            {health.metrics.map((metric, i) => (
              <VendorHealthMetric key={metric.key} metric={metric} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
