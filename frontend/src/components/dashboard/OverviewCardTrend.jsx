import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/* --------------------------------------------------------------------------
   OverviewCardTrend — growth indicator row: a colored badge with an arrow
   (green up / red down / neutral) plus the backend-provided comparison
   label ("vs last month"). When no percentage is available a neutral dash
   badge is shown — the card never drops the row.
   -------------------------------------------------------------------------- */

export default function OverviewCardTrend({ changePercent, trendDirection, trendLabel }) {
  const hasTrend = changePercent != null;
  const isFlat = trendDirection === "flat" || trendDirection === "neutral" || changePercent === 0;
  const isUp = trendDirection === "up";
  const TrendIcon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const deltaText = hasTrend ? `${changePercent > 0 ? "+" : ""}${Math.round(changePercent)}%` : null;

  return (
    <div className="mt-2.5 flex min-h-[22px] items-center gap-2">
      {deltaText ? (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-bold ${
            isFlat
              ? "bg-[var(--border-card)]/50 text-[var(--text-muted)]"
              : isUp
                ? "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]"
                : "bg-[#FEE2E2] text-[#B91C1C]"
          }`}
        >
          <TrendIcon className="h-3 w-3" strokeWidth={2.5} />
          {deltaText}
        </span>
      ) : (
        <span className="rounded-full bg-[var(--border-card)]/50 px-2 py-0.5 text-[12px] font-bold text-[var(--text-muted)]">
          —
        </span>
      )}

      {trendLabel && (
        <span className="truncate text-[12px] font-medium text-[var(--text-muted)]">{trendLabel}</span>
      )}
    </div>
  );
}
