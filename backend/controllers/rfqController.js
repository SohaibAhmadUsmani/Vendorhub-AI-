const RFQ = require('../models/RFQ');
const { generateRFQPdf } = require('../services/pdfGenerator');

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

/**
 * @desc    Export RFQ as PDF (works with dummy data — no DB needed for testing)
 * @route   POST /api/rfq/export-pdf
 * @access  Private (buyer)
 */
const exportRFQPdf = async (req, res) => {
  try {
    const pdfBuffer = await generateRFQPdf(req.body);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=rfq.pdf',
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRfqTest, createRFQ, exportRFQPdf };