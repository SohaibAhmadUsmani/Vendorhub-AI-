import React from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { useVendorMessages, getMessages } from "../../services/dashboard/dashboardService";
import { GlassCard, WidgetHeader } from "./Widget";
import { SkeletonRows } from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";
import DashboardErrorState from "./DashboardErrorState";

/* --------------------------------------------------------------------------
   Recent Messages — customer conversations with avatar, last message, time
   and unread badge. API driven via /api/vendor/messages (React Query).
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

function MessageRow({ message, index }) {
  const initials = message.customer
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05, duration: 0.4, ease: "easeOut" }}
      className={`group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-[var(--primary-purple-light)]/40 ${
        message.unread ? "bg-[var(--primary-purple-light)]/30" : ""
      }`}
    >
      <div className="relative shrink-0">
        {message.avatar ? (
          <img
            src={message.avatar}
            alt={message.customer}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--border-card)]"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-purple)] to-[var(--accent-cyan)] text-xs font-extrabold text-white">
            {initials || "?"}
          </span>
        )}
        {message.unread && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg-card)] bg-[var(--primary-purple)]" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[13px] font-bold text-[var(--text-primary)]">
            {message.customer}
          </p>
          <span className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {timeAgo(message.time)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs font-semibold text-[var(--text-secondary)]">
          {message.subject}
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--text-muted)]">{message.preview}</p>
      </div>
    </motion.div>
  );
}

export default function RecentMessages() {
  const { data, isSuccess, isLoading, isError, refetch } = useVendorMessages();
  const messages = isSuccess ? getMessages(data) : [];
  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <GlassCard className="min-w-0" delay={0}>
      <WidgetHeader
        eyebrow="Inbox"
        title="Recent Messages"
        subtitle={unreadCount ? `${unreadCount} unread conversations.` : "Latest customer conversations."}
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
        {isLoading && <SkeletonRows rows={5} />}

        {isError && (
          <div className="flex flex-1">
            <DashboardErrorState
              title="Inbox unreachable"
              hint="We couldn't load customer conversations right now."
              onRetry={refetch}
            />
          </div>
        )}

        {isSuccess && messages.length === 0 && (
          <div className="flex flex-1">
            <DashboardEmptyState
              icon={<MessageSquare className="h-6 w-6" strokeWidth={1.75} />}
              title="Your inbox is empty."
              hint="Buyer messages and inquiries will appear here."
              onRetry={refetch}
            />
          </div>
        )}

        {isSuccess && messages.length > 0 && (
          <div className="max-h-[400px] flex-1 space-y-0.5 overflow-auto pr-1">
            {messages.map((message, i) => (
              <MessageRow key={message.id} message={message} index={i} />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}