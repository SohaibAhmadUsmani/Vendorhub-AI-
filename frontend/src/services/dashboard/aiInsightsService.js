import { useQuery } from "@tanstack/react-query";
import { getAIInsightsSummary } from "./api";

/* --------------------------------------------------------------------------
   aiInsightsService — the dedicated AI Insights page. One backend call
   (/api/vendor/dashboard/ai-insights?range=) powers every section: KPI row,
   executive summary, insight trend, category + buyer-interest breakdown,
   top opportunities and smart recommendations. Nothing is fabricated —
   the backend composes every value from live collections.
   -------------------------------------------------------------------------- */

export const AI_INSIGHTS_RANGES = [
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
];

export function useVendorAIInsights(range = "30d", { refresh = 0 } = {}) {
  return useQuery({
    queryKey: ["vendor", "ai-insights", range, refresh],
    queryFn: () => getAIInsightsSummary(range, { refresh: refresh > 0 }),
  });
}

export function getAIInsightsPage(data) {
  const base = data?.data ?? data ?? {};
  const rawKpis = base.kpis ?? null;
  const rawSummary = base.summary ?? {};
  const rawTrend = base.trend ?? {};
  const rawCounts = rawTrend.counts ?? {};
  const observations = Array.isArray(base.observations) ? base.observations : [];
  const categories = Array.isArray(base.categories) ? base.categories : [];
  const buyerInterest = Array.isArray(base.buyerInterest) ? base.buyerInterest : [];
  const opportunities = Array.isArray(base.opportunities) ? base.opportunities : [];
  const recommendations = Array.isArray(base.recommendations) ? base.recommendations : [];

  return {
    generatedAt: base.generatedAt ?? null,
    range: base.range ?? "30d",
    periodLabel: base.periodLabel ?? null,
    kpis: rawKpis
      ? {
          totalInsights: Number(rawKpis.totalInsights ?? 0),
          highImpact: Number(rawKpis.highImpact ?? 0),
          opportunities: Number(rawKpis.opportunities ?? 0),
          revenueImpact: Number(rawKpis.revenueImpact ?? 0),
          revenueDelta: rawKpis.revenueDelta != null ? Number(rawKpis.revenueDelta) : null,
          updatedAt: rawKpis.updatedAt ?? null,
          spark: {
            activity: Array.isArray(rawKpis.spark?.activity) ? rawKpis.spark.activity.map(Number) : [],
            revenue: Array.isArray(rawKpis.spark?.revenue) ? rawKpis.spark.revenue.map(Number) : [],
          },
        }
      : null,
    summary: {
      text: rawSummary.text ?? null,
      confidence:
        rawSummary.confidence != null ? Math.round(Number(rawSummary.confidence)) : null,
      level: rawSummary.level ?? null,
    },
    observations: observations.map((i) => ({
      id: i._id ?? i.id ?? `${i.icon ?? i.type}-${i.title}`,
      type: i.type ?? i.icon ?? "trend",
      category: i.category ?? "General",
      priority: (i.priority ?? "medium").toLowerCase(),
      title: i.title ?? "Insight",
      description: i.description ?? "",
      icon: i.icon ?? i.type ?? "trend",
      timestamp: i.timestamp ?? null,
    })),
    trend: {
      points: Array.isArray(rawTrend.points)
        ? rawTrend.points.map((p) => ({
            label: p.label ?? "",
            value: Number(p.value ?? 0),
          }))
        : [],
      counts: {
        total: Number(rawCounts.total ?? 0),
        high: Number(rawCounts.high ?? 0),
        medium: Number(rawCounts.medium ?? 0),
        low: Number(rawCounts.low ?? 0),
      },
    },
    categories: categories.map((c) => ({
      name: c.name ?? "Category",
      value: Number(c.value ?? 0),
      percentage: Number(c.percentage ?? 0),
    })),
    buyerInterest: buyerInterest.map((b) => ({
      country: b.country ?? "—",
      count: Number(b.count ?? 0),
      percentage: Number(b.percentage ?? 0),
    })),
    opportunities: opportunities.map((o) => ({
      id: o.id ?? `opportunity-${o.name}-${o.country}`,
      name: o.name ?? "Opportunity",
      country: o.country ?? null,
      quantity: o.quantity != null ? Number(o.quantity) : null,
      priority: (o.priority ?? "medium").toLowerCase(),
      impact: (o.impact ?? "medium").toLowerCase(),
      potentialLabel: o.potentialLabel ?? null,
      ctaLabel: o.ctaLabel ?? "View",
      description: o.description ?? o.explanation ?? "",
    })),
    recommendations: recommendations.map((r) => ({
      id: r._id ?? r.id ?? `recommendation-${r.type}-${r.title}`,
      type: r.type ?? "info",
      title: r.title ?? "Recommendation",
      description: r.description ?? "",
      impact: (r.impact ?? "medium").toLowerCase(),
      ctaLabel: r.ctaLabel ?? "Take action",
    })),
    ai: {
      available: Boolean(base.ai?.available),
      reason: base.ai?.reason ?? null,
      cached: Boolean(base.ai?.cached),
      generatedAt: base.ai?.generatedAt ?? null,
    },
  };
}