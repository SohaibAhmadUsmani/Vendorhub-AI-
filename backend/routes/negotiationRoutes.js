const express = require('express');
const router = express.Router();
const {
  getNegotiationTest,
  generateNegotiationDraft,
  getNegotiationByQuote,
} = require('../controllers/negotiationController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

// Module 10 — AI Negotiation Assistant Routes
router.get('/test', getNegotiationTest);
router.post('/generate', authMiddleware, roleMiddleware('buyer'), generateNegotiationDraft);
router.get('/quote/:quoteId', authMiddleware, getNegotiationByQuote);

module.exports = router;
