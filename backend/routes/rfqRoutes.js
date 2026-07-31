const express = require('express');
const router = express.Router();
const { getRfqTest, createRFQ } = require('../controllers/rfqController');

// Module 8 — RFQ Generator Routes
router.get('/test', getRfqTest);
router.post('/', createRFQ);

module.exports = router;