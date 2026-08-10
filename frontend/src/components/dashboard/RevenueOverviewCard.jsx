import React from "react";
import { TrendingUp } from "lucide-react";
import DashboardCard from "../layout/DashboardCard";
import DashboardErrorState from "./DashboardErrorState";
import RevenueFilter from "./RevenueFilter";
import RevenueSummary from "./RevenueSummary";
import RevenueChart from "./RevenueChart";
import RevenueSkeleton from "./RevenueSkeleton";

/* --------------------------------------------------------------------------
   RevenueOverviewCard — left analytics card. Header with the range dropdown,
   then the animated summary + area chart for the selected period. The chart
   is always rendered: an empty period draws a flat baseline with a subtle
   inline note instead of replacing the visualization. Loading uses a
   dimension-stable skeleton; failures show an inline error with retry. All
   numbers come from the backend analytics payload.
   -------------------------------------------------------------------------- */

export default function RevenueOverviewCard({ range, onRangeChange, revenue, query }) {
  const { isLoading, isError, refetch } = query;

  return (
    <DashboardCard aria-label="Revenue Overview" className="flex min-w-0 flex-col p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="icon-tile bg-[var(--pastel-purple)] text-[var(--primary-purple)]">
            <TrendingUp className="h-6 w-6" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
              Revenue Overview
            </h2>
            <p className="truncate text-[13px] font-medium text-[var(--text-muted)]">
              Track revenue performance across time
            </p>
          </div>
        </div>
        <RevenueFilter value={range} onChange={onRangeChange} />
      </div>

      <div className="flex flex-1 flex-col">
        {isLoading && <RevenueSkeleton />}

        {isError && (
          <DashboardErrorState
            icon={<TrendingUp className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load revenue analytics"
            hint="Your revenue data is temporarily unavailable. Retry to refresh the chart."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && revenue && (
          <>
            <RevenueSummary
              total={revenue.total}
              changePercent={revenue.changePercent}
              trendDirection={revenue.trendDirection}
              compareLabel={revenue.compareLabel}
            />
            {/* key={range} re-runs the chart's draw animation on filter change */}
            <RevenueChart key={range} data={revenue.timeline} />
          </>
        )}
      </div>
    </DashboardCard>
  );
}