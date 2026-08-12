const dashboardService = require('../services/dashboardService');
const aiInsightService = require('../services/aiInsightService');
const Notification = require('../models/Notification');

/**
 * Vendor Dashboard controller (Module 3).
 * Each handler aggregates live data — loading/empty/error handled on the UI.
 */

const getVendorIdForRequest = async (req) => {
  if (req.user && req.user.role === 'admin') return 'admin';
  const vendor = await dashboardService.resolveVendorForRequest(req);
  return vendor ? vendor._id : null;
};

const getOverview = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildOverview(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/dashboard/overview — greeting + current date + four KPI metrics. */
const getOverviewMetrics = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildOverviewMetrics(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildAnalytics(vendorId, req.query.range);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRfqs = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildRfqs(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomerRequests = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildCustomerRequests(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductPerformance = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildProductPerformance(vendorId, req.query.range);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildNotifications(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    req.app.get('notificationIo')?.to('vendorhub:notifications').emit('vendorhub:notification:deleted', {
      id: String(req.params.id),
    });

    return res.status(200).json({ success: true, data: { id: String(req.params.id) } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    req.app.get('notificationIo')?.to('vendorhub:notifications').emit('vendorhub:notification:updated', {
      id: String(notification._id),
      unread: false,
      read: true,
    });

    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const result = await Notification.updateMany({ vendor: vendorId, read: false }, { read: true });
    req.app.get('notificationIo')?.to('vendorhub:notifications').emit('vendorhub:notifications:updated', {
      unreadCount: 0,
      count: result.modifiedCount,
    });
    return res.status(200).json({ success: true, data: { count: result.modifiedCount } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAdvancedAnalytics = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildAdvancedAnalytics(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildRecentActivity(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInsights = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildInsights(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVendorHealth = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildVendorHealth(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const data = await dashboardService.buildTasks(vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Map Groq's structured output onto the payload shapes the dashboard UI
 * renders. Each AI item gets a stable id, a priority (from impact), a Lucide
 * icon key and a timestamp, mirroring the deterministic builders.
 */

const AI_CATEGORY_ICON = {
  Demand: 'rfq',
  Revenue: 'revenue',
  Performance: 'category',
  Inventory: 'inventory',
  Market: 'globe',
  'Response Time': 'clock',
  Engagement: 'message',
};

const AI_REC_TYPE = {
  pricing: 'warning',
  'product descriptions': 'warning',
  'product images': 'warning',
  'product availability': 'inventory',
  'response time': 'warning',
  certifications: 'cert',
  'category expansion': 'warning',
  'international market': 'globe',
  'RFQ conversion': 'quote',
  'customer engagement': 'message',
};

function money(label) {
  return `$${Number(label || 0).toLocaleString('en-US')}`;
}

function mapAIInsights(items, generatedAt) {
  return (items || []).map((item, index) => ({
    id: `ai-${index}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}`,
    title: item.title,
    description: item.description ?? item.supportingMetric ?? '',
    category: item.category ?? 'Performance',
    priority: item.impact ?? 'medium',
    icon: AI_CATEGORY_ICON[item.category] ?? 'trend',
    timestamp: generatedAt,
  }));
}

function mapAIOpportunities(items, generatedAt) {
  return (items || []).map((item, index) => ({
    id: `ai-opp-${index}`,
    name: item.title,
    description: item.explanation ?? '',
    country: null,
    quantity: null,
    priority: item.impact ?? 'medium',
    impact: item.impact ?? 'medium',
    potentialValue: item.estimatedRevenue,
    potentialLabel: item.estimatedRevenue != null ? money(item.estimatedRevenue) : null,
    ctaLabel: 'Review',
    timestamp: generatedAt,
  }));
}

function mapAIRecommendations(items, generatedAt) {
  return (items || []).map((item, index) => ({
    id: `ai-rec-${index}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}`,
    type: AI_REC_TYPE[item.category] ?? 'warning',
    title: item.title,
    description: item.description ?? '',
    impact: item.impact ?? 'medium',
    ctaLabel: item.actionLabel ?? 'Take action',
    timestamp: generatedAt,
  }));
}

/**
 * GET /api/vendor/dashboard/ai-insights — full AI Insights page payload.
 *
 * Pipeline: resolve the authenticated vendor → compute deterministic
 * analytics from the database → feed a structured, non-sensitive dataset to
 * Groq for the AI summary/insights/opportunities/recommendations → validate
 * + cache the AI output → merge over the deterministic fallbacks. If the AI
 * layer is unavailable the page still renders every deterministic value.
 */
const getAISummary = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    // Let dashboardService fetch vendor internally if needed, or pass isGlobal
    // Wait, buildAISummary takes 'vendor' object natively?
    // Let's pass vendorId to it and modify buildAISummary to handle vendorId
    let vendor = null;
    if (vendorId !== 'admin') {
       vendor = await dashboardService.resolveVendor(vendorId);
    }
    const data = await dashboardService.buildAISummary(vendor, req.query.range);

    if (data.kpis) {
      const refresh = req.query.refresh === '1' || req.query.refresh === 'true';
      const ai = await aiInsightService.generateAIInsights(
        vendor,
        data.range,
        data._aiContext,
        { refresh },
      );

      if (ai.available) {
        if (typeof ai.payload.summary === 'string' && ai.payload.summary.trim()) {
          data.summary.text = ai.payload.summary;
        }
        if (Array.isArray(ai.payload.keyInsights) && ai.payload.keyInsights.length) {
          data.observations = mapAIInsights(ai.payload.keyInsights, ai.generatedAt);
        }
        if (Array.isArray(ai.payload.opportunities) && ai.payload.opportunities.length) {
          data.opportunities = mapAIOpportunities(ai.payload.opportunities, ai.generatedAt);
        }
        if (Array.isArray(ai.payload.recommendations) && ai.payload.recommendations.length) {
          data.recommendations = mapAIRecommendations(ai.payload.recommendations, ai.generatedAt);
        }
        data.generatedAt = ai.generatedAt;
      }

      /* Keep the KPI + segmented counts consistent with what is displayed. */
      const byPriority = (p) => data.observations.filter((o) => o.priority === p).length;
      data.kpis.totalInsights = data.observations.length;
      data.kpis.highImpact = byPriority('high');
      data.trend.counts = {
        total: data.observations.length,
        high: byPriority('high'),
        medium: byPriority('medium'),
        low: byPriority('low'),
      };

      data.ai = {
        available: ai.available,
        reason: ai.reason ?? null,
        cached: Boolean(ai.cached),
        generatedAt: ai.generatedAt ?? data.generatedAt,
      };
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/vendor/dashboard/metric-details/:key — live detail payload for one metric. */
const getMetricDetails = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const { key } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const data = await dashboardService.buildMetricDetails(vendorId, key, page, limit);
    if (!data) {
      return res.status(404).json({ success: false, message: `Unknown metric: ${req.params.key}` });
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/vendor/dashboard/metric-export/:key — real-record CSV download. */
const getMetricExport = async (req, res) => {
  try {
    const vendorId = await getVendorIdForRequest(req);
    const { key } = req.params;
    const report = await dashboardService.buildMetricReport(key, vendorId);
    if (!report) {
      return res.status(404).json({ success: false, message: `Unknown metric: ${key}` });
    }
    const csv = dashboardService.serializeCsv(report.headers, report.rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOverview,
  getOverviewMetrics,
  getAnalytics,
  getRfqs,
  getCustomerRequests,
  getProductPerformance,
  getNotifications,
  deleteNotification,
  markNotificationRead,
  markAllNotificationsRead,
  getAdvancedAnalytics,
  getRecentActivity,
  getInsights,
  getVendorHealth,
  getTasks,
  getAISummary,
  getMetricDetails,
  getMetricExport,
};