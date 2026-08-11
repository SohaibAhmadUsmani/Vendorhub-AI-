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
  deleteNotification,
  markNotificationRead,
  markAllNotificationsRead,
  getAdvancedAnalytics,
  getRecentActivity,
  getInsights,
  getVendorHealth,
  getTasks,
  getMetricDetails,
  getMetricExport,
  getAISummary,
} = require('../controllers/dashboardController');

// Module 3 — Vendor Dashboard routes
router.get('/overview', getOverview);
router.get('/analytics', getAnalytics);
router.get('/rfqs', getRfqs);
router.get('/customer-requests', getCustomerRequests);
router.get('/product-performance', getProductPerformance);
router.get('/notifications', getNotifications);
router.delete('/notifications/:id', deleteNotification);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.get('/advanced-analytics', getAdvancedAnalytics);
router.get('/recent-activity', getRecentActivity);
router.get('/insights', getInsights);
router.get('/vendor-health', getVendorHealth);
router.get('/tasks', getTasks);
router.get('/ai-insights', getAISummary);
router.get('/metric-details/:key', getMetricDetails);
router.get('/metric-export/:key', getMetricExport);

// Phase 1 — Dashboard Overview module (mounted separately at /api/dashboard)
const overviewRouter = express.Router();
overviewRouter.get('/overview', getOverviewMetrics);

module.exports = router;
module.exports.overviewRouter = overviewRouter;