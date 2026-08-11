import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Bot, RotateCcw } from "lucide-react";
import DashboardErrorState from "../components/dashboard/DashboardErrorState";
import { AI_INSIGHTS_RANGES, useVendorAIInsights, getAIInsightsPage } from "../services/dashboard/aiInsightsService";
import AIInsightsSkeleton from "../components/ai/AIInsightsSkeleton";
import AIInsightsKpis from "../components/ai/AIInsightsKpis";
import AISummaryCard from "../components/ai/AISummaryCard";
import InsightsTrendCard from "../components/ai/InsightsTrendCard";
import TopOpportunitiesCard from "../components/ai/TopOpportunitiesCard";
import SmartRecommendationsCard from "../components/ai/SmartRecommendationsCard";
import {
  CategoryPerformanceCard,
  BuyerInterestCard,
  ConfidenceScoreCard,
  RecentInsightsCard,
} from "../components/ai/AIInsightsBreakdown";

/* --------------------------------------------------------------------------
   AIInsightsPage — the dedicated AI Insights view at /buyer/ai-insights.
   One backend payload powers the KPI row, executive summary, insight trend,
   category + buyer-interest breakdown, top opportunities and smart
   recommendations. The clean light header holds the range toggle (7/30/90
   days); range changes refetch through React Query.
   -------------------------------------------------------------------------- */

const RANGE_LABELS = Object.fromEntries(AI_INSIGHTS_RANGES.map((r) => [r.key, r.label]));

const AI_UNAVAILABLE_TEXT = {
  not_configured: "AI insights are temporarily unavailable (the AI service isn't configured). Showing live analytics instead.",
  insufficient_data: "There isn't enough business data yet for AI analysis — showing what we could determine from your account.",
  ai_unavailable: "AI insights are temporarily unavailable — showing the analytics computed live from your data.",
};

export default function AIInsightsPage() {
  const [range, setRange] = useState("30d");
  const [refresh, setRefresh] = useState(0);
  const { data, isSuccess, isLoading, isError, refetch } = useVendorAIInsights(range, { refresh });

  const page = useMemo(() => (isSuccess ? getAIInsightsPage(data) : null), [data, isSuccess]);

  /* Re-selecting the active range regenerates the AI answer (cache bypass);
     switching ranges resets the refresh flag so every range keeps its cache. */
  const selectRange = (key) => {
    if (key === range) setRefresh((n) => n + 1);
    else {
      setRange(key);
      setRefresh(0);
    }
  };

  const unavailableReason = isSuccess && page?.ai && !page.ai.available ? page.ai.reason : null;
  const unavailableText = unavailableReason ? (AI_UNAVAILABLE_TEXT[unavailableReason] ?? AI_UNAVAILABLE_TEXT.ai_unavailable) : null;

  return (
    <div className="relative mx-auto w-full">
      <div className="relative z-10 space-y-4 lg:space-y-5">
        {/* Clean page header — title, subtitle and compact range control. */}
        <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="icon-tile bg-[var(--primary-purple-light)] text-[var(--primary-purple)] ring-1 ring-[var(--primary-purple)]/15">
              <BrainCircuit className="h-6 w-6" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <h1 className="font-heading text-[26px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[28px]">
                AI Insights
              </h1>
              <p className="truncate text-[12px] font-medium text-[var(--text-muted)] sm:text-[13px]">
                {isSuccess && page?.periodLabel
                  ? `${page.periodLabel} · every figure computed live from your data`
                  : "Live intelligence and recommendations for your business"}
              </p>
            </div>
          </div>

          {/* Range toggle 7D / 30D / 90D. */}
          <div
            role="group"
            aria-label="Insights time range"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#E9ECF2] bg-white p-1 shadow-[var(--shadow-sm)]"
          >
            {AI_INSIGHTS_RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => selectRange(r.key)}
                aria-pressed={range === r.key}
                className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all ${
                  range === r.key
                    ? "bg-[var(--primary-purple)] text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:bg-[var(--primary-purple-light)] hover:text-[var(--primary-purple)]"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </header>

        {isLoading && <AIInsightsSkeleton />}

        {/* Non-blocking notice when the AI layer is down but live analytics
            still render — never hides the page. */}
        {isSuccess && page?.kpis && unavailableText && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#F59E0B]/40 bg-[#FEF3C7]/60 px-4 py-3 text-[12px] font-medium text-[#92400E] dark:bg-[#3A2E16]/70 dark:text-[#FCD34D]"
            role="status"
          >
            <span className="inline-flex items-center gap-2">
              <Bot className="h-4 w-4 shrink-0" strokeWidth={2} />
              {unavailableText}
            </span>
            <button
              type="button"
              onClick={() => setRefresh((n) => n + 1)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#F59E0B]/50 px-3 py-1.5 text-[11px] font-bold text-[#92400E] transition hover:bg-[#F59E0B]/15 dark:text-[#FCD34D]"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={2.5} />
              Try again
            </button>
          </motion.div>
        )}

        {isError && (
          <DashboardErrorState
            icon={<BrainCircuit className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load AI Insights"
            hint="Your intelligence feed is temporarily unavailable. Retry and it should come right back."
            onRetry={refetch}
          />
        )}

        {isSuccess && !page?.kpis && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#E9ECF2] bg-[var(--bg-card)] py-16 text-center shadow-[var(--shadow-card)] dark:border-white/15">
            <span className="icon-tile bg-[var(--purple-card-tint)] text-[var(--primary-purple)]">
              <Bot className="h-7 w-7" strokeWidth={2} />
            </span>
            <p className="font-heading text-[18px] font-bold text-[var(--text-primary)]">Insights unavailable</p>
            <p className="max-w-[320px] text-[13px] leading-relaxed text-[var(--text-muted)]">
              We couldn't find an active vendor profile to analyze. Finish setting up your account and check back.
            </p>
          </div>
        )}

        {isSuccess && page?.kpis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 lg:space-y-5"
          >
            <AIInsightsKpis page={page} />

            {/* Executive summary + top opportunities — summary takes the lead, 
                opportunities a slightly narrower share so the mascot has room. */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <AISummaryCard page={page} />
              <TopOpportunitiesCard page={page} />
            </div>

            {/* Activity chart + smart recommendations. */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <InsightsTrendCard page={page} />
              <SmartRecommendationsCard page={page} />
            </div>

            {/* Equal four-column breakdown grid. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <CategoryPerformanceCard page={page} />
              <BuyerInterestCard page={page} />
              <ConfidenceScoreCard page={page} />
              <RecentInsightsCard page={page} />
            </div>

            {/* Range uptime note. */}
            <p className="pt-1 text-center text-[12px] font-medium text-[var(--text-muted)]">
              Viewing {RANGE_LABELS[page.range] ?? page.range} of analytics · auto-refreshes as new data arrives
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}