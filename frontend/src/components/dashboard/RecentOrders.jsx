import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, PackageCheck } from "lucide-react";
import { useVendorOrders, getRecentOrders } from "../../services/dashboard/dashboardService";
import { GlassCard, WidgetHeader } from "./Widget";
import { SkeletonRows } from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";
import DashboardErrorState from "./DashboardErrorState";

/* --------------------------------------------------------------------------
   Recent Orders — status badge, date, buyer, amount and action.
   API driven via /api/vendor/orders (React Query). Nothing hardcoded.
   -------------------------------------------------------------------------- */

const STATUS_STYLES = {
  delivered: "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]",
  shipped: "bg-[var(--accent-cyan-light)] text-[#0E7490]",
  in_progress: "bg-[var(--status-review-bg)] text-[var(--status-review-text)]",
  pending: "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]",
  cancelled: "bg-[#FEE2E2] text-[#B91C1C]",
};

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ") : "—";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function formatAmount(value) {
  const amount = Number(value) || 0;
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function OrderRow({ order, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group flex items-center gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-[var(--primary-purple-light)]/40"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-main)]">
        <PackageCheck className="h-4.5 w-4.5 text-[var(--primary-purple)]" strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{order.items}</p>
        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
          {order.buyerName} · {formatDate(order.date)}
        </p>
      </div>

      <span
        className={`hidden rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider sm:inline-flex ${
          STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
        }`}
      >
        {capitalize(order.status)}
      </span>

      <span className="shrink-0 font-heading text-sm font-extrabold text-[var(--text-primary)]">
        {formatAmount(order.amount)}
      </span>

      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-all hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)] hover:text-white cursor-pointer"
        aria-label={`View order ${order.id}`}
      >
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

export default function RecentOrders() {
  const { data, isSuccess, isLoading, isError, refetch } = useVendorOrders();
  const orders = isSuccess ? getRecentOrders(data) : [];

  return (
    <GlassCard className="min-w-0" delay={1}>
      <WidgetHeader
        eyebrow="Fulfilment"
        title="Recent Orders"
        subtitle={orders.length ? "Your latest confirmed orders." : "Latest orders from buyers."}
        actions={
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-cyan-light)]">
            <ShoppingCart className="h-4.5 w-4.5 text-[var(--accent-cyan)]" strokeWidth={2} />
          </span>
        }
      />

      <div className="mt-5 flex flex-1 flex-col">
        {isLoading && <SkeletonRows rows={6} />}

        {isError && (
          <div className="flex flex-1">
            <DashboardErrorState
              title="Orders unreachable"
              hint="We couldn't load your recent orders."
              onRetry={refetch}
            />
          </div>
        )}

        {isSuccess && orders.length === 0 && (
          <div className="flex flex-1">
            <DashboardEmptyState
              icon={<ShoppingCart className="h-6 w-6" strokeWidth={1.75} />}
              title="No orders yet."
              hint="Confirmed orders will appear here with their status and value."
              onRetry={refetch}
            />
          </div>
        )}

        {isSuccess && orders.length > 0 && (
          <div className="max-h-[480px] flex-1 space-y-0.5 overflow-auto pr-1">
            {orders.map((order, i) => (
              <OrderRow key={order.id} order={order} index={i} />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
}