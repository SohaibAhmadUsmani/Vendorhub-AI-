import React from "react";
import { Sparkles, ArrowRight, Store } from "lucide-react";
import { Link } from "react-router-dom";

const recommendations = [
  {
    id: 1,
    title: "Explore verified electronics suppliers",
    description:
      "AI found suppliers that match your recent product searches.",
  },
  {
    id: 2,
    title: "Compare pricing for your active RFQs",
    description:
      "You have multiple quotes that may benefit from a price comparison.",
  },
  {
    id: 3,
    title: "Review new vendor matches",
    description:
      "New suppliers matching your purchasing preferences are available.",
  },
];

export default function AIRecommendations() {
  return (
    <div className="dash-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-purple)]/10 text-[var(--primary-purple)]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-purple)]">
              AI Powered
            </p>

            <h3 className="mt-1 font-heading text-xl font-extrabold text-[var(--text-primary)]">
              AI Recommendations
            </h3>

            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Smart suggestions based on your buying activity.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 space-y-3">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="group flex items-start gap-4 rounded-xl border border-[#EEF1F6] bg-[#FAFBFD] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary-purple)]/20 hover:shadow-sm"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[var(--primary-purple)] shadow-sm">
              <Store className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                {recommendation.title}
              </h4>

              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                {recommendation.description}
              </p>
            </div>

            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--text-light)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary-purple)]" />
          </div>
        ))}
      </div>

      {/* Action */}
      <Link
        to="/buyer/ai-search"
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-purple)] hover:underline"
      >
        Explore AI recommendations
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}