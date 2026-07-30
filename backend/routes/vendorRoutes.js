const express = require('express');
const router = express.Router();
const { getVendorTest } = require('../controllers/vendorController');

// Module 5 — Vendor Profiles Routes
router.get('/test', getVendorTest);

module.exports = router;
