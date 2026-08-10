const mongoose = require('mongoose');

/**
 * AICache — persisted, per-vendor generated AI content for the AI Insights
 * page. Storing the generated payload avoids re-calling Groq on every page
 * visit while the underlying data fingerprint stays unchanged.
 */
const aiCacheSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    range: { type: String, default: '30d' },
    fingerprint: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

aiCacheSchema.index({ vendor: 1, range: 1 }, { unique: true });
aiCacheSchema.index({ generatedAt: -1 });

module.exports = mongoose.model('AICache', aiCacheSchema);