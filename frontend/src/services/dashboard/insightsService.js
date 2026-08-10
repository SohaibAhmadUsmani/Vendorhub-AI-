import { useQuery } from "@tanstack/react-query";
import { getData } from "../httpClient";
import { getAIInsights } from "./api";

/* --------------------------------------------------------------------------
   insightsService — AI-generated business insights. The dashboard feed
   combines the AI insights endpoint with the existing recommendations
   endpoint so the panel can show up to three items even when only a few
   insights have been generated (no fake data — both come from live APIs).
   -------------------------------------------------------------------------- */

const INSIGHTS_PATH = "/api/vendor/insights";

/* Recommendation types → category labels. Mirrors the backend's own
   INSIGHT_CATEGORY mapping so merged cards render a proper badge instead of
   a generic fallback. Pure presentation — no data is fabricated. */
const RECOMMENDATION_CATEGORY = {
  quote: "Demand",
  message: "Engagement",
  inventory: "Inventory",
  cert: "Performance",
  warning: "Performance",
  shipment: "Operations",
  quotation: "Demand",
};

export function useVendorInsights() {
  return useQuery({
    queryKey: ["vendor", "insights"],
    queryFn: () => getData(INSIGHTS_PATH),
  });
}

/** Combined AI insights + recommendations feed for the dashboard rail. */
export function useVendorInsightsFeed() {
  return useQuery({
    queryKey: ["vendor", "insights-feed"],
    queryFn: getAIInsights,
  });
}

/**
 * Normalizes the insights payload. Backend contract per insight:
 * { id, title, description, category, priority, icon, timestamp }.
 * `severity` is kept for backwards compatibility with older payloads.
 */
export function getInsights(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map((i) => ({
    id: i._id ?? i.id ?? `${i.type}-${i.title}`,
    type: i.type ?? i.icon ?? "trend",
    severity: i.severity ?? "info",
    category: i.category ?? "General",
    priority: (i.priority ?? "medium").toLowerCase(),
    title: i.title ?? "Insight",
    description: i.description ?? i.message ?? "",
    icon: i.icon ?? i.type ?? "trend",
    timestamp: i.timestamp ?? null,
  }));
}

/** Normalizes { insights, recommendations } into one merged feed. */
export function getInsightsFeed(data) {
  const base = data?.data ?? data ?? {};
  const insights = Array.isArray(base.insights) ? base.insights : [];
  const recommendations = Array.isArray(base.recommendations) ? base.recommendations : [];
  return [
    ...getInsights(insights),
    ...recommendations.map((r) => ({
      id: r._id ?? r.id ?? `rec-${r.type}-${r.title}`,
      type: r.type ?? "trend",
      severity: r.severity ?? "info",
      category: RECOMMENDATION_CATEGORY[r.type] ?? r.category ?? "General",
      priority: (r.priority ?? "medium").toLowerCase(),
      title: r.title ?? "Recommendation",
      description: r.description ?? r.message ?? "",
      icon: r.icon ?? r.type ?? "trend",
      timestamp: r.timestamp ?? null,
    })),
  ];
}
