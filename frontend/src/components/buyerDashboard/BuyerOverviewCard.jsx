import React from "react";
import { motion } from "framer-motion";
import {
  FileQuestion,
  PackageCheck,
  DollarSign,
  MessageSquarePlus,
  Bookmark,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  RefreshCw,
  Download,
  Maximize2,
} from "lucide-react";
import useCountUp from "../dashboard/useCountUp";

const ICON_MAP = {
  FileQuestion,
  PackageCheck,
  DollarSign,
  MessageSquarePlus,
  Bookmark,
};

function GrowthBadge({ changePercent }) {
  const hasChange = changePercent != null;

  const direction = !hasChange
    ? "flat"
    : changePercent > 0
      ? "up"
      : changePercent < 0
        ? "down"
        : "flat";

  const Icon =
    direction === "up"
      ? TrendingUp
      : direction === "down"
        ? TrendingDown
        : Minus;

  const text = hasChange
    ? `${changePercent >= 0 ? "+" : ""}${Math.round(changePercent)}%`
    : "0%";

  const scheme =
    direction === "up"
      ? "bg-[#ECFDF5] text-[#059669]"
      : direction === "down"
        ? "bg-[#FEF2F2] text-[#DC2626]"
        : "bg-[#F1F5F9] text-[var(--text-light)]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${scheme}`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {text}
    </span>
  );
}

export default function BuyerOverviewCard({
  metric,
  delay = 0,
}) {
  const accent = metric.color ?? "#6C5CE7";
  const Icon = ICON_MAP[metric.icon] ?? FileText;

  const hasValue = metric.value != null;
  const animatedValue = useCountUp(hasValue ? metric.value : 0);

  const formattedValue = hasValue
    ? `${metric.prefix ?? ""}${animatedValue.toLocaleString("en-US")}`
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.06 + delay * 0.07,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="dash-card dash-card-hover group flex h-full flex-col p-5"
    >
      {/* Icon */}
      <div className="flex items-start justify-between">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(135deg, ${accent}22 0%, ${accent}0D 100%)`,
            color: accent,
            border: `1px solid ${accent}26`,
          }}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>

        <span className="text-[var(--text-light)]">•••</span>
      </div>

      {/* Title */}
      <p className="mt-4 text-[12px] font-semibold text-[var(--text-muted)]">
        {metric.title}
      </p>

      {/* Value */}
      <p className="mt-1 font-heading text-[26px] font-extrabold leading-none tracking-tight text-[var(--text-primary)] tabular-nums">
        {formattedValue}
      </p>

      {/* Change */}
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-2">
          <GrowthBadge changePercent={metric.changePercent} />

          {metric.compareLabel && (
            <span className="truncate text-[11px] font-medium text-[var(--text-muted)]">
              {metric.compareLabel}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}