const dashboardService = require('../services/dashboardService');

/**
 * Vendor Dashboard controller (Module 3).
 * Each handler aggregates live data — loading/empty/error handled on the UI.
 */

const getOverview = async (req, res) => {
  try {
    const data = await dashboardService.buildOverview(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/dashboard/overview — greeting + current date + four KPI metrics. */
const getOverviewMetrics = async (req, res) => {
  try {
    const data = await dashboardService.buildOverviewMetrics(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const data = await dashboardService.buildAnalytics(req.query.vendorId, req.query.range);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRfqs = async (req, res) => {
  try {
    const data = await dashboardService.buildRfqs();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomerRequests = async (req, res) => {
  try {
    const data = await dashboardService.buildCustomerRequests(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductPerformance = async (req, res) => {
  try {
    const data = await dashboardService.buildProductPerformance(req.query.vendorId, req.query.range);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const data = await dashboardService.buildNotifications();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdvancedAnalytics = async (req, res) => {
  try {
    const data = await dashboardService.buildAdvancedAnalytics(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const data = await dashboardService.buildRecentActivities(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInsights = async (req, res) => {
  try {
    const data = await dashboardService.buildInsights(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVendorHealth = async (req, res) => {
  try {
    const data = await dashboardService.buildVendorHealth(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const data = await dashboardService.buildTasks(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** GET /api/vendor/dashboard/metric-details/:key — live detail payload for one metric. */
const getMetricDetails = async (req, res) => {
  try {
    const data = await dashboardService.buildMetricDetails(req.params.key, req.query.vendorId);
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
    const report = await dashboardService.buildMetricReport(req.params.key, req.query.vendorId);
    if (!report) {
      return res.status(404).json({ success: false, message: `Unknown metric: ${req.params.key}` });
    }
    const csv = dashboardService.serializeCsv(report.headers, report.rows);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
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
  getAdvancedAnalytics,
  getRecentActivity,
  getInsights,
  getVendorHealth,
  getTasks,
  getMetricDetails,
  getMetricExport,
};