const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAnalytics,
  getOrders,
  getRfqs,
  getMessages,
  getInsights,
  getRecommendations,
} = require('../controllers/vendorDashboardController');

// Vendor Dashboard REST endpoints (Module 3)
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/orders', getOrders);
router.get('/rfqs', getRfqs);
router.get('/messages', getMessages);
router.get('/insights', getInsights);
router.get('/recommendations', getRecommendations);

module.exports = router;
