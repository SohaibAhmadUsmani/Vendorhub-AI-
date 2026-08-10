const mongoose = require('mongoose');


const analyticsSnapshotSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['buyer', 'vendor'],
      required: true,
      index: true,
    },
    period: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      default: 'monthly',
    },
    // Buyer analytics payload
    buyer: {
      monthlySpending: [
        { month: String, amount: Number, _id: false },
      ],
      topSuppliers: [
        { name: String, spend: Number, orders: Number, _id: false },
      ],
      savings: { name: String, value: Number },
      purchaseTrend: [
        { label: String, value: Number, _id: false },
      ],
      highlights: {
        monthlySpending: String,
        topSuppliers: String,
        costSavings: String,
        purchaseTrends: String,
      },
    },
    // Vendor analytics payload
    vendor: {
      revenueTrend: [
        { month: String, revenue: Number, _id: false },
      ],
      rfqConversion: { name: String, value: Number },
      rfqFunnel: [
        { stage: String, value: Number, _id: false },
      ],
      bestSellingProducts: [
        { name: String, sales: Number, _id: false },
      ],
      highlights: {
        revenue: String,
        rfqConversionRate: String,
        responseTime: String,
        bestSellingProducts: String,
      },
    },
    // AI-generated narrative insights (Groq)
    aiInsights: {
      buyerSummary: String,
      vendorSummary: String,
      recommendations: [String],
    },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSnapshotSchema);