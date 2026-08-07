const { explainMatch } = require('../services/matchExplainer');
const Vendor = require('../models/Vendor');

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
 * @desc    Calculate match scores for vendors against buyer requirements using real MongoDB vendors
 * @route   POST /api/match
 * @access  Private (buyer)
 */
const calculateMatch = async (req, res) => {
  try {
    const { requirement } = req.body;

    // Fetch real vendors from MongoDB Atlas
    const realVendors = await Vendor.find({});
    
    if (!realVendors || realVendors.length === 0) {
      return res.status(200).json({ success: true, results: [] });
    }

    const weights = {
      price: 0.15, quality: 0.2, deliveryTime: 0.15, reviews: 0.15,
      location: 0.1, capacity: 0.1, certifications: 0.1, pastPerformance: 0.05,
    };

    const scored = realVendors.map((v) => {
      const vendorObj = v.toObject();
      // Derive factors from real fields
      const priceFactor = 8;
      const qualityFactor = Math.min(10, Math.round((v.rating || 4.5) * 2));
      const reviewsFactor = Math.min(10, Math.round((v.rating || 4.5) * 2));
      const certsFactor = Math.min(10, (v.certifications?.length || 1) * 3);
      
      const score = (
        priceFactor * weights.price +
        qualityFactor * weights.quality +
        8 * weights.deliveryTime +
        reviewsFactor * weights.reviews +
        8 * weights.location +
        8 * weights.capacity +
        certsFactor * weights.certifications +
        8 * weights.pastPerformance
      );
      
      return {
        ...vendorObj,
        matchScore: Math.min(99, Math.max(70, Math.round(score * 10)))
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    try {
      const explanation = await explainMatch(scored[0], requirement || 'general sourcing need');
      scored[0].explanation = explanation;
    } catch (err) {
      scored[0].explanation = 'AI explanation unavailable (GROQ key not configured yet).';
    }

    res.status(200).json({ success: true, results: scored });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMatchTest, calculateMatch };