const crypto = require('crypto');
const AICache = require('../models/AICache');
const { groqChat } = require('./groqClient');

/* --------------------------------------------------------------------------
   aiInsightService — the AI layer for the AI Insights page. It consumes a
   structured, non-sensitive business dataset (built by dashboardService),
   sends it to Groq, validates the structured JSON response and caches the
   result per vendor + range. The Groq API key lives ONLY in the backend
   environment (process.env.GROQ_API_KEY) — it never reaches the frontend.

   If Groq is unavailable or the dataset is too thin, the service returns an
   honest { available:false, reason } result so the controller can fall back
   to the deterministic analytics already computed from the database.
   -------------------------------------------------------------------------- */

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MODEL = 'openai/gpt-oss-120b';

const INSIGHT_CATEGORIES = [
  'Demand',
  'Revenue',
  'Performance',
  'Inventory',
  'Market',
  'Response Time',
  'Engagement',
];

const RECOMMENDATION_CATEGORIES = [
  'pricing',
  'product descriptions',
  'product images',
  'product availability',
  'response time',
  'certifications',
  'category expansion',
  'international market',
  'RFQ conversion',
  'customer engagement',
];

const IMPACT_LEVELS = ['high', 'medium', 'low'];

/* ---------------------------- Fingerprint ------------------------------ */

/** Deterministic JSON string with sorted keys (stable cache fingerprints). */
function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
}

function fingerprint(ctx) {
  return crypto.createHash('sha256').update(stableStringify(ctx)).digest('hex');
}

/* ----------------------------- Dataset check --------------------------- */

function hasAnyData(ctx) {
  if (!ctx || !ctx.totals) return false;
  return (
    ctx.totals.products > 0 ||
    ctx.totals.orders > 0 ||
    ctx.totals.quotes > 0 ||
    ctx.totals.rfqs > 0 ||
    ctx.totals.customerRequests > 0 ||
    Number(ctx.period?.revenue || 0) > 0
  );
}

/* ------------------------------ Prompt --------------------------------- */

function buildMessages(ctx) {
  const system = `You are the senior analytics AI inside VendorHub, a B2B sourcing platform.
You receive ONE vendor's real business dataset for a given period as JSON. Analyze ONLY that data.
Do not invent numbers, add outside facts, or restate raw counts without interpretation.
No private buyer/customer information is included — never mention any.

Respond with STRICT valid JSON only. No markdown, no code fences, no commentary.
Use exactly this schema:
{
  "summary": "<2-4 short sentences of business insight>",
  "keyInsights": [
    { "title": "short headline", "description": "why it matters",
      "impact": "high|medium|low", "category": "<one of the insight categories>",
      "supportingMetric": "the single number/metric that supports this" }
  ],
  "opportunities": [
    { "title": "short headline", "explanation": "how to act on it",
      "impact": "high|medium|low",
      "estimatedRevenue": <number or null>,
      "supportingData": "the real data points that support this" }
  ],
  "recommendations": [
    { "category": "<one of the recommendation categories>",
      "title": "short headline", "description": "what to do and why",
      "impact": "high|medium|low", "actionLabel": "short CTA like 'Update pricing'" }
  ]
}

Rules:
- keyInsights: at most 5, only items clearly supported by the data.
- opportunities: at most 4; "estimatedRevenue" must be a NUMBER only when the dataset
  supports a defensible calculation (e.g. open RFQs quantity x catalog price is NOT given,
  but confirmed revenue, won values or explicit totals may support it). Otherwise null.
  Never invent an estimate.
- recommendations: at most 4, from real gaps or strengths in the data.
- "impact" values must be exactly one of: high, medium, low.
- Insight "category" must be exactly one of: ${INSIGHT_CATEGORIES.join(', ')}.
- Recommendation "category" must be exactly one of: ${RECOMMENDATION_CATEGORIES.join(', ')}.
- Be specific and reference actual numbers; find meaningful patterns, not a summary of the summary.`;

  return [
    { role: 'system', content: system },
    { role: 'user', content: `HERE IS THE REAL DATASET:\n${JSON.stringify(ctx)}` },
  ];
}

/* ---------------------------- Validation ------------------------------- */

function cleanImpact(value) {
  const v = String(value || '').toLowerCase();
  return IMPACT_LEVELS.includes(v) ? v : 'medium';
}

function cleanText(value, fallback = '') {
  const v = String(value ?? '');
  return v.trim() ? v.slice(0, 280) : fallback;
}

function cleanCurrency(value) {
  if (value == null) return null;
  const parsed =
    typeof value === 'number'
      ? value
      : Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

function pickAllowed(value, allowed, fallback) {
  const v = String(value || '').toLowerCase();
  return allowed.includes(v) ? v : fallback;
}

/** Parse model text into a clean object; returns null when unusable. */
function sanitizeAIResult(raw) {
  let text = String(raw || '').trim();
  if (!text) return null;

  /* Tolerate code fences or surrounding prose. */
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        parsed = JSON.parse(text.slice(start, end + 1));
      } catch {
        parsed = null;
      }
    }
  }
  if (!parsed || typeof parsed !== 'object') return null;

  const summary = cleanText(parsed.summary, null);
  const toItems = (value) => (Array.isArray(value) ? value : []);

  const keyInsights = toItems(parsed.keyInsights)
    .map((item) => ({
      title: cleanText(item?.title),
      description: cleanText(item?.description),
      impact: cleanImpact(item?.impact),
      category: pickAllowed(item?.category, INSIGHT_CATEGORIES, 'Performance'),
      supportingMetric: cleanText(item?.supportingMetric, null),
    }))
    .filter((item) => item.title)
    .slice(0, 5);

  const opportunities = toItems(parsed.opportunities)
    .map((item) => ({
      title: cleanText(item?.title),
      explanation: cleanText(item?.explanation),
      impact: cleanImpact(item?.impact),
      estimatedRevenue: cleanCurrency(item?.estimatedRevenue),
      supportingData: cleanText(item?.supportingData, null),
    }))
    .filter((item) => item.title)
    .slice(0, 4);

  const recommendations = toItems(parsed.recommendations)
    .map((item) => ({
      category: pickAllowed(item?.category, RECOMMENDATION_CATEGORIES, 'pricing'),
      title: cleanText(item?.title),
      description: cleanText(item?.description),
      impact: cleanImpact(item?.impact),
      actionLabel: cleanText(item?.actionLabel),
    }))
    .filter((item) => item.title)
    .slice(0, 4);

  if (!summary && !keyInsights.length && !opportunities.length && !recommendations.length) {
    return null;
  }

  return { summary, keyInsights, opportunities, recommendations };
}

/* ------------------------------ Main entry ----------------------------- */

/**
 * Generate AI content for one vendor + range.
 * Returns { available, reason?, cached?, generatedAt?, payload? }.
 */
async function generateAIInsights(vendor, rangeKey, ctx, { refresh = false } = {}) {
  if (!process.env.GROQ_API_KEY) {
    return { available: false, reason: 'not_configured' };
  }
  if (!vendor || !ctx || !hasAnyData(ctx)) {
    return { available: false, reason: 'insufficient_data' };
  }

  const ctxFingerprint = fingerprint(ctx);
  const vid = vendor._id || vendor.id;

  /* Serve from cache when the underlying data is unchanged and fresh. */
  if (!refresh) {
    try {
      const cached = await AICache.findOne({ vendor: vid, range: rangeKey }).lean();
      if (cached && cached.fingerprint === ctxFingerprint) {
        const age = Date.now() - new Date(cached.generatedAt).getTime();
        if (age < CACHE_TTL_MS && cached.payload) {
          return {
            available: true,
            cached: true,
            generatedAt: cached.generatedAt,
            payload: cached.payload,
            fingerprint: ctxFingerprint,
          };
        }
      }
    } catch {
      /* Cache read failures degrade gracefully to a fresh generation. */
    }
  }

  try {
    const content = await groqChat(buildMessages(ctx), {
      model: MODEL,
      temperature: 0.2,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
      timeout: 25_000,
    });
    const payload = sanitizeAIResult(content);
    if (!payload) return { available: false, reason: 'ai_unavailable' };

    const generatedAt = new Date();
    try {
      await AICache.findOneAndDelete({ vendor: vid, range: rangeKey });
      await AICache.create({
        vendor: vid,
        range: rangeKey,
        fingerprint: ctxFingerprint,
        payload,
        generatedAt,
      });
    } catch {
      /* Persisting the cache is best-effort — stale caches simply regenerate. */
    }

    return { available: true, cached: false, generatedAt, payload, fingerprint: ctxFingerprint };
  } catch (error) {
    console.error('AI insight generation failed:', error.message);
    return { available: false, reason: 'ai_unavailable' };
  }
}

/** Force-regenerate (used by the frontend refresh affordance). */
async function regenerateAIInsights(vendor, rangeKey, ctx) {
  return generateAIInsights(vendor, rangeKey, ctx, { refresh: true });
}

module.exports = { generateAIInsights, regenerateAIInsights, sanitizeAIResult };