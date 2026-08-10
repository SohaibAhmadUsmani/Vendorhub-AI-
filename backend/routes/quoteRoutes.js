const express = require('express');
const router = express.Router();
const {
  getQuoteTest,
  createQuote,
  getQuotesByRFQ,
  getQuoteById,
  acceptQuote,
  rejectQuote,
} = require('../controllers/quoteController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Module 9 — Quote Comparison Routes
router.get('/test', getQuoteTest);
router.post('/', authMiddleware, roleMiddleware('vendor'), createQuote);
router.get('/rfq/:rfqId', authMiddleware, getQuotesByRFQ);
router.get('/:id', authMiddleware, getQuoteById);
router.patch('/:id/accept', authMiddleware, roleMiddleware('buyer'), acceptQuote);
router.patch('/:id/reject', authMiddleware, roleMiddleware('buyer'), rejectQuote);

module.exports = router;
