/**
 * dashboardService.js — Vendor Dashboard aggregation layer (Module 3)
 *
 * Every metric is computed from real collections. When a collection has no
 * documents yet, endpoints return honest empty values (null / empty arrays)
 * so the UI can render empty states — never fabricated numbers.
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const RFQ = require('../models/RFQ');
const Order = require('../models/Order');
const CustomerRequest = require('../models/CustomerRequest');
const Notification = require('../models/Notification');
const Quote = require('../models/Quote');
const Message = require('../models/Message');
// Side-effect import + reference: the User model is required for every
// `.populate('buyer')` below (RFQs, orders, requests, messages) — without
// it Mongoose throws "Schema hasn't been registered for model 'User'" once
// real docs exist.
const UserModel = require('../models/User');

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function serializeNotification(n) {
  return {
    id: String(n._id),
    title: n.title,
    message: n.message ?? '',
    type: n.type ?? 'system',
    time: n.createdAt ?? n.time,
    unread: !n.read,
    link: n.link ?? null,
  };
}

async function purgeSeededNotifications() {
  const seedMatches = [
    {
      title: 'RFQ response needed',
      message: 'A buyer is waiting on your quote for the premium packaging order.',
    },
    {
      title: 'New message from buyer',
      message: 'Please confirm the delivery window before we release the next purchase order.',
    },
    {
      title: 'Order shipped',
      message: 'Order #10492 has moved to shipped and is now in transit.',
    },
    {
      title: 'Quote approved',
      message: 'The latest quote for the home-office set was approved by the buyer.',
    },
  ];

  if (!seedMatches.length) return 0;
  const result = await Notification.deleteMany({ $or: seedMatches });
  return result.deletedCount || 0;
}

/** Resolve the vendor the dashboard belongs to (explicit id or top-rated). */
async function resolveVendor(vendorId) {
  let vendor = null;
  if (vendorId && mongoose.Types.ObjectId.isValid(vendorId)) {
    vendor = await Vendor.findById(vendorId);
  }
  if (!vendor) {
    vendor = await Vendor.findOne({}).sort({ rating: -1 });
  }
  return vendor;
}

/**
 * Resolve the vendor scoped to the requesting user, when a valid JWT is
 * present. Vendors are owned by whoever registered their vendor account with
 * a matching contact email, so an authenticated vendor only ever sees their
 * own data. Without a usable token (dev/demo mode) this falls back to the
 * existing dashboard resolution so the current app keeps working.
 */
async function resolveVendorForRequest(req) {
  const token = req?.header ? req.header('Authorization')?.replace('Bearer ', '') : null;
  if (token && process.env.JWT_SECRET) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded?.id) {
        const user = await UserModel.findById(decoded.id).lean();
        if (user?.email && user.role === 'vendor') {
          const owned = await Vendor.findOne({ 'contact.email': user.email });
          if (owned) return owned;
        }
      }
    } catch {
      /* Invalid/expired token — fall through to the default resolution. */
    }
  }
  return resolveVendor(req?.query?.vendorId);
}

function percentageChange(current, previous) {
  if (current == null || previous == null) return null;
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/* ------------------------------ Overview ------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Last N days as trailing counts (oldest → newest) for KPI sparklines. */
function dailyCounts(items, days = 7) {
  const out = Array(days).fill(0);
  const now = Date.now();
  (items || []).forEach((it) => {
    const t = new Date(it.createdAt || Date.now()).getTime();
    const idx = Math.floor((now - t) / DAY_MS);
    if (idx >= 0 && idx < days) out[days - 1 - idx] += 1;
  });
  return out;
}

function dailyAmounts(items, days = 7) {
  const out = Array(days).fill(0);
  const now = Date.now();
  (items || []).forEach((it) => {
    const t = new Date(it.createdAt || Date.now()).getTime();
    const idx = Math.floor((now - t) / DAY_MS);
    if (idx >= 0 && idx < days) out[days - 1 - idx] += Number(it.total || 0);
  });
  return out;
}

/** Per-day average order value (sum / count per day), 0 when no orders that day. */
function dailyAov(items, days = 7) {
  const out = Array(days).fill(0);
  const counts = Array(days).fill(0);
  const now = Date.now();
  (items || []).forEach((it) => {
    const t = new Date(it.createdAt || Date.now()).getTime();
    const idx = Math.floor((now - t) / DAY_MS);
    if (idx >= 0 && idx < days) {
      const i = days - 1 - idx;
      counts[i] += 1;
      out[i] += Number(it.total || 0);
    }
  });
  return out.map((sum, i) => (counts[i] ? Math.round(sum / counts[i]) : 0));
}

async function buildOverview(vendorId) {
  const vendor = await resolveVendor(vendorId);

  const emptyKpi = { value: null, delta: null, spark: [] };
  if (!vendor) {
    return {
      vendorScore: null,
      scoreTrend: null,
      vendorName: null,
      kpis: {
        rfqs: emptyKpi,
        orders: emptyKpi,
        revenue: emptyKpi,
        customerRequests: emptyKpi,
      },
    };
  }

  const now = Date.now();
  const curStart = now - THIRTY_DAYS_MS;
  const prevStart = curStart - THIRTY_DAYS_MS;
  const vid = vendor._id;

  const [rfqs, orders, requests] = await Promise.all([
    RFQ.find({}).lean(),
    Order.find({ vendor: vid }).lean(),
    CustomerRequest.find({ vendor: vid }).lean(),
  ]);

  const inWindow = (t, start, end) => t >= start && t < end;
  const createdAt = (doc) => new Date(doc.createdAt || Date.now()).getTime();

  const rfqCur = rfqs.filter((r) => inWindow(createdAt(r), curStart, now)).length;
  const rfqPrev = rfqs.filter((r) => inWindow(createdAt(r), prevStart, curStart)).length;
  const reqCur = requests.filter((r) => inWindow(createdAt(r), curStart, now)).length;
  const reqPrev = requests.filter((r) => inWindow(createdAt(r), prevStart, curStart)).length;
  const orderCur = orders.filter((o) => inWindow(createdAt(o), curStart, now)).length;
  const orderPrev = orders.filter((o) => inWindow(createdAt(o), prevStart, curStart)).length;
  const activeOrders = orders.filter((o) => ['pending', 'in_progress', 'shipped'].includes(o.status)).length;

  const revCur = orders
    .filter((o) => inWindow(createdAt(o), curStart, now))
    .reduce((s, o) => s + Number(o.total || 0), 0);
  const revPrev = orders
    .filter((o) => inWindow(createdAt(o), prevStart, curStart))
    .reduce((s, o) => s + Number(o.total || 0), 0);

  const hasOrders = orders.length > 0;

  return {
    vendorScore: vendor.riskBreakdown?.overallScore ?? null,
    scoreTrend: null,
    vendorName: vendor.name,
    kpis: {
      rfqs: { value: rfqCur, delta: percentageChange(rfqCur, rfqPrev), spark: dailyCounts(rfqs) },
      orders: { value: activeOrders, delta: percentageChange(orderCur, orderPrev), spark: dailyCounts(orders) },
      revenue: {
        value: hasOrders ? revCur : null,
        delta: hasOrders ? percentageChange(revCur, revPrev) : null,
        spark: dailyAmounts(orders),
      },
      customerRequests: { value: reqCur, delta: percentageChange(reqCur, reqPrev), spark: dailyCounts(requests) },
    },
  };
}

/* ------------------------------ Analytics ------------------------------ */

const ANALYTICS_RANGES = {
  today: { label: 'Today', bucket: 'hour' },
  '7d': { label: 'Last 7 Days', bucket: 'day' },
  month: { label: 'This Month', bucket: 'day' },
  'last-month': { label: 'Last Month', bucket: 'day' },
  year: { label: 'This Year', bucket: 'month' },
};

/** RFQ pipeline stages: real statuses map onto each stage (future-proof). */
const PIPELINE_STAGES = [
  { key: 'pending', name: 'Pending', color: '#6C5CE7', statuses: ['draft', 'sent', 'pending'] },
  { key: 'quoted', name: 'Quoted', color: '#0EA5E9', statuses: ['quoted'] },
  { key: 'negotiation', name: 'Negotiation', color: '#F59E0B', statuses: ['negotiation'] },
  { key: 'accepted', name: 'Accepted', color: '#06B6D4', statuses: ['accepted'] },
  { key: 'completed', name: 'Completed', color: '#22C55E', statuses: ['completed', 'closed'] },
];

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Window (start / end / previous-period start) for a revenue range key. */
function rangeWindow(range, now) {
  const windows = {
    today: { start: startOfDay(now), prevStart: startOfDay(new Date(now.getTime() - DAY_MS)), end: now },
    '7d': {
      start: new Date(now.getTime() - 7 * DAY_MS),
      prevStart: new Date(now.getTime() - 14 * DAY_MS),
      end: now,
    },
    month: { start: monthStart(now, 0), prevStart: monthStart(now, -1), end: now },
    'last-month': {
      start: monthStart(now, -1),
      prevStart: monthStart(now, -2),
      end: monthStart(now, 0),
    },
    year: {
      start: new Date(now.getFullYear(), 0, 1),
      prevStart: new Date(now.getFullYear() - 1, 0, 1),
      end: new Date(now.getFullYear() + 1, 0, 1),
    },
  };
  return windows[range] ?? windows['7d'];
}

/** Local (not UTC) yyyy-mm-dd key so bucket keys stay in the server's zone. */
function localDayKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Sortable key + human label for a bucket boundary. */
function bucketInfo(date, kind) {
  const d = new Date(date);
  if (kind === 'hour') {
    d.setMinutes(0, 0, 0);
    return {
      key: `${localDayKey(d)}-${String(d.getHours()).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
  }
  if (kind === 'month') {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('en-US', { month: 'short' }),
    };
  }
  d.setHours(0, 0, 0, 0);
  return {
    key: localDayKey(d),
    label: d.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
  };
}

function advanceBucket(date, kind) {
  const d = new Date(date);
  if (kind === 'hour') d.setHours(d.getHours() + 1);
  else if (kind === 'month') d.setMonth(d.getMonth() + 1);
  else d.setDate(d.getDate() + 1);
  return d;
}

/**
 * Revenue timeline for a range: one point per bucket (hour/day/month) between
 * the window's start and end. Each point carries its amount plus the percentage
 * change vs the previous point (null for the first) — computed here, never on
 * the client.
 */
function buildRevenueTimeline(orders, window, kind) {
  const buckets = new Map();
  for (let cursor = new Date(window.start); cursor < window.end; cursor = advanceBucket(cursor, kind)) {
    const info = bucketInfo(cursor, kind);
    buckets.set(info.key, { date: info.key, label: info.label, amount: 0, changePercent: null });
  }

  orders.forEach((order) => {
    const created = new Date(order.createdAt || Date.now());
    if (created < window.start || created >= window.end) return;
    const info = bucketInfo(created, kind);
    const bucket = buckets.get(info.key);
    if (bucket) bucket.amount += Number(order.total || 0);
  });

  const timeline = Array.from(buckets.values());
  let previous = null;
  timeline.forEach((point) => {
    if (previous != null) point.changePercent = percentageChange(point.amount, previous);
    previous = point.amount;
  });
  return timeline;
}

/** RFQ pipeline breakdown with backend-computed counts + percentages. */
function buildPipeline(rfqs) {
  const counts = { pending: 0, quoted: 0, negotiation: 0, accepted: 0, completed: 0 };
  (rfqs || []).forEach((r) => {
    const status = String(r.status || '').toLowerCase();
    PIPELINE_STAGES.forEach((stage) => {
      if (stage.statuses.includes(status)) counts[stage.key] += 1;
    });
  });
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return {
    total,
    stages: PIPELINE_STAGES.map((stage) => ({
      key: stage.key,
      name: stage.name,
      color: stage.color,
      value: counts[stage.key],
      percentage: total ? Math.round((counts[stage.key] / total) * 100) : 0,
    })),
  };
}

async function buildAnalytics(vendorId, range = '7d') {
  const vendor = await resolveVendor(vendorId);
  const vid = vendor ? vendor._id : null;

  const [orders, rfqs] = await Promise.all([
    vid ? Order.find({ vendor: vid }).lean() : Promise.resolve([]),
    RFQ.find({}).lean(),
  ]);

  const paidOrders = orders.filter((o) => String(o.status || '').toLowerCase() === 'delivered');
  const now = new Date();
  const key = ANALYTICS_RANGES[range] ? range : '7d';
  const window = rangeWindow(key, now);
  const timeline = buildRevenueTimeline(paidOrders, window, ANALYTICS_RANGES[key].bucket);

  const total = timeline.reduce((sum, point) => sum + point.amount, 0);
  const prevTotal = paidOrders
    .filter((o) => {
      const t = new Date(o.createdAt || Date.now()).getTime();
      return t >= window.prevStart.getTime() && t < window.start.getTime();
    })
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const changePercent = percentageChange(total, prevTotal);
  const trendDirection =
    changePercent == null
      ? 'neutral'
      : changePercent > 0
        ? 'up'
        : changePercent < 0
          ? 'down'
          : 'flat';

  return {
    range: { key, label: ANALYTICS_RANGES[key].label },
    revenue: {
      total,
      changePercent,
      trendDirection,
      compareLabel: 'vs previous period',
      timeline,
    },
    pipeline: buildPipeline(rfqs),
  };
}

/* -------------------------------- Lists -------------------------------- */

/** Paginated RFQ list. `page` starts at 1; returns { items, total, page, pages }. */
async function buildRfqs({ page = 1, limit = 10 } = {}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  const [docs, total] = await Promise.all([
    RFQ.find({})
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate('buyer', 'name email')
      .lean(),
    RFQ.countDocuments({}),
  ]);

  return {
    items: docs.map((r) => ({
      id: String(r._id),
      buyerName: r.buyer?.name ?? 'Unknown buyer',
      buyerAvatar: null,
      product: r.product ?? null,
      quantity: r.quantity ?? null,
      country: r.country ?? null,
      deadline: r.deliveryDate ?? null,
      priority: r.priority ?? null,
      status: r.status ?? 'pending',
    })),
    total,
    page: pageNum,
    pages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

async function buildCustomerRequests(vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return [];

  const list = await CustomerRequest.find({ vendor: vendor._id })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('buyer', 'name email')
    .lean();

  return list.map((r) => ({
    id: String(r._id),
    buyerName: r.buyer?.name ?? 'Unknown buyer',
    buyerAvatar: null,
    message: r.message,
    time: r.createdAt,
    unread: !r.read,
  }));
}

/* --------------------------- Product Performance ------------------------- */

const PERFORMANCE_RANGES = {
  '7d': { label: 'Last 7 Days', days: 7 },
  '30d': { label: 'Last 30 Days', days: 30 },
  '90d': { label: 'Last 90 Days', days: 90 },
  year: { label: 'This Year', days: null },
};

/** Current + previous comparison window for a product-performance range. */
function performanceWindow(range, now) {
  const key = PERFORMANCE_RANGES[range] ? range : '30d';
  const config = PERFORMANCE_RANGES[key];
  if (config.days) {
    const start = now - config.days * DAY_MS;
    return { key, label: config.label, start, prevStart: start - config.days * DAY_MS, end: now };
  }
  const d = new Date(now);
  return {
    key,
    label: config.label,
    start: new Date(d.getFullYear(), 0, 1).getTime(),
    prevStart: new Date(d.getFullYear() - 1, 0, 1).getTime(),
    end: new Date(d.getFullYear() + 1, 0, 1).getTime(),
  };
}

/**
 * Free-text RFQ product names have no FK, so each RFQ is attributed to the
 * catalog listing whose name matches it best (exact or longest substring).
 */
function matchProductName(rfqName, products) {
  let best = null;
  let bestLen = 0;
  products.forEach((p) => {
    const pName = String(p.name || '').toLowerCase().trim();
    if (!pName || pName.length <= bestLen) return;
    if (rfqName === pName || rfqName.includes(pName)) {
      best = p;
      bestLen = pName.length;
    }
  });
  return best;
}

/** Performance status badge derived from live activity — never hardcoded. */
function productStatus(trend, hasActivity, createdInWindow) {
  if (createdInWindow && hasActivity) return 'New';
  if (trend == null) return hasActivity ? 'Steady' : 'Listed';
  if (trend >= 15) return 'Trending';
  if (trend > 0) return 'Rising';
  if (trend < 0) return 'Cooling';
  return 'Steady';
}

async function buildProductPerformance(vendorId, range) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return [];

  const vid = vendor._id;
  const [orders, products, rfqs] = await Promise.all([
    Order.find({ vendor: vid }).lean(),
    Product.find({ vendorId: vid }).lean(),
    RFQ.find({}).lean(),
  ]);
  if (!products.length) return [];

  const now = Date.now();
  const window = performanceWindow(range, now);
  const inWindow = (t) => t >= window.start && t < window.end;
  const inPrev = (t) => t >= window.prevStart && t < window.start;

  const byProduct = new Map();
  products.forEach((p) => {
    const id = String(p._id);
    byProduct.set(id, {
      id,
      key: id,
      name: p.name,
      category: p.category ?? 'Products',
      thumbnail: p.image ?? null,
      image: p.image ?? null,
      views: Number(p.views || 0),
      units: 0,
      orders: 0,
      revenue: 0,
      rfqCount: 0,
      cur: 0,
      prev: 0,
      createdInWindow: inWindow(new Date(p.createdAt || now).getTime()),
    });
  });

  orders.forEach((order) => {
    const created = new Date(order.createdAt || Date.now()).getTime();
    (order.items || []).forEach((item) => {
      /* Prefer the ObjectId ref; fall back to the free-text product name so
         order lines without a ref still attribute to the right listing. */
      let entry = item.product ? byProduct.get(String(item.product)) : null;
      if (!entry && item.productName) {
        const matched = matchProductName(String(item.productName).toLowerCase().trim(), products);
        if (matched) entry = byProduct.get(String(matched._id));
      }
      if (!entry) return;
      const revenue = Number(item.unitPrice || 0) * Number(item.quantity || 0);
      entry.units += Number(item.quantity || 0);
      entry.revenue += revenue;
      entry.orders += 1;
      if (inWindow(created)) entry.cur += revenue;
      else if (inPrev(created)) entry.prev += revenue;
    });
  });

  rfqs.forEach((rfq) => {
    const created = new Date(rfq.createdAt || Date.now()).getTime();
    if (!inWindow(created)) return;
    const rfqName = String(rfq.product || '').toLowerCase().trim();
    if (!rfqName) return;
    const product = matchProductName(rfqName, products);
    if (product) byProduct.get(String(product._id)).rfqCount += 1;
  });

  const ranked = Array.from(byProduct.values()).map((p) => {
    const trend = percentageChange(p.cur, p.prev);
    const hasActivity = p.orders > 0 || p.rfqCount > 0;
    return {
      ...p,
      orderCount: p.orders,
      /* Capped at 100 so it always reads as a true conversion rate. */
      conversionRate: p.rfqCount > 0 ? Math.min(100, Math.round((p.orders / p.rfqCount) * 100)) : null,
      trend,
      status: productStatus(trend, hasActivity, p.createdInWindow),
    };
  });

  /* Revenue-first when any revenue exists, otherwise activity-first. */
  ranked.sort((a, b) => {
    const aHas = a.revenue > 0;
    const bHas = b.revenue > 0;
    if (aHas !== bHas) return aHas ? -1 : 1;
    return b.revenue - a.revenue || b.rfqCount - a.rfqCount || b.views - a.views;
  });
  const top = ranked.slice(0, 6);

  const maxRevenue = Math.max(0, ...top.map((p) => p.revenue));
  const maxRfqs = Math.max(0, ...top.map((p) => p.rfqCount));
  const perfBase = maxRevenue > 0 ? maxRevenue : maxRfqs;

  return top.map((p) => ({
    id: p.id,
    key: p.key,
    name: p.name,
    category: p.category,
    thumbnail: p.thumbnail,
    image: p.image,
    views: p.views,
    units: p.units,
    orders: p.orders,
    orderCount: p.orderCount,
    revenue: p.revenue,
    rfqCount: p.rfqCount,
    conversionRate: p.conversionRate,
    trend: p.trend,
    status: p.status,
    percentage: perfBase ? Math.round(((maxRevenue > 0 ? p.revenue : p.rfqCount) / perfBase) * 100) : 0,
  }));
}

async function buildNotifications() {
  await purgeSeededNotifications();
  const list = await Notification.find({}).sort({ createdAt: -1 }).limit(15).lean();
  return list.map(serializeNotification);
}

/* -------------------------- Advanced Analytics -------------------------- */

/**
 * Eight high-level business statistics, every comparison computed server-side.
 * Counts compare the trailing 30-day window against the previous 30 days;
 * growth metrics compare calendar months. Each metric carries its own
 * presentation hints (icon, colour, prefix) so the UI never computes stats.
 */
async function buildAdvancedAnalytics(vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return { periodLabel: null, metrics: [] };

  const vid = vendor._id;
  const [products, orders, rfqs] = await Promise.all([
    Product.find({ vendorId: vid }).lean(),
    Order.find({ vendor: vid }).lean(),
    RFQ.find({}).lean(),
  ]);

  const now = new Date();
  const curStart = now.getTime() - THIRTY_DAYS_MS;
  const prevStart = curStart - THIRTY_DAYS_MS;
  const inCur = (t) => t >= curStart && t < now.getTime();
  const inPrev = (t) => t >= prevStart && t < curStart;
  const created = (doc) => new Date(doc.createdAt || now).getTime();

  const paid = orders.filter((o) => String(o.status || '').toLowerCase() === 'delivered');
  /* Orders that converted from an RFQ — drives the conversion sparkline. */
  const convertedOrders = paid.filter((o) => o.rfq);
  const buyersWithOrders = (list) => {
    const counts = new Map();
    list.forEach((o) => {
      if (o.buyer) counts.set(String(o.buyer), (counts.get(String(o.buyer)) || 0) + 1);
    });
    return counts;
  };

  /* Total Products — listings now vs how many were newly added per window. */
  const addedCur = products.filter((p) => inCur(created(p))).length;
  const addedPrev = products.filter((p) => inPrev(created(p))).length;

  /* Active Products — currently listed & in stock, new additions per window. */
  const activeProducts = products.filter((p) => p.inStock !== false);
  const activeAddedCur = activeProducts.filter((p) => inCur(created(p))).length;
  const activeAddedPrev = activeProducts.filter((p) => inPrev(created(p))).length;

  /* Average Response Time — score from the vendor's response-time label. */
  const responseScore = responseTimeScore(vendor.responseTime);

  /* RFQ Conversion — orders linked to an RFQ vs RFQs received, per window. */
  const rfqsCur = rfqs.filter((r) => inCur(created(r)));
  const rfqsPrev = rfqs.filter((r) => inPrev(created(r)));
  const convertedIn = (list, rfqIds) =>
    list.filter((o) => o.rfq && rfqIds.has(String(o.rfq))).length;
  const rfqIdMap = (list) => new Set(list.map((r) => String(r._id)));
  const convCur = rfqsCur.length
    ? Math.round((convertedIn(paid, rfqIdMap(rfqsCur)) / rfqsCur.length) * 100)
    : null;
  const convPrev = rfqsPrev.length
    ? Math.round((convertedIn(paid, rfqIdMap(rfqsPrev)) / rfqsPrev.length) * 100)
    : null;

  /* Average Order Value — delivered revenue per delivered order, per window. */
  const paidCur = paid.filter((o) => inCur(created(o)));
  const paidPrev = paid.filter((o) => inPrev(created(o)));
  const aovCur = paidCur.length
    ? Math.round(paidCur.reduce((s, o) => s + Number(o.total || 0), 0) / paidCur.length)
    : null;
  const aovPrev = paidPrev.length
    ? Math.round(paidPrev.reduce((s, o) => s + Number(o.total || 0), 0) / paidPrev.length)
    : null;

  /* Monthly Growth — delivered revenue this calendar month vs last month. */
  const monthCur = monthStart(now, 0);
  const monthPrev = monthStart(now, -1);
  const monthNext = monthStart(now, 1);
  const revIn = (start, end) =>
    paid
      .filter((o) => created(o) >= start.getTime() && created(o) < end.getTime())
      .reduce((s, o) => s + Number(o.total || 0), 0);
  const revMonthCur = revIn(monthCur, monthNext);
  const revMonthPrev = revIn(monthPrev, monthCur);
  const monthlyGrowth =
    revMonthCur > 0 || revMonthPrev > 0
      ? percentageChange(revMonthCur, revMonthPrev)
      : null;

  /* Customer Retention — buyers with 2+ orders vs buyers with any order. */
  const retentionFor = (list) => {
    const counts = buyersWithOrders(list);
    if (!counts.size) return null;
    const returning = Array.from(counts.values()).filter((c) => c >= 2).length;
    return Math.round((returning / counts.size) * 100);
  };
  const retentionCur = retentionFor(paid.filter((o) => inCur(created(o))));
  const retentionPrev = retentionFor(paid.filter((o) => inPrev(created(o))));

  /* Returning Customers — buyers with 2+ orders in the current window. */
  const returningCur = Array.from(buyersWithOrders(paid.filter((o) => inCur(created(o)))).values()).filter(
    (c) => c >= 2,
  ).length;
  const returningPrev = Array.from(buyersWithOrders(paid.filter((o) => inPrev(created(o)))).values()).filter(
    (c) => c >= 2,
  ).length;

  const metrics = [
    {
      key: 'totalProducts',
      label: 'Total Products',
      value: products.length,
      prefix: '',
      suffix: '',
      changePercent: percentageChange(addedCur, addedPrev),
      trendDirection: 'auto',
      compareLabel: 'new listings vs last 30 days',
      icon: 'Package',
      color: '#6C5CE7',
      hint: 'Add products to start building your catalog.',
      sparkline: sparklineFrom(dailyCounts(products, 7)),
    },
    {
      key: 'activeProducts',
      label: 'Active Products',
      value: activeProducts.length,
      prefix: '',
      suffix: '',
      changePercent: percentageChange(activeAddedCur, activeAddedPrev),
      trendDirection: 'auto',
      compareLabel: 'new active vs last 30 days',
      icon: 'PackageCheck',
      color: '#0EA5E9',
      hint: 'Products that are live and in stock.',
      sparkline: sparklineFrom(dailyCounts(activeProducts, 7)),
    },
    {
      key: 'avgResponseTime',
      label: 'Avg Response Time',
      value: responseScore,
      display: vendor.responseTime ?? null,
      prefix: '',
      suffix: '%',
      changePercent: null,
      trendDirection: 'neutral',
      compareLabel: 'response-time rating',
      icon: 'Clock',
      color: '#F59E0B',
      hint: 'Your typical time to answer buyer inquiries.',
      sparkline: [],
    },
    {
      key: 'rfqConversionRate',
      label: 'RFQ Conversion Rate',
      value: convCur,
      prefix: '',
      suffix: '%',
      changePercent: percentageChange(convCur, convPrev),
      trendDirection: 'auto',
      compareLabel: 'vs last 30 days',
      icon: 'Percent',
      color: '#22C55E',
      hint: 'Share of RFQs that turned into orders.',
      sparkline: sparklineFrom(dailyCounts(convertedOrders, 7)),
    },
    {
      key: 'avgOrderValue',
      label: 'Average Order Value',
      value: aovCur,
      prefix: '$',
      suffix: '',
      changePercent: percentageChange(aovCur, aovPrev),
      trendDirection: 'auto',
      compareLabel: 'vs last 30 days',
      icon: 'Receipt',
      color: '#8B5CF6',
      hint: 'Average size of your delivered orders.',
      sparkline: sparklineFrom(dailyAov(paid, 7)),
    },
    {
      key: 'monthlyGrowth',
      label: 'Monthly Growth',
      value: monthlyGrowth,
      prefix: '',
      suffix: '%',
      signed: true,
      changePercent: monthlyGrowth,
      trendDirection: 'auto',
      compareLabel: 'vs last month',
      icon: 'TrendingUp',
      color: '#06B6D4',
      hint: 'No revenue recorded yet.',
      sparkline: sparklineFrom(dailyAmounts(paid, 7)),
    },
    {
      key: 'customerRetention',
      label: 'Customer Retention',
      value: retentionCur,
      prefix: '',
      suffix: '%',
      changePercent: percentageChange(retentionCur, retentionPrev),
      trendDirection: 'auto',
      compareLabel: 'vs last 30 days',
      icon: 'Users',
      color: '#EC4899',
      hint: 'Buyers who order from you again.',
      sparkline: [],
    },
    {
      key: 'returningCustomers',
      label: 'Returning Customers',
      value: returningCur,
      prefix: '',
      suffix: '',
      changePercent: percentageChange(returningCur, returningPrev),
      trendDirection: 'auto',
      compareLabel: 'vs last 30 days',
      icon: 'Repeat',
      color: '#10B981',
      hint: 'Repeat buyers in the current window.',
      sparkline: [],
    },
  ];

  /* "auto" means direction is derived from changePercent by the service. */
  metrics.forEach((m) => {
    if (m.trendDirection !== 'auto') return;
    const c = m.changePercent;
    m.trendDirection = c == null ? 'neutral' : c > 0 ? 'up' : c < 0 ? 'down' : 'flat';
  });

  return {
    periodLabel: 'Trailing 30 days',
    metrics,
  };
}

/* --------------------------- Recent Activity ---------------------------- */

const ORDER_ACTIVITY_TITLES = {
  pending: { title: 'Order placed', status: 'placed' },
  in_progress: { title: 'Order confirmed', status: 'confirmed' },
  shipped: { title: 'Order shipped', status: 'shipped' },
  delivered: { title: 'Order delivered', status: 'delivered' },
  cancelled: { title: 'Order cancelled', status: 'cancelled' },
};

/**
 * Recent vendor events composed from real collections — RFQs (new / quoted),
 * orders, catalog additions, customer reviews and certifications. Newest
 * first. Every field is derived from live documents; nothing is fabricated.
 */
async function buildRecentActivities(vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return [];

  const [rfqs, orders, products] = await Promise.all([
    RFQ.find({}).sort({ createdAt: -1 }).limit(4).populate('buyer', 'name email').lean(),
    Order.find({ vendor: vendor._id })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('buyer', 'name email')
      .lean(),
    Product.find({ vendorId: vendor._id }).sort({ createdAt: -1 }).limit(3).lean(),
  ]);

  const activities = [];

  rfqs.forEach((r) => {
    const status = String(r.status || '').toLowerCase();
    const isQuote = status === 'quoted';
    const qty = Number(r.quantity || 0).toLocaleString();
    activities.push({
      id: `rfq-${String(r._id)}`,
      type: isQuote ? 'quote' : 'rfq',
      title: isQuote ? 'Quote submitted' : 'New RFQ received',
      description: isQuote
        ? `Quotation sent for ${r.product} (${qty} units)`
        : `RFQ for ${r.product} — ${qty} units${r.country ? ` from ${r.country}` : ''}`,
      timestamp: r.createdAt,
      status: isQuote ? 'submitted' : status,
    });
  });

  orders.forEach((o) => {
    const config = ORDER_ACTIVITY_TITLES[o.status] ?? ORDER_ACTIVITY_TITLES.pending;
    const items = (o.items || []).map((i) => i.productName).filter(Boolean).join(', ') || 'Order';
    activities.push({
      id: `order-${String(o._id)}`,
      type: 'order',
      title: config.title,
      description: `${items}${o.buyer?.name ? ` — ${o.buyer.name}` : ''}`,
      timestamp: o.createdAt,
      status: config.status,
    });
  });

  products.forEach((p) => {
    activities.push({
      id: `product-${String(p._id)}`,
      type: 'product',
      title: 'Product added',
      description: `${p.name} listed under ${p.category ?? 'Products'}`,
      timestamp: p.createdAt,
      status: 'listed',
    });
  });

  (vendor.reviews || [])
    .slice()
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 2)
    .forEach((r) => {
      activities.push({
        id: `review-${String(r._id || r.reviewerName)}`,
        type: 'review',
        title: 'Customer review received',
        description: `${r.reviewerName} rated you ${r.rating}/5`,
        timestamp: r.date ?? vendor.updatedAt,
        status: `${r.rating}/5`,
      });
    });

  if ((vendor.certifications || []).length) {
    activities.push({
      id: 'certificate',
      type: 'certificate',
      title: 'Certificate approved',
      description: vendor.certifications.map((c) => c.name).filter(Boolean).join(', '),
      timestamp: vendor.updatedAt,
      status: 'approved',
    });
  }

  return activities
    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
    .slice(0, 8);
}

/* --------------------------- Overview Metrics --------------------------- */

const ACTIVE_ORDER_STATUSES = ['in_progress', 'shipped'];
const NEW_RFQ_STATUSES = ['draft', 'sent', 'pending'];

/** Seven-day per-day series, or [] when the window has no activity at all. */
function sparklineFrom(daily) {
  return Array.isArray(daily) && daily.some((v) => v > 0) ? daily : [];
}

/** Human role label derived from the vendor's verification status (data-driven). */
function vendorRole(status) {
  const map = {
    Verified: 'Verified Vendor',
    Pending: 'Pending Verification',
    Unverified: 'Unverified Vendor',
  };
  return map[status] ?? 'Vendor';
}

function monthStart(now, offsetMonths) {
  return new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
}

function trendEntry(cur, prev) {
  const changePercent = percentageChange(cur, prev);
  if (changePercent == null) {
    return { changePercent: 0, trendDirection: 'neutral' };
  }
  return {
    changePercent,
    trendDirection: changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'flat',
  };
}

/**
 * Phase 1 overview: greeting, current date and four KPI metrics computed
 * from real collections. Metric value semantics map to the actual schemas:
 *   - New RFQs        → status in [draft, sent, pending] (there is no 'new')
 *   - Active Orders   → status in [in_progress, shipped]
 *   - Monthly Revenue → sum of `total` for DELIVERED orders this month
 *                       (the schema has no payment field; delivered = paid)
 *   - Customer Req.   → unread (`read: false`) customer messages
 * Growth compares the current calendar month against the previous one.
 * Sparklines are the real last-7-day series, empty when there is no data.
 */
async function buildOverviewMetrics(vendorId) {
  const vendor = await resolveVendor(vendorId);
  const vid = vendor ? vendor._id : null;

  const [rfqs, orders, requests, unreadNotifications] = await Promise.all([
    RFQ.find({}).lean(),
    vid ? Order.find({ vendor: vid }).lean() : Promise.resolve([]),
    vid ? CustomerRequest.find({ vendor: vid }).lean() : Promise.resolve([]),
    Notification.countDocuments({ read: false }),
  ]);

  const now = new Date();
  const monthStartCur = monthStart(now, 0);
  const monthStartPrev = monthStart(now, -1);
  const monthStartNext = monthStart(now, 1);

  const inRange = (date, start, end) => {
    const time = new Date(date || Date.now()).getTime();
    return time >= start.getTime() && time < end.getTime();
  };

  const status = (doc) => String(doc.status || '').toLowerCase();
  const isPaid = (order) => status(order) === 'delivered';
  const paidOrders = orders.filter(isPaid);

  const newRfqs = rfqs.filter((r) => NEW_RFQ_STATUSES.includes(status(r))).length;
  const activeOrders = orders.filter((o) => ACTIVE_ORDER_STATUSES.includes(status(o))).length;
  const openRequests = requests.filter((r) => !r.read).length;

  const revCur = paidOrders
    .filter((o) => inRange(o.createdAt, monthStartCur, monthStartNext))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const revPrev = paidOrders
    .filter((o) => inRange(o.createdAt, monthStartPrev, monthStartCur))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const countCur = (items) =>
    items.filter((it) => inRange(it.createdAt, monthStartCur, monthStartNext)).length;
  const countPrev = (items) =>
    items.filter((it) => inRange(it.createdAt, monthStartPrev, monthStartCur)).length;

  const hour = now.getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 17) greeting = 'Good Afternoon';

  const metrics = [
    {
      id: 'rfqs',
      title: 'New RFQs',
      value: newRfqs,
      ...trendEntry(countCur(rfqs), countPrev(rfqs)),
      trendLabel: 'vs last month',
      emptyHint: 'Waiting for new RFQs',
      sparkline: sparklineFrom(dailyCounts(rfqs, 7)),
      icon: 'FileQuestion',
      color: '#6C5CE7',
      prefix: '',
    },
    {
      id: 'orders',
      title: 'Active Orders',
      value: activeOrders,
      ...trendEntry(countCur(orders), countPrev(orders)),
      trendLabel: 'vs last month',
      emptyHint: 'No active orders yet',
      sparkline: sparklineFrom(dailyCounts(orders, 7)),
      icon: 'PackageCheck',
      color: '#0EA5E9',
      prefix: '',
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      value: revCur,
      ...trendEntry(revCur, revPrev),
      trendLabel: 'vs last month',
      emptyHint: 'No revenue recorded yet',
      sparkline: sparklineFrom(dailyAmounts(paidOrders, 7)),
      icon: 'DollarSign',
      color: '#22C55E',
      prefix: '$',
    },
    {
      id: 'requests',
      title: 'Customer Requests',
      value: openRequests,
      ...trendEntry(countCur(requests), countPrev(requests)),
      trendLabel: 'vs last month',
      emptyHint: 'No new requests yet',
      sparkline: sparklineFrom(dailyCounts(requests, 7)),
      icon: 'MessageSquarePlus',
      color: '#F59E0B',
      prefix: '',
    },
  ];

  return {
    greeting,
    currentDate: now.toISOString(),
    vendorName: vendor?.name ?? null,
    user: vendor
      ? {
          name: vendor.name,
          role: vendorRole(vendor.verificationStatus),
          avatar: vendor.logo ?? null,
          email: vendor.contact?.email ?? null,
        }
      : null,
    notificationCount: unreadNotifications,
    metrics,
  };
}

/* ------------------------------ Vendor Health ------------------------------ */

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function responseTimeScore(label) {
  const match = String(label || '').match(/(\d+)\s*hours/);
  if (!match) return label ? 90 : null;
  const hours = Number(match[1]);
  if (hours <= 1) return 98;
  if (hours <= 2) return 92;
  if (hours <= 3) return 85;
  if (hours <= 4) return 78;
  return 60;
}

function parseLeadTimeDays(label) {
  const match = String(label || '').match(/(\d+)\s*days?/i);
  return match ? Number(match[1]) : null;
}

async function buildVendorHealth(vendorId) {
  const vendor = await resolveVendor(vendorId);
  const empty = { overallScore: null, metrics: [] };
  if (!vendor) return empty;

  const [orders, products] = await Promise.all([
    Order.find({ vendor: vendor._id }).lean(),
    Product.find({ vendorId: vendor._id }).lean(),
  ]);
  const total = orders.length;
  const delivered = orders.filter((o) => o.status === 'delivered');

  /* Profile Completion — weighted across the profile dimensions the UI tracks:
     company profile, logo, products, certifications, contact details,
     business description, verification. */
  const profileChecks = [
    Boolean(vendor.name && vendor.overview && vendor.location),
    Boolean(vendor.logo),
    products.length > 0,
    (vendor.certifications || []).length > 0,
    Boolean(vendor.contact?.email || vendor.contact?.phone || vendor.contact?.website),
    Boolean(vendor.overview),
    vendor.verificationStatus === 'Verified',
  ];
  const profileFilled = profileChecks.filter(Boolean).length;
  const profileCompletion = Math.round((profileFilled / profileChecks.length) * 100);
  const profileDetail = `${profileFilled} of ${profileChecks.length} profile areas complete`;

  /* On-Time Delivery — delivered orders that completed within the quoted lead time. */
  let lateCount = 0;
  let onTimeRate = null;
  let onTimeDetail = null;
  if (delivered.length > 0) {
    const productIds = [
      ...new Set(
        orders
          .flatMap((o) => o.items || [])
          .map((i) => (i.product ? String(i.product) : null))
          .filter(Boolean),
      ),
    ];
    const productsById =
      productIds.length > 0
        ? await Product.find({ _id: { $in: productIds } }).lean()
        : [];
    const leadMap = new Map(productsById.map((p) => [String(p._id), p.leadTime]));

    delivered.forEach((order) => {
      const created = new Date(order.createdAt).getTime();
      const completed = new Date(order.updatedAt).getTime();
      const leadDays = Math.max(
        0,
        ...(order.items || []).map((item) => {
          const parsed = item.product ? parseLeadTimeDays(leadMap.get(String(item.product))) : null;
          return parsed ?? 0;
        }),
      );
      const allowedMs = leadDays > 0 ? leadDays * 24 * 60 * 60 * 1000 : null;
      if (allowedMs != null && completed - created > allowedMs) lateCount += 1;
    });
    const onTime = delivered.length - lateCount;
    onTimeRate = Math.round((onTime / delivered.length) * 100);
    onTimeDetail = `${onTime} of ${delivered.length} delivered on time`;
  }

  /* Customer Satisfaction — average review score (reviews, else vendor rating). */
  const reviews = vendor.reviews || [];
  const ratingSource = reviews.length
    ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
    : vendor.rating;
  const satisfaction = ratingSource != null ? Math.round((ratingSource / 5) * 100) : null;
  const satisfactionDetail = ratingSource != null ? `${ratingSource.toFixed(1)} / 5` : null;

  /* Order Completion — completed (delivered) vs total orders. */
  const completionRate = total > 0 ? Math.round((delivered.length / total) * 100) : null;
  const completionDetail = total > 0 ? `${delivered.length} of ${total} orders completed` : null;

  return {
    overallScore: vendor.riskBreakdown?.overallScore ?? null,
    metrics: [
      {
        key: 'profileCompletion',
        label: 'Profile Completion',
        value: profileCompletion,
        detail: profileDetail,
      },
      {
        key: 'responseTime',
        label: 'Response Time',
        value: responseTimeScore(vendor.responseTime),
        detail: vendor.responseTime ?? null,
      },
      {
        key: 'onTimeDelivery',
        label: 'On-Time Delivery',
        value: onTimeRate,
        detail: onTimeDetail,
      },
      {
        key: 'satisfaction',
        label: 'Customer Satisfaction',
        value: satisfaction,
        detail: satisfactionDetail,
      },
      {
        key: 'orderCompletion',
        label: 'Order Completion',
        value: completionRate,
        detail: completionDetail,
      },
    ],
  };
}

/* ------------------------------ AI Insights ------------------------------ */

function countRange(items, field, start, end) {
  return (items || []).filter((item) => {
    const t = new Date(item[field] || Date.now()).getTime();
    return t >= start && t < end;
  }).length;
}

/** Human category label per insight type (drives the pastel icon + grouping). */
const INSIGHT_CATEGORY = {
  rfq: 'Demand',
  revenue: 'Revenue',
  category: 'Performance',
  inventory: 'Inventory',
  globe: 'Market',
  clock: 'Response Time',
  message: 'Engagement',
  trend: 'Performance',
};

/** Low / Medium / High priority derived from the computed severity. */
const SEVERITY_TO_PRIORITY = {
  positive: 'low',
  info: 'medium',
  warning: 'high',
};

async function buildInsights(vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return [];

  const vid = vendor._id;
  const [orders, rfqs, requests, products] = await Promise.all([
    Order.find({ vendor: vid }).lean(),
    RFQ.find({}).lean(),
    CustomerRequest.find({ vendor: vid }).lean(),
    Product.find({ vendorId: vid }).lean(),
  ]);

  const insights = [];
  const now = Date.now();

  /* RFQ volume trend — this week vs previous week. */
  if (rfqs.length) {
    const curWeek = countRange(rfqs, 'createdAt', now - WEEK_MS, now);
    const prevWeek = countRange(rfqs, 'createdAt', now - 2 * WEEK_MS, now - WEEK_MS);
    const delta = percentageChange(curWeek, prevWeek);
    if (delta != null && (curWeek > 0 || prevWeek > 0)) {
      insights.push({
        id: 'rfq-trend',
        type: 'rfq',
        severity: delta >= 0 ? 'positive' : 'warning',
        title: delta >= 0 ? 'RFQ activity is trending up' : 'RFQ activity is cooling down',
        message:
          delta >= 0
            ? `You received ${delta}% more RFQs this week than the previous one (${curWeek} total).`
            : `RFQ volume is down ${Math.abs(delta)}% this week (${curWeek} total vs ${prevWeek} last week).`,
      });
    }
  }

  /* Revenue trend — last 30 days vs the 30 days before. */
  if (orders.length) {
    const curRev = orders
      .filter((o) => new Date(o.createdAt).getTime() >= now - THIRTY_DAYS_MS)
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    const prevRev = orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= now - 2 * THIRTY_DAYS_MS && t < now - THIRTY_DAYS_MS;
    }).reduce((sum, o) => sum + Number(o.total || 0), 0);
    const delta = percentageChange(curRev, prevRev);
    if ((curRev > 0 || prevRev > 0) && delta != null) {
      insights.push({
        id: 'revenue-trend',
        type: 'revenue',
        severity: delta >= 0 ? 'positive' : 'warning',
        title: delta >= 0 ? 'Revenue is growing' : 'Revenue slipped recently',
        message:
          delta >= 0
            ? `Last 30 days brought in $${curRev.toLocaleString()} — up ${delta}% from the prior period.`
            : `Last 30 days brought in $${curRev.toLocaleString()} — down ${Math.abs(delta)}% from the prior period.`,
      });
    }
  }

  /* Best performing category — real order revenue when available, otherwise
     the largest slice of the catalog. */
  const productMap = new Map(products.map((p) => [String(p._id), p]));
  const categoryRevenue = new Map();
  let orderBasedCategory = orders.length > 0;
  if (orders.length) {
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const product = item.product ? productMap.get(String(item.product)) : null;
        const category = product ? product.category : null;
        if (!category) return;
        const revenue = Number(item.unitPrice || 0) * Number(item.quantity || 0);
        categoryRevenue.set(category, (categoryRevenue.get(category) || 0) + revenue);
      });
    });
  } else {
    products.forEach((p) => {
      if (!p.category) return;
      categoryRevenue.set(p.category, (categoryRevenue.get(p.category) || 0) + 1);
    });
  }
  let bestCategory = null;
  let bestCategoryValue = 0;
  categoryRevenue.forEach((value, category) => {
    if (value > bestCategoryValue) {
      bestCategoryValue = value;
      bestCategory = category;
    }
  });
  if (bestCategory) {
    insights.push({
      id: 'best-category',
      type: 'category',
      severity: 'info',
      title: `${bestCategory} is your strongest category`,
      message: orderBasedCategory
        ? `This category generated $${bestCategoryValue.toLocaleString()} in confirmed revenue.`
        : `It makes up the largest share of your catalog (${bestCategoryValue} listings).`,
    });
  }

  /* Catalog health — real listing + category counts from the catalog. */
  if (products.length > 0) {
    const categories = new Set(products.map((p) => p.category).filter(Boolean)).size;
    const active = products.filter((p) => p.inStock !== false).length;
    insights.push({
      id: 'catalog-health',
      type: 'category',
      severity: 'info',
      title: `${active} active listing${active === 1 ? '' : 's'} across ${categories} categor${categories === 1 ? 'y' : 'ies'}`,
      message: `Your catalog holds ${products.length} product${products.length === 1 ? '' : 's'}, ${active} of them live and in stock.`, 
    });
  }

  /* Profile strength — completeness of the vendor profile, like Vendor Health. */
  if (vendor) {
    const checks = [
      Boolean(vendor.name && vendor.overview && vendor.location),
      Boolean(vendor.logo),
      products.length > 0,
      (vendor.certifications || []).length > 0,
      Boolean(vendor.contact?.email || vendor.contact?.phone || vendor.contact?.website),
      Boolean(vendor.overview),
      vendor.verificationStatus === 'Verified',
    ];
    const filled = checks.filter(Boolean).length;
    const profilePct = Math.round((filled / checks.length) * 100);
    if (profilePct < 100) {
      insights.push({
        id: 'profile-strength',
        type: 'trend',
        severity: profilePct >= 60 ? 'info' : 'warning',
        title: `Your vendor profile is ${profilePct}% complete`,
        message: `${filled} of ${checks.length} profile areas are filled in — finishing them improves match scores and buyer trust.`,
      });
    }
  }

  /* Response-time rating — derived from the vendor's own response-time label. */
  if (vendor?.responseTime) {
    insights.push({
      id: 'response-time',
      type: 'clock',
      severity: 'info',
      title: `Buyers typically wait ${vendor.responseTime} for your quote`,
      message: 'Faster responses measurably increase RFQ win rates — aim to answer within 24 hours.',
    });
  }

  /* Verification — real verification status drives the badge call-to-action. */
  if (vendor && String(vendor.verificationStatus || '').toLowerCase() !== 'verified') {
    insights.push({
      id: 'verification',
      type: 'trend',
      severity: 'warning',
      title: 'Unlock the Verified badge to win more RFQs',
      message: 'Verified vendors are prioritized in buyer searches and receive more high-value RFQs.',
    });
  }

  /* Pricing snapshot — real price band across the active catalog. */
  if (products.length > 0) {
    const priced = products.filter((p) => Number(p.price) > 0);
    if (priced.length > 0) {
      const prices = priced.map((p) => Number(p.price));
      const low = Math.min(...prices);
      const high = Math.max(...prices);
      insights.push({
        id: 'pricing-snapshot',
        type: 'globe',
        severity: 'info',
        title: `Listings priced from $${low.toLocaleString()} to $${high.toLocaleString()}`,
        message: `Across ${priced.length} priced product${priced.length === 1 ? '' : 's'} in your catalog.`,
      });
    }
  }

  /* Recent catalog additions — real created dates within the last 30 days. */
  if (products.length > 0) {
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    const recent = products.filter((p) => new Date(p.createdAt || Date.now()).getTime() >= cutoff).length;
    if (recent > 0) {
      insights.push({
        id: 'recent-additions',
        type: 'category',
        severity: 'info',
        title: `${recent} product${recent === 1 ? '' : 's'} added in the last 30 days`,
        message: 'Fresh listings keep your catalog visible in buyer searches.',
      });
    }
  }

  /* Inventory suggestion — a listed product running low on stock. */
  const lowStock = products
    .filter((p) => p.inStock !== false)
    .sort((a, b) => Number(a.stockQuantity || 0) - Number(b.stockQuantity || 0))
    .find((p) => Number(p.stockQuantity || 0) < Math.max(10, Number(p.moq || 0) * 5));
  if (lowStock) {
    insights.push({
      id: 'inventory',
      type: 'inventory',
      severity: 'warning',
      title: `Restock ${lowStock.name}`,
      message: `Only ${Number(lowStock.stockQuantity || 0).toLocaleString()} units remain, below the restock threshold for this product.`,
    });
  }

  /* High demand market — most requested country. */
  const countryCounts = new Map();
  rfqs.forEach((r) => {
    if (!r.country) return;
    countryCounts.set(r.country, (countryCounts.get(r.country) || 0) + 1);
  });
  let topCountry = null;
  let topCountryCount = 0;
  countryCounts.forEach((count, country) => {
    if (count > topCountryCount) {
      topCountryCount = count;
      topCountry = country;
    }
  });
  if (topCountry) {
    insights.push({
      id: 'demand-market',
      type: 'globe',
      severity: 'info',
      title: `High demand from ${topCountry}`,
      message: `${topCountryCount} RFQ${topCountryCount === 1 ? '' : 's'} came in from this market. Consider prioritizing it in outreach.`,
    });
  }

  /* Slow response warning — oldest unanswered RFQ waiting too long. */
  const unanswered = rfqs
    .filter((r) => ['sent', 'pending', 'draft'].includes(String(r.status).toLowerCase()))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const oldest = unanswered[0];
  if (oldest) {
    const ageHours = Math.floor((now - new Date(oldest.createdAt).getTime()) / (60 * 60 * 1000));
    if (ageHours >= 48) {
      insights.push({
        id: 'slow-response',
        type: 'clock',
        severity: 'warning',
        title: `A slow response may cost this RFQ`,
        message: `RFQ for "${oldest.product}" has been awaiting your quote for ${ageHours} hours.`,
      });
    }
  }

  /* Unsolicited attention — unanswered customer inquiries. */
  const unreadRequests = requests.filter((r) => !r.read);
  if (unreadRequests.length) {
    insights.push({
      id: 'unread-requests',
      type: 'message',
      severity: 'info',
      title: `${unreadRequests.length} customer message${unreadRequests.length === 1 ? '' : 's'} need a reply`,
      message: 'Timely replies measurably improve buyer trust and win rates.',
    });
  }

  return insights.slice(0, 5).map((insight) => ({
    id: insight.id,
    title: insight.title,
    description: insight.message ?? '',
    category: INSIGHT_CATEGORY[insight.type] ?? 'General',
    priority: SEVERITY_TO_PRIORITY[insight.severity] ?? 'medium',
    icon: insight.type ?? 'trend',
    timestamp: new Date().toISOString(),
  }));
}

/* ------------------------------ Upcoming Tasks ------------------------------ */

const PRIORITY_WEIGHT = { critical: 4, high: 3, medium: 2, low: 1 };

function deadlineSort(a, b) {
  if (a.deadline == null && b.deadline == null) return 0;
  if (a.deadline == null) return 1;
  if (b.deadline == null) return -1;
  return new Date(a.deadline) - new Date(b.deadline);
}

async function buildTasks(vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return [];

  const [rfqs, orders] = await Promise.all([
    RFQ.find({}).lean(),
    Order.find({ vendor: vendor._id }).lean(),
  ]);

  const tasks = [];

  /* Respond to open RFQs (most urgent first). */
  const openRfqs = rfqs
    .filter((r) => ['sent', 'pending', 'draft'].includes(String(r.status).toLowerCase()))
    .sort((a, b) => {
      const weight =
        (PRIORITY_WEIGHT[b.priority] || 1) - (PRIORITY_WEIGHT[a.priority] || 1);
      if (weight !== 0) return weight;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  openRfqs.slice(0, 3).forEach((r) => {
    tasks.push({
      id: `rfq-${String(r._id)}`,
      category: 'rfq',
      title: `Respond to RFQ: ${r.product}`,
      detail: `${r.quantity != null ? Number(r.quantity).toLocaleString() + ' units · ' : ''}${r.country || 'International'} buyer`,
      deadline: r.deliveryDate ?? null,
      priority: r.priority ?? 'medium',
      progress: 0,
    });
  });

  /* Certification that is still missing. */
  const hasIso = (vendor.certifications || []).some((c) =>
    /iso\s*9001|iso\s*14001/i.test(c.name || ''),
  );
  if (!hasIso) {
    tasks.push({
      id: 'cert-iso',
      category: 'cert',
      title: 'Upload ISO Certificate',
      detail: 'Required for Verified badge eligibility',
      deadline: null,
      priority: 'high',
      progress: 0,
    });
  }

  /* Shipments / quotations for in-flight orders. */
  const orderStages = {
    pending: { title: 'Review quotation', progress: 15 },
    in_progress: { title: 'Prepare shipment', progress: 45 },
    shipped: { title: 'Confirm shipment arrival', progress: 80 },
  };
  const inflight = orders
    .filter((o) => orderStages[o.status])
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  inflight.slice(0, 3).forEach((o) => {
    const productNames = (o.items || []).map((i) => i.productName).filter(Boolean).join(', ');
    const stage = orderStages[o.status];
    tasks.push({
      id: `order-${String(o._id)}`,
      category: o.status === 'shipped' ? 'shipment' : 'quotation',
      title: `${stage.title}: ${productNames || 'Order'}`,
      detail: `Order #${String(o._id).slice(-6).toUpperCase()}`,
      deadline: null,
      priority: o.status === 'shipped' ? 'high' : 'medium',
      progress: stage.progress,
    });
  });

  return tasks.sort(deadlineSort).slice(0, 6);
}

/* ---------------------------- Recent Orders ----------------------------- */

async function buildRecentOrders(vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return [];

  const list = await Order.find({ vendor: vendor._id })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('buyer', 'name email')
    .lean();

  return list.map((o) => ({
    id: String(o._id),
    buyerName: o.buyer?.name ?? 'Unknown buyer',
    buyerAvatar: null,
    status: o.status ?? 'pending',
    amount: Number(o.total || 0),
    items: (o.items || []).map((i) => i.productName).filter(Boolean).join(', ') || 'Order',
    date: o.createdAt,
  }));
}

/* ---------------------------- Recent Messages --------------------------- */

async function buildRecentMessages(vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return [];

  const list = await CustomerRequest.find({ vendor: vendor._id })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('buyer', 'name email')
    .lean();

  return list.map((r) => ({
    id: String(r._id),
    customer: r.buyer?.name ?? 'Unknown buyer',
    avatar: null,
    subject: r.subject ?? 'New inquiry',
    preview: r.message ?? '',
    time: r.createdAt,
    unread: !r.read,
  }));
}

/* --------------------------- Recommendations ---------------------------- */

async function buildRecommendations(vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor) return [];

  const vid = vendor._id;
  const [rfqs, orders, requests, products] = await Promise.all([
    RFQ.find({}).lean(),
    Order.find({ vendor: vid }).lean(),
    CustomerRequest.find({ vendor: vid }).lean(),
    Product.find({ vendorId: vid }).lean(),
  ]);

  const recommendations = [];
  const openRfqs = rfqs.filter((r) => ['sent', 'pending', 'draft'].includes(String(r.status).toLowerCase()));
  const highPriority = openRfqs.filter((r) => r.priority === 'high' || r.priority === 'critical');

  if (openRfqs.length) {
    recommendations.push({
      id: 'quote-rfqs',
      type: 'quote',
      title: `Quote ${highPriority.length ? `${highPriority.length} high-priority` : openRfqs.length} open RFQ${openRfqs.length === 1 ? '' : 's'}`,
      description: `Respond faster to win more business. ${openRfqs.length} RFQ${openRfqs.length === 1 ? ' is' : 's are'} awaiting your quotation.`,
      ctaLabel: 'Review RFQs',
    });
  }

  const unread = requests.filter((r) => !r.read);
  if (unread.length) {
    recommendations.push({
      id: 'reply-messages',
      type: 'message',
      title: `Reply to ${unread.length} customer message${unread.length === 1 ? '' : 's'}`,
      description: 'Timely replies build buyer trust and improve your response-time rating.',
      ctaLabel: 'Open inbox',
    });
  }

  const lowStock = products
    .filter((p) => p.inStock !== false)
    .sort((a, b) => Number(a.stockQuantity || 0) - Number(b.stockQuantity || 0))
    .find((p) => Number(p.stockQuantity || 0) < Math.max(10, Number(p.moq || 0) * 5));
  if (lowStock) {
    recommendations.push({
      id: 'restock',
      type: 'inventory',
      title: `Restock ${lowStock.name}`,
      description: `Only ${Number(lowStock.stockQuantity || 0).toLocaleString()} units remain. Replenish before demand outpaces supply.`,
      ctaLabel: 'Manage inventory',
    });
  }

  const hasIso = (vendor.certifications || []).some((c) => /iso\s*9001|iso\s*14001/i.test(c.name || ''));
  if (!hasIso) {
    recommendations.push({
      id: 'certificate',
      type: 'cert',
      title: 'Complete your verification',
      description: 'Upload your ISO certificate to unlock the Verified badge and higher match scores.',
      ctaLabel: 'Upload certificate',
    });
  }

  const cancelled = orders.filter((o) => o.status === 'cancelled').length;
  if (orders.length && cancelled > 0 && cancelled / orders.length > 0.2) {
    recommendations.push({
      id: 'reduce-cancellations',
      type: 'warning',
      title: 'Reduce cancellations',
      description: `${cancelled} of ${orders.length} orders were cancelled. Review capacity and lead times.`,
      ctaLabel: 'View orders',
    });
  }

  return recommendations.slice(0, 4);
}

/* --------------------------- AI Insights Page --------------------------- */

const AI_RANGES = ['7d', '30d', '90d'];

/** Clamp an AI-page range to a supported key (defaults to 30d). */
function aiPageRange(range) {
  return AI_RANGES.includes(range) ? range : '30d';
}

/** Impact level for an opportunity, derived from its real priority label. */
function opportunityImpact(priority) {
  const p = String(priority || '').toLowerCase();
  if (p === 'critical' || p === 'high') return 'high';
  if (p === 'medium') return 'medium';
  return 'low';
}

/** Signed delta phrase for a composed summary ("up 12%" / "down 4%"). */
function formatDelta(pct) {
  if (pct == null) return '';
  return pct >= 0
    ? `, up ${pct}% versus the prior period`
    : `, down ${Math.abs(pct)}% versus the prior period`;
}

/**
 * Per-day "insight signal" counts across the window — new RFQs, orders,
 * customer requests and product listings. This real activity drives the
 * trend chart and the count-card sparklines on the AI Insights page.
 */
function buildActivityTimeline(window, sources) {
  const buckets = new Map();
  for (
    let cursor = new Date(window.start);
    cursor < window.end;
    cursor = advanceBucket(cursor, 'day')
  ) {
    const info = bucketInfo(cursor, 'day');
    buckets.set(info.key, { date: info.key, label: info.label, value: 0 });
  }
  (sources || []).forEach((items) => {
    (items || []).forEach((doc) => {
      const created = new Date(doc.createdAt || Date.now());
      if (created < window.start || created >= window.end) return;
      const bucket = buckets.get(bucketInfo(created, 'day').key);
      if (bucket) bucket.value += 1;
    });
  });
  return Array.from(buckets.values());
}

/**
 * buildAISummary — the single payload for the AI Insights page. Every figure
 * is computed from real collections for the selected range; the executive
 * summary paragraph is composed server-side from those live numbers (a
 * Groq-backed paraphrase is wired up in the next step). Empty collections
 * produce honest empty states, never fabricated values.
 */
async function buildAISummary(vendorOrId, range = '30d') {
  /* The controller resolves the authenticated vendor and passes it in; a raw
     id is accepted too so the builder stays self-contained for other callers. */
  const vendor =
    vendorOrId && typeof vendorOrId === 'object' ? vendorOrId : await resolveVendor(vendorOrId);
  const key = aiPageRange(range);
  const now = new Date();
  const window = performanceWindow(key, now.getTime());

  const empty = {
    generatedAt: now.toISOString(),
    range: key,
    periodLabel: window.label,
    kpis: null,
    summary: { text: null, confidence: null, level: null },
    observations: [],
    trend: { points: [], counts: { total: 0, high: 0, medium: 0, low: 0 } },
    categories: [],
    buyerInterest: [],
    opportunities: [],
    recommendations: [],
    ai: { available: false, reason: 'no_vendor' },
  };
  if (!vendor) return empty;

  const vid = vendor._id;
  const [orders, rfqs, requests, products, quotes] = await Promise.all([
    Order.find({ vendor: vid }).lean(),
    RFQ.find({}).lean(),
    CustomerRequest.find({ vendor: vid }).lean(),
    Product.find({ vendorId: vid }).lean(),
    Quote.find({ vendor: vid }).lean(),
  ]);

  const inWindow = (t) => t >= window.start && t < window.end;
  const created = (doc) => new Date(doc.createdAt || now).getTime();

  /* Revenue in the window vs the previous window (real order totals). */
  const revenueFor = (start, end) =>
    orders
      .filter((o) => created(o) >= start && created(o) < end)
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const revenue = revenueFor(window.start, window.end);
  const prevRevenue = revenueFor(window.prevStart, window.start);
  const revenueDelta = percentageChange(revenue, prevRevenue);

  /* Live insights + recommendations (reused builders — no duplicate logic). */
  const insights = await buildInsights(vid);
  const recommendations = await buildRecommendations(vid);

  /* Activity series + per-day revenue series (both real historical data). */
  const activity = buildActivityTimeline(window, [rfqs, orders, requests, products]);
  const revenueSpark = dailyAmounts(orders, PERFORMANCE_RANGES[key].days);

  /* Open RFQs = the current opportunities, ranked by priority then age. */
  const openRfqs = rfqs
    .filter((r) => ['sent', 'pending', 'draft'].includes(String(r.status).toLowerCase()))
    .sort(
      (a, b) =>
        (PRIORITY_WEIGHT[String(b.priority || 'medium').toLowerCase()] || 2) -
          (PRIORITY_WEIGHT[String(a.priority || 'medium').toLowerCase()] || 2) ||
        new Date(a.createdAt) - new Date(b.createdAt),
    );

  const productMap = new Map(products.map((p) => [String(p._id), p]));
  const opportunities = openRfqs.slice(0, 4).map((rfq) => {
    const product = matchProductName(String(rfq.product || ''), products);
    const price = product ? Number(product.price || 0) : 0;
    const qty = Number(rfq.quantity || 0);
    /* Potential value = requested quantity × the matching catalog price.
       Real data when a price is known, otherwise null. */
    const potentialValue = price > 0 && qty > 0 ? price * qty : null;
    return {
      id: `rfq-${String(rfq._id)}`,
      name: rfq.product ?? 'New RFQ',
      country: rfq.country ?? null,
      quantity: qty,
      priority: rfq.priority ?? 'medium',
      impact: opportunityImpact(rfq.priority),
      potentialValue,
      potentialLabel: potentialValue != null ? fmtMoney(potentialValue) : null,
      ctaLabel: 'View RFQ',
    };
  });

  /* Impact for each live recommendation, derived from the same real signals
     the recommendation builder used. */
  const unread = requests.filter((r) => !r.read);
  const hasIso = (vendor.certifications || []).some((c) =>
    /iso\s*9001|iso\s*14001/i.test(c.name || ''),
  );
  const cancelled = orders.filter((o) => o.status === 'cancelled').length;
  const impactFor = (rec) => {
    switch (rec.id) {
      case 'quote-rfqs':
        return openRfqs.some((r) => opportunityImpact(r.priority) === 'high') ? 'high' : 'medium';
      case 'reply-messages':
        return unread.length > 2 ? 'high' : 'medium';
      case 'restock':
        return 'high';
      case 'certificate':
        return 'medium';
      case 'reduce-cancellations':
        return 'high';
      default:
        return 'medium';
    }
  };
  const enriched = recommendations.map((rec) => ({ ...rec, impact: impactFor(rec) }));

  /* If no open RFQs exist yet, surface the live recommendations as the
     current opportunities so the rail is never empty (still real data). */
  if (!opportunities.length) {
    enriched.slice(0, 4).forEach((rec) => {
      opportunities.push({
        id: `rec-${rec.id}`,
        name: rec.title,
        country: null,
        quantity: null,
        priority: 'medium',
        impact: rec.impact ?? 'medium',
        potentialValue: null,
        potentialLabel: null,
        ctaLabel: rec.ctaLabel ?? 'Take action',
      });
    });
  }

  /* Category revenue share (real order revenue, else catalog counts). */
  const categoryValue = new Map();
  if (orders.length) {
    orders.forEach((o) => {
      if (!inWindow(created(o))) return;
      (o.items || []).forEach((item) => {
        const product = item.product ? productMap.get(String(item.product)) : null;
        const name = product ? product.category : null;
        if (!name) return;
        categoryValue.set(
          name,
          (categoryValue.get(name) || 0) + Number(item.unitPrice || 0) * Number(item.quantity || 0),
        );
      });
    });
  } else {
    products.forEach((p) => {
      if (!p.category || !inWindow(created(p))) return;
      categoryValue.set(p.category, (categoryValue.get(p.category) || 0) + 1);
    });
  }
  const categoryTotal = Array.from(categoryValue.values()).reduce((sum, n) => sum + n, 0);
  const categories = Array.from(categoryValue.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value: Math.round(value),
      percentage: categoryTotal ? Math.round((value / categoryTotal) * 100) : 0,
    }));

  /* Buyer interest — real RFQ country counts within the window. */
  const countryCounts = new Map();
  rfqs.forEach((r) => {
    if (!r.country || !inWindow(created(r))) return;
    countryCounts.set(r.country, (countryCounts.get(r.country) || 0) + 1);
  });
  const buyerTotal = Array.from(countryCounts.values()).reduce((sum, n) => sum + n, 0);
  const buyerInterest = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({
      country,
      count,
      percentage: buyerTotal ? Math.round((count / buyerTotal) * 100) : 0,
    }));

  /* Insight counts by priority (drives the trend card's segmented chips). */
  const priorityCounts = { total: insights.length, high: 0, medium: 0, low: 0 };
  insights.forEach((i) => {
    if (priorityCounts[i.priority] != null) priorityCounts[i.priority] += 1;
  });

  /* Window-level stats shared by the summary, the AI dataset and confidence. */
  const ordersInWindow = orders.filter((o) => inWindow(created(o)));
  const rfqsInWindow = rfqs.filter((r) => inWindow(created(r)));
  const requestsInWindow = requests.filter((r) => inWindow(created(r)));
  const windowRfqIds = new Set(rfqsInWindow.map((r) => String(r._id)));
  const convertedInWindow = ordersInWindow.filter(
    (o) => o.rfq && windowRfqIds.has(String(o.rfq)),
  ).length;
  const conversionRate =
    rfqsInWindow.length > 0 ? Math.round((convertedInWindow / rfqsInWindow.length) * 100) : null;
  const avgOrderValue = ordersInWindow.length ? Math.round(revenue / ordersInWindow.length) : null;
  const quotesOpen = quotes.filter((q) =>
    ['pending', 'submitted', 'under_negotiation'].includes(String(q.status).toLowerCase()),
  ).length;

  /* Top products by revenue within the window (real order lines). */
  const productRevenue = new Map();
  ordersInWindow.forEach((o) => {
    (o.items || []).forEach((item) => {
      const product = item.product ? productMap.get(String(item.product)) : null;
      const name = product ? product.name : null;
      if (!name) return;
      const entry = productRevenue.get(name) || { revenue: 0, units: 0, category: product.category };
      entry.revenue += Number(item.unitPrice || 0) * Number(item.quantity || 0);
      entry.units += Number(item.quantity || 0);
      productRevenue.set(name, entry);
    });
  });
  const topProducts = Array.from(productRevenue.entries())
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([name, entry]) => ({
      name,
      category: entry.category,
      revenue: Math.round(entry.revenue),
      units: entry.units,
    }));

  /* Confidence — blended from data presence, recency, vendor-profile
     completeness, metric breadth and source consistency. */
  const presenceSignals = [
    products.length > 0,
    orders.length > 0,
    rfqs.length > 0,
    requests.length > 0,
    quotes.length > 0,
  ];
  const presence = presenceSignals.filter(Boolean).length / presenceSignals.length;

  const profileChecks = [
    Boolean(vendor.name && vendor.overview && vendor.location),
    Boolean(vendor.logo),
    products.length > 0,
    (vendor.certifications || []).length > 0,
    Boolean(vendor.contact?.email || vendor.contact?.phone || vendor.contact?.website),
    vendor.verificationStatus === 'Verified',
  ];
  const profilePct = (profileChecks.filter(Boolean).length / profileChecks.length) * 100;

  const allDocs = [products, orders, rfqs, requests, quotes];
  const latestTs = Math.max(0, ...allDocs.flatMap((list) => (list.length ? list.map(created) : [])));
  const stalenessDays = (Date.now() - latestTs) / DAY_MS;
  const recency = latestTs > 0 ? Math.max(0, Math.min(1, 1 - stalenessDays / 90)) : 0;

  const breadthSignals = [
    products.length > 0,
    orders.length > 0,
    rfqs.length > 0,
    requests.length > 0,
    quotes.length > 0,
    revenue > 0 || prevRevenue > 0,
    categories.length > 0,
    activity.some((p) => p.value > 0),
    buyerInterest.length > 0,
  ];
  const breadth = breadthSignals.filter(Boolean).length / breadthSignals.length;

  const timestampHealthy = (list) =>
    list.length ? list.filter((d) => created(d) <= Date.now()).length / list.length : 1;
  const ordersWithItems = orders.filter((o) => (o.items || []).length > 0).length;
  const consistency =
    (timestampHealthy(orders) +
      timestampHealthy(rfqs) +
      (orders.length ? ordersWithItems / orders.length : 1)) /
    3;

  const confidence = Math.min(
    95,
    Math.max(
      5,
      Math.round(
        100 * (0.45 * presence + 0.15 * recency + 0.15 * (profilePct / 100) + 0.15 * breadth + 0.1 * consistency),
      ),
    ),
  );
  const confidenceLevel = confidence >= 70 ? 'high' : confidence >= 40 ? 'medium' : 'low';

  /* Executive summary — composed from the live numbers above (the controller
     overlays the Groq-generated text when the AI layer is available). */
  const sentences = [];
  if (vendor.name) sentences.push(`Here's your business snapshot for ${vendor.name}.`);
  if (rfqsInWindow.length > 0)
    sentences.push(
      `${rfqsInWindow.length} new RFQ${rfqsInWindow.length === 1 ? '' : 's'} came in during this period.`,
    );
  if (ordersInWindow.length > 0)
    sentences.push(
      `${ordersInWindow.length} order${ordersInWindow.length === 1 ? '' : 's'} were placed in the same window.`,
    );
  if (revenue > 0)
    sentences.push(`Revenue reached ${fmtMoney(revenue)}${formatDelta(revenueDelta)}.`);
  if (categories.length)
    sentences.push(`${categories[0].name} leads your categories with a ${categories[0].percentage}% share.`);
  if (openRfqs.length)
    sentences.push(
      `${openRfqs.length} open ${openRfqs.length === 1 ? 'opportunity is' : 'opportunities are'} waiting on a quote.`,
    );
  if (insights.length) {
    sentences.push(
      priorityCounts.high > 0
        ? `${priorityCounts.high} high-priority insight${priorityCounts.high === 1 ? '' : 's'} need${priorityCounts.high === 1 ? 's' : ''} your attention.`
        : 'Your recent signals look healthy — no high-priority alerts right now.',
    );
  }
  const text = sentences.length
    ? sentences.join(' ')
    : "There isn't enough activity in this period yet to summarize — new RFQs, orders and inquiries will appear here as they happen.";

  /* Structured, non-sensitive dataset handed to the AI service. No buyer PII,
     addresses or private contact details are included — only business
     aggregates the model needs to reason with. */
  const aiContext = {
    businessName: vendor.name,
    period: {
      periodLabel: window.label,
      newRfqs: rfqsInWindow.length,
      newOrders: ordersInWindow.length,
      newRequests: requestsInWindow.length,
      revenue,
      prevRevenue,
      revenueDelta,
      avgOrderValue,
      conversionRate,
      cancellationRate: orders.length ? Math.round((cancelled / orders.length) * 100) : null,
      openQuotes: quotesOpen,
    },
    totals: {
      products: products.length,
      activeProducts: products.filter((p) => p.inStock !== false).length,
      orders: orders.length,
      rfqs: rfqs.length,
      customerRequests: requests.length,
      quotes: quotes.length,
      openRfqs: openRfqs.length,
      unreadRequests: requests.filter((r) => !r.read).length,
    },
    catalogProfile: {
      country: vendor.country,
      responseTime: vendor.responseTime,
      rating: vendor.rating,
      verification: vendor.verificationStatus,
      certificationNames: (vendor.certifications || []).map((c) => c.name || c.title).filter(Boolean),
      profileCompletePct: Math.round(profilePct),
    },
    topCategories: categories,
    topMarkets: buyerInterest,
    topProducts,
    activitySignals: activity
      .slice(-7)
      .reverse()
      .map((p) => ({ label: p.label, signals: p.value })),
  };

  const payload = {
    generatedAt: now.toISOString(),
    range: key,
    periodLabel: window.label,
    kpis: {
      totalInsights: insights.length,
      highImpact: priorityCounts.high,
      opportunities: openRfqs.length,
      revenueImpact: revenue,
      revenueDelta,
      updatedAt: now.toISOString(),
      spark: {
        activity: activity.map((p) => p.value),
        revenue: revenueSpark,
      },
    },
    summary: { text, confidence, level: confidenceLevel },
    observations: insights.slice(0, 4),
    trend: {
      points: activity,
      counts: priorityCounts,
    },
    categories,
    buyerInterest,
    opportunities,
    recommendations: enriched,
    ai: { available: false, reason: null },
  };

  /* The AI dataset is internal plumbing — non-enumerable so Express JSON
     serialization never leaks it to the frontend. */
  Object.defineProperty(payload, '_aiContext', {
    value: aiContext,
    enumerable: false,
    writable: true,
    configurable: true,
  });

  return payload;
}

/* -------------------- Metric Details & CSV Reports -------------------- */

/** Presentation metadata shared by metric details + CSV exports. */
const METRIC_META = {
  rfqs: { label: 'New RFQs', color: '#6C5CE7', prefix: '', suffix: '' },
  orders: { label: 'Active Orders', color: '#0EA5E9', prefix: '', suffix: '' },
  revenue: { label: 'Monthly Revenue', color: '#22C55E', prefix: '$', suffix: '' },
  requests: { label: 'Customer Requests', color: '#F59E0B', prefix: '', suffix: '' },
  totalProducts: { label: 'Total Products', color: '#6C5CE7', prefix: '', suffix: '' },
  activeProducts: { label: 'Active Products', color: '#0EA5E9', prefix: '', suffix: '' },
  avgResponseTime: { label: 'Avg Response Time', color: '#F59E0B', prefix: '', suffix: '%' },
  rfqConversionRate: { label: 'RFQ Conversion Rate', color: '#22C55E', prefix: '', suffix: '%' },
  avgOrderValue: { label: 'Average Order Value', color: '#8B5CF6', prefix: '$', suffix: '' },
  monthlyGrowth: { label: 'Monthly Growth', color: '#06B6D4', prefix: '', suffix: '%', signed: true },
  customerRetention: { label: 'Customer Retention', color: '#EC4899', prefix: '', suffix: '%' },
  returningCustomers: { label: 'Returning Customers', color: '#10B981', prefix: '', suffix: '' },
};

const STATUS_LABEL = {
  pending: 'Pending',
  draft: 'Draft',
  sent: 'Sent',
  quoted: 'Quoted',
  negotiation: 'Negotiation',
  accepted: 'Accepted',
  completed: 'Completed',
  closed: 'Closed',
  in_progress: 'In Progress',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function statusLabel(status) {
  return STATUS_LABEL[String(status || '').toLowerCase()] ?? String(status || '—');
}

function fmtDate(d) {
  return new Date(d || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtMoney(n) {
  return `$${Number(n || 0).toLocaleString('en-US')}`;
}

function trendFrom(changePercent) {
  if (changePercent == null) return 'neutral';
  return changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'flat';
}

/** All collections needed by metric details + exports, fetched once. */
async function fetchMetricCollections(vendor) {
  const vid = vendor._id;
  const [orders, rfqs, requests, products] = await Promise.all([
    Order.find({ vendor: vid }).populate('buyer', 'name email').lean(),
    RFQ.find({}).populate('buyer', 'name email').lean(),
    CustomerRequest.find({ vendor: vid }).populate('buyer', 'name email').lean(),
    Product.find({ vendorId: vid }).lean(),
  ]);
  return { orders, rfqs, requests, products };
}

/** Daily { label, value } series (oldest → newest) from trailing item counts. */
function dailySeries(items, days = 14) {
  const counts = dailyCounts(items, days);
  const now = new Date();
  return counts.map((value, i) => {
    const d = new Date(now.getTime() - (counts.length - 1 - i) * DAY_MS);
    return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value };
  });
}

/** Daily { label, value } series of summed amounts (oldest → newest). */
function dailyAmountSeries(items, days = 14) {
  const amounts = dailyAmounts(items, days);
  const now = new Date();
  return amounts.map((value, i) => {
    const d = new Date(now.getTime() - (amounts.length - 1 - i) * DAY_MS);
    return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value };
  });
}

/** Monthly summed-amount series, oldest → newest (for revenue/growth trends). */
function monthlyAmountSeries(items, months = 6) {
  const now = new Date();
  const out = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const start = monthStart(now, -i);
    const end = monthStart(now, -i + 1);
    const value = (items || []).reduce((sum, it) => {
      const t = new Date(it.createdAt || now).getTime();
      return t >= start.getTime() && t < end.getTime() ? sum + Number(it.total || 0) : sum;
    }, 0);
    out.push({ label: start.toLocaleDateString('en-US', { month: 'short' }), value });
  }
  return out;
}

/** Monthly average-order-value series, oldest → newest. */
function monthlyAovSeries(items, months = 6) {
  const now = new Date();
  const out = [];
  for (let i = months - 1; i >= 0; i -= 1) {
    const start = monthStart(now, -i);
    const end = monthStart(now, -i + 1);
    const inMonth = (items || []).filter((it) => {
      const t = new Date(it.createdAt || now).getTime();
      return t >= start.getTime() && t < end.getTime();
    });
    const sum = inMonth.reduce((s, it) => s + Number(it.total || 0), 0);
    out.push({
      label: start.toLocaleDateString('en-US', { month: 'short' }),
      value: inMonth.length ? Math.round(sum / inMonth.length) : 0,
    });
  }
  return out;
}

/** Category → count breakdown with a stable pastel-compatible palette. */
function categoryBreakdown(products) {
  const counts = new Map();
  (products || []).forEach((p) => {
    const c = p.category || 'Products';
    counts.set(c, (counts.get(c) || 0) + 1);
  });
  const palette = ['#6C5CE7', '#0EA5E9', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#10B981', '#8B5CF6'];
  return Array.from(counts.entries()).map(([label, value], i) => ({
    label,
    value,
    color: palette[i % palette.length],
  }));
}

/** Buyer → { name, email, count } for populated orders, filtered to 2+ orders. */
function returningBuyers(orders) {
  const counts = new Map();
  (orders || []).forEach((o) => {
    const id = o.buyer ? String(o.buyer._id || o.buyer) : null;
    if (!id) return;
    const entry = counts.get(id) || {
      count: 0,
      name: o.buyer?.name || 'Unknown buyer',
      email: o.buyer?.email || null,
    };
    entry.count += 1;
    counts.set(id, entry);
  });
  return Array.from(counts.values())
    .filter((e) => e.count >= 2)
    .sort((a, b) => b.count - a.count);
}

/** Buyer counts for populated orders (any order count). */
function buyerCounts(orders) {
  const counts = new Map();
  (orders || []).forEach((o) => {
    const id = o.buyer ? String(o.buyer._id || o.buyer) : null;
    if (!id) return;
    counts.set(id, (counts.get(id) || 0) + 1);
  });
  return counts;
}

/**
 * Detailed, metric-specific payload for the card action menu (View Details /
 * Expand). The generic shape — summary chips, a time series, an optional
 * breakdown and a real records list — is computed live from the database
 * for the requested metric. Returns null for unknown keys.
 */
async function buildMetricDetails(key, vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor || !METRIC_META[key]) return null;
  const { orders, rfqs, requests, products } = await fetchMetricCollections(vendor);

  const meta = METRIC_META[key];
  const paid = orders.filter((o) => String(o.status || '').toLowerCase() === 'delivered');
  const activeOrders = orders.filter((o) =>
    ['pending', 'in_progress', 'shipped'].includes(String(o.status || '').toLowerCase()),
  );
  const activeProducts = products.filter((p) => p.inStock !== false);
  const openRfqs = rfqs.filter((r) =>
    ['draft', 'sent', 'pending'].includes(String(r.status || '').toLowerCase()),
  );
  const convertedOrders = paid.filter((o) => o.rfq);
  const now = new Date();
  const nowMs = now.getTime();
  const start30 = new Date(nowMs - THIRTY_DAYS_MS);
  const prev30 = new Date(start30.getTime() - THIRTY_DAYS_MS);
  const monthCur = monthStart(now, 0);
  const monthPrev = monthStart(now, -1);
  const monthNext = monthStart(now, 1);

  const inRange = (date, start, end) => {
    const t = new Date(date || nowMs).getTime();
    return t >= start.getTime() && t < end.getTime();
  };
  const countIn = (list, start, end) => list.filter((it) => inRange(it.createdAt, start, end)).length;
  const revIn = (start, end) =>
    paid.filter((o) => inRange(o.createdAt, start, end)).reduce((s, o) => s + Number(o.total || 0), 0);
  const orderItem = (o) => ({
    title: (o.items || []).map((i) => i.productName).filter(Boolean).join(', ') || 'Order',
    subtitle: o.buyer?.name || 'Unknown buyer',
    meta: fmtMoney(o.total),
    status: statusLabel(o.status),
    date: fmtDate(o.createdAt),
  });

  const base = {
    key,
    label: meta.label,
    color: meta.color,
    prefix: meta.prefix,
    suffix: meta.suffix,
    signed: Boolean(meta.signed),
  };

  switch (key) {
    case 'rfqs': {
      const delta = percentageChange(countIn(rfqs, monthCur, monthNext), countIn(rfqs, monthPrev, monthCur));
      return {
        ...base,
        metric: {
          value: openRfqs.length,
          changePercent: delta,
          trendDirection: trendFrom(delta),
          compareLabel: 'vs last month',
        },
        summary: [
          { label: 'Total RFQs', value: rfqs.length },
          { label: 'Open', value: openRfqs.length },
          { label: 'Quoted', value: rfqs.filter((r) => String(r.status || '').toLowerCase() === 'quoted').length },
        ],
        series: dailySeries(rfqs),
        breakdown: PIPELINE_STAGES.map((s) => ({
          label: s.name,
          value: rfqs.filter((r) => s.statuses.includes(String(r.status || '').toLowerCase())).length,
          color: s.color,
        })),
        items: rfqs.slice(0, 8).map((r) => ({
          title: r.product || 'RFQ',
          subtitle: r.buyer?.name || 'Unknown buyer',
          meta: `${Number(r.quantity || 0).toLocaleString()} units${r.country ? ` · ${r.country}` : ''}`,
          status: statusLabel(r.status),
          date: fmtDate(r.createdAt),
        })),
      };
    }

    case 'orders': {
      const delta = percentageChange(countIn(orders, monthCur, monthNext), countIn(orders, monthPrev, monthCur));
      return {
        ...base,
        metric: {
          value: activeOrders.length,
          changePercent: delta,
          trendDirection: trendFrom(delta),
          compareLabel: 'vs last month',
        },
        summary: [
          { label: 'Active', value: activeOrders.length },
          { label: 'Delivered', value: orders.filter((o) => String(o.status || '').toLowerCase() === 'delivered').length },
          { label: 'Total', value: orders.length },
        ],
        series: dailySeries(orders),
        breakdown: PIPELINE_STAGES.map((s) => ({
          label: s.name,
          value: orders.filter((o) => s.statuses.includes(String(o.status || '').toLowerCase())).length,
          color: s.color,
        })),
        items: activeOrders.slice(0, 8).map(orderItem),
      };
    }

    case 'revenue': {
      const revCur = revIn(monthCur, monthNext);
      const revPrev = revIn(monthPrev, monthCur);
      const delta = percentageChange(revCur, revPrev);
      return {
        ...base,
        metric: {
          value: revCur,
          changePercent: delta,
          trendDirection: trendFrom(delta),
          compareLabel: 'vs last month',
        },
        summary: [
          { label: 'This Month', value: fmtMoney(revCur) },
          { label: 'Last Month', value: fmtMoney(revPrev) },
          { label: '30-Day Total', value: fmtMoney(revIn(start30, now)) },
        ],
        series: dailyAmountSeries(paid, 14),
        breakdown: monthlyAmountSeries(paid, 6),
        items: paid.slice(0, 8).map(orderItem),
      };
    }

    case 'requests': {
      const unread = requests.filter((r) => !r.read);
      const delta = percentageChange(countIn(requests, monthCur, monthNext), countIn(requests, monthPrev, monthCur));
      return {
        ...base,
        metric: {
          value: unread.length,
          changePercent: delta,
          trendDirection: trendFrom(delta),
          compareLabel: 'vs last month',
        },
        summary: [
          { label: 'Unread', value: unread.length },
          { label: 'Total', value: requests.length },
        ],
        series: dailySeries(requests),
        breakdown: [
          { label: 'Unread', value: unread.length, color: '#F59E0B' },
          { label: 'Read', value: requests.length - unread.length, color: '#22C55E' },
        ],
        items: requests.slice(0, 8).map((r) => ({
          title: r.buyer?.name || 'Unknown buyer',
          subtitle: r.message || '',
          meta: r.subject ?? 'New inquiry',
          status: r.read ? 'Read' : 'Unread',
          date: fmtDate(r.createdAt),
        })),
      };
    }

    case 'totalProducts': {
      const delta = percentageChange(
        countIn(products, monthCur, monthNext),
        countIn(products, monthPrev, monthCur),
      );
      return {
        ...base,
        metric: {
          value: products.length,
          changePercent: delta,
          trendDirection: trendFrom(delta),
          compareLabel: 'new listings vs last month',
        },
        summary: [
          { label: 'Total', value: products.length },
          { label: 'Active', value: activeProducts.length },
          { label: 'Added This Month', value: countIn(products, monthCur, monthNext) },
        ],
        series: dailySeries(products),
        breakdown: categoryBreakdown(products),
        items: products.slice(0, 8).map((p) => ({
          title: p.name || 'Product',
          subtitle: p.category || 'Products',
          meta: `${fmtMoney(p.price)} · ${Number(p.stockQuantity || 0).toLocaleString()} in stock`,
          status: p.inStock === false ? 'Out of stock' : 'Active',
          date: fmtDate(p.createdAt),
        })),
      };
    }

    case 'activeProducts': {
      const delta = percentageChange(
        countIn(activeProducts, monthCur, monthNext),
        countIn(activeProducts, monthPrev, monthCur),
      );
      return {
        ...base,
        metric: {
          value: activeProducts.length,
          changePercent: delta,
          trendDirection: trendFrom(delta),
          compareLabel: 'new active vs last month',
        },
        summary: [
          { label: 'Active', value: activeProducts.length },
          { label: 'Out of Stock', value: products.filter((p) => p.inStock === false).length },
          { label: 'Total', value: products.length },
        ],
        series: dailySeries(activeProducts),
        breakdown: categoryBreakdown(activeProducts),
        items: activeProducts.slice(0, 8).map((p) => ({
          title: p.name || 'Product',
          subtitle: p.category || 'Products',
          meta: `${fmtMoney(p.price)} · ${Number(p.stockQuantity || 0).toLocaleString()} in stock`,
          status: 'Active',
          date: fmtDate(p.createdAt),
        })),
      };
    }

    case 'avgResponseTime': {
      const score = responseTimeScore(vendor.responseTime);
      return {
        ...base,
        metric: {
          value: score,
          changePercent: null,
          trendDirection: 'neutral',
          compareLabel: 'response-time rating',
        },
        summary: [
          { label: 'Response Time', value: vendor.responseTime ?? '—' },
          { label: 'Score', value: score != null ? `${score}%` : '—' },
        ],
        series: [],
        breakdown: [],
        items: openRfqs.slice(0, 8).map((r) => ({
          title: r.product || 'RFQ',
          subtitle: r.buyer?.name || 'Unknown buyer',
          meta: `${Math.max(0, Math.floor((nowMs - new Date(r.createdAt || nowMs).getTime()) / 3600000))}h waiting`,
          status: statusLabel(r.status),
          date: fmtDate(r.createdAt),
        })),
      };
    }

    case 'rfqConversionRate': {
      const rfqsCur = rfqs.filter((r) => inRange(r.createdAt, start30, now));
      const rfqIdSet = new Set(rfqsCur.map((r) => String(r._id)));
      const convertedCur = convertedOrders.filter((o) => rfqIdSet.has(String(o.rfq))).length;
      const conv = rfqsCur.length ? Math.round((convertedCur / rfqsCur.length) * 100) : null;
      return {
        ...base,
        metric: {
          value: conv,
          changePercent: null,
          trendDirection: 'neutral',
          compareLabel: 'last 30 days',
        },
        summary: [
          { label: 'Conversion Rate', value: conv != null ? `${conv}%` : '—' },
          { label: 'Converted Orders', value: convertedCur },
          { label: 'RFQs (30d)', value: rfqsCur.length },
        ],
        series: dailySeries(convertedOrders),
        breakdown: PIPELINE_STAGES.map((s) => ({
          label: s.name,
          value: rfqs.filter((r) => s.statuses.includes(String(r.status || '').toLowerCase())).length,
          color: s.color,
        })),
        items: convertedOrders.slice(0, 8).map(orderItem),
      };
    }

    case 'avgOrderValue': {
      const paidCur = paid.filter((o) => inRange(o.createdAt, start30, now));
      const paidPrev = paid.filter((o) => inRange(o.createdAt, prev30, start30));
      const aovCur = paidCur.length
        ? Math.round(paidCur.reduce((s, o) => s + Number(o.total || 0), 0) / paidCur.length)
        : null;
      const aovPrev = paidPrev.length
        ? Math.round(paidPrev.reduce((s, o) => s + Number(o.total || 0), 0) / paidPrev.length)
        : null;
      const delta = percentageChange(aovCur, aovPrev);
      return {
        ...base,
        metric: {
          value: aovCur,
          changePercent: delta,
          trendDirection: trendFrom(delta),
          compareLabel: 'vs previous 30 days',
        },
        summary: [
          { label: '30-Day AOV', value: aovCur != null ? fmtMoney(aovCur) : '—' },
          { label: 'Previous 30 Days', value: aovPrev != null ? fmtMoney(aovPrev) : '—' },
          { label: 'Delivered Orders', value: paidCur.length },
        ],
        series: monthlyAovSeries(paid, 6),
        breakdown: [],
        items: paid.slice(0, 8).map(orderItem),
      };
    }

    case 'monthlyGrowth': {
      const revCur = revIn(monthCur, monthNext);
      const revPrev = revIn(monthPrev, monthCur);
      const growth = revCur > 0 || revPrev > 0 ? percentageChange(revCur, revPrev) : null;
      return {
        ...base,
        metric: {
          value: growth,
          changePercent: growth,
          trendDirection: trendFrom(growth),
          compareLabel: 'vs last month',
        },
        summary: [
          { label: 'This Month', value: fmtMoney(revCur) },
          { label: 'Last Month', value: fmtMoney(revPrev) },
          { label: 'Growth', value: growth != null ? `${growth >= 0 ? '+' : ''}${growth}%` : '—' },
        ],
        series: monthlyAmountSeries(paid, 6),
        breakdown: [],
        items: paid.slice(0, 8).map(orderItem),
      };
    }

    case 'customerRetention': {
      const paidCur = paid.filter((o) => inRange(o.createdAt, start30, now));
      const counts = buyerCounts(paidCur);
      const retention = counts.size
        ? Math.round((Array.from(counts.values()).filter((c) => c >= 2).length / counts.size) * 100)
        : null;
      return {
        ...base,
        metric: {
          value: retention,
          changePercent: null,
          trendDirection: 'neutral',
          compareLabel: 'last 30 days',
        },
        summary: [
          { label: 'Retention', value: retention != null ? `${retention}%` : '—' },
          { label: 'Returning Buyers', value: Array.from(counts.values()).filter((c) => c >= 2).length },
          { label: 'Total Buyers', value: counts.size },
        ],
        series: [],
        breakdown: [],
        items: returningBuyers(paidCur).map((b) => ({
          title: b.name,
          subtitle: b.email || 'No email on file',
          meta: `${b.count} orders`,
          status: 'Returning',
          date: null,
        })),
      };
    }

    case 'returningCustomers': {
      const paidCur = paid.filter((o) => inRange(o.createdAt, start30, now));
      const counts = buyerCounts(paidCur);
      const returning = Array.from(counts.values()).filter((c) => c >= 2).length;
      const retention = counts.size ? Math.round((returning / counts.size) * 100) : null;
      return {
        ...base,
        metric: {
          value: returning,
          changePercent: null,
          trendDirection: 'neutral',
          compareLabel: 'last 30 days',
        },
        summary: [
          { label: 'Returning Buyers', value: returning },
          { label: 'Total Buyers', value: counts.size },
          { label: 'Retention', value: retention != null ? `${retention}%` : '—' },
        ],
        series: [],
        breakdown: [],
        items: returningBuyers(paidCur).map((b) => ({
          title: b.name,
          subtitle: b.email || 'No email on file',
          meta: `${b.count} orders`,
          status: 'Returning',
          date: null,
        })),
      };
    }

    default:
      return null;
  }
}

/**
 * CSV export for a metric, built strictly from real database records.
 * Returns { filename, headers, rows } or null for unknown keys.
 */
async function buildMetricReport(key, vendorId) {
  const vendor = await resolveVendor(vendorId);
  if (!vendor || !METRIC_META[key]) return null;
  const { orders, rfqs, requests, products } = await fetchMetricCollections(vendor);

  const paid = orders.filter((o) => String(o.status || '').toLowerCase() === 'delivered');
  const activeProducts = products.filter((p) => p.inStock !== false);
  const convertedOrders = paid.filter((o) => o.rfq);
  const openRfqs = rfqs.filter((r) =>
    ['draft', 'sent', 'pending'].includes(String(r.status || '').toLowerCase()),
  );
  const orderCells = (o) => [
    (o.items || []).map((i) => i.productName).filter(Boolean).join(', '),
    o.buyer?.name || '',
    Number(o.total || 0),
    fmtDate(o.createdAt),
  ];

  switch (key) {
    case 'rfqs':
      return {
        filename: 'rfqs-report.csv',
        headers: ['Product', 'Buyer', 'Quantity', 'Country', 'Status', 'Created'],
        rows: rfqs.map((r) => [
          r.product || '',
          r.buyer?.name || '',
          r.quantity ?? 0,
          r.country || '',
          statusLabel(r.status),
          fmtDate(r.createdAt),
        ]),
      };

    case 'orders':
      return {
        filename: 'active-orders-report.csv',
        headers: ['Items', 'Buyer', 'Status', 'Total (USD)', 'Created'],
        rows: orders.map((o) => [
          (o.items || []).map((i) => i.productName).filter(Boolean).join(', '),
          o.buyer?.name || '',
          statusLabel(o.status),
          Number(o.total || 0),
          fmtDate(o.createdAt),
        ]),
      };

    case 'revenue':
      return {
        filename: 'revenue-report.csv',
        headers: ['Date', 'Revenue (USD)'],
        rows: dailyAmountSeries(paid, 30).map((p) => [p.label, p.value]),
      };

    case 'requests':
      return {
        filename: 'customer-requests-report.csv',
        headers: ['Buyer', 'Message', 'Status', 'Created'],
        rows: requests.map((r) => [
          r.buyer?.name || '',
          r.message || '',
          r.read ? 'Read' : 'Unread',
          fmtDate(r.createdAt),
        ]),
      };

    case 'totalProducts':
    case 'activeProducts': {
      const list = key === 'totalProducts' ? products : activeProducts;
      return {
        filename: `${key}-report.csv`,
        headers: ['Name', 'Category', 'Price (USD)', 'Stock', 'Status', 'Created'],
        rows: list.map((p) => [
          p.name || '',
          p.category || '',
          Number(p.price || 0),
          Number(p.stockQuantity || 0),
          p.inStock === false ? 'Out of stock' : 'Active',
          fmtDate(p.createdAt),
        ]),
      };
    }

    case 'avgResponseTime': {
      const nowMs = Date.now();
      return {
        filename: 'response-time-report.csv',
        headers: ['RFQ', 'Status', 'Waiting (hours)', 'Created'],
        rows: openRfqs.map((r) => [
          r.product || '',
          statusLabel(r.status),
          Math.max(0, Math.floor((nowMs - new Date(r.createdAt || nowMs).getTime()) / 3600000)),
          fmtDate(r.createdAt),
        ]),
      };
    }

    case 'rfqConversionRate':
      return {
        filename: 'rfq-conversion-report.csv',
        headers: ['Buyer', 'Items', 'Total (USD)', 'Created'],
        rows: convertedOrders.map((o) => [
          o.buyer?.name || '',
          (o.items || []).map((i) => i.productName).filter(Boolean).join(', '),
          Number(o.total || 0),
          fmtDate(o.createdAt),
        ]),
      };

    case 'avgOrderValue':
    case 'monthlyGrowth':
      return {
        filename: `${key}-report.csv`,
        headers: ['Items', 'Buyer', 'Order Total (USD)', 'Created'],
        rows: paid.map(orderCells),
      };

    case 'customerRetention':
    case 'returningCustomers':
      return {
        filename: `${key}-report.csv`,
        headers: ['Buyer', 'Email', 'Orders'],
        rows: returningBuyers(paid).map((b) => [b.name, b.email || '', b.count]),
      };

    default:
      return null;
  }
}

/** RFC-4180-style CSV serializer (hand-rolled — no extra dependency). */
function serializeCsv(headers, rows) {
  const escape = (value) => {
    const s = value == null ? '' : String(value);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers, ...(rows || [])].map((r) => r.map(escape).join(',')).join('\r\n');
}

module.exports = {
  resolveVendor,
  resolveVendorForRequest,
  buildOverview,
  buildOverviewMetrics,
  buildAnalytics,
  buildRfqs,
  buildCustomerRequests,
  buildProductPerformance,
  buildNotifications,
  buildAdvancedAnalytics,
  buildRecentActivities,
  buildVendorHealth,
  buildInsights,
  buildTasks,
  buildRecentOrders,
  buildRecentMessages,
  buildRecommendations,
  buildAISummary,
  buildMetricDetails,
  buildMetricReport,
  serializeCsv,
};