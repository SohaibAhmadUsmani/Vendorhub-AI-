const Negotiation = require('../models/Negotiation');
const Quote = require('../models/Quote');
const { groqChat } = require('../services/groqClient');

/**
 * @desc    Test Negotiation Route
 * @route   GET /api/negotiation/test
 * @access  Public
 */
const getNegotiationTest = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Negotiation Assistant API endpoint is active (Module 10)',
    timestamp: new Date().toISOString(),
  });
};

const TYPE_PROMPTS = {
  counter_offer: (ctx) =>
    `Write a polite, professional B2B procurement counter-offer email to a supplier. ` +
    `Current quoted price is ${ctx.currency} ${ctx.currentPrice} for ${ctx.quantity || 'the requested quantity'} of ${ctx.product || 'the product'}. ` +
    `The buyer wants to propose ${ctx.currency} ${ctx.proposedPrice} instead. ` +
    `Justify it briefly (market rate, order volume, or long-term partnership potential). Keep it under 150 words. Do not include a subject line.`,
  discount_request: (ctx) =>
    `Write a polite, professional B2B email requesting a discount from a supplier on their quoted price of ${ctx.currency} ${ctx.currentPrice} ` +
    `for ${ctx.quantity || 'the requested quantity'} of ${ctx.product || 'the product'}. ` +
    `Mention bulk order size and interest in a long-term supply relationship as leverage. Keep it under 150 words. Do not include a subject line.`,
  follow_up: (ctx) =>
    `Write a brief, polite follow-up email to a supplier who has not responded to a quote request for ${ctx.product || 'the product'} in over a week. ` +
    `Keep it friendly but prompt them for a response. Keep it under 100 words. Do not include a subject line.`,
};

/**
 * @desc    Generate an AI negotiation draft (counter offer / discount request / follow-up)
 * @route   POST /api/negotiation/generate
 * @access  Private (buyer)
 * @body    { quoteId, type: 'counter_offer'|'discount_request'|'follow_up', proposedPrice? }
 */
const generateNegotiationDraft = async (req, res) => {
  try {
    const { quoteId, type, proposedPrice } = req.body;

    if (!TYPE_PROMPTS[type]) {
      return res.status(400).json({ success: false, message: 'Invalid negotiation type' });
    }

    const quote = await Quote.findById(quoteId).populate('vendor', 'name').populate('rfq');
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

    const ctx = {
      currency: quote.currency,
      currentPrice: quote.price,
      proposedPrice,
      product: quote.rfq?.product,
      quantity: quote.rfq?.quantity,
    };

    const prompt = TYPE_PROMPTS[type](ctx);
    const generatedText = await groqChat([
      { role: 'system', content: 'You are an expert B2B procurement negotiation assistant. Write concise, professional, respectful emails.' },
      { role: 'user', content: prompt },
    ]);

    let negotiation = await Negotiation.findOne({ quote: quoteId });
    if (!negotiation) {
      negotiation = await Negotiation.create({
        quote: quoteId,
        buyer: quote.buyer,
        vendor: quote.vendor,
        entries: [],
      });
    }

    negotiation.entries.push({ type, generatedText, proposedPrice });
    await negotiation.save();

    res.status(200).json({ success: true, generatedText, negotiation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Get negotiation thread for a quote
 * @route   GET /api/negotiation/quote/:quoteId
 * @access  Private
 */
const getNegotiationByQuote = async (req, res) => {
  try {
    const negotiation = await Negotiation.findOne({ quote: req.params.quoteId });
    res.status(200).json({ success: true, negotiation: negotiation || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getNegotiationTest, generateNegotiationDraft, getNegotiationByQuote };
