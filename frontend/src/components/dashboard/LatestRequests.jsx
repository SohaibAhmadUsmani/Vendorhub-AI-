import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoleRoute } from "../../utils/routeUtils";
import { useVendorCustomerRequests, getCustomerRequests } from "../../services/dashboard/dashboardService";
import { SkeletonRows } from "./DashboardSkeleton";
import DashboardErrorState from "./DashboardErrorState";
import DashboardEmptyState from "./DashboardEmptyState";

/* --------------------------------------------------------------------------
   LatestRequests — customer request inbox: avatar, company, message preview,
   relative time and unread dot. Driven by
   /api/vendor/dashboard/customer-requests (React Query). Skeletons while
   loading; inline error + retry on failure; empty state with CTA.
   -------------------------------------------------------------------------- */

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

const RequestRow = React.memo(function RequestRow({ request, index }) {
  const initials = (request.buyerName || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.05, duration: 0.4, ease: "easeOut" }}
      className={`group flex cursor-pointer items-start gap-3 rounded-2xl p-3 transition-colors duration-200 hover:bg-[var(--primary-purple-light)]/45 ${
        request.unread ? "bg-[var(--primary-purple-light)]/25" : ""
      }`}
    >
      <div className="relative shrink-0">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-purple)] to-[var(--accent-cyan)] text-xs font-extrabold text-white">
          {initials || "?"}
        </span>
        {request.unread && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg-card)] bg-[var(--primary-purple)]" aria-label="Unread" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate text-[13px] ${request.unread ? "font-bold" : "font-semibold"} text-[var(--text-primary)]`}>
            {request.buyerName}
          </p>
          <span className="shrink-0 text-[10px] font-medium text-[var(--text-muted)]">
            {timeAgo(request.time)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">{request.subject}</p>
      </div>
    </motion.div>
  );
});

export default function LatestRequests() {
  const navigate = useNavigate();
  const { data, isSuccess, isLoading, isError, refetch } = useVendorCustomerRequests();
  const requests = useMemo(
    () => (isSuccess ? getCustomerRequests(data) : []),
    [isSuccess, data],
  );
  const unreadCount = requests.filter((r) => r.unread).length;

  return (
    <section className="dash-card flex min-w-0 flex-col p-5 sm:p-6" aria-label="Latest Customer Requests">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="icon-tile bg-[var(--pastel-amber)] text-[#B45309]">
            <Mail className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
              Latest Customer Requests
            </h2>
            <p className="text-[13px] font-medium text-[var(--text-muted)]">
              {unreadCount ? `${unreadCount} unread` : "Your latest conversations"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(getRoleRoute("messages"))}
          aria-label="Open inbox"
          className="flex h-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:text-[var(--primary-purple)]"
        >
          Inbox
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-3 min-h-[240px] flex-1">
        {isLoading && <SkeletonRows rows={5} />}

        {isError && (
          <DashboardErrorState
            icon={<Mail className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load customer requests"
            hint="Your inbox feed is temporarily unavailable. Retry and it should come right back."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && requests.length === 0 && (
          <DashboardEmptyState
            icon={<Mail className="h-6 w-6" strokeWidth={2} />}
            title="No customer requests yet"
            hint="Buyer messages and inquiries will appear here."
            action={{ label: "Open inbox", to: getRoleRoute("messages") }}
            compact
          />
        )}

        {!isLoading && !isError && requests.length > 0 && (
          <div className="max-h-[320px] flex-1 space-y-0.5 overflow-y-auto pr-1">
            {requests.map((request, i) => (
              <RequestRow key={request.id} request={request} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}