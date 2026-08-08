const dashboardService = require('../services/dashboardService');

/**
 * Vendor Dashboard REST API (Module 3, Prompt 1 rebuild).
 * One thin handler per endpoint; all aggregation lives in the service layer.
 */

const wrap = (fn) => async (req, res) => {
  try {
    const data = await fn(req.query.vendorId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboard = wrap(dashboardService.buildOverview);
const getAnalytics = async (req, res) => {
  try {
    const data = await dashboardService.buildAnalytics(req.query.vendorId, req.query.range);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getOrders = wrap(dashboardService.buildRecentOrders);
const getRfqs = async (req, res) => {
  try {
    const data = await dashboardService.buildRfqs(req.query);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getMessages = wrap(dashboardService.buildRecentMessages);
const getInsights = wrap(dashboardService.buildInsights);
const getRecommendations = wrap(dashboardService.buildRecommendations);

module.exports = {
  getDashboard,
  getAnalytics,
  getOrders,
  getRfqs,
  getMessages,
  getInsights,
  getRecommendations,
};
