import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Award,
  Bell,
  FilePlus2,
  FileText,
  PackagePlus,
  ShoppingCart,
  Star,
} from "lucide-react";
import {
  useVendorRecentActivity,
  getRecentActivity,
} from "../../services/dashboard/dashboardService";
import { SkeletonRows } from "./DashboardSkeleton";
import DashboardErrorState from "./DashboardErrorState";
import DashboardEmptyState from "./DashboardEmptyState";

/* --------------------------------------------------------------------------
   RecentActivity — timeline of the vendor's latest events (RFQs, quotes,
   orders, catalog additions, reviews, certificates). Fully backend-driven
   via /api/vendor/dashboard/recent-activity; newest events first.
   -------------------------------------------------------------------------- */

const TYPE_CONFIG = {
  rfq: { icon: FileText, tint: "bg-[var(--primary-purple-light)] text-[var(--primary-purple)]" },
  quote: { icon: FilePlus2, tint: "bg-[var(--accent-cyan-light)] text-[#0E7490]" },
  order: { icon: ShoppingCart, tint: "bg-[#DBEAFE] text-[#1D4ED8]" },
  product: { icon: PackagePlus, tint: "bg-[#FEF3C7] text-[#B45309]" },
  review: { icon: Star, tint: "bg-[#FEF3C7] text-[#D97706]" },
  certificate: { icon: Award, tint: "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]" },
  system: { icon: Bell, tint: "bg-[var(--border-card)]/70 text-[var(--text-muted)]" },
};

function timeAgo(value) {
  if (!value) return "now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short" }).format(date);
}

const ActivityItem = React.memo(function ActivityItem({ activity, index, isLast }) {
  const config = TYPE_CONFIG[activity.type] ?? TYPE_CONFIG.system;
  const Icon = config.icon;

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 + index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative flex gap-3 pb-3 last:pb-0"
    >
      <span className="relative mt-0.5 shrink-0">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${config.tint}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        {!isLast && (
          <span
            className="absolute left-1/2 top-8 h-[calc(100%-1.1rem)] w-px -translate-x-1/2 bg-[var(--border-card)]/70"
            aria-hidden="true"
          />
        )}
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="truncate text-[12px] font-semibold leading-tight text-[var(--text-primary)]">
            {activity.title}
          </p>
          <span className="flex shrink-0 items-center gap-1.5">
            {activity.status && (
              <span className="rounded-full bg-[var(--border-card)]/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                {activity.status}
              </span>
            )}
            <span className="text-[10px] font-medium text-[var(--text-muted)]">
              {timeAgo(activity.timestamp)}
            </span>
          </span>
        </div>

        {activity.description && (
          <p className="mt-0.5 truncate text-[11px] leading-4 text-[var(--text-muted)]">
            {activity.description}
          </p>
        )}
      </div>
    </motion.li>
  );
});

export default function RecentActivity() {
  const { data, isSuccess, isLoading, isError, refetch } = useVendorRecentActivity();

  const activities = useMemo(
    () => (isSuccess ? getRecentActivity(data) : []),
    [isSuccess, data],
  );

  return (
    <section className="dash-card flex min-w-0 flex-col p-5 sm:p-6" aria-label="Recent Activity">
      <div className="flex items-center gap-3.5">
        <span className="icon-tile bg-[var(--pastel-purple)] text-[var(--primary-purple)]">
          <Activity className="h-6 w-6" strokeWidth={2} />
        </span>
        <div>
          <h2 className="font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
            Recent Activity
          </h2>
          <p className="text-[13px] font-medium text-[var(--text-muted)]">
            The latest events across your account
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {isLoading && <SkeletonRows rows={6} />}

        {isError && (
          <DashboardErrorState
            icon={<Activity className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load recent activity"
            hint="Your activity timeline is temporarily unavailable. Retry to refresh it."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && activities.length === 0 && (
          <DashboardEmptyState
            icon={<Activity className="h-6 w-6" strokeWidth={1.75} />}
            title="No recent activity"
            hint="New RFQs, orders, reviews and catalog updates will appear here as they happen."
          />
        )}

        {!isLoading && !isError && activities.length > 0 && (
          <ul className="max-h-[300px] flex-1 overflow-auto pr-1">
            {activities.slice(0, 5).map((activity, i) => (
              <ActivityItem key={activity.id} activity={activity} index={i} isLast={i === Math.min(activities.length, 5) - 1} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
