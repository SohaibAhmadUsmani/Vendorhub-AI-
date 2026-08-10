import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileQuestion,
  DollarSign,
  Boxes,
  PackageSearch,
  Globe2,
  Clock,
  MessageSquare,
  TrendingUp,
  Sparkles,
} from "lucide-react";

/* --------------------------------------------------------------------------
   AIInsightItem — a single AI-generated insight card for the right rail.
   Icon (pastel tint per category), title, short description, relative
   timestamp and a Low / Medium / High priority badge. Fully data-driven —
   the backend supplies every field; the UI only maps icon keys + colors.
   -------------------------------------------------------------------------- */

const TYPE_ICONS = {
  rfq: FileQuestion,
  quote: FileQuestion,
  revenue: DollarSign,
  category: Boxes,
  inventory: PackageSearch,
  globe: Globe2,
  clock: Clock,
  message: MessageSquare,
  trend: TrendingUp,
};

const CATEGORY_TINTS = {
  Demand: "bg-[#EDE9FE] text-[#6C63FF]",
  Revenue: "bg-[#DCFCE7] text-[#15803D]",
  Performance: "bg-[#E0F2FE] text-[#0369A1]",
  Inventory: "bg-[#FEF3C7] text-[#B45309]",
  Market: "bg-[#E0F2FE] text-[#0E7490]",
  "Response Time": "bg-[#FEE2E2] text-[#B91C1C]",
  Engagement: "bg-[#FCE7F3] text-[#BE185D]",
};

const PRIORITY_STYLES = {
  high: "bg-[#FEE2E2] text-[#B91C1C]",
  medium: "bg-[#FEF3C7] text-[#B45309]",
  low: "bg-[#DCFCE7] text-[#15803D]",
};

/** Human-friendly relative time ("just now", "3h ago", "2d ago"). */
function timeAgo(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

const InsightItem = React.memo(function InsightItem({ item, index }) {
  const Icon = TYPE_ICONS[item.icon ?? item.type] ?? Sparkles;
  const tint = CATEGORY_TINTS[item.category] ?? "bg-[var(--primary-purple-light)] text-[var(--primary-purple)]";
  const priorityChip = PRIORITY_STYLES[item.priority] ?? PRIORITY_STYLES.medium;
  const time = timeAgo(item.timestamp);
  const navigate = useNavigate();

  const open = () => navigate("/buyer/ai-insights");

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.06, duration: 0.4, ease: "easeOut" }}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      role="button"
      tabIndex={0}
      className="group relative cursor-pointer overflow-hidden rounded-[16px] border border-[var(--primary-purple)]/20 bg-[var(--purple-card-tint)] p-3.5 shadow-[0_10px_24px_-14px_rgba(108,99,255,0.4)] transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary-purple)]/50 hover:shadow-[var(--shadow-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-purple)]"
      aria-label={`${item.title}. Priority ${item.priority}. Open in AI Insights.`}
    >
      {/* Very soft purple tint — decorative, theme-aware, hidden from AT. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[16px] bg-gradient-to-br from-transparent via-transparent to-[var(--primary-purple)]/10" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[var(--primary-purple)]/5 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
      <div className="relative flex items-start gap-2.5">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${tint}`}>
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[12px] font-bold leading-snug text-[var(--text-primary)]">
              {item.title}
            </p>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${priorityChip}`}>
              {item.priority}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-1 text-[12px] leading-[1.45] text-[var(--text-secondary)]">
            {item.description}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[10px] font-medium text-[var(--text-muted)]">
            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${tint}`}>
              {item.category}
            </span>
            {time && (
              <>
                <span className="shrink-0">·</span>
                <span className="shrink-0 tabular-nums">{time}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export default InsightItem;
