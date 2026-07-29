const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['buyer', 'vendor', 'admin'], required: true },
  oauthProvider: { type: String, enum: ['google', 'linkedin', 'microsoft', null], default: null },
  isVerified: { type: Boolean, default: false },
  twoFAEnabled: { type: Boolean, default: false },
  savedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);