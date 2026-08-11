import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Activity } from "lucide-react";

/* --------------------------------------------------------------------------
   InsightsTrendCard — daily insight-signal activity across the selected
   range (real RFQ/order/request/product events per day). The area chart is
   fully data-driven (points + counts come from the backend) and the range
   toggle in the page header drives which buckets render. The segmented
   priority counts sit as a compact legend aligned beside the chart. Empty
   states are honest.
   -------------------------------------------------------------------------- */

const COUNTS_META = [
  { key: "total", label: "Total", color: "#6C63FF" },
  { key: "high", label: "High", color: "#F59E0B" },
  { key: "medium", label: "Medium", color: "#0EA5E9" },
  { key: "low", label: "Low", color: "#22C55E" },
];

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-[#E9ECF2] bg-white px-3 py-2 text-[12px] shadow-lg dark:border-white/10 dark:bg-[#1E1B3A]">
      <p className="font-bold text-[var(--text-primary)]">{point.label}</p>
      <p className="text-[var(--text-secondary)]">
        <span className="font-bold text-[var(--primary-purple)]">{point.value}</span> insight signals
      </p>
    </div>
  );
}

export default function InsightsTrendCard({ page }) {
  const trend = page?.trend ?? { points: [], counts: {} };
  const hasActivity = trend.points.length > 0 && trend.points.some((p) => p.value > 0);

  /* Show a readable axis: first, middle and last bucket labels only. */
  const ticks = useMemo(() => {
    if (trend.points.length <= 6) return trend.points.map((p) => p.label);
    const max = trend.points.length - 1;
    return [0, Math.round(max / 2), max].map((i) => trend.points[i]?.label).filter(Boolean);
  }, [trend.points]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="dash-card flex min-w-0 flex-col rounded-3xl p-5 sm:p-6"
      aria-label="Insights trend"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="icon-tile shrink-0 bg-[var(--primary-purple-light)] text-[var(--primary-purple)]">
            <Activity className="h-6 w-6" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[17px] font-bold tracking-tight text-[var(--text-primary)]">
              Insights Trend
            </h2>
            <p className="truncate text-[12px] font-medium text-[var(--text-secondary)]">
              Buyer + catalog activity across {page?.periodLabel?.toLowerCase() ?? "this period"}
            </p>
          </div>
        </div>
      </div>

      {/* Chart with its segmented legend aligned beside it. */}
      <div className="mt-5 grid flex-1 gap-5 md:grid-cols-[minmax(0,1fr)_118px]">
        <div className="h-56 min-w-0 md:h-64">
          {hasActivity ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend.points} margin={{ top: 8, right: 4, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id="insightsAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border-subtle)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  ticks={ticks}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 600 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={32}
                  tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 600 }}
                />
                <Tooltip cursor={{ stroke: "rgba(108,99,255,0.35)", strokeDasharray: "4 4" }} content={<TrendTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6C63FF"
                  strokeWidth={2.5}
                  fill="url(#insightsAreaFill)"
                  dot={{ r: 2.5, fill: "#6C63FF", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#6C63FF", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full min-h-56 flex-col items-center justify-center gap-2 text-center">
              <span className="icon-tile bg-[var(--purple-card-tint)] text-[var(--primary-purple)]">
                <Activity className="h-6 w-6" strokeWidth={2} />
              </span>
              <p className="text-[13px] font-bold text-[var(--text-primary)]">No insight activity yet</p>
              <p className="max-w-[240px] text-[12px] leading-relaxed text-[var(--text-muted)]">
                New RFQs, orders, requests and listings in this range will chart here automatically.
              </p>
            </div>
          )}
        </div>

        {/* Segmented legend — real counts stacked beside the plot. */}
        <ul className="flex items-center gap-x-4 gap-y-3 md:flex-col md:justify-center md:gap-y-4 md:border-l md:border-[#E9ECF2] md:pl-5 dark:md:border-white/10">
          {COUNTS_META.map((meta) => (
            <li key={meta.key} className="flex min-w-0 items-center justify-between gap-2">
              <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)]">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                <span className="truncate">{meta.label}</span>
              </span>
              <span className="shrink-0 text-[12px] font-bold tabular-nums text-[var(--text-primary)]">
                {trend.counts[meta.key] ?? 0}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}