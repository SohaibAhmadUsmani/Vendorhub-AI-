import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Target, Lightbulb, Wallet, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";

/* --------------------------------------------------------------------------
   AIInsightsKpis — the five-card KPI row on the AI Insights page. Every
   value comes from the backend payload (real counts / revenue / timestamps).
   All five cards share the exact same shell so the row reads as one
   perfectly-aligned strip: same padding, radius, header structure and a
   fixed-height bottom trend area. Sparklines render only where real
   historical series exist (daily insight activity + daily revenue); the
   remaining cards show a static status line instead of a fabricated curve.
   "Insights Updated" ticks live.
   -------------------------------------------------------------------------- */

const CURRENCY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Small rAF count-up so KPI values bounce in smoothly. */
function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(value);

  useEffect(() => {
    const from = ref.current;
    const to = value;
    ref.current = value;
    if (from === to) {
      setDisplay(to);
      return undefined;
    }
    const start = performance.now();
    const duration = 700;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span className="tabular-nums">
      {prefix}
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/** Progressively re-rendered "…ago" label for the last-updated card. */
function RelativeTime({ value }) {
  const [, force] = useState(0);

  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!value) return "just now";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const IMPACT_META = {
  high: { label: "High Impact", color: "#F59E0B", tint: "bg-[#FEF3C7] text-[#B45309]", icon: Target },
  medium: { label: "Need Attention", color: "#0EA5E9", tint: "bg-[#E0F2FE] text-[#0369A1]", icon: Lightbulb },
  low: { label: "On Track", color: "#22C55E", tint: "bg-[#DCFCE7] text-[#15803D]", icon: BrainCircuit },
};

function DeltaBadge({ delta }) {
  if (delta == null) return null;
  const up = delta >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${up ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEE2E2] text-[#B91C1C]"}`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {up ? "+" : ""}
      {delta}%
    </span>
  );
}

/* One shared shell — every KPI card is literally the same card. Only the
   icon tint and the footer (value + fixed-height trend strip) differ. */
function KpiCard({ icon: Icon, label, tint, footer, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="dash-card relative flex min-w-0 flex-col overflow-hidden rounded-3xl p-5"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[var(--primary-purple)]/5 blur-2xl" />
      <div className="relative flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tint}`}>
          <Icon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <p className="min-w-0 text-[12px] font-bold uppercase leading-tight tracking-wider text-[var(--text-muted)]">
          {label}
        </p>
      </div>
      <div className="relative mt-4 flex flex-1 flex-col justify-end">{footer}</div>
    </motion.article>
  );
}

/** Compact inline sparkline sized to the fixed KPI trend strip. */
function TrendSpark({ data = [], accent = "#6C63FF" }) {
  const values = data.map(Number).filter(Number.isFinite);
  if (values.length < 2) {
    return (
      <svg viewBox="0 0 200 22" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
        <line x1="2" y1="17" x2="198" y2="17" stroke={`${accent}45`} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 7" />
      </svg>
    );
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = 200 / (values.length - 1);
  const pts = values.map((v, i) => ({ x: Math.round(i * step), y: 2 + Math.round(18 - ((v - min) / span) * 18) }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M2,22 ${line} ${pts[pts.length - 1].x},22 Z`;
  return (
    <svg viewBox="0 0 200 22" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`ts-${accent.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#ts-${accent.replace("#", "")})`} />
      <polyline points={line} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Fixed-height bottom strip so every card reserves the same trend space. */
function TrendStrip({ children }) {
  return <div className="mt-2.5 flex h-[22px] w-full items-center">{children}</div>;
}

export default function AIInsightsKpis({ page }) {
  const kpis = page?.kpis;
  if (!kpis) return null;
  const hasActivity = Array.isArray(kpis.spark?.activity) && kpis.spark.activity.some((v) => v > 0);
  const hasRevenue = Array.isArray(kpis.spark?.revenue) && kpis.spark.revenue.some((v) => v > 0);

  return (
    <section aria-label="AI Insights summary statistics" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      <KpiCard
        icon={BrainCircuit}
        label="Total Insights"
        tint="bg-[var(--primary-purple-light)] text-[var(--primary-purple)]"
        footer={
          <>
            <p className="font-heading text-[24px] font-bold leading-none text-[var(--text-primary)]">
              <AnimatedNumber value={kpis.totalInsights} />
            </p>
            <TrendStrip>
              {hasActivity ? (
                <TrendSpark data={kpis.spark.activity} accent="#6C63FF" />
              ) : (
                <p className="text-[11px] font-medium text-[var(--text-muted)]">No signals in this range yet</p>
              )}
            </TrendStrip>
          </>
        }
      />

      <KpiCard
        icon={IMPACT_META.high.icon}
        label="High Impact"
        tint={IMPACT_META.high.tint}
        footer={
          <>
            <p className="font-heading text-[24px] font-bold leading-none text-[var(--text-primary)]">
              <AnimatedNumber value={kpis.highImpact} />
            </p>
            <TrendStrip>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                Need your attention
              </span>
            </TrendStrip>
          </>
        }
      />

      <KpiCard
        icon={IMPACT_META.medium.icon}
        label="Opportunities"
        tint="bg-[#E0F2FE] text-[#0369A1]"
        footer={
          <>
            <p className="font-heading text-[24px] font-bold leading-none text-[var(--text-primary)]">
              <AnimatedNumber value={kpis.opportunities} />
            </p>
            <TrendStrip>
              {hasActivity ? (
                <TrendSpark data={kpis.spark.activity} accent="#0EA5E9" />
              ) : (
                <p className="text-[11px] font-medium text-[var(--text-muted)]">Tracked from live signals</p>
              )}
            </TrendStrip>
          </>
        }
      />

      <KpiCard
        icon={Wallet}
        label="Revenue Impact"
        tint="bg-[#DCFCE7] text-[#15803D]"
        footer={
          <>
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate font-heading text-[20px] font-bold leading-none text-[var(--text-primary)]">
                {CURRENCY.format(kpis.revenueImpact)}
              </p>
              <DeltaBadge delta={kpis.revenueDelta} />
            </div>
            <TrendStrip>
              {hasRevenue ? (
                <TrendSpark data={kpis.spark.revenue} accent="#22C55E" />
              ) : (
                <p className="text-[11px] font-medium text-[var(--text-muted)]">No revenue in this range yet</p>
              )}
            </TrendStrip>
          </>
        }
      />

      <KpiCard
        icon={RefreshCw}
        label="Insights Updated"
        tint="bg-[#E0F2FE] text-[#0369A1]"
        delay={0.2}
        footer={
          <>
            <p className="font-heading text-[24px] font-bold leading-none text-[var(--text-primary)]">
              <RelativeTime value={kpis.updatedAt} />
            </p>
            <TrendStrip>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live · refreshes as data arrives
              </span>
            </TrendStrip>
          </>
        }
      />
    </section>
  );
}