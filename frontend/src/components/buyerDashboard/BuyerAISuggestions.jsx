import React from "react";
import { ArrowRight, Sparkles, Store } from "lucide-react";
import DashboardSection from "../dashboard/DashboardSection";

const recommendations = [
  {
    id: 1,
    vendor: "Premium Industrial Supplies",
    reason: "Matches your recent RFQ requirements",
    match: "96%",
  },
  {
    id: 2,
    vendor: "Global Manufacturing Co.",
    reason: "Competitive pricing for your current needs",
    match: "91%",
  },
  {
    id: 3,
    vendor: "Reliable Trade Solutions",
    reason: "Highly rated in your preferred category",
    match: "87%",
  },
];

export default function BuyerAISuggestions() {
  return (
    <DashboardSection
      eyebrow="AI Assistant"
      title="AI Recommendations"
      subtitle="Smart vendor suggestions based on your procurement activity."
    >
      <div className="dash-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-purple)]/10 text-[var(--primary-purple)]">
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          </div>

          <div>
            <p className="font-heading text-sm font-bold text-[var(--text-primary)]">
              Recommended for you
            </p>

            <p className="text-xs text-[var(--text-muted)]">
              AI-powered supplier matching
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {recommendations.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[var(--border)] p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[var(--text-secondary)]">
                  <Store className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                      {item.vendor}
                    </p>

                    <span className="shrink-0 text-xs font-bold text-emerald-600">
                      {item.match}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                    {item.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-purple)] hover:underline"
        >
          View all recommendations
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </DashboardSection>
  );
}