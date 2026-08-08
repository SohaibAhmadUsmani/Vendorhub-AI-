import { useQuery } from "@tanstack/react-query";
import { getData } from "../httpClient";
import {
  normalizeRequests,
  getVendorHealth,
  getProductPerformance as normalizeProductPerformance,
  getNotifications as normalizeNotifications,
} from "../dashboardService";
import {
  getDashboardOverview,
  getRecentRFQs,
  getProductPerformance as fetchProductPerformance,
  getAdvancedAnalytics as fetchAdvancedAnalytics,
  getRecentActivity as fetchRecentActivity,
  getMetricDetails as fetchMetricDetails,
} from "./api";

/* --------------------------------------------------------------------------
   dashboardService — overview, recent RFQs, orders, messages, customer
   requests and vendor health. Every hook delegates to the dedicated Dashboard
   Service API (services/dashboard/api.js) and is cached by React Query
   (deduplicated, background refetch, retry). The request/vendor-health
   normalizers are shared with the legacy service to avoid duplicating
   mapping logic.
   -------------------------------------------------------------------------- */

const ENDPOINTS = {
  orders: "/api/vendor/orders",
  messages: "/api/vendor/messages",
  customerRequests: "/api/vendor/dashboard/customer-requests",
  vendorHealth: "/api/vendor/dashboard/vendor-health",
  notifications: "/api/vendor/dashboard/notifications",
};

function useEndpoint(key, path) {
  return useQuery({
    queryKey: ["vendor", key],
    queryFn: () => getData(path),
  });
}

export function useVendorDashboard() {
  return useQuery({
    queryKey: ["vendor", "dashboard"],
    queryFn: getDashboardOverview,
  });
}

/** Recent RFQs with API-driven pagination (page starts at 1). */
export function useVendorRfqs(page = 1, limit = 8) {
  return useQuery({
    queryKey: ["vendor", "rfqs", page, limit],
    queryFn: () => getRecentRFQs(page, limit),
  });
}

export function useVendorOrders() {
  return useEndpoint("orders", ENDPOINTS.orders);
}

export function useVendorMessages() {
  return useEndpoint("messages", ENDPOINTS.messages);
}

export function useVendorCustomerRequests() {
  return useEndpoint("customer-requests", ENDPOINTS.customerRequests);
}

export function useVendorHealth() {
  return useEndpoint("health", ENDPOINTS.vendorHealth);
}

export function useVendorNotifications() {
  return useEndpoint("notifications", ENDPOINTS.notifications);
}

/** Product performance for a selected range — refetches on range change. */
export function useVendorProductPerformance(range = "30d") {
  return useQuery({
    queryKey: ["vendor", "product-performance", range],
    queryFn: () => fetchProductPerformance(range),
  });
}

export function useVendorAdvancedAnalytics() {
  return useQuery({
    queryKey: ["vendor", "advanced-analytics"],
    queryFn: fetchAdvancedAnalytics,
  });
}

export function useVendorRecentActivity() {
  return useQuery({
    queryKey: ["vendor", "recent-activity"],
    queryFn: fetchRecentActivity,
  });
}

/**
 * Metric details for the card action menu — fetches ONLY while `enabled`
 * (i.e. when the details modal is open), so nothing is preloaded.
 */
export function useMetricDetails(key, { enabled = false } = {}) {
  return useQuery({
    queryKey: ["vendor", "metric-details", key],
    queryFn: () => fetchMetricDetails(key),
    enabled: Boolean(key && enabled),
    staleTime: 30_000,
    retry: 1,
  });
}

/* ------------------------------ Normalizers ----------------------------- */

export function getOverview(data) {
  const base = data?.data ?? data ?? {};
  const kpis = base?.kpis ?? {};

  const normalizeKpi = (entry) => {
    const value = entry?.value ?? null;
    const delta = entry?.delta ?? null;
    const spark = Array.isArray(entry?.spark) ? entry.spark.map(Number) : [];
    return { value, delta, spark };
  };

  return {
    vendorScore: base?.vendorScore ?? null,
    scoreTrend: base?.scoreTrend ?? null,
    vendorName: base?.vendorName ?? null,
    kpis: {
      rfqs: normalizeKpi(kpis.rfqs),
      orders: normalizeKpi(kpis.orders),
      revenue: normalizeKpi(kpis.revenue),
      customerRequests: normalizeKpi(kpis.customerRequests),
    },
  };
}

export function normalizeRfqs(data) {
  const list = Array.isArray(data) ? data : data?.items ?? data?.data ?? [];
  return list.map((r) => ({
    id: r._id ?? r.id ?? `${r.buyer?.name}-${r.product}`,
    buyerName: r.buyer?.name ?? r.buyerName ?? "Unknown buyer",
    buyerAvatar: r.buyer?.avatar ?? r.buyerAvatar ?? "",
    product: r.product ?? r.title ?? "—",
    quantity: r.quantity ?? r.qty ?? null,
    country: r.country ?? r.buyer?.country ?? "—",
    deadline: r.deadline ?? r.deliveryDate ?? null,
    priority: (r.priority ?? "normal").toLowerCase(),
    status: (r.status ?? "pending").toLowerCase(),
  }));
}

/** Pagination metadata from the paginated /api/vendor/rfqs response. */
export function getRfqPageMeta(data) {
  const base = data ?? {};
  return {
    total: Number(base.total ?? 0),
    page: Number(base.page ?? 1),
    pages: Number(base.pages ?? 1),
  };
}

export function getRecentOrders(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map((o) => ({
    id: o._id ?? o.id ?? o.orderNumber,
    buyerName: o.buyer?.name ?? o.buyerName ?? "Unknown buyer",
    buyerAvatar: o.buyer?.avatar ?? o.buyerAvatar ?? null,
    status: (o.status ?? "pending").toLowerCase(),
    amount: Number(o.amount ?? o.total ?? 0),
    items: o.items ?? "Order",
    date: o.date ?? o.createdAt ?? null,
  }));
}

export function getMessages(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map((m) => ({
    id: m._id ?? m.id ?? `${m.customer}-${m.time}`,
    customer: m.customer ?? m.buyer?.name ?? m.buyerName ?? "Unknown buyer",
    avatar: m.avatar ?? m.buyerAvatar ?? null,
    subject: m.subject ?? m.title ?? "New inquiry",
    preview: m.message ?? m.preview ?? "",
    time: m.time ?? m.createdAt ?? null,
    unread: Boolean(m.unread ?? m.isUnread),
  }));
}

/* ------------------------- New widget normalizers ------------------------ */

export function getAdvancedAnalytics(data) {
  const base = data?.data ?? data ?? {};
  const metrics = Array.isArray(base.metrics) ? base.metrics : [];
  return {
    periodLabel: base.periodLabel ?? null,
    metrics: metrics.map((m) => ({
      key: m.key ?? "metric",
      label: m.label ?? "Metric",
      value: m.value != null ? Number(m.value) : null,
      display: m.display ?? null,
      prefix: m.prefix ?? "",
      suffix: m.suffix ?? "",
      changePercent: m.changePercent != null ? Number(m.changePercent) : null,
      trendDirection: m.trendDirection ?? "neutral",
      compareLabel: m.compareLabel ?? null,
      icon: m.icon ?? "BarChart3",
      color: m.color ?? "#6C5CE7",
      signed: Boolean(m.signed),
      hint: m.hint ?? null,
      sparkline: Array.isArray(m.sparkline) ? m.sparkline.map(Number) : [],
    })),
  };
}

export function getRecentActivity(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map((a) => ({
    id: a._id ?? a.id ?? `${a.type}-${a.timestamp}`,
    type: a.type ?? "system",
    title: a.title ?? "Activity",
    description: a.description ?? "",
    timestamp: a.timestamp ?? a.createdAt ?? null,
    status: a.status ?? null,
  }));
}

/**
 * Normalizes the metric-details payload for the action-menu modal. The
 * backend sends { key, label, color, prefix, suffix, metric, summary,
 * series, breakdown, items } — this only reshapes it for the UI.
 */
export function normalizeMetricDetails(data) {
  const base = data?.data ?? data ?? {};
  return {
    key: base.key ?? "metric",
    label: base.label ?? "Metric",
    color: base.color ?? "#6C5CE7",
    prefix: base.prefix ?? "",
    suffix: base.suffix ?? "",
    signed: Boolean(base.signed),
    metric: {
      value: base.metric?.value != null ? Number(base.metric.value) : null,
      changePercent: base.metric?.changePercent != null ? Number(base.metric.changePercent) : null,
      trendDirection: base.metric?.trendDirection ?? "neutral",
      compareLabel: base.metric?.compareLabel ?? null,
    },
    summary: Array.isArray(base.summary)
      ? base.summary.map((s) => ({ label: s.label ?? "", value: s.value ?? "—" }))
      : [],
    series: Array.isArray(base.series)
      ? base.series.map((p) => ({
          label: p.label ?? "",
          value: Number(p.value ?? 0),
        }))
      : [],
    breakdown: Array.isArray(base.breakdown)
      ? base.breakdown.map((b) => ({
          label: b.label ?? "",
          value: Number(b.value ?? 0),
          color: b.color ?? "#6C5CE7",
        }))
      : [],
    items: Array.isArray(base.items) ? base.items : [],
  };
}

/* Shared with the legacy service — no duplicated mapping logic. */
export {
  normalizeRequests as getCustomerRequests,
  getVendorHealth,
  normalizeProductPerformance as getProductPerformance,
  normalizeNotifications as getNotifications,
};
