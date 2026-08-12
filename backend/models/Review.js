const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  reviewerName: { type: String, required: true },
  reviewerCompany: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  categories: {
    productQuality: { type: Number, default: 5 },
    communication: { type: Number, default: 5 },
    deliverySpeed: { type: Number, default: 5 },
    valueForMoney: { type: Number, default: 5 }
  },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
