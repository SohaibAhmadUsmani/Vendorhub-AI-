const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true 
  },
  vendorName: { type: String },
  name: { type: String, required: true },
  category: { type: String, required: true },
  sku: { type: String },
  price: { type: Number, required: true },
  unit: { type: String, default: 'piece' },
  moq: { type: Number, default: 100 },
  leadTime: { type: String, default: '14 days' },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 5000 },
  image: { type: String },
  gallery: [{ type: String }],
  description: { type: String },
  specifications: { 
    type: Map, 
    of: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
