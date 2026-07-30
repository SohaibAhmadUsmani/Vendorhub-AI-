const express = require('express');
const router = express.Router();
const { getProductTest } = require('../controllers/productController');

// Module 6 — Product Catalog Routes
router.get('/test', getProductTest);

module.exports = router;
