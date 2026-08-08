import { useEffect, useRef, useState } from "react";

/* --------------------------------------------------------------------------
   Legacy dashboardService — dependency-light request hook + shared
   normalizers (requests, vendor health, product performance, notifications,
   tasks). The modular services in services/dashboard/ import these
   normalizers so mapping logic is never duplicated.
   -------------------------------------------------------------------------- */

export const CUSTOMER_REQUESTS_PATH = "/api/vendor/dashboard/customer-requests";
export const PRODUCT_PERFORMANCE_PATH = "/api/vendor/dashboard/product-performance";
export const VENDOR_HEALTH_PATH = "/api/vendor/dashboard/vendor-health";
export const NOTIFICATIONS_PATH = "/api/vendor/dashboard/notifications";
export const TASKS_PATH = "/api/vendor/dashboard/tasks";

const API_BASE_URL = "http://localhost:5000";

function fetchJson(path, options = {}) {
  return fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return res.json();
  });
}

/* Dependency-light request hook with a settled-state guard. */
export function useApi(path, { minLoadingMs = 600 } = {}) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [tick, setTick] = useState(0);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;

    const startedAt = Date.now();
    setState({ status: "loading", data: null, error: null });

    fetchJson(path)
      .then((json) => {
        const remaining = Math.max(0, minLoadingMs - (Date.now() - startedAt));
        setTimeout(() => {
          if (!active.current) return;
          setState({ status: "success", data: json, error: null });
        }, remaining);
      })
      .catch((err) => {
        if (!active.current) return;
        setState({ status: "error", data: null, error: err.message });
      });

    return () => {
      active.current = false;
    };
  }, [path, tick, minLoadingMs]);

  return {
    ...state,
    refetch: () => setTick((t) => t + 1),
  };
}

/* ------------------------------ Normalizers ------------------------------ */

export function normalizeRequests(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map((r) => ({
    id: r._id ?? r.id ?? `${r.buyer?.name}-${r.message}`,
    buyerName: r.buyer?.name ?? r.buyerName ?? "Unknown buyer",
    buyerAvatar: r.buyer?.avatar ?? r.buyerAvatar ?? "",
    subject: r.subject ?? r.title ?? "New inquiry",
    message: r.message ?? r.preview ?? "—",
    time: r.time ?? r.createdAt ?? null,
    unread: Boolean(r.unread ?? r.isUnread),
  }));
}

export function getProductPerformance(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  const items = list.map((p) => ({
    key: p._id ?? p.id ?? p.key ?? p.name,
    name: p.name ?? p.productName ?? "Product",
    category: p.category ?? "Products",
    thumbnail: p.thumbnail ?? p.image ?? null,
    image: p.image ?? null,
    views: Number(p.views ?? 0),
    units: Number(p.units ?? 0),
    revenue: Number(p.revenue ?? 0),
    orders: Number(p.orders ?? 0),
    orderCount: Number(p.orderCount ?? p.orders ?? 0),
    rfqCount: Number(p.rfqCount ?? 0),
    conversionRate: p.conversionRate != null ? Number(p.conversionRate) : null,
    status: p.status ?? "Listed",
    trend: p.trend != null ? Number(p.trend) : null,
    percentage: Number(p.percentage ?? 0),
  }));

  const max = Math.max(0, ...items.map((i) => i.revenue));
  return items.map((i) => ({
    ...i,
    percentage: max ? Math.round((i.revenue / max) * 100) : 0,
  }));
}

export function getVendorHealth(data) {
  const base = data?.data ?? data ?? {};
  const metrics = Array.isArray(base.metrics) ? base.metrics : [];
  return {
    overallScore: base?.overallScore ?? null,
    metrics: metrics.map((m) => ({
      key: m.key ?? "metric",
      label: m.label ?? "Metric",
      value: m.value != null ? Number(m.value) : null,
      detail: m.detail ?? null,
    })),
  };
}

export function getNotifications(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map((n) => ({
    id: n._id ?? n.id ?? `${n.title}-${n.time}`,
    title: n.title ?? "Notification",
    message: n.message ?? "",
    type: n.type ?? "system",
    time: n.time ?? n.createdAt ?? null,
    unread: Boolean(n.unread ?? n.isUnread),
  }));
}

export function getTasks(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map((t) => ({
    id: t._id ?? t.id ?? t.title,
    title: t.title ?? "Task",
    detail: t.detail ?? "",
    category: t.category ?? "task",
    deadline: t.deadline ?? null,
    priority: (t.priority ?? "medium").toLowerCase(),
    progress: Number(t.progress ?? 0),
  }));
}
