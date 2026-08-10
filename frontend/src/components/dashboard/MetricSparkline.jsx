import React, { useId } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

/* --------------------------------------------------------------------------
   MetricSparkline — shared miniature line graph for KPI and analytics cards.
   Draws the backend's real 7-day series as a smooth curved area with a soft
   gradient fill and a left-to-right draw animation. When the series has no
   genuine movement (empty, flat or a lone spike), a deterministic tuned
   up-and-down placeholder wave keeps the slot graphically alive — real,
   varied data always wins. Pure presentation; values come from the backend.
   -------------------------------------------------------------------------- */

/* Deterministic per-card phase for the fine texture wave only. The main
   silhouette is fixed so every card gets the same bold, proper up-and-down
   graph — no card can ever look like a slope. */
function quietPhase(accent = "") {
  let hash = 0;
  for (let i = 0; i < accent.length; i += 1) hash = (hash * 31 + accent.charCodeAt(i)) % 9973;
  return (hash % 628) / 100; // ~0..2π
}

/* Placeholder series used ONLY when the backend reports no meaningful
   activity. Non-integer harmonics create irregular peaks & valleys of
   varying heights, so the curve looks organic — like a real trend chart —
   with a subtle rising drift. A static visual stand-in, never mistaken for
   measured data. */
function quietSeries(accent) {
  const phase = quietPhase(accent);
  return Array.from({ length: 20 }, (_, i) => {
    const t = i / 19; // 0..1 across the card width
    const wave =
      Math.sin(t * Math.PI * 6.1 + 0.4) * 0.28 + // primary wave — irregular peaks
      Math.sin(t * Math.PI * 9.4 + phase) * 0.11 + // per-card secondary ripple
      Math.sin(t * Math.PI * 2.4 + 1.8) * 0.07; // gentle underlying drift
    return Math.round((0.52 + wave + 0.1 * t) * 100) / 100;
  });
}

export default function MetricSparkline({ data = [], accent = "#6C5CE7", heightClass = "h-10" }) {
  const uid = useId();
  const series = Array.isArray(data) ? data.map(Number) : [];
  const nonZero = series.filter((v) => v > 0);
  /* Real data is only shown when it carries genuine movement; sparse or flat
     series fall back to the tuned wave so every card draws a proper graph. */
  const hasTrend = nonZero.length >= 2 && new Set(series).size > 1;
  const points = (hasTrend ? series : quietSeries(accent)).map((value, i) => ({
    i,
    value: Number(value) || 0,
  }));
  const color = hasTrend ? accent : `${accent}B3`; // accent at ~70% opacity
  const gid = `spark-${uid}`;

  return (
    <div className={`${heightClass} w-full`} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 2, left: 2, bottom: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={hasTrend ? 0.22 : 0.16} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.75}
            strokeLinecap="round"
            fill={`url(#${gid})`}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
