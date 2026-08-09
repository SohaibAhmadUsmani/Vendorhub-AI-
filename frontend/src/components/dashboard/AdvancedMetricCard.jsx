import React, { useState } from "react";
import {
  Package,
  PackageCheck,
  Clock,
  Percent,
  Receipt,
  TrendingUp,
  Users,
  Repeat,
  Eye,
  RefreshCw,
  Download,
  Maximize2,
} from "lucide-react";
import useCountUp from "./useCountUp";
import OverviewCardTrend from "./OverviewCardTrend";
import CardActionMenu from "./CardActionMenu";
import MetricDetailsModal from "./MetricDetailsModal";
import { getMetricDetails as fetchMetricDetails, downloadMetricReport } from "../../services/dashboard/api";
import { normalizeMetricDetails } from "../../services/dashboard/dashboardService";

/* --------------------------------------------------------------------------
   AdvancedMetricCard — one statistic from the advanced analytics payload,
   rendered as a compact, uniform tile. 16px padding, 24px radius white
   surface with a hairline border + soft shadow. Hierarchy: 40px circular
   gradient icon + a functional three-dot action menu, 10px uppercase
   letter-spaced title, 24px animated count-up value and a bottom trend
   footer (badge + comparison label). The action menu drives real backend
   operations:
     - View Details / Expand Card → MetricDetailsModal (fetch-on-open)
     - Refresh Data            → re-fetches this metric and updates the card
     - Download Report         → real-record CSV from the export endpoint
   -------------------------------------------------------------------------- */

const ICON_MAP = {
  Package,
  PackageCheck,
  Clock,
  Percent,
  Receipt,
  TrendingUp,
  Users,
  Repeat,
};

function formatValue(animated, metric) {
  const sign = metric.signed && animated > 0 ? "+" : "";
  return `${metric.prefix}${sign}${animated.toLocaleString("en-US")}${metric.suffix}`;
}

export default React.memo(function AdvancedMetricCard({ metric }) {
  const Icon = ICON_MAP[metric.icon] ?? TrendingUp;
  const accent = metric.color ?? "#6C5CE7";

  /* view = null | "details" | "expand" — the modal fetches only when opened. */
  const [view, setView] = useState(null);
  /* After "Refresh Data", the card displays the freshly fetched metric. */
  const [refreshed, setRefreshed] = useState(null);

  const value = refreshed?.metric?.value ?? metric.value;
  const hasValue = value != null;
  const animated = useCountUp(hasValue ? value : 0);

  const changePercent = refreshed?.metric?.changePercent ?? metric.changePercent;
  const trendDirection = refreshed?.metric?.trendDirection ?? metric.trendDirection;
  const trendLabel = refreshed?.metric?.compareLabel ?? metric.compareLabel;

  const refresh = async () => {
    const data = await fetchMetricDetails(metric.key);
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
      onSelect: () => downloadMetricReport(metric.key),
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
      <div
        className="dash-card dash-card-hover group flex h-full w-full min-h-[150px] flex-col p-5"
        aria-label={`${metric.label}: ${hasValue ? formatValue(metric.value, metric) : "no data yet"}`}
      >
        {/* Top row — circular gradient icon + functional action menu */}
        <div className="flex items-start justify-between gap-2">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            style={{
              background: `linear-gradient(135deg, ${accent}24 0%, ${accent}0D 100%)`,
              color: accent,
              border: `1px solid ${accent}30`,
              boxShadow: `0 10px 24px -12px ${accent}66`,
            }}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>

          <CardActionMenu label={`${metric.label} actions`} actions={actions} />
        </div>

        {/* Uppercase title */}
        <p
          title={metric.label}
          className="mt-3 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]"
        >
          {metric.label}
        </p>

        {/* Metric */}
        <p className="mt-1 font-heading text-[20px] font-extrabold leading-none tracking-tight text-[var(--text-primary)] tabular-nums">
          {hasValue ? formatValue(animated, metric) : "—"}
        </p>

        {/* Bottom trend footer — pinned to the card floor */}
        <div className="mt-auto">
          <OverviewCardTrend
            changePercent={changePercent}
            trendDirection={trendDirection}
            trendLabel={trendLabel}
          />
        </div>
      </div>

      <MetricDetailsModal
        open={view !== null}
        metricKey={metric.key}
        label={metric.label}
        accent={accent}
        fullscreen={view === "expand"}
        onClose={() => setView(null)}
      />
    </>
  );
});
