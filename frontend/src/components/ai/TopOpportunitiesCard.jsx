import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lightbulb, Rocket, ArrowUpRight } from "lucide-react";
import { getRoleRoute } from "../../utils/routeUtils";

/* --------------------------------------------------------------------------
   TopOpportunitiesCard — open RFQs ranked by priority, with a real impact
   level, buyer market, quantity and (when a matching catalog price exists)
   the potential order value. Rows share an identical shell so the icon,
   title, explanation, impact badge and revenue align into clean columns;
   revenue pins to the right edge. All values come from the backend payload.
   -------------------------------------------------------------------------- */

const IMPACT_STYLES = {
  high: { label: "High Impact", chip: "bg-[#FEE2E2] text-[#B91C1C]" },
  medium: { label: "Medium Impact", chip: "bg-[#FEF3C7] text-[#B45309]" },
  low: { label: "Low Impact", chip: "bg-[#DCFCE7] text-[#15803D]" },
};

const ROW_COLS = "sm:grid-cols-[auto_minmax(0,1fr)_104px_minmax(72px,auto)]";

function OpportunityRow({ opp, index }) {
  const meta = IMPACT_STYLES[opp.impact] ?? IMPACT_STYLES.medium;
  const revenue = opp.potentialLabel;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05, duration: 0.35 }}
      className="rounded-2xl border border-[#EEF1F6] bg-[var(--bg-subtle)] px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary-purple)]/40 hover:shadow-[var(--shadow-hover)] dark:border-white/10"
    >
      <div className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 ${ROW_COLS} sm:items-center sm:gap-y-0`}>
        {/* Icon */}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--purple-card-tint)] text-[var(--primary-purple)]">
          <Rocket className="h-4 w-4" strokeWidth={2.2} />
        </span>

        {/* Title + dynamic explanation */}
        <div className="min-w-0">
          <h3 className="truncate text-[13px] font-bold text-[var(--text-primary)]">{opp.name}</h3>
          <p className="truncate text-[12px] leading-[1.5] text-[var(--text-muted)]">
            {opp.description || (opp.country || opp.quantity
              ? [opp.country, opp.quantity > 0 ? `${opp.quantity.toLocaleString("en-US")} units` : null]
                  .filter(Boolean)
                  .join(" · ")
              : "")}
          </p>
        </div>

        {/* Impact badge — fixed column so it lines up across rows. */}
        <span className={`justify-self-start rounded-full px-2 py-0.5 text-center text-[10px] font-bold uppercase tracking-wider ${meta.chip}`}>
          {meta.label}
        </span>

        {/* Revenue — pinned right. */}
        <div className="min-w-0 text-left sm:text-right">
          <p className="truncate text-[12px] font-bold tabular-nums text-[#15803D]">
            {revenue ?? "—"}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Potential</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function TopOpportunitiesCard({ page }) {
  const opportunities = page?.opportunities ?? [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="dash-card flex min-w-0 flex-col rounded-3xl p-5 sm:p-6"
      aria-label="Top opportunities"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="icon-tile shrink-0 bg-[#FEF3C7] text-[#B45309]">
            <Lightbulb className="h-6 w-6" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[17px] font-bold tracking-tight text-[var(--text-primary)]">
              Top Opportunities
            </h2>
            <p className="truncate text-[12px] font-medium text-[var(--text-secondary)]">
              Open buyer inquiries ranked by impact
            </p>
          </div>
        </div>

        {/* Count + View all — aligned top-right. */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[var(--purple-card-tint)] px-3 py-1 text-[11px] font-bold tabular-nums text-[var(--primary-purple)]">
            {opportunities.length}
          </span>
          <Link
            to={getRoleRoute("rfqs")}
            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[var(--primary-purple)] transition-colors hover:text-[var(--primary-purple-hover)]"
            aria-label="View all opportunities"
          >
            View all
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-center gap-2.5">
        {opportunities.map((opp, index) => (
          <OpportunityRow key={opp.id} opp={opp} index={index} />
        ))}

        {opportunities.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E9ECF2] py-10 text-center dark:border-white/15">
            <span className="icon-tile bg-[var(--purple-card-tint)] text-[var(--primary-purple)]">
              <Lightbulb className="h-6 w-6" strokeWidth={2} />
            </span>
            <p className="text-[13px] font-bold text-[var(--text-primary)]">No open opportunities right now</p>
            <p className="max-w-[240px] text-[12px] leading-relaxed text-[var(--text-muted)]">
              New RFQs will appear here as buyers express interest in your catalog.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}