import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import RevenueTooltip from "./RevenueTooltip";

/* --------------------------------------------------------------------------
   RevenueChart — pure presentational area chart for the Revenue Overview
   card. The chart, grid and axes ALWAYS render. When the backend has no
   trend the series falls back to a flat baseline (still on axes + grid) and
   a subtle "No revenue data yet" note is shown inside the chart — the chart
   never disappears. All data is passed in; no fetching or business logic.
   -------------------------------------------------------------------------- */

const AXIS_TICK = { fontSize: 11, fill: "var(--text-muted)" };
const FALLBACK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatCurrency(value) {
  const amount = Number(value) || 0;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}k`;
  return `$${amount.toFixed(0)}`;
}

export default function RevenueChart({ data }) {
  const raw = Array.isArray(data) ? data : [];
  const hasTrend = raw.some((p) => Number(p.amount) > 0);

  // Flat baseline keeps axes/grid/area alive on an empty period.
  const series = hasTrend
    ? raw
    : raw.length
      ? raw.map((p) => ({ ...p, amount: 0 }))
      : FALLBACK_LABELS.map((label) => ({ label, amount: 0 }));

  return (
    <div className="relative mt-4 min-h-[170px] w-full flex-1 sm:min-h-[190px]" role="img" aria-label="Revenue over the selected period">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="analyticsRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.34} />
              <stop offset="55%" stopColor="#6C63FF" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#6C63FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border-card)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} width={56} tickFormatter={formatCurrency} />
          <Tooltip
            cursor={{ stroke: "#6C63FF", strokeWidth: 1.5, strokeDasharray: "4 4" }}
            content={<RevenueTooltip />}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#6C63FF"
            strokeWidth={3}
            strokeDasharray={hasTrend ? undefined : "5 5"}
            fill="url(#analyticsRevenueFill)"
            animationDuration={900}
            animationEasing="ease-out"
            activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--bg-card)", fill: "#6C63FF" }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {!hasTrend && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 px-4 text-center">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">No revenue data yet</p>
          <p className="max-w-[16rem] text-[11px] leading-4 text-[var(--text-light)]">
            Sales activity will appear here once orders start flowing.
          </p>
        </div>
      )}
    </div>
  );
}