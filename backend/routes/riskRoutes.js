const express = require("express");

const {
  analyzeRisk,
  analyzeAllRisks,
} = require("../controllers/riskController");

const router = express.Router();

// Analyze all vendors (summary list)
router.get("/", analyzeAllRisks);

// Analyze a single vendor
router.get("/:vendorId", analyzeRisk);

module.exports = router;
