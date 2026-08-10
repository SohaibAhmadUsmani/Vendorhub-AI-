import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { analyzeVendorRisk } from "../services/riskAnalysisService";

const getRiskColor = (level) => {
  switch (level) {
    case "Low":
      return "#16a34a";
    case "Medium":
      return "#ca8a04";
    case "High":
      return "#ea580c";
    case "Critical":
      return "#dc2626";
    default:
      return "#64748b";
  }
};

export default function RiskAnalysisPage() {
  const { vendorId } = useParams();

  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRisk = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await analyzeVendorRisk(vendorId);

        setRisk(result.data);
      } catch (err) {
        setError(
          err.message || "Failed to load risk analysis"
        );
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) {
      loadRisk();
    }
  }, [vendorId]);

  if (loading) {
    return (
      <div className="p-6">
        <p>Analyzing supplier risk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="p-6">
        No risk analysis available.
      </div>
    );
  }

  const riskColor = getRiskColor(risk.riskLevel);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          AI Risk Analysis
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          AI-powered supplier risk assessment
        </p>
      </div>

      {/* Risk Score */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Overall Risk Score
            </p>

            <div className="mt-2 flex items-center gap-3">
              <span
                className="text-4xl font-bold"
                style={{ color: riskColor }}
              >
                {risk.riskScore}
              </span>

              <span className="text-slate-400">
                / 100
              </span>
            </div>
          </div>

          <div
            className="rounded-full px-4 py-2 text-sm font-bold text-white"
            style={{ backgroundColor: riskColor }}
          >
            {risk.riskLevel}
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-900">
          Risk Factors
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["Supplier Verification", risk.verificationRisk],
            ["Business Age", risk.businessAgeRisk],
            ["Certifications", risk.certificationRisk],
            ["Delivery", risk.deliveryRisk],
            ["Financial", risk.financialRisk],
            ["Fraud Indicators", risk.fraudRisk],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
            >
              <span className="text-sm font-medium text-slate-700">
                {label}
              </span>

              <span
                className="rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  color: getRiskColor(value),
                  backgroundColor: `${getRiskColor(value)}18`,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          AI Assessment
        </h2>

        <p className="text-sm leading-6 text-slate-600">
          {risk.summary}
        </p>
      </div>

      {/* Recommendation */}
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
        <h2 className="mb-3 text-lg font-bold text-violet-900">
          Procurement Recommendation
        </h2>

        <p className="text-sm leading-6 text-violet-800">
          {risk.recommendation}
        </p>
      </div>
    </div>
  );
}