const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");
const {
  analyzeVendorRisk,
  analyzeVendorRiskLight,
} = require("../services/riskAnalysisService");

const findVendor = async (vendorId) => {
  if (mongoose.Types.ObjectId.isValid(vendorId)) {
    return Vendor.findById(vendorId);
  }

  const cleanSearch = vendorId
    .replace(/^v-/, "")
    .replace(/-\d+$/, "")
    .replace(/-/g, " ");

  return Vendor.findOne({ name: { $regex: cleanSearch, $options: "i" } });
};

const analyzeAllRisks = async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    const data = vendors.map((vendor) => analyzeVendorRiskLight(vendor));

    return res.status(200).json({
      success: true,
      count: data.length,
      message: "Vendor risk summaries completed",
      data,
    });
  } catch (error) {
    console.error("Bulk risk analysis error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const analyzeRisk = async (req, res) => {
  try {
    const vendor = await findVendor(req.params.vendorId);

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
  analyzeAllRisks,
};
