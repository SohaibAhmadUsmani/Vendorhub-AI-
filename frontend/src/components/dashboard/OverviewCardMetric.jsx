import React from "react";
import useCountUp from "./useCountUp";

/* --------------------------------------------------------------------------
   OverviewCardMetric — the large, dominant metric value. Animated with a
   requestAnimationFrame count-up when the value changes, formatted with
   thousands separators and an optional currency prefix ("$1,500").
   Null values render an em-dash so the card never collapses.
   -------------------------------------------------------------------------- */

export default function OverviewCardMetric({ value, prefix = "" }) {
  const hasValue = value != null;
  const animated = useCountUp(hasValue ? value : 0);
  const formatted = hasValue ? `${prefix}${animated.toLocaleString("en-US")}` : "—";

  return (
    <p className="mt-5 font-heading text-[30px] font-extrabold leading-none tracking-tight text-[var(--text-primary)] tabular-nums">
      {formatted}
    </p>
  );
}
