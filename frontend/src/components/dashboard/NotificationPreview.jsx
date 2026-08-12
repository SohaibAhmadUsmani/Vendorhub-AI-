import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bell, FileText, Mail, ShoppingCart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { getRoleRoute } from "../../utils/routeUtils";
import {
  useVendorNotifications,
  getNotifications,
} from "../../services/dashboard/dashboardService";
import { SkeletonRows } from "./DashboardSkeleton";
import DashboardErrorState from "./DashboardErrorState";
import DashboardEmptyState from "./DashboardEmptyState";

/* --------------------------------------------------------------------------
   NotificationPreview — compact notifications widget showing the latest five
   items plus an unread count and a View All link. Types cover RFQ updates,
   order updates, customer messages and AI recommendations (system/AI). All
   content comes from /api/vendor/dashboard/notifications.
   -------------------------------------------------------------------------- */

const TYPE_CONFIG = {
  rfq: { icon: FileText, label: "RFQ", tint: "bg-[var(--primary-purple-light)] text-[var(--primary-purple)]" },
  order: { icon: ShoppingCart, label: "Order", tint: "bg-[var(--accent-cyan-light)] text-[#0E7490]" },
  message: { icon: Mail, label: "Message", tint: "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]" },
  system: { icon: Sparkles, label: "AI", tint: "bg-[#EDE9FE] text-[#7C3AED]" },
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

const NotificationRow = React.memo(function NotificationRow({ notification, index }) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;
  const Icon = config.icon;

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.35, ease: "easeOut" }}
      className="group flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[var(--primary-purple-light)]/40"
    >
      <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${config.tint}`}>
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[12px] font-semibold text-[var(--text-primary)]">
            {notification.title}
          </p>
          <span className="shrink-0 text-[10px] font-medium text-[var(--text-muted)]">
            {timeAgo(notification.time)}
          </span>
        </div>
        {notification.message && (
          <p className="mt-0.5 line-clamp-1 text-xs leading-4 text-[var(--text-muted)]">
            {notification.message}
          </p>
        )}
      </div>

      {notification.unread && (
        <span
          role="img"
          aria-label="Unread"
          title="Unread"
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--primary-purple)]"
        />
      )}
    </motion.li>
  );
});

export default function NotificationPreview() {
  const { data, isSuccess, isLoading, isError, refetch } = useVendorNotifications();

  const notifications = useMemo(
    () => (isSuccess ? getNotifications(data) : []),
    [isSuccess, data],
  );
  const unreadCount = notifications.filter((n) => n.unread).length;
  const preview = notifications.slice(0, 5);

  return (
    <section className="dash-card flex min-w-0 flex-col p-5 sm:p-6" aria-label="Notifications">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="icon-tile bg-[var(--pastel-pink)] text-[#DB2777]">
            <Bell className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
              Notifications
            </h2>
            <p className="text-[13px] font-medium text-[var(--text-muted)]">
              {unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}` : "Latest updates first"}
            </p>
          </div>
        </div>
        <Link
          to={getRoleRoute("notifications")}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:text-[var(--primary-purple)]"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        {isLoading && <SkeletonRows rows={5} />}

        {isError && (
          <DashboardErrorState
            icon={<Bell className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load notifications"
            hint="Your notifications are temporarily unavailable. Retry to refresh them."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && preview.length === 0 && (
          <DashboardEmptyState
            icon={<Bell className="h-6 w-6" strokeWidth={1.75} />}
            title="No notifications"
            hint="RFQ updates, order changes and AI recommendations will show up here."
            compact
          />
        )}

        {!isLoading && !isError && preview.length > 0 && (
          <ul className="max-h-[300px] flex-1 space-y-0.5 overflow-auto pr-1">
            {preview.map((notification, i) => (
              <NotificationRow key={notification.id} notification={notification} index={i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
