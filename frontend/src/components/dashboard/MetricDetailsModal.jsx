import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { X, TrendingUp, TrendingDown, Minus, BarChart3, Download } from "lucide-react";
import { useMetricDetails, normalizeMetricDetails } from "../../services/dashboard/dashboardService";
import { downloadMetricReport } from "../../services/dashboard/api";
import DashboardErrorState from "./DashboardErrorState";
import DashboardEmptyState from "./DashboardEmptyState";

/* --------------------------------------------------------------------------
   MetricDetailsModal — the action-menu detail surface for any dashboard
   card. It NEVER preloads: the query is `enabled` only while the modal is
   open, so each View Details / Expand action fetches the metric's live
   payload on demand. The body is rendered entirely from the backend
   response — summary chips, an area chart from the real time series (or a
   donut from the breakdown), and a list of real records. A fullscreen
   variant doubles as the Expand Card view.
   -------------------------------------------------------------------------- */

function TrendBadge({ direction, changePercent }) {
  const Icon = direction === "up" ? TrendingUp : direction === "down" ? TrendingDown : Minus;
  const scheme =
    direction === "up"
      ? "bg-[#ECFDF5] text-[#059669]"
      : direction === "down"
        ? "bg-[#FEF2F2] text-[#DC2626]"
        : "bg-[#F1F5F9] text-[var(--text-light)]";
  const text =
    changePercent != null ? `${changePercent >= 0 ? "+" : ""}${Math.round(changePercent)}%` : "—";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${scheme}`}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {text}
    </span>
  );
}

function ChartCard({ detail, chartHeight }) {
  const { series, breakdown } = detail;
  const money = detail.prefix === "$";
  const fmtTick = (v) =>
    money ? `$${Number(v).toLocaleString("en-US")}` : Number(v).toLocaleString("en-US");

  if (series.length >= 2) {
    return (
      <div className="min-h-0 w-full">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`metric-fill-${detail.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={detail.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={detail.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(148,163,184,0.22)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--text-light)" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--text-light)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={fmtTick}
              width={58}
            />
            <Tooltip
              cursor={{ stroke: detail.color, strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: 14,
                border: "1px solid var(--border-card)",
                boxShadow: "0 16px 36px -14px rgba(15,23,42,0.28)",
                fontSize: 12,
                fontWeight: 600,
                background: "var(--bg-card)",
                color: "var(--text-primary)",
              }}
              formatter={(value) => [fmtTick(value), detail.label]}
              labelStyle={{ color: "var(--text-muted)", fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={detail.color}
              strokeWidth={2.25}
              fill={`url(#metric-fill-${detail.key})`}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--bg-card)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (breakdown.length >= 1) {
    const total = breakdown.reduce((sum, b) => sum + b.value, 0);
    return (
      <div className="flex flex-wrap items-center gap-6">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdown}
                dataKey="value"
                nameKey="label"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={3}
                strokeWidth={0}
              >
                {breakdown.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid var(--border-card)",
                  boxShadow: "0 16px 36px -14px rgba(15,23,42,0.28)",
                  fontSize: 12,
                  fontWeight: 600,
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                }}
                formatter={(value, name) => [`${Number(value).toLocaleString("en-US")}`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-light)]">
              Total
            </span>
            <span className="font-heading text-xl font-extrabold text-[var(--text-primary)]">
              {total.toLocaleString("en-US")}
            </span>
          </div>
        </div>
        <ul className="min-w-0 flex-1 space-y-2.5">
          {breakdown.map((b) => {
            const pct = total ? Math.round((b.value / total) * 100) : 0;
            return (
              <li key={b.label} className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: b.color }} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--text-secondary)]">
                  {b.label}
                </span>
                <span className="text-[13px] font-bold tabular-nums text-[var(--text-primary)]">
                  {b.value.toLocaleString("en-US")}
                </span>
                <span className="w-10 text-right text-[12px] font-medium tabular-nums text-[var(--text-light)]">
                  {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-main)] px-4 py-8 text-center">
      <BarChart3 className="mx-auto h-6 w-6 text-[var(--text-light)]" strokeWidth={1.75} />
      <p className="mt-2 text-[13px] font-medium text-[var(--text-muted)]">
        No historical data recorded yet — this section will populate as activity builds up.
      </p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading metric details">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-[var(--border-card)] p-3.5">
            <span className="skeleton-block block h-3 w-20 rounded-full" />
            <span className="skeleton-block mt-2 block h-6 w-16 rounded-lg" />
          </div>
        ))}
      </div>
      <span className="skeleton-block block h-52 w-full rounded-2xl" />
      <div className="space-y-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="skeleton-block h-9 w-9 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <span className="skeleton-block block h-3.5 w-40 rounded-full" />
              <span className="skeleton-block block h-3 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MetricDetailsModal({ open, metricKey, label, accent, fullscreen = false, onClose }) {
  const { data, isSuccess, isLoading, isError, isFetching, refetch } = useMetricDetails(metricKey, {
    enabled: open,
  });

  /* Lock body scroll while the modal is open. */
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /* Close on Escape. */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const detail = isSuccess ? normalizeMetricDetails(data) : null;
  const metricValue =
    detail && detail.metric.value != null
      ? `${detail.prefix}${detail.signed && detail.metric.value > 0 ? "+" : ""}${Number(detail.metric.value).toLocaleString("en-US")}${detail.suffix}`
      : "—";

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${label} details`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,16,33,0.6)] p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] shadow-[0_32px_72px_-20px_rgba(15,23,42,0.45)] ${
              fullscreen ? "max-w-5xl" : "max-w-2xl"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-card)] px-6 py-5">
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${accent}22 0%, ${accent}0D 100%)`,
                    color: accent,
                    border: `1px solid ${accent}30`,
                  }}
                >
                  <BarChart3 className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-[18px] font-extrabold tracking-tight text-[var(--text-primary)]">
                    {label}
                  </h2>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="truncate text-[13px] font-bold tabular-nums text-[var(--text-primary)]">
                      {metricValue}
                    </span>
                    {detail && (
                      <TrendBadge
                        direction={detail.metric.trendDirection}
                        changePercent={detail.metric.changePercent}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {detail && (
                  <button
                    type="button"
                    onClick={() => downloadMetricReport(metricKey)}
                    className="hidden cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold text-[var(--primary-purple)] transition-colors hover:bg-[var(--primary-purple-light)] sm:inline-flex"
                  >
                    <Download className="h-3.5 w-3.5" strokeWidth={2.25} />
                    Export CSV
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Close details"
                  onClick={onClose}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--border-card)]/70 hover:text-[var(--text-primary)]"
                >
                  <X className="h-5 w-5" strokeWidth={2.25} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {isLoading && !detail && <DetailSkeleton />}

              {isError && (
                <DashboardErrorState
                  icon={<BarChart3 className="h-6 w-6" strokeWidth={2} />}
                  title="Couldn't load details"
                  hint={`We couldn't fetch the ${label.toLowerCase()} details. Retry and it should come right back.`}
                  onRetry={refetch}
                />
              )}

              {isSuccess && detail && (
                <div className="space-y-6">
                  {/* Summary chips */}
                  {detail.summary.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {detail.summary.map((s) => (
                        <div
                          key={s.label}
                          className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-main)] p-3.5"
                        >
                          <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                            {s.label}
                          </p>
                          <p className="mt-1.5 truncate font-heading text-[19px] font-extrabold tabular-nums text-[var(--text-primary)]">
                            {s.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chart */}
                  {(detail.series.length >= 2 || detail.breakdown.length >= 1) && (
                    <div className="rounded-2xl border border-[var(--border-card)] p-4">
                      <ChartCard detail={detail} chartHeight={fullscreen ? 320 : 220} />
                    </div>
                  )}

                  {/* Real records list */}
                  {detail.items.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                        Recent records
                      </h3>
                      <ul className="space-y-2.5">
                        {detail.items.map((item, i) => (
                          <li
                            key={`${item.title}-${i}`}
                            className="flex items-center gap-3 rounded-2xl border border-[var(--border-card)] px-4 py-3 transition-colors hover:bg-[var(--bg-main)]"
                          >
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-extrabold"
                              style={{
                                background: `linear-gradient(135deg, ${accent}1F 0%, ${accent}0A 100%)`,
                                color: accent,
                              }}
                            >
                              {String(item.title ?? "?").charAt(0).toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">
                                {item.title}
                              </p>
                              {item.subtitle && (
                                <p className="truncate text-[12px] font-medium text-[var(--text-muted)]">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            <div className="hidden shrink-0 text-right sm:block">
                              {item.meta && (
                                <p className="text-[12px] font-bold tabular-nums text-[var(--text-secondary)]">
                                  {item.meta}
                                </p>
                              )}
                              {item.date && (
                                <p className="text-[11px] font-medium text-[var(--text-light)]">{item.date}</p>
                              )}
                            </div>
                            {item.status && (
                              <span className="shrink-0 rounded-full bg-[var(--primary-purple-light)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--primary-purple)]">
                                {item.status}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {detail.items.length === 0 &&
                    detail.summary.length === 0 &&
                    detail.series.length === 0 &&
                    detail.breakdown.length === 0 && (
                      <DashboardEmptyState
                        icon={<BarChart3 className="h-6 w-6" strokeWidth={1.75} />}
                        title="No details available yet"
                        hint="Once this metric starts generating activity, its details will appear here."
                      />
                    )}
                </div>
              )}

              {isFetching && detail && (
                <div className="flex items-center gap-2 pt-1 text-[12px] font-semibold text-[var(--text-muted)]">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--border-card)] border-t-[var(--primary-purple)]" />
                  Refreshing…
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
