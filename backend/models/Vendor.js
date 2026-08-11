const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: { type: String },
  name: { type: String },
  issuer: { type: String },
  desc: { type: String },
  year: { type: String },
  validThru: { type: String },
  image: { type: String },
  documentUrl: { type: String },
  verified: { type: Boolean, default: true },
  badge: { type: String, default: 'Verified' }
});

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  whatsApp: { type: String },
  avatar: { type: String },
  photo: { type: String },
  languages: { type: String }
});

const reviewSchema = new mongoose.Schema({
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

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, unique: true },
  tagline: { type: String },
  logo: { type: String },
  logoImage: { type: String },
  bannerImage: { type: String },
  coverImage: { type: String },
  location: { type: String, required: true },
  country: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  verificationStatus: { type: String, enum: ['Verified', 'Pending', 'Unverified'], default: 'Verified' },
  verificationBadge: { type: String, default: 'Verified Platinum' },
  responseTime: { type: String, default: '< 2 hours' },
  languages: [{ type: String }],
  overview: { type: String, required: true },
  description: { type: String },
  establishedYear: { type: Number },
  founded: { type: String },
  employeeCount: { type: String },
  staff: { type: String },
  businessType: { type: String },
  industryRank: { type: String },
  compliance: { type: String },
  exportCountries: [{
    country: { type: String },
    code: { type: String },
    flag: { type: String },
    percent: { type: Number }
  }],
  manufacturingCapabilities: {
    capacity: { type: String },
    leadTime: { type: String },
    rndDept: { type: String },
    customTooling: { type: String },
    factoryArea: { type: String },
    cncMachines: { type: String },
    automatedLines: { type: String }
  },
  factoryDetails: {
    area: { type: String },
    productionLines: { type: Number },
    annualOutput: { type: String },
    factoryPhotos: [{ type: String }],
    videoTourUrl: { type: String },
    videoUrl: { type: String },
    videoTitle: { type: String }
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
    address: { type: String },
    whatsApp: { type: String }
  },
  reviews: [reviewSchema]
}, { timestamps: true });

vendorSchema.pre('save', function(next) {
  if (!this.description) this.description = this.overview;
  if (!this.overview) this.overview = this.description;
  if (!this.logoImage) this.logoImage = this.logo;
  if (!this.logo) this.logo = this.logoImage;
  if (!this.coverImage) this.coverImage = this.bannerImage;
  if (!this.bannerImage) this.bannerImage = this.coverImage;
  if (this.certifications && this.certifications.length > 0) {
    this.certifications.forEach(c => {
      if (!c.title) c.title = c.name;
      if (!c.name) c.name = c.title;
    });
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);

