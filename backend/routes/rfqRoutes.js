const express = require('express');
const router = express.Router();
const { getRfqTest, createRFQ, exportRFQPdf } = require('../controllers/rfqController');

// Module 8 — RFQ Generator Routes
router.get('/test', getRfqTest);
router.post('/', createRFQ);
router.post('/export-pdf', exportRFQPdf);

module.exports = router;