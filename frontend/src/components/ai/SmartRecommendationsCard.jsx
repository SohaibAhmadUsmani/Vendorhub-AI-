import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileQuestion, MessageSquare, PackageSearch, Award, AlertTriangle } from "lucide-react";

/* --------------------------------------------------------------------------
   SmartRecommendationsCard — prioritized next actions from the live
   recommendations endpoint. Every row renders in the same shell: icon,
   title + description, impact badge and CTA button all lock into the same
   columns so heights stay identical and the buttons sit flush on the right
   edge. Nothing is fabricated.
   -------------------------------------------------------------------------- */

const TYPE_ICONS = {
  quote: FileQuestion,
  message: MessageSquare,
  inventory: PackageSearch,
  cert: Award,
  warning: AlertTriangle,
};

const IMPACT_STYLES = {
  high: { label: "High", chip: "bg-[#FEE2E2] text-[#B91C1C]" },
  medium: { label: "Medium", chip: "bg-[#FEF3C7] text-[#B45309]" },
  low: { label: "Low", chip: "bg-[#DCFCE7] text-[#15803D]" },
};

const ROW_COLS = "sm:grid-cols-[auto_minmax(0,1fr)_60px_96px]";

export default function SmartRecommendationsCard({ page }) {
  const recommendations = page?.recommendations ?? [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="dash-card flex min-w-0 flex-col rounded-3xl p-5 sm:p-6"
      aria-label="Smart recommendations"
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <span className="icon-tile shrink-0 bg-[#E0F2FE] text-[#0369A1]">
          <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <h2 className="truncate font-heading text-[17px] font-bold tracking-tight text-[var(--text-primary)]">
            Smart Recommendations
          </h2>
          <p className="truncate text-[12px] font-medium text-[var(--text-secondary)]">
            Prioritized next actions for your business
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-center gap-2.5">
        {recommendations.map((rec, index) => {
          const Icon = TYPE_ICONS[rec.type] ?? CheckCircle2;
          const meta = IMPACT_STYLES[rec.impact] ?? IMPACT_STYLES.medium;
          return (
            <motion.article
              key={rec.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.05, duration: 0.35 }}
              className="group rounded-2xl border border-[#E9ECF2] bg-[var(--bg-subtle)] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary-purple)]/40 hover:shadow-[var(--shadow-hover)] dark:border-white/10"
            >
              <div className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 ${ROW_COLS} sm:items-center sm:gap-y-0`}>
                {/* Icon */}
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--purple-card-tint)] text-[var(--primary-purple)]">
                  <Icon className="h-4 w-4" strokeWidth={2.2} />
                </span>

                {/* Title + description */}
                <div className="min-w-0">
                  <h3 className="truncate text-[13px] font-bold text-[var(--text-primary)]">{rec.title}</h3>
                  <p className="mt-0.5 truncate text-[12px] leading-[1.4] text-[var(--text-secondary)]">
                    {rec.description}
                  </p>
                </div>

                {/* Impact badge — fixed column. */}
                <span className={`justify-self-start rounded-full px-2 py-0.5 text-center text-[9px] font-bold uppercase tracking-wider ${meta.chip}`}>
                  {meta.label}
                </span>

                {/* CTA — pinned to the right edge, identical width per row. */}
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center justify-end gap-1 text-[11px] font-bold text-[var(--primary-purple)] transition-colors hover:text-[var(--primary-purple-hover)]"
                  aria-label={`Take action: ${rec.title}`}
                >
                  {rec.ctaLabel}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
              </div>
            </motion.article>
          );
        })}

        {recommendations.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E9ECF2] py-10 text-center dark:border-white/15">
            <span className="icon-tile bg-[var(--purple-card-tint)] text-[var(--primary-purple)]">
              <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
            </span>
            <p className="text-[13px] font-bold text-[var(--text-primary)]">All clear</p>
            <p className="max-w-[240px] text-[12px] leading-relaxed text-[var(--text-muted)]">
              Nothing needs attention right now — we'll surface actions as new signals arrive.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}