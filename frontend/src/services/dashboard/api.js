import { getData, httpClient } from "../httpClient";

/* --------------------------------------------------------------------------
   Dashboard Service API — the single front-end API layer for the vendor
   dashboard. Every method is a thin, documented wrapper over the central
   axios client (httpClient). Components and hooks never call axios or fetch
   directly; they go through these named methods so the surface area of the
   dashboard backend stays fully explicit and testable.

   The named methods cover the whole dashboard surface:
     getDashboardOverview()        -> /api/vendor/dashboard
     getRevenueAnalytics(range)    -> /api/vendor/analytics?range= (revenue + pipeline)
     getRecentRFQs(page, limit)    -> /api/vendor/rfqs (paginated)
     getCustomerRequests()         -> /api/vendor/dashboard/customer-requests
     getVendorHealth()             -> /api/vendor/dashboard/vendor-health
     getNotifications()            -> /api/vendor/dashboard/notifications
     getProductPerformance(range)  -> /api/vendor/dashboard/product-performance?range=
     getAdvancedAnalytics()        -> /api/vendor/dashboard/advanced-analytics
     getRecentActivity()           -> /api/vendor/dashboard/recent-activity
     getAIInsightsSummary(range)   -> /api/vendor/dashboard/ai-insights?range=
     getAIInsights()               -> /api/vendor/insights + /recommendations
     getQuickActions()             -> navigation config (UI, no backend call)
   -------------------------------------------------------------------------- */

const ENDPOINTS = {
  dashboard: "/api/vendor/dashboard",
  analytics: "/api/vendor/analytics",
  rfqs: "/api/vendor/rfqs",
  customerRequests: "/api/vendor/dashboard/customer-requests",
  vendorHealth: "/api/vendor/dashboard/vendor-health",
  notifications: "/api/vendor/dashboard/notifications",
  productPerformance: "/api/vendor/dashboard/product-performance",
  advancedAnalytics: "/api/vendor/dashboard/advanced-analytics",
  recentActivity: "/api/vendor/dashboard/recent-activity",
  aiInsights: "/api/vendor/dashboard/ai-insights",
  insights: "/api/vendor/insights",
  recommendations: "/api/vendor/recommendations",
  metricDetails: (key) => `/api/vendor/dashboard/metric-details/${key}`,
  metricExport: (key) => `/api/vendor/dashboard/metric-export/${key}`,
};

/** Overview payload: vendorName, score + the four KPI entries. */
export function getDashboardOverview() {
  return getData(ENDPOINTS.dashboard);
}

/**
 * Phase 1 Dashboard Overview — GET /api/dashboard/overview.
 * Returns { greeting, currentDate, vendorName, metrics }. Each metric is
 * { id, title, value, changePercent, trendDirection, sparkline, icon, color,
 *   prefix } — consumed directly by the Redux overview slice.
 */
export function getOverview() {
  return getData("/api/dashboard/overview");
}

/**
 * Analytics payload for a revenue range (today | 7d | month | last-month |
 * year). The backend computes the total, previous-period growth and the
 * timeline for that range, plus the RFQ pipeline breakdown — all business
 * statistics live server-side.
 */
export function getRevenueAnalytics(range) {
  return getData(ENDPOINTS.analytics, { params: range ? { range } : undefined });
}

/** Paginated recent RFQs. Backend responds { items, total, page, pages }. */
export function getRecentRFQs(page = 1, limit = 8) {
  return getData(ENDPOINTS.rfqs, { params: { page, limit } });
}

/** Customer requests inbox feed. */
export function getCustomerRequests() {
  return getData(ENDPOINTS.customerRequests);
}

/** Vendor health indicators + overall score. */
export function getVendorHealth() {
  return getData(ENDPOINTS.vendorHealth);
}

/** Recent notifications feed (latest first). */
export function getNotifications() {
  return getData(ENDPOINTS.notifications);
}

/**
 * Product performance for a range (7d | 30d | 90d | year). The backend
 * computes RFQ/order counts, revenue, conversion rate and status per product.
 */
export function getProductPerformance(range) {
  return getData(ENDPOINTS.productPerformance, { params: range ? { range } : undefined });
}

/** Eight advanced business statistics with previous-period comparisons. */
export function getAdvancedAnalytics() {
  return getData(ENDPOINTS.advancedAnalytics);
}

/** Recent vendor events (RFQs, quotes, orders, products, reviews, certs). */
export function getRecentActivity() {
  return getData(ENDPOINTS.recentActivity);
}

/**
 * Full AI Insights page payload for a range (7d | 30d | 90d). When a session
 * token exists it is attached so the backend can scope the analysis to the
 * authenticated vendor; `refresh` forces a fresh AI generation (server cache
 * bypassed).
 */
export function getAIInsightsSummary(range, { refresh = false } = {}) {
  const params = {};
  if (range) params.range = range;
  if (refresh) params.refresh = 1;
  const token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  return getData(ENDPOINTS.aiInsights, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

/** AI insights + recommendations combined in one call for the rail card. */
export async function getAIInsights() {
  const [insights, recommendations] = await Promise.all([
    getData(ENDPOINTS.insights),
    getData(ENDPOINTS.recommendations),
  ]);
  return { insights, recommendations };
}

/**
 * Live detail payload for one dashboard metric (card action menu). The
 * backend computes the metric, summary chips, time series, optional
 * breakdown and real records — the request fires only when the menu opens
 * the modal (see useMetricDetails `enabled`).
 */
export function getMetricDetails(key) {
  return getData(ENDPOINTS.metricDetails(key));
}

/**
 * Download a real-record CSV report for one metric. The backend streams a
 * `text/csv` attachment; the browser saves it under the Content-Disposition
 * filename. Returns the filename for callers that want to confirm.
 */
export async function downloadMetricReport(key) {
  const response = await httpClient.get(ENDPOINTS.metricExport(key), {
    responseType: "blob",
  });
  const disposition = response.headers?.["content-disposition"] ?? "";
  const match = /filename="?([^";]+)"?/i.exec(disposition);
  const filename = match?.[1] ?? `${key}-report.csv`;
  const url = URL.createObjectURL(new Blob([response.data], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return filename;
}

/**
 * Quick Actions are pure navigation (no business data), so there is no
 * backend endpoint. The canonical tile config lives here in the service
 * layer instead of inside the component, keeping components free of
 * hardcoded route tables. `icon` is a Lucide icon key mapped in the UI.
 */
import { getRoleRoute } from "../../utils/routeUtils";

export function getQuickActions() {
  let userRole = 'buyer';
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.role) userRole = user.role.toLowerCase();
    }
  } catch (err) {}

  if (userRole === 'admin') {
    return [
      { id: "manage-users", label: "Manage Users", route: "/admin/users", icon: "Users" },
      { id: "verify-vendors", label: "Verify Vendors", route: "/admin/vendors", icon: "BadgeCheck" },
      { id: "all-vendors", label: "All Vendors", route: "/admin/vendors", icon: "Building2" },
      { id: "ai-search", label: "AI Search", route: "/admin/ai-search", icon: "Sparkles" },
      { id: "system-settings", label: "System Settings", route: "/admin/settings", icon: "Settings" },
    ];
  }

  return [
    { id: "add-product", label: "Add Product", route: getRoleRoute("product-catalog"), icon: "PackagePlus" },
    { id: "generate-quote", label: "Generate Quote", route: getRoleRoute("quotes"), icon: "FilePlus2" },
    { id: "view-orders", label: "View Orders", route: getRoleRoute("orders"), icon: "ClipboardList" },
    { id: "upload-certificate", label: "Upload Certificate", route: getRoleRoute("vendors"), icon: "Award" },
    { id: "company-profile", label: "Company Profile", route: getRoleRoute("profile"), icon: "UserRound" },
    { id: "ai-search", label: "AI Search", route: getRoleRoute("ai-search"), icon: "Sparkles" },
  ];
}
