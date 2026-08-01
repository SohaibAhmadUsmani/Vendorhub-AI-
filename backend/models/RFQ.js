const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  material: { type: String },
  budget: { type: Number },
  deliveryDate: { type: Date },
  paymentTerms: { type: String },
  shippingMethod: { type: String },
  attachments: [{ type: String }], // Cloudinary URLs
  status: { type: String, enum: ['draft', 'sent', 'quoted', 'closed'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('RFQ', rfqSchema);