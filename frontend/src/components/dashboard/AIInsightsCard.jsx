import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { BrainCircuit, ArrowUpRight } from "lucide-react";
import { useVendorInsightsFeed, getInsightsFeed } from "../../services/dashboard/insightsService";
import AIInsightItem from "./AIInsightItem";
import AIInsightEmptyState from "./AIInsightEmptyState";
import AIInsightSkeleton from "./AIInsightSkeleton";
import DashboardErrorState from "./DashboardErrorState";

/* --------------------------------------------------------------------------
   AIInsightsCard — right-rail intelligence feed. Shows the three most recent
   AI-generated insights (icon, title, description, timestamp, priority).
   "View All" deep-links to the dedicated AI Insights page. Everything is
   backend-driven via /api/vendor/insights (React Query); loading skeletons,
   inline error + retry, and an empty state keep the widget always visible.
   -------------------------------------------------------------------------- */

const MAX_INSIGHTS = 5;

export default function AIInsightsCard() {
  const { data, isSuccess, isLoading, isError, refetch } = useVendorInsightsFeed();

  const feed = useMemo(
    () => (isSuccess ? getInsightsFeed(data).slice(0, MAX_INSIGHTS) : []),
    [data, isSuccess],
  );

  const userRole = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.role?.toLowerCase() || "buyer";
    } catch {
      return "buyer";
    }
  })();

  const targetPath = userRole === "vendor" ? "/vendor/analytics" : "/buyer/ai-insights";

  return (
    <section
      className="relative flex w-full flex-1 flex-col overflow-hidden rounded-3xl border border-[#6C63FF]/40 bg-gradient-to-b from-[#3D3C8A] via-[#4B4AA8] to-[#7C70E8] p-5 shadow-[0_22px_52px_-22px_rgba(108,99,255,0.55)] sm:p-6"
      aria-label="AI Insights"
    >
      {/* Evident ombre: light lavender top fading to deep indigo bottom. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-[#C7C2F8] via-[#7A74CF] to-[#2E2C68] opacity-90" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-[#D6D2FF]/60 via-transparent to-[#4330B0]/40" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-3xl bg-gradient-to-b from-[#2E2C68]/70 to-transparent" />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="icon-tile bg-gradient-to-br from-[var(--primary-purple)] to-[var(--accent-cyan)] shadow-[var(--shadow-card)]">
            <BrainCircuit className="h-6 w-6 text-white" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[20px] font-bold tracking-tight text-white">
              AI Insights
            </h2>
            <p className="truncate text-[13px] font-medium text-white/90">
              Business recommendations powered by live data
            </p>
          </div>
        </div>
        <Link
          to={targetPath}
          className="group inline-flex shrink-0 items-center gap-1 rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur transition hover:border-white/70 hover:bg-white/25"
          aria-label="View all AI insights"
        >
          View All
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
        </Link>
      </div>

      <div className="relative mt-3.5 min-h-0 flex-1 space-y-4">
        {isLoading && <AIInsightSkeleton />}

        {isError && (
          <DashboardErrorState
            icon={<BrainCircuit className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load AI insights"
            hint="Your intelligence feed is temporarily unavailable. Retry and it should come right back."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && feed.length > 0 && (
          <div className="space-y-2.5">
            {feed.map((item, i) => (
              <AIInsightItem key={item.id} item={item} index={i} />
            ))}
          </div>
        )}

        {!isLoading && !isError && feed.length === 0 && <AIInsightEmptyState />}
      </div>
    </section>
  );
}
