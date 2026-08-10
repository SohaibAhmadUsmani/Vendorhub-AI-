const express = require("express");

const {
  analyzeRisk,
} = require("../controllers/riskAnalysisController");

const router = express.Router();

// Analyze vendor risk
router.get("/:vendorId", analyzeRisk);

module.exports = router;