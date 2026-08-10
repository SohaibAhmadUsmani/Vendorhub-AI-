import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileQuestion,
  PackageCheck,
  DollarSign,
  MessageSquarePlus,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  RefreshCw,
  Download,
  Maximize2,
} from "lucide-react";
import useCountUp from "./useCountUp";
import MetricSparkline from "./MetricSparkline";
import CardActionMenu from "./CardActionMenu";
import MetricDetailsModal from "./MetricDetailsModal";
import { getMetricDetails as fetchMetricDetails, downloadMetricReport } from "../../services/dashboard/api";
import { normalizeMetricDetails } from "../../services/dashboard/dashboardService";

/* --------------------------------------------------------------------------
   OverviewCard — single KPI card, matched to the premium SaaS reference.
   24px radius white surface with a hairline border + soft shadow (dash-card),
   24px internal padding, equal height across the row (grid stretch + flex).
   Top row: large pastel icon circle (left) + a functional three-dot action
   menu (right) wired to real backend operations:
     - View Details / Expand Card → MetricDetailsModal (fetch-on-open)
     - Refresh Data            → re-fetches this metric and updates the card
     - Download Report         → real-record CSV from the export endpoint
   Below: small title, large bold metric, then a bottom block pinned with
   mt-auto — a dynamic growth badge (backend changePercent) and a full-width
   40px sparkline. The card always draws a graphical line: the backend's real
   7-day series when activity exists, otherwise an accent-colored
   up-and-down placeholder curve so every card keeps its premium look.
   -------------------------------------------------------------------------- */

const ICON_MAP = {
  FileQuestion,
  PackageCheck,
  DollarSign,
  MessageSquarePlus,
};

function GrowthBadge({ changePercent, trendDirection }) {
  const has = changePercent != null;
  const dir = trendDirection ?? (has ? (changePercent > 0 ? "up" : changePercent < 0 ? "down" : "flat") : "flat");
  const Icon = dir === "up" ? TrendingUp : dir === "down" ? TrendingDown : Minus;
  const text = has ? `${changePercent >= 0 ? "+" : ""}${Math.round(changePercent)}%` : "0%";

  const scheme =
    dir === "up"
      ? "bg-[#ECFDF5] text-[#059669]"
      : dir === "down"
        ? "bg-[#FEF2F2] text-[#DC2626]"
        : "bg-[#F1F5F9] text-[var(--text-light)]";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${scheme}`}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {text}
    </span>
  );
}

function OverviewCard({ metric, delay = 0 }) {
  const accent = metric.color ?? "#6C5CE7";
  const Icon = ICON_MAP[metric.icon] ?? TrendingUp;

  /* view = null | "details" | "expand" — the modal fetches only when opened. */
  const [view, setView] = useState(null);
  /* After "Refresh Data", the card displays the freshly fetched metric. */
  const [refreshed, setRefreshed] = useState(null);

  const value = refreshed?.metric?.value ?? metric.value ?? null;
  const hasValue = value != null;
  const animated = useCountUp(hasValue ? value : 0);
  const formatted = hasValue ? `${metric.prefix ?? ""}${animated.toLocaleString("en-US")}` : "—";

  const changePercent = refreshed?.metric?.changePercent ?? metric.changePercent;
  const trendDirection = refreshed?.metric?.trendDirection ?? metric.trendDirection;
  const trendLabel = refreshed?.metric?.compareLabel ?? metric.trendLabel;
  const sparkline = refreshed?.series?.length ? refreshed.series.map((p) => p.value) : metric.sparkline;

  const refresh = async () => {
    const data = await fetchMetricDetails(metric.id);
    setRefreshed(normalizeMetricDetails(data));
  };

  const actions = [
    {
      id: "view",
      label: "View Details",
      icon: <Eye className="h-4 w-4" strokeWidth={2} />,
      onSelect: () => setView("details"),
    },
    {
      id: "refresh",
      label: "Refresh Data",
      icon: <RefreshCw className="h-4 w-4" strokeWidth={2} />,
      onSelect: refresh,
    },
    {
      id: "download",
      label: "Download Report",
      icon: <Download className="h-4 w-4" strokeWidth={2} />,
      onSelect: () => downloadMetricReport(metric.id),
    },
    {
      id: "expand",
      label: "Expand Card",
      icon: <Maximize2 className="h-4 w-4" strokeWidth={2} />,
      onSelect: () => setView("expand"),
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 + delay * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="dash-card dash-card-hover group flex h-full flex-col p-6 !duration-200"
        aria-label={`${metric.title}: ${formatted}`}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className="icon-tile transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            style={{
              background: `linear-gradient(135deg, ${accent}22 0%, ${accent}0D 100%)`,
              color: accent,
              border: `1px solid ${accent}26`,
              boxShadow: `0 10px 24px -12px ${accent}66`,
            }}
          >
            <Icon className="h-6 w-6" strokeWidth={2} />
          </span>

          <CardActionMenu label={`${metric.title} actions`} actions={actions} />
        </div>

        <p className="mt-4 text-[12px] font-semibold text-[var(--text-muted)]">{metric.title}</p>
        <p className="mt-1 font-heading text-[26px] font-extrabold leading-none tracking-tight text-[var(--text-primary)] tabular-nums">
          {formatted}
        </p>

        {/* Bottom block — pinned to the card floor so every card lines up. */}
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-2">
            <GrowthBadge changePercent={changePercent} trendDirection={trendDirection} />
            {trendLabel && (
              <span className="truncate text-[11px] font-medium text-[var(--text-muted)]">{trendLabel}</span>
            )}
          </div>
          <div className="mt-2">
            <MetricSparkline data={sparkline} accent={accent} />
          </div>
        </div>
      </motion.div>

      <MetricDetailsModal
        open={view !== null}
        metricKey={metric.id}
        label={metric.title}
        accent={accent}
        fullscreen={view === "expand"}
        onClose={() => setView(null)}
      />
    </>
  );
}

export default React.memo(OverviewCard);
