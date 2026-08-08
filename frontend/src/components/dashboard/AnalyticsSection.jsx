import React, { useMemo, useState } from "react";
import {
  useVendorAnalytics,
  getRevenueOverview,
  getPipeline,
} from "../../services/dashboard/analyticsService";
import RevenueOverviewCard from "./RevenueOverviewCard";
import RFQPipelineCard from "./RFQPipelineCard";

/* --------------------------------------------------------------------------
   AnalyticsSection — the Revenue Overview + RFQ Pipeline pair below the KPI
   row. Owns the selected range and the single range-aware analytics query;
   both cards render the same payload (revenue for the period + the pipeline
   breakdown), so changing the period triggers one backend request and both
   cards refresh together. Presentation stays fully separated from the
   data-fetching logic.
   -------------------------------------------------------------------------- */

export default function AnalyticsSection() {
  const [range, setRange] = useState("month");
  const { data, isSuccess, isLoading, isError, refetch } = useVendorAnalytics(range);

  const revenue = useMemo(() => (isSuccess ? getRevenueOverview(data) : null), [isSuccess, data]);
  const pipeline = useMemo(() => (isSuccess ? getPipeline(data) : null), [isSuccess, data]);
  const query = { isLoading, isError, refetch };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <RevenueOverviewCard range={range} onRangeChange={setRange} revenue={revenue} query={query} />
      <RFQPipelineCard pipeline={pipeline} query={query} />
    </div>
  );
}
