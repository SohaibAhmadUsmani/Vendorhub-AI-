const { groqChat } = require("./groqClient");

const LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

const FACTOR_WEIGHTS = {
  verificationRisk: 0.25,
  businessAgeRisk: 0.15,
  certificationRisk: 0.2,
  deliveryRisk: 0.15,
  financialRisk: 0.15,
  fraudRisk: 0.1,
};

const levelFromScore = (score) => {
  if (score <= 30) return LEVELS.LOW;
  if (score <= 60) return LEVELS.MEDIUM;
  if (score <= 80) return LEVELS.HIGH;
  return LEVELS.CRITICAL;
};

const clamp = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.min(100, Math.max(0, Math.round(num)));
};

const buildFactor = (score, findings = [], detail = "") => {
  const safeScore = clamp(score);
  return {
    score: safeScore,
    level: levelFromScore(safeScore),
    findings: findings.slice(0, 8),
    detail,
  };
};

const SUMMARY_TEXT = {
  Low: (name) =>
    `${name} presents a low overall supply risk. The supplier passes verification, carries verifiable certifications, and shows a healthy trading history.`,
  Medium: (name) =>
    `${name} presents a moderate supply risk. Some gaps in verification, certification coverage, or delivery data should be investigated before committing to large orders.`,
  High: (name) =>
    `${name} presents a high supply risk. Notable gaps in verification, certifications, financial health, or delivery reliability require a structured supplier audit before any commitment.`,
  Critical: (name) =>
    `${name} presents a critical supply risk. Multiple risk indicators are elevated; procurement should be paused pending a full supplier due-diligence and fraud review.`,
};

const RECOMMENDATION_TEXT = {
  Low: "Proceed with standard onboarding. Monitor performance quarterly and keep certification records updated.",
  Medium:
    "Request updated documentation, validate key certifications, and start with a small pilot order before scaling commitment.",
  High: "Run an on-site audit, require escrow-backed payment terms, and limit initial order value until identified risks are resolved.",
  Critical:
    "Do not engage without a completed fraud review, third-party financial check, and verified trade references.",
};

function extractYear(value) {
  if (value == null) return null;
  const numeric = Number(value);
  if (Number.isInteger(numeric) && numeric >= 1900 && numeric <= new Date().getFullYear() + 1) {
    return numeric;
  }
  const match = String(value).match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function summarizeVendorData(vendor) {
  const currentYear = new Date().getFullYear();
  const establishedYear = extractYear(vendor.establishedYear) || extractYear(vendor.founded);
  const businessAge = establishedYear ? currentYear - establishedYear : null;

  const certifications = Array.isArray(vendor.certifications) ? vendor.certifications : [];
  const certTitles = certifications.map((c) => c.title || c.name).filter(Boolean);
  const verifiedCerts = certifications.filter(
    (c) => c.verified !== false && !/unverified|pending/i.test(c.badge || "")
  );
  const expiredCerts = certifications.filter((c) => {
    const year = extractYear(c.validThru);
    return year != null && year < currentYear;
  });

  const reviews = Array.isArray(vendor.reviews) ? vendor.reviews : [];
  const reviewCount = Number(vendor.reviewCount) || reviews.length || 0;
  const deliveryRatings = reviews.map((r) => r.categories?.deliverySpeed).filter((n) => n != null);
  const avgDeliveryRating = deliveryRatings.length
    ? deliveryRatings.reduce((sum, n) => sum + Number(n), 0) / deliveryRatings.length
    : null;

  const responseTime = String(vendor.responseTime || "");
  const responseHours = Number((responseTime.match(/(\d+(?:\.\d+)?)/) || [])[1]) || null;
  const fastResponse = /under 1 hour|< 1 hour|same day|within hours|24 hours/i.test(responseTime);

  const contact = vendor.contact || {};
  const hasContactEmail = Boolean(contact.email);
  const hasContactPhone = Boolean(contact.phone);
  const hasWebsite = Boolean(contact.website);

  const financialStatus = String(
    vendor.riskBreakdown?.financialRisk || vendor.financialStatus || ""
  ).toLowerCase();
  const verificationStatus = String(vendor.verificationStatus || "").toLowerCase();

  return {
    vendorId: vendor._id,
    vendorName: vendor.name,
    logoImage: vendor.logo || vendor.logoImage,
    establishedYear,
    businessAge,
    certTitles,
    verifiedCerts,
    expiredCerts,
    reviewCount,
    avgDeliveryRating,
    responseHours,
    fastResponse,
    hasContactEmail,
    hasContactPhone,
    hasWebsite,
    financialStatus,
    verificationStatus,
    fraudIndicators: Array.isArray(vendor.fraudIndicators) ? vendor.fraudIndicators : [],
    fraudFlags: Array.isArray(vendor.fraudFlags) ? vendor.fraudFlags : [],
    rating: Number(vendor.rating) || 0,
  };
}

function scoreVerification(v) {
  const findings = [];
  let score;
  if (v.verificationStatus === "verified") {
    score = 10;
    findings.push("Company is fully verified on VendorHub.");
  } else if (v.verificationStatus === "pending") {
    score = 55;
    findings.push("Company verification is pending review.");
  } else if (v.verificationStatus === "unverified") {
    score = 80;
    findings.push("Company has not completed supplier verification.");
  } else {
    score = 45;
    findings.push("Verification status has not been disclosed.");
  }
  return buildFactor(score, findings);
}

function scoreBusinessAge(v) {
  const findings = [];
  let score;
  if (v.businessAge == null) {
    score = 70;
    findings.push("Establishment year not disclosed, limiting history verification.");
  } else if (v.businessAge >= 15) {
    score = 10;
    findings.push(`Operating for ${v.businessAge} years with an established track record.`);
  } else if (v.businessAge >= 8) {
    score = 30;
    findings.push(`Operating for ${v.businessAge} years — moderate trading history.`);
  } else if (v.businessAge >= 3) {
    score = 50;
    findings.push(`Operating for ${v.businessAge} years — limited long-term history.`);
  } else {
    score = 80;
    findings.push(`Operating for only ${v.businessAge} year(s) — very short trading history.`);
  }
  return buildFactor(score, findings);
}

function scoreCertification(v) {
  const findings = [];
  let score;
  if (v.certTitles.length === 0) {
    score = 75;
    findings.push("No certifications have been uploaded or verified.");
  } else {
    const verifiedRatio = v.verifiedCerts.length / v.certTitles.length;
    score = 15 + (1 - verifiedRatio) * 45;
    findings.push(`${v.verifiedCerts.length} of ${v.certTitles.length} certifications verified.`);
    if (v.certTitles.length < 3) {
      score += 10;
      findings.push(`Only ${v.certTitles.length} certification(s) on file — thin coverage.`);
    }
    if (v.expiredCerts.length > 0) {
      score += v.expiredCerts.length * 8;
      findings.push(`${v.expiredCerts.length} certification(s) appear expired.`);
    }
  }
  return buildFactor(score, findings);
}

function scoreDelivery(v) {
  const findings = [];
  let score;
  if (v.avgDeliveryRating != null) {
    score = ((5 - v.avgDeliveryRating) / 4) * 70;
    findings.push(`Average delivery rating of ${v.avgDeliveryRating.toFixed(1)}/5 across reviews.`);
    if (v.reviewCount < 10) {
      score += 10;
      findings.push("Few reviews available to confirm delivery reliability.");
    }
  } else if (v.fastResponse || (v.responseHours != null && v.responseHours <= 2)) {
    score = 25;
    findings.push("Responsive supplier with fast turnaround times.");
  } else if (v.responseHours != null && v.responseHours <= 12) {
    score = 45;
    findings.push(`Typical response time of ${v.responseHours} hour(s).`);
  } else if (v.responseHours != null) {
    score = 65;
    findings.push(`Slow response time of ${v.responseHours} hour(s).`);
  } else {
    score = 60;
    findings.push("Delivery performance data is not available.");
  }
  return buildFactor(score, findings);
}

function scoreFinancial(v) {
  const findings = [];
  let score;
  const status = v.financialStatus;
  if (!status) {
    score = 40;
    findings.push("Financial health has not been assessed.");
  } else if (status.includes("low")) {
    score = 15;
    findings.push("Financial health assessed as low risk.");
  } else if (status.includes("medium")) {
    score = 50;
    findings.push("Financial health assessed as medium risk.");
  } else if (status.includes("high")) {
    score = 75;
    findings.push("Financial health assessed as high risk.");
  } else if (status.includes("critical")) {
    score = 90;
    findings.push("Financial health flagged as critical risk.");
  } else {
    score = 40;
    findings.push("Financial health rating is unrecognized.");
  }
  if (v.businessAge != null && v.businessAge >= 15) {
    score = Math.max(5, score - 5);
    findings.push("Long operating history supports financial stability.");
  }
  return buildFactor(score, findings);
}

function scoreFraud(v) {
  const findings = [];
  let score = 5;
  const flags = [...v.fraudIndicators, ...v.fraudFlags];
  if (flags.length > 0) {
    score += 45;
    flags.forEach((flag) => findings.push(String(flag)));
  }
  if (v.verificationStatus && v.verificationStatus !== "verified") {
    score += 20;
    findings.push("Supplier is not fully verified.");
  }
  if (!v.hasContactEmail || !v.hasContactPhone) {
    score += 15;
    findings.push("Company contact details are incomplete.");
  }
  if (!v.hasWebsite) {
    score += 8;
    findings.push("No official company website listed.");
  }
  if (v.businessAge == null || v.businessAge < 3) {
    score += 12;
    findings.push("Short or undisclosed operating history raises fraud concern.");
  }
  if (v.reviewCount < 5) {
    score += 8;
    findings.push("Very few independent reviews exist for this supplier.");
  }
  if (v.certTitles.length === 0 && v.verificationStatus !== "verified") {
    score += 7;
    findings.push("No certifications combined with unverified status is suspicious.");
  }
  return buildFactor(score, findings);
}

function riskReport(vendor) {
  const data = summarizeVendorData(vendor);
  const factors = {
    verificationRisk: scoreVerification(data),
    businessAgeRisk: scoreBusinessAge(data),
    certificationRisk: scoreCertification(data),
    deliveryRisk: scoreDelivery(data),
    financialRisk: scoreFinancial(data),
    fraudRisk: scoreFraud(data),
  };
  const riskScore = clamp(
    Object.entries(FACTOR_WEIGHTS).reduce(
      (total, [key, weight]) => total + weight * factors[key].score,
      0
    )
  );
  const riskLevel = levelFromScore(riskScore);

  return {
    vendorId: data.vendorId,
    vendorName: data.vendorName,
    logoImage: data.logoImage,
    riskScore,
    riskLevel,
    verificationRisk: factors.verificationRisk.level,
    businessAgeRisk: factors.businessAgeRisk.level,
    certificationRisk: factors.certificationRisk.level,
    deliveryRisk: factors.deliveryRisk.level,
    financialRisk: factors.financialRisk.level,
    fraudRisk: factors.fraudRisk.level,
    factors,
    analyzedAt: new Date().toISOString(),
  };
}

function analyzeVendorRiskLight(vendor) {
  const report = riskReport(vendor);
  report.summary = SUMMARY_TEXT[report.riskLevel](report.vendorName);
  report.recommendation = RECOMMENDATION_TEXT[report.riskLevel];
  return report;
}

async function generateAiSummary(vendor, report) {
  const prompt = `
You are a professional B2B procurement risk analyst.

Generate a concise procurement assessment for the supplier below. Return JSON only:

{
  "summary": "Short professional explanation of the risk posture (1-3 sentences)",
  "recommendation": "Short actionable procurement recommendation (1-2 sentences)"
}

Supplier:
Name: ${report.vendorName || "Unknown"}
Overall Risk Score: ${report.riskScore}/100
Risk Level: ${report.riskLevel}
Verification: ${report.verificationRisk}
Business Age: ${report.businessAgeRisk}
Certifications: ${report.certificationRisk}
Delivery: ${report.deliveryRisk}
Financial: ${report.financialRisk}
Fraud: ${report.fraudRisk}
Verification Status: ${vendor.verificationStatus || "Unknown"}
Established Year: ${vendor.establishedYear || vendor.founded || "Unknown"}
`;

  const response = await groqChat([{ role: "user", content: prompt }], {
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  let parsed;
  try {
    parsed = JSON.parse(response);
  } catch (error) {
    parsed = {};
  }

  return {
    summary: String(parsed.summary || "").trim(),
    recommendation: String(parsed.recommendation || "").trim(),
  };
}

async function analyzeVendorRisk(vendor) {
  const report = riskReport(vendor);
  const fallback = {
    summary: SUMMARY_TEXT[report.riskLevel](report.vendorName),
    recommendation: RECOMMENDATION_TEXT[report.riskLevel],
  };

  try {
    const ai = await generateAiSummary(vendor, report);
    report.summary = ai.summary || fallback.summary;
    report.recommendation = ai.recommendation || fallback.recommendation;
  } catch (error) {
    console.warn("AI summary generation failed, using deterministic fallback:", error.message);
    report.summary = fallback.summary;
    report.recommendation = fallback.recommendation;
  }

  return report;
}

module.exports = {
  analyzeVendorRisk,
  analyzeVendorRiskLight,
  riskReport,
  levelFromScore,
};
