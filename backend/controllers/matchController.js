const { groqChat } = require('../services/groqClient');
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

    const vendorData = realVendors.map(v => ({
      id: v._id.toString(),
      name: v.name,
      rating: v.rating,
      certifications: v.certifications,
      location: v.location,
      overview: v.overview
    }));

    const prompt = `You are a B2B sourcing expert.
Requirement: "${requirement || 'general sourcing need'}"

Vendors available:
${JSON.stringify(vendorData, null, 2)}

Analyze the vendors against the requirement. Rank them by giving a matchScore (0-100) and a brief 1-2 sentence explanation of why they match or don't match.
Return ONLY a JSON object with a "results" array containing objects with "id", "matchScore", and "explanation".`;

    let aiResults = [];
    try {
      const response = await groqChat(
        [{ role: 'user', content: prompt }],
        { model: 'llama-3.3-70b-versatile', temperature: 0.2, response_format: { type: 'json_object' } }
      );
      const parsed = JSON.parse(response);
      aiResults = parsed.results || [];
    } catch (err) {
      console.error('Groq matching failed:', err);
      // Fallback to basic scoring if AI fails
      aiResults = realVendors.map(v => ({
        id: v._id.toString(),
        matchScore: 75,
        explanation: 'AI ranking unavailable, fallback score applied.'
      }));
    }

    const scored = realVendors.map((v) => {
      const aiData = aiResults.find(r => r.id === v._id.toString()) || { matchScore: 70, explanation: 'Unscored' };
      return {
        ...v.toObject(),
        matchScore: aiData.matchScore,
        explanation: aiData.explanation
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ success: true, results: scored });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMatchTest, calculateMatch };