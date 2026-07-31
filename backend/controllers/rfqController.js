// RFQ Generator Controller (Module 8)
const RFQ = require('../models/RFQ');

/**
 * @desc    Test RFQ Route
 * @route   GET /api/rfq/test
 * @access  Public
 */
const getRfqTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RFQ Generator API endpoint is active (Module 8)',
    timestamp: new Date().toISOString(),
  });
};

/**
 * @desc    Create a new RFQ
 * @route   POST /api/rfq
 * @access  Private (buyer)
 */
const createRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.create(req.body);
    res.status(201).json({ success: true, rfq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { getRfqTest, createRFQ };