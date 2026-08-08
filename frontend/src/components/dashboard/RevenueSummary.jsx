import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import useCountUp from "./useCountUp";

/* --------------------------------------------------------------------------
   RevenueSummary — headline total for the selected range. Large 44px
   animated count-up with the backend-driven growth badge (green up / red
   down / neutral) placed right below it, per the premium reference. Number
   formatting is a presentation concern; values come from the analytics
   endpoint.
   -------------------------------------------------------------------------- */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function RevenueSummary({ total, changePercent, trendDirection, compareLabel }) {
  const animated = useCountUp(total);
  const isFlat = trendDirection === "flat" || trendDirection === "neutral" || changePercent === 0;
  const isUp = trendDirection === "up";
  const TrendIcon = isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
  const deltaText = changePercent != null ? `${changePercent > 0 ? "+" : ""}${Math.round(changePercent)}%` : null;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-[var(--text-muted)]">Total Revenue</p>
      <p className="mt-1.5 font-heading text-[28px] font-extrabold leading-none tracking-tight text-[var(--text-primary)] tabular-nums sm:text-[32px]">
        {currency.format(animated)}
      </p>

      <div className="mt-2 flex min-h-[22px] items-center gap-2">
        {deltaText ? (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              isFlat
                ? "bg-[var(--border-card)]/50 text-[var(--text-muted)]"
                : isUp
                  ? "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]"
                  : "bg-[#FEE2E2] text-[#B91C1C]"
            }`}
          >
            <TrendIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
            {deltaText}
          </span>
        ) : (
          <span className="text-[11px] font-medium text-[var(--text-muted)]">No change recorded</span>
        )}
        {compareLabel && (
          <span className="truncate text-[11px] font-medium text-[var(--text-muted)]">{compareLabel}</span>
        )}
      </div>
    </div>
  );
}
