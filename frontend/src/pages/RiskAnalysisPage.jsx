import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  analyzeVendorRisk,
  analyzeAllVendorsRisk,
} from "../services/riskAnalysisService";

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

const RISK_FACTOR_LABELS = [
  ["Supplier Verification", "verificationRisk"],
  ["Business Age", "businessAgeRisk"],
  ["Certifications", "certificationRisk"],
  ["Delivery", "deliveryRisk"],
  ["Financial", "financialRisk"],
  ["Fraud Indicators", "fraudRisk"],
];

function RiskLevelBadge({ level }) {
  const color = getRiskColor(level);

  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {level}
    </span>
  );
}

function FactorPill({ label, value }) {
  const color = getRiskColor(value);

  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span
        className="rounded-full px-3 py-1 text-xs font-bold"
        style={{
          color,
          backgroundColor: `${color}18`,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function RiskListView({ onSelect }) {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");

  const loadRisks = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await analyzeAllVendorsRisk();
      setRisks(result);
    } catch (err) {
      setError(err.message || "Failed to load risk analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisks();
  }, []);

  const filtered = risks.filter((risk) => {
    const matchesLevel = levelFilter === "All" || risk.riskLevel === levelFilter;
    const matchesSearch = !search ||
      (risk.vendorName || "").toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Risk Analysis</h1>
          <p className="mt-1 text-sm text-slate-500">
            AI-powered supplier risk assessment across your vendor base
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers..."
            aria-label="Search suppliers"
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 sm:w-64"
          />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            aria-label="Filter by risk level"
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 sm:w-44"
          >
            <option value="All">All Levels</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
          <button
            type="button"
            onClick={loadRisks}
            className="ml-3 text-sm font-bold text-red-700 underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            No suppliers match your search.
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((risk) => {
            const color = getRiskColor(risk.riskLevel);

            return (
              <button
                type="button"
                key={risk.vendorId}
                onClick={() => onSelect(risk.vendorId)}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-[#6C5CE7] hover:shadow-hover"
              >
                <div className="flex items-center gap-3">
                  {risk.logoImage ? (
                    <img
                      src={risk.logoImage}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0EBFE] text-lg font-bold text-[#6C5CE7]">
                      {(risk.vendorName || "?").charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {risk.vendorName || "Unknown Supplier"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="text-lg font-bold"
                        style={{ color }}
                      >
                        {risk.riskScore}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                      <RiskLevelBadge level={risk.riskLevel} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {RISK_FACTOR_LABELS.map(([label, key]) => (
                    <span
                      key={key}
                      title={label}
                      className="rounded-full px-2.5 py-1 text-[10px] font-bold"
                      style={{
                        color: getRiskColor(risk[key]),
                        backgroundColor: `${getRiskColor(risk[key])}18`,
                      }}
                    >
                      {key.replace("Risk", "").replace(/([A-Z])/g, " $1").trim()}: {risk[key]}
                    </span>
                  ))}
                </div>

                {risk.summary && (
                  <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-500">
                    {risk.summary}
                  </p>
                )}

                <span className="mt-4 inline-flex items-center text-xs font-bold text-[#6C5CE7]">
                  View Full Analysis →
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RiskDetailView({ vendorId, onBack }) {
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRisk = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await analyzeVendorRisk(vendorId);

      setRisk(result.data);
    } catch (err) {
      setError(err.message || "Failed to load risk analysis");
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorId) {
      loadRisk();
    }
  }, [vendorId, loadRisk]);

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
          <button
            type="button"
            onClick={loadRisk}
            className="ml-3 text-sm font-bold text-red-700 underline cursor-pointer"
          >
            Retry
          </button>
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
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm font-semibold text-slate-500 transition-colors hover:text-[#6C5CE7]"
      >
        ← Back to all suppliers
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Risk Analysis</h1>
          <p className="mt-1 text-sm text-slate-500">
            {risk.vendorName ? `${risk.vendorName} — ` : ""}
            AI-powered supplier risk assessment
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Overall Risk Score</p>

            <div className="mt-2 flex items-center gap-3">
              <span className="text-4xl font-bold" style={{ color: riskColor }}>
                {risk.riskScore}
              </span>

              <span className="text-slate-400">/ 100</span>
            </div>
          </div>

          <RiskLevelBadge level={risk.riskLevel} />
        </div>

        {risk.factors && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider">
                Risk Breakdown
              </span>
              <span>Lower is safer</span>
            </div>
            <div className="space-y-2">
              {RISK_FACTOR_LABELS.map(([label, key]) => {
                const factor = risk.factors[key];

                if (!factor) return null;

                const color = getRiskColor(factor.level);

                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{label}</span>
                      <span className="font-bold" style={{ color }}>
                        {factor.score} · {factor.level}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${factor.score}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-bold text-slate-900">Risk Factors</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {RISK_FACTOR_LABELS.map(([label, key]) => (
            <FactorPill key={key} label={label} value={risk[key]} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-bold text-slate-900">AI Assessment</h2>

        <p className="text-sm leading-6 text-slate-600">{risk.summary}</p>
      </div>

      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-6">
        <h2 className="mb-3 text-lg font-bold text-violet-900">
          Procurement Recommendation
        </h2>

        <p className="text-sm leading-6 text-violet-800">{risk.recommendation}</p>
      </div>

      {risk.factors &&
        Object.values(risk.factors).some(
          (factor) => factor.findings && factor.findings.length > 0
        ) && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Key Findings
            </h2>

            <div className="space-y-4">
              {RISK_FACTOR_LABELS.map(([label, key]) => {
                const factor = risk.factors[key];

                if (!factor || !factor.findings || factor.findings.length === 0) {
                  return null;
                }

                return (
                  <div key={key}>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {label}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {factor.findings.map((finding, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <span style={{ color: getRiskColor(factor.level) }}>
                            •
                          </span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
}

export default function RiskAnalysisPage() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  if (vendorId) {
    return (
      <RiskDetailView
        vendorId={vendorId}
        onBack={() => navigate("/buyer/risk-analysis")}
      />
    );
  }

  return (
    <RiskListView
      onSelect={(id) => navigate(`/buyer/risk-analysis/${id}`)}
    />
  );
}
