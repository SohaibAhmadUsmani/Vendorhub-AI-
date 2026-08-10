const express = require('express');
const router = express.Router();
const {
  getAnalyticsTest,
  getBuyerAnalytics,
  getVendorAnalytics,
  getDashboardAnalytics,
} = require('../controllers/analyticsController');

router.get('/test', getAnalyticsTest);
router.get('/buyer', getBuyerAnalytics);
router.get('/vendor', getVendorAnalytics);
router.get('/dashboard', getDashboardAnalytics);

module.exports = router;