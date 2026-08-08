import { useQuery } from "@tanstack/react-query";
import { getRevenueAnalytics } from "./api";

/* --------------------------------------------------------------------------
   analyticsService — revenue overview + RFQ pipeline data, consumed by the
   AnalyticsSection (Revenue Overview + RFQ Pipeline cards). The fetch is
   delegated to the Dashboard Service API (services/dashboard/api.js); this
   module only adds the React Query hook (range-aware, so changing the
   period triggers a fresh backend request) and the pure data selectors.
   All business statistics (totals, growth, percentages) come from the
   backend — the selectors only normalize the shape for the UI.
   -------------------------------------------------------------------------- */

export function useVendorAnalytics(range) {
  return useQuery({
    queryKey: ["vendor", "analytics", range ?? "7d"],
    queryFn: () => getRevenueAnalytics(range),
  });
}

/** Normalized revenue overview: { total, changePercent, trendDirection,
    compareLabel, timeline }. Returns null when the payload shape is missing. */
export function getRevenueOverview(data) {
  const revenue = data?.revenue ?? null;
  if (!revenue) return null;
  return {
    total: Number(revenue.total ?? 0),
    changePercent: revenue.changePercent != null ? Number(revenue.changePercent) : null,
    trendDirection: revenue.trendDirection ?? "neutral",
    compareLabel: revenue.compareLabel ?? null,
    timeline: Array.isArray(revenue.timeline)
      ? revenue.timeline.map((point) => ({
          date: point.date ?? point.label ?? "",
          label: point.label ?? point.date ?? "",
          amount: Number(point.amount ?? 0),
          changePercent: point.changePercent != null ? Number(point.changePercent) : null,
        }))
      : [],
  };
}

/** Normalized RFQ pipeline: { total, stages: [{ key, name, value,
    percentage, color }] }. Returns null when the payload shape is missing. */
export function getPipeline(data) {
  const pipeline = data?.pipeline ?? null;
  if (!pipeline) return null;
  return {
    total: Number(pipeline.total ?? 0),
    stages: Array.isArray(pipeline.stages)
      ? pipeline.stages.map((stage) => ({
          key: stage.key ?? stage.name ?? "stage",
          name: stage.name ?? stage.key ?? "Stage",
          value: Number(stage.value ?? 0),
          percentage: Number(stage.percentage ?? 0),
          color: stage.color ?? "#6C5CE7",
        }))
      : [],
  };
}
