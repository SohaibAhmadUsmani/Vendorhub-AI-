import React from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const recentSearches = [
  {
    id: 1,
    query: "Electronic components",
    date: "Today",
  },
  {
    id: 2,
    query: "Packaging suppliers",
    date: "Yesterday",
  },
  {
    id: 3,
    query: "Industrial equipment",
    date: "2 days ago",
  },
  {
    id: 4,
    query: "Raw material vendors",
    date: "3 days ago",
  },
];

export default function RecentSearches() {
  return (
    <div className="dash-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-purple)]">
            Buyer Activity
          </p>

          <h3 className="mt-1 font-heading text-xl font-extrabold text-[var(--text-primary)]">
            Recent Searches
          </h3>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Quickly revisit your latest vendor searches.
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-purple)]/10 text-[var(--primary-purple)]">
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* Searches */}
      <div className="mt-5 divide-y divide-[#EEF1F6]">
        {recentSearches.map((search) => (
          <Link
            key={search.id}
            to={`/buyer/ai-search?search=${encodeURIComponent(search.query)}`}
            className="group flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7F8FC] text-[var(--text-muted)] transition-colors group-hover:bg-[var(--primary-purple)]/10 group-hover:text-[var(--primary-purple)]">
                <Search className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                  {search.query}
                </p>

                <p className="mt-0.5 text-xs text-[var(--text-light)]">
                  {search.date}
                </p>
              </div>
            </div>

            <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-light)] transition-colors group-hover:text-[var(--primary-purple)]" />
          </Link>
        ))}
      </div>

      <Link
        to="/buyer/ai-search"
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-purple)] hover:underline"
      >
        View all searches
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}