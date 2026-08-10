const express = require('express');
const router = express.Router();
const { getRfqTest, createRFQ, exportRFQPdf } = require('../controllers/rfqController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Module 8 — RFQ Generator Routes
router.get('/test', getRfqTest);
router.post('/', authMiddleware, createRFQ);
router.post('/export-pdf', exportRFQPdf);

module.exports = router;