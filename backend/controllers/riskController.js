const Vendor = require("../models/Vendor");
const { analyzeVendorRisk } = require("../services/riskAnalysisService");

const analyzeRisk = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const riskAnalysis = await analyzeVendorRisk(vendor);

    return res.status(200).json({
      success: true,
      message: "Vendor risk analysis completed",
      data: riskAnalysis,
    });
  } catch (error) {
    console.error("Risk analysis error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeRisk,
};