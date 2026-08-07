const Quote = require('../models/Quote');
const RFQ = require('../models/RFQ');

/**
 * @desc    Test Quote Route
 * @route   GET /api/quotes/test
 * @access  Public
 */
const getQuoteTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Quote Comparison API endpoint is active (Module 9)',
    timestamp: new Date().toISOString(),
  });
};

/**
 * @desc    Vendor submits a quote against an RFQ
 * @route   POST /api/quotes
 * @access  Private (vendor)
 */
const createQuote = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.body.rfq);
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });

    const quote = await Quote.create({ ...req.body, buyer: rfq.buyer });

    // Keep the RFQ status in sync
    if (rfq.status === 'sent') {
      rfq.status = 'quoted';
      await rfq.save();
    }

    res.status(201).json({ success: true, quote });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get all quotes for a given RFQ (buyer's comparison view)
 * @route   GET /api/quotes/rfq/:rfqId
 * @access  Private (buyer)
 */
const getQuotesByRFQ = async (req, res) => {
  try {
    const quotes = await Quote.find({ rfq: req.params.rfqId })
      .populate('vendor', 'name logo location country rating verificationStatus responseTime')
      .sort({ price: 1 });

    const scored = scoreQuotes(quotes);
    res.status(200).json({ success: true, count: scored.length, quotes: scored });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get a single quote by id
 * @route   GET /api/quotes/:id
 * @access  Private
 */
const getQuoteById = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('vendor', 'name logo location country rating verificationStatus')
      .populate('rfq');
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.status(200).json({ success: true, quote });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Buyer accepts a quote (auto-rejects the rest for that RFQ)
 * @route   PATCH /api/quotes/:id/accept
 * @access  Private (buyer)
 */
const acceptQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

    quote.status = 'accepted';
    await quote.save();

    await Quote.updateMany(
      { rfq: quote.rfq, _id: { $ne: quote._id } },
      { $set: { status: 'rejected' } }
    );

    await RFQ.findByIdAndUpdate(quote.rfq, { status: 'closed' });

    res.status(200).json({ success: true, quote });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Buyer rejects a specific quote
 * @route   PATCH /api/quotes/:id/reject
 * @access  Private (buyer)
 */
const rejectQuote = async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.status(200).json({ success: true, quote });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * Simple AI-style scoring for quote comparison.
 * Weighs price (lower is better, normalized against the cheapest quote),
 * vendor rating, and verification status.
 * Marks the top-scoring quote as aiRecommended.
 */
function scoreQuotes(quotes) {
  if (!quotes.length) return quotes;

  const prices = quotes.map((q) => q.price).filter((p) => typeof p === 'number');
  const minPrice = Math.min(...prices);

  const withScores = quotes.map((q) => {
    const priceScore = minPrice > 0 ? (minPrice / q.price) * 60 : 60; // up to 60 pts
    const ratingScore = ((q.vendor?.rating || 4) / 5) * 30; // up to 30 pts
    const verifiedScore = q.vendor?.verificationStatus === 'Verified' ? 10 : 0; // up to 10 pts
    const aiScore = Math.round(priceScore + ratingScore + verifiedScore);
    return { ...q.toObject(), aiScore };
  });

  const topScore = Math.max(...withScores.map((q) => q.aiScore));
  return withScores.map((q) => ({ ...q, aiRecommended: q.aiScore === topScore }));
}

module.exports = {
  getQuoteTest,
  createQuote,
  getQuotesByRFQ,
  getQuoteById,
  acceptQuote,
  rejectQuote,
};
