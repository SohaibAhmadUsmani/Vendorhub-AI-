import React from "react";
import {
  FileQuestion,
  PackageCheck,
  DollarSign,
  MessageSquarePlus,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";

/* --------------------------------------------------------------------------
   OverviewCardHeader — top row of a KPI card: a premium circular pastel
   icon (tinted with the metric's own accent color), the dynamic metric
   title, and a subtle overflow-menu placeholder reserved for future
   per-card actions. The icon key → Lucide mapping is the only
   presentation concern; everything else is backend-driven.
   -------------------------------------------------------------------------- */

const ICON_MAP = {
  FileQuestion,
  PackageCheck,
  DollarSign,
  MessageSquarePlus,
};

export default function OverviewCardHeader({ metric, accent }) {
  const Icon = ICON_MAP[metric.icon] ?? TrendingUp;

  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
        style={{
          background: `linear-gradient(135deg, ${accent}22 0%, ${accent}0D 100%)`,
          color: accent,
          border: `1px solid ${accent}26`,
          boxShadow: `0 10px 24px -12px ${accent}66`,
        }}
      >
        <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
      </span>

      <p className="min-w-0 flex-1 truncate font-heading text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
        {metric.title}
      </p>

      {/* Overflow menu placeholder (future use) — intentionally inert. */}
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 cursor-default items-center justify-center rounded-full text-[var(--text-light)] opacity-50 transition-opacity duration-200 group-hover:opacity-100"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
      </span>
    </div>
  );
}
