import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

/* --------------------------------------------------------------------------
   OverviewCardSparkline — small animated sparkline for a KPI card.
   Draws the backend's 7-day series as a smooth curved area with a soft
   gradient fill and an on-load drawing animation. When no series exists,
   a subtle dashed placeholder line with a "No recent activity" caption
   keeps the slot visually complete.
   -------------------------------------------------------------------------- */

export default function OverviewCardSparkline({ data = [], accent = "#6C5CE7" }) {
  const points = data.map((value, i) => ({ i, value }));
  const gradientId = `spark-${String(accent).replace("#", "")}`;

  if (points.length === 0) {
    return (
      <div className="mt-5 flex h-12 flex-col items-center justify-end gap-1.5" aria-hidden="true">
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="h-8 w-full">
          <line
            x1="4"
            y1="32"
            x2="196"
            y2="32"
            stroke={`${accent}40`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="1 8"
          />
        </svg>
        <p className="text-[10px] font-medium text-[var(--text-muted)]">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="mt-5 h-12 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={0.28} />
              <stop offset="100%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={accent}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
