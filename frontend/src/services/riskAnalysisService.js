import { INITIAL_VENDORS_DATA } from "./vendorService";

const API_URL = "http://localhost:5000/api/risk";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const toRiskScore = (healthScore) => {
  const num = Number(healthScore);
  if (!Number.isFinite(num)) return 50;
  return Math.min(100, Math.max(0, Math.round(100 - num)));
};

const estimateRiskFromVendor = (vendor) => {
  const healthScore = vendor.riskMetrics?.score ?? vendor.riskBreakdown?.overallScore ?? 96;
  const status = String(vendor.riskMetrics?.status ?? "Low Risk").replace(/ risk$/i, "");

  return {
    vendorId: vendor._id || vendor.id,
    vendorName: vendor.name,
    logoImage: vendor.logoImage || vendor.logo,
    riskScore: toRiskScore(healthScore),
    riskLevel: status || "Low",
    verificationRisk: "Unknown",
    businessAgeRisk: "Unknown",
    certificationRisk: "Unknown",
    deliveryRisk: "Unknown",
    financialRisk: "Unknown",
    fraudRisk: "Unknown",
    summary: "Backend unavailable — showing a local estimate. Connect the server for a full AI analysis.",
    recommendation: "Reconnect the backend and run the full analysis for a complete assessment.",
  };
};

export const analyzeAllVendorsRisk = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze vendor risks");
    }

    const data = await response.json();

    if (Array.isArray(data.data) && data.data.length > 0) {
      return data.data;
    }

    throw new Error("No risk data returned");
  } catch (error) {
    console.warn("Backend risk API unavailable, using local estimates:", error);
    return INITIAL_VENDORS_DATA.map(estimateRiskFromVendor);
  }
};

export const analyzeVendorRisk = async (vendorId) => {
  try {
    const response = await fetch(`${API_URL}/${vendorId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to analyze vendor risk");
    }

    return data;
  } catch (error) {
    console.warn("Backend risk API unavailable, using local estimate:", error);
    const vendor =
      INITIAL_VENDORS_DATA.find((v) => v.id === vendorId || v._id === vendorId) ||
      INITIAL_VENDORS_DATA[0];

    return {
      success: true,
      message: "Offline local estimate",
      data: estimateRiskFromVendor(vendor),
    };
  }
};
