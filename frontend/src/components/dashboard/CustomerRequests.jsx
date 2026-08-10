import React from "react";
import { motion } from "framer-motion";
import { Mail, Reply, Clock } from "lucide-react";
import {
  CUSTOMER_REQUESTS_PATH,
  useApi,
  normalizeRequests,
} from "../../services/dashboardService";
import { GlassCard, WidgetHeader } from "./Widget";
import { SkeletonRows, EmptyState, ConnectionState } from "./DashboardStates";

/* --------------------------------------------------------------------------
   Section 5 — Customer Requests
   Modern CRM-style feed. API driven; unread badges, avatars, reply actions.
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

function RequestAvatar({ name, avatar, unread }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative shrink-0">
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="h-11 w-11 rounded-full object-cover ring-2 ring-[var(--border-card)]"
        />
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-purple)] to-[var(--accent-cyan)] font-heading text-sm font-extrabold text-white">
          {initials || "?"}
        </span>
      )}
      {unread && (
        <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg-card)] bg-[var(--primary-purple)]" />
      )}
    </div>
  );
}

function RequestRow({ request, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.45, ease: "easeOut" }}
      className={`group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-[var(--primary-purple-light)]/40 ${
        request.unread ? "bg-[var(--primary-purple-light)]/30" : ""
      }`}
    >
      <RequestAvatar name={request.buyerName} avatar={request.buyerAvatar} unread={request.unread} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">
              {request.buyerName}
            </p>
            {request.unread && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-purple)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">
                New
              </span>
            )}
          </div>
          <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {timeAgo(request.time)}
          </span>
        </div>

        <p className="mt-0.5 truncate text-xs font-semibold text-[var(--text-primary)]">
          {request.subject}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[var(--text-secondary)]">
          {request.message}
        </p>

        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] opacity-90 transition-all hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)] hover:text-white group-hover:opacity-100 cursor-pointer"
        >
          <Reply className="h-3 w-3" strokeWidth={2.5} />
          Reply
        </button>
      </div>
    </motion.div>
  );
}

export default function CustomerRequests() {
  const { status, data, refetch } = useApi(CUSTOMER_REQUESTS_PATH);
  const requests = status === "success" ? normalizeRequests(data) : [];
  const unreadCount = requests.filter((r) => r.unread).length;

  return (
    <GlassCard className="min-w-0 h-full" delay={1}>
      <WidgetHeader
        eyebrow="Inbox"
        title="Customer Requests"
        subtitle="Latest messages from buyers."
        actions={
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary-purple-light)]">
            <Mail className="h-4.5 w-4.5 text-[var(--primary-purple)]" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--primary-purple)] px-1 text-[9px] font-extrabold text-white">
                {unreadCount}
              </span>
            )}
          </span>
        }
      />

      <div className="mt-5 flex flex-1 flex-col">
        {status === "loading" && <SkeletonRows rows={5} />}

        {status === "error" && (
          <div className="flex flex-1">
            <ConnectionState
              title="Inbox unreachable"
              hint="We couldn't load customer requests right now."
              onRetry={refetch}
            />
          </div>
        )}

        {status === "success" && requests.length === 0 && (
          <div className="flex flex-1">
            <EmptyState
              title="No customer requests yet."
              hint="Buyer messages and inquiries will appear here."
              onRetry={refetch}
            />
          </div>
        )}

        {status === "success" && requests.length > 0 && (
          <div className="max-h-[440px] flex-1 space-y-0.5 overflow-auto pr-1">
            {requests.map((request, i) => (
              <RequestRow key={request.id} request={request} index={i} />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}