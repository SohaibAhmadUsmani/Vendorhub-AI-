const mongoose = require('mongoose');

const negotiationEntrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['counter_offer', 'discount_request', 'follow_up', 'note'],
    required: true,
  },
  generatedText: { type: String, required: true }, // AI-generated draft
  proposedPrice: { type: Number },
  sentByBuyer: { type: Boolean, default: false }, // whether buyer actually sent this draft
  createdAt: { type: Date, default: Date.now },
});

const negotiationSchema = new mongoose.Schema({
  quote: { type: mongoose.Schema.Types.ObjectId, ref: 'Quote', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  entries: [negotiationEntrySchema],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
}, { timestamps: true });

module.exports = mongoose.model('Negotiation', negotiationSchema);
