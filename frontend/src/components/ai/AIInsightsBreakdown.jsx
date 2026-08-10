import React from "react";
import { motion } from "framer-motion";
import { Layers, Globe2, Gauge, BrainCircuit } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/* --------------------------------------------------------------------------
   AIInsightsBreakdown — the four compact bottom cards on the AI Insights
   page: Category Performance, Buyer Interest Heatmap, AI Confidence Score
   and Recent AI Insights. They share one shell (identical header, padding,
   radius) so the row reads as a perfectly equal four-column grid while
   every value comes from the real backend payload.
   -------------------------------------------------------------------------- */

const CATEGORY_COLORS = ["#6C63FF", "#0EA5E9", "#22C55E", "#F59E0B"];

const PRIORITY_DOT = {
  high: "bg-[#EF4444]",
  medium: "bg-[#F59E0B]",
  low: "bg-[#22C55E]",
};

const LEVEL_META = {
  high: { color: "#22C55E", chip: "bg-[#DCFCE7] text-[#15803D]", label: "High confidence" },
  medium: { color: "#F59E0B", chip: "bg-[#FEF3C7] text-[#B45309]", label: "Medium confidence" },
  low: { color: "#EF4444", chip: "bg-[#FEE2E2] text-[#B91C1C]", label: "Low confidence" },
};

function timeAgo(value) {
  if (!value) return null;
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/* Shared shell — every bottom card is literally the same card. */
function CompactCard({ icon: Icon, tint, title, badge, delay = 0, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="dash-card relative flex min-w-0 flex-col overflow-hidden rounded-3xl p-4"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[var(--primary-purple)]/5 blur-xl" />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tint}`}>
            <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </span>
          <h3 className="truncate text-[15px] font-bold tracking-tight text-[var(--text-primary)]">{title}</h3>
        </div>
        {badge}
      </div>
      <div className="relative mt-4 flex min-h-0 flex-1">{children}</div>
    </motion.section>
  );
}

function EmptyNote({ text }) {
  return <p className="self-start text-[12px] leading-relaxed text-[var(--text-muted)]">{text}</p>;
}

export function CategoryPerformanceCard({ page }) {
  const categories = page?.categories ?? [];
  const data = categories.map((c, index) => ({
    name: c.name ?? "Category",
    value: Number(c.value) > 0 ? Number(c.value) : Number(c.percentage) || 0,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    percentage: Number(c.percentage) || 0,
  }));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <CompactCard
      icon={Layers}
      tint="bg-[var(--primary-purple-light)] text-[var(--primary-purple)]"
      title="Category Performance"
      badge={<span className="shrink-0 text-[11px] font-bold tabular-nums text-[var(--text-muted)]">{categories.length}</span>}
    >
      {data.length ? (
        <div className="flex w-full items-center gap-4">
          <div className="relative h-[104px] w-[104px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={34} outerRadius={48} paddingAngle={2} strokeWidth={0}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-[18px] font-bold leading-none tabular-nums text-[var(--text-primary)]">
                {total > 0 ? total : categories.length}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {total > 0 ? "signals" : "categories"}
              </span>
            </div>
          </div>
          <ul className="min-w-0 flex-1 space-y-2">
            {data.map((d) => (
              <li key={d.name} className="flex min-w-0 items-center justify-between gap-2">
                <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-[var(--text-muted)]">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="truncate">{d.name}</span>
                </span>
                <span className="shrink-0 text-[11px] font-bold tabular-nums text-[var(--text-primary)]">
                  {d.percentage}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyNote text="No category activity in this range yet." />
      )}
    </CompactCard>
  );
}

export function BuyerInterestCard({ page }) {
  const buyerInterest = page?.buyerInterest ?? [];
  const max = Math.max(1, ...buyerInterest.map((b) => b.count));

  return (
    <CompactCard
      icon={Globe2}
      tint="bg-[#E0F2FE] text-[#0369A1]"
      title="Buyer Interest"
      badge={<span className="shrink-0 text-[11px] font-bold tabular-nums text-[var(--text-muted)]">{buyerInterest.length}</span>}
    >
      {buyerInterest.length ? (
        <ul className="grid w-full grid-cols-2 gap-2 content-start">
          {buyerInterest.map((b, index) => {
            const intensity = 0.25 + (b.count / max) * 0.55;
            return (
              <li
                key={b.country}
                className="flex min-w-0 items-center gap-2 rounded-xl border border-[#EEF1F6] bg-[var(--bg-subtle)] p-2 dark:border-white/10"
              >
                <span
                  className="flex h-7 w-8 shrink-0 items-center justify-center rounded-md text-[9px] font-black text-white"
                  style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length], opacity: intensity }}
                  title={`${b.count} RFQs from ${b.country}`}
                >
                  {b.country.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-bold text-[var(--text-secondary)]">{b.country}</p>
                  <p className="text-[11px] tabular-nums text-[var(--text-muted)]">{b.count} RFQ{b.count === 1 ? "" : "s"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyNote text="No buyer RFQs with locations in this range yet." />
      )}
    </CompactCard>
  );
}

export function ConfidenceScoreCard({ page }) {
  const summary = page?.summary ?? {};
  const kpis = page?.kpis ?? {};
  const categories = page?.categories ?? [];
  const buyerInterest = page?.buyerInterest ?? [];
  const level = summary.level?.toLowerCase() ?? "low";
  const meta = LEVEL_META[level] ?? LEVEL_META.low;
  const confidence = Math.min(100, Math.max(0, Number(summary.confidence) || 0));

  /* Supporting note is assembled purely from real data coverage. */
  const basis = [
    Number(kpis.totalInsights) > 0 ? `${kpis.totalInsights} signal${kpis.totalInsights === 1 ? "" : "s"}` : null,
    categories.length ? `${categories.length} categor${categories.length === 1 ? "y" : "ies"}` : null,
    buyerInterest.length ? `${buyerInterest.length} market${buyerInterest.length === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(", ");
  const caption = basis
    ? `Computed from ${basis} of live business data in ${page?.periodLabel ?? "this period"}.`
    : `No measurable signals yet in ${page?.periodLabel ?? "this period"} — confidence rises as activity grows.`;

  const r = 42;
  const c = 2 * Math.PI * r;
  const filled = (confidence / 100) * c;

  return (
    <CompactCard
      icon={Gauge}
      tint="bg-[#FEF3C7] text-[#B45309]"
      title="AI Confidence"
      badge={<span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${meta.chip}`}>{meta.label}</span>}
    >
      <div className="flex w-full items-center gap-4">
        <div className="relative h-[92px] w-[92px] shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={meta.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${c}`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-[22px] font-bold leading-none tabular-nums text-[var(--text-primary)]">
              {confidence}
              <span className="text-[12px] text-[var(--text-muted)]">%</span>
            </span>
          </div>
        </div>
        <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-[var(--text-muted)]">{caption}</p>
      </div>
    </CompactCard>
  );
}

export function RecentInsightsCard({ page }) {
  const observations = page?.observations ?? [];
  const sorted = [...observations].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  return (
    <CompactCard
      icon={BrainCircuit}
      tint="bg-[var(--purple-card-tint)] text-[var(--primary-purple)]"
      title="Recent AI Insights"
      badge={<span className="shrink-0 text-[11px] font-bold tabular-nums text-[var(--text-muted)]">{observations.length}</span>}
    >
      {sorted.length ? (
        <ul className="w-full space-y-2">
          {sorted.slice(0, 4).map((item) => (
            <li key={item.id} className="flex min-w-0 items-start gap-2.5">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[item.priority] ?? PRIORITY_DOT.medium}`} aria-label={`Priority: ${item.priority}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold leading-snug text-[var(--text-primary)]">{item.title}</p>
                <p className="truncate text-[11px] font-medium text-[var(--text-muted)]">{item.description}</p>
              </div>
              <span className="mt-0.5 shrink-0 text-[10px] font-semibold tabular-nums text-[var(--text-muted)]">
                {timeAgo(item.timestamp) ?? ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyNote text="No insights generated for this range yet." />
      )}
    </CompactCard>
  );
}