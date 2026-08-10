const { groqChat } = require("./groqClient");

async function analyzeVendorRisk(vendor) {
  const prompt = `
You are a professional B2B procurement risk analyst.

Analyze this supplier and calculate a procurement risk assessment.

Supplier:
Name: ${vendor.name || "Unknown"}
Business Age: ${vendor.businessAge || "Unknown"}
Country: ${vendor.country || "Unknown"}
Verification Status: ${vendor.verificationStatus || "Unknown"}
Certifications: ${
    vendor.certifications?.length
      ? vendor.certifications.join(", ")
      : "None provided"
  }
Delivery Performance: ${vendor.deliveryPerformance || "Unknown"}
Financial Status: ${vendor.financialStatus || "Unknown"}
Reviews: ${vendor.reviews || 0}
Rating: ${vendor.rating || 0}
Fraud Indicators: ${
    vendor.fraudIndicators?.length
      ? vendor.fraudIndicators.join(", ")
      : "None detected"
  }

Evaluate:
1. Supplier verification risk
2. Business age risk
3. Certification risk
4. Delivery risk
5. Financial risk
6. Fraud risk

Return JSON only in this format:

{
  "riskScore": 0,
  "riskLevel": "Low",
  "verificationRisk": "Low",
  "businessAgeRisk": "Low",
  "certificationRisk": "Low",
  "deliveryRisk": "Low",
  "financialRisk": "Low",
  "fraudRisk": "Low",
  "summary": "Short professional explanation",
  "recommendation": "Short procurement recommendation"
}

Risk score:
0-30 = Low
31-60 = Medium
61-80 = High
81-100 = Critical
`;

  const response = await groqChat(
    [{ role: "user", content: prompt }],
    {
      model: "llama3-70b-8192",
      temperature: 0.2,
    }
  );

  try {
    return JSON.parse(response);
  } catch (error) {
    return {
      riskScore: 50,
      riskLevel: "Medium",
      summary: response,
      recommendation: "Manual supplier verification recommended.",
    };
  }
}

module.exports = {
  analyzeVendorRisk,
};