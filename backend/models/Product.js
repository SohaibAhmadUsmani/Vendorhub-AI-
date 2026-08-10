const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true 
  },
  vendorName: { type: String },
  name: { type: String, required: true },
  title: { type: String },
  category: { type: String, required: true },
  sku: { type: String },
  price: { type: Number, required: true },
  priceMin: { type: Number },
  priceMax: { type: Number },
  priceDisplay: { type: String },
  unit: { type: String, default: 'piece' },
  moq: { type: Number, default: 100 },
  leadTime: { type: String, default: '14 days' },
  leadTimeDays: { type: Number, default: 14 },
  inStock: { type: Boolean, default: true },
  availableStock: { type: Number, default: 5000 },
  stockQuantity: { type: Number, default: 5000 },
views: { type: Number, default: 0 },
  stockStatus: { type: String, enum: ['In Stock', 'Low Stock', 'Made to Order', 'Out of Stock'], default: 'In Stock' },
  image: { type: String },
  imageUrl: { type: String },
  gallery: [{ type: String }],
  tags: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  isVerified: { type: Boolean, default: true },
  description: { type: String },
  specifications: { 
    type: Map, 
    of: String 
  }
}, { timestamps: true });

// Pre-save hook to synchronize alias fields seamlessly
productSchema.pre('save', function(next) {
  if (!this.title) this.title = this.name;
  if (!this.name) this.name = this.title;
  if (this.priceMin === undefined) this.priceMin = this.price;
  if (this.priceMax === undefined) this.priceMax = this.price;
  if (!this.priceDisplay) this.priceDisplay = `$${this.price ? this.price.toFixed(2) : '0.00'}`;
  if (!this.imageUrl) this.imageUrl = this.image;
  if (!this.image) this.image = this.imageUrl;
  if (this.availableStock === undefined) this.availableStock = this.stockQuantity;
  if (this.stockQuantity === undefined) this.stockQuantity = this.availableStock;
  next();
});

module.exports = mongoose.model('Product', productSchema);

