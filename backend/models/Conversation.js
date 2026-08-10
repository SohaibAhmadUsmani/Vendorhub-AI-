const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  rfq: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' }, // optional context link
  lastMessage: { type: String },
  lastMessageAt: { type: Date, default: Date.now },
}, { timestamps: true });

// A buyer should have exactly one conversation per vendor
conversationSchema.index({ buyer: 1, vendor: 1 }, { unique: true });

module.exports = mongoose.model('Conversation', conversationSchema);
