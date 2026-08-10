import React from "react";
import { motion } from "framer-motion";
import {
  Lightbulb,
  FileText,
  MessageSquare,
  Package,
  Award,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useVendorRecommendations, getRecommendations } from "../../services/dashboard/recommendationService";
import { GlassCard, WidgetHeader } from "./Widget";
import { SkeletonRows } from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";
import DashboardErrorState from "./DashboardErrorState";

/* --------------------------------------------------------------------------
   AI Recommendations — suggested actions with icon, title, description and
   CTA. API driven via /api/vendor/recommendations (React Query).
   -------------------------------------------------------------------------- */

const TYPE_CONFIG = {
  quote: { icon: FileText, chip: "bg-[var(--primary-purple-light)] text-[var(--primary-purple)]" },
  message: { icon: MessageSquare, chip: "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]" },
  inventory: { icon: Package, chip: "bg-[var(--accent-cyan-light)] text-[#0E7490]" },
  cert: { icon: Award, chip: "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]" },
  warning: { icon: AlertTriangle, chip: "bg-[#FEE2E2] text-[#B91C1C]" },
};

function RecommendationCard({ recommendation, index }) {
  const config = TYPE_CONFIG[recommendation.type] ?? { icon: Lightbulb, chip: "bg-[var(--border-card)]/70 text-[var(--text-muted)]" };
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.45, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary-purple)]/40 hover:shadow-[var(--shadow-hover)]"
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.chip}`}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>

      <h3 className="mt-4 font-heading text-[13px] font-bold leading-snug text-[var(--text-primary)]">
        {recommendation.title}
      </h3>
      <p className="mt-1.5 flex-1 text-xs leading-5 text-[var(--text-secondary)]">
        {recommendation.description}
      </p>

      <button
        type="button"
        className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)] transition-all hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)] hover:text-white cursor-pointer"
      >
        {recommendation.ctaLabel}
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

export default function Recommendations() {
  const { data, isSuccess, isLoading, isError, refetch } = useVendorRecommendations();
  const recommendations = isSuccess ? getRecommendations(data) : [];

  return (
    <GlassCard className="min-w-0" delay={1}>
      <WidgetHeader
        eyebrow="AI Recommendations"
        title="Suggested next actions"
        subtitle="Prioritized actions based on your current activity."
        actions={
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary-purple)] to-[var(--accent-cyan)] shadow-[var(--shadow-card)]">
            <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2} />
          </span>
        }
      />

      <div className="mt-5 flex flex-1 flex-col">
        {isLoading && <SkeletonRows rows={3} />}

        {isError && (
          <div className="flex flex-1">
            <DashboardErrorState
              title="Recommendations unreachable"
              hint="We couldn't load your recommendations right now."
              onRetry={refetch}
            />
          </div>
        )}

        {isSuccess && recommendations.length === 0 && (
          <div className="flex flex-1">
            <DashboardEmptyState
              icon={<Lightbulb className="h-6 w-6" strokeWidth={1.75} />}
              title="No recommendations yet."
              hint="Actionable suggestions will appear once there's enough activity to analyze."
              onRetry={refetch}
            />
          </div>
        )}

        {isSuccess && recommendations.length > 0 && (
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            {recommendations.map((recommendation, i) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} index={i} />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}