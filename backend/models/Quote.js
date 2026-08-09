const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  moq: { type: Number },
  deliveryTime: { type: String }, // e.g. "15-20 days"
  paymentTerms: { type: String },
  shippingMethod: { type: String },
  certifications: [{ type: String }],
  warranty: { type: String },
  notes: { type: String },

  aiScore: { type: Number, min: 0, max: 100 }, // computed match/value score for comparison
  aiRecommended: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ['pending', 'submitted', 'under_negotiation', 'accepted', 'rejected', 'expired'],
    default: 'submitted',
  },

  validUntil: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
