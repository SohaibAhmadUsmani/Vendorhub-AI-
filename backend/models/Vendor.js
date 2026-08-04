const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  year: { type: String },
  image: { type: String },
  verified: { type: Boolean, default: true }
});

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  avatar: { type: String }
});

const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  reviewerCompany: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tagline: { type: String },
  logo: { type: String },
  bannerImage: { type: String },
  location: { type: String, required: true },
  country: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  verificationStatus: { type: String, enum: ['Verified', 'Pending', 'Unverified'], default: 'Verified' },
  responseTime: { type: String, default: '< 2 hours' },
  languages: [{ type: String }],
  overview: { type: String, required: true },
  establishedYear: { type: Number },
  employeeCount: { type: String },
  factoryDetails: {
    area: { type: String },
    productionLines: { type: Number },
    annualOutput: { type: String },
    factoryPhotos: [{ type: String }],
    videoTourUrl: { type: String }
  },
  certifications: [certificationSchema],
  team: [teamMemberSchema],
  riskBreakdown: {
    overallScore: { type: Number, default: 94 },
    complianceRisk: { type: String, default: 'Low' },
    operationalRisk: { type: String, default: 'Low' },
    financialRisk: { type: String, default: 'Low' }
  },
  contact: {
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    address: { type: String }
  },
  reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
