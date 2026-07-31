const express = require('express');
const router = express.Router();
const { getMatchTest, calculateMatch } = require('../controllers/matchController');

// Module 7 — AI Vendor Matching Routes
router.get('/test', getMatchTest);
router.post('/', calculateMatch);

module.exports = router;