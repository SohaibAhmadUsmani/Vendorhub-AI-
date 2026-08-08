const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/dashboardController');

// Module 3 — Vendor Dashboard routes
router.get('/overview', getOverview);
router.get('/analytics', getAnalytics);
router.get('/rfqs', getRfqs);
router.get('/customer-requests', getCustomerRequests);
router.get('/product-performance', getProductPerformance);
router.get('/notifications', getNotifications);
router.get('/advanced-analytics', getAdvancedAnalytics);
router.get('/recent-activity', getRecentActivity);
router.get('/insights', getInsights);
router.get('/vendor-health', getVendorHealth);
router.get('/tasks', getTasks);
router.get('/metric-details/:key', getMetricDetails);
router.get('/metric-export/:key', getMetricExport);

// Phase 1 — Dashboard Overview module (mounted separately at /api/dashboard)
const overviewRouter = express.Router();
overviewRouter.get('/overview', getOverviewMetrics);

module.exports = router;
module.exports.overviewRouter = overviewRouter;