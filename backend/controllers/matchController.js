const { explainMatch } = require('../services/matchExplainer');

/**
 * @desc    Test Matching Route
 * @route   GET /api/match/test
 * @access  Public
 */
const getMatchTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Vendor Matching API endpoint is active (Module 7)',
    timestamp: new Date().toISOString(),
  });
};

/**
 * @desc    Calculate match scores for vendors against buyer requirements
 * @route   POST /api/match
 * @access  Private (buyer)
 *
 * Day 3: uses mock vendor data (Vendor model not merged yet — coordinate with Muzammil)
 * Top vendor gets an AI-generated explanation via GROQ (falls back gracefully if key missing)
 */
const calculateMatch = async (req, res) => {
  const { requirement } = req.body;

  const mockVendors = [
    { id: 1, name: 'Vendor A', price: 8, quality: 9, deliveryTime: 7, reviews: 9, location: 9, capacity: 8, certifications: 10, pastPerformance: 8 },
    { id: 2, name: 'Vendor B', price: 6, quality: 8, deliveryTime: 9, reviews: 7, location: 6, capacity: 9, certifications: 7, pastPerformance: 9 },
  ];

  const weights = {
    price: 0.15, quality: 0.2, deliveryTime: 0.15, reviews: 0.15,
    location: 0.1, capacity: 0.1, certifications: 0.1, pastPerformance: 0.05,
  };

  const scored = mockVendors.map((v) => {
    const score = Object.keys(weights).reduce((sum, key) => sum + v[key] * weights[key], 0);
    return { ...v, matchScore: Math.round(score * 10) };
  }).sort((a, b) => b.matchScore - a.matchScore);

  try {
    const explanation = await explainMatch(scored[0], requirement || 'general sourcing need');
    scored[0].explanation = explanation;
  } catch (err) {
    scored[0].explanation = 'AI explanation unavailable (GROQ key not configured yet).';
  }

  res.status(200).json({ success: true, results: scored });
};

module.exports = { getMatchTest, calculateMatch };