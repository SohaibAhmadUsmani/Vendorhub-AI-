import React from "react";

/* --------------------------------------------------------------------------
   AIInsightsSkeleton — full-page loading state. Mirrors the AI Insights page
   layout (header, KPI row, main two-column grids, four-card breakdown) using
   theme-aware shimmer blocks.
   -------------------------------------------------------------------------- */

function Block({ className = "" }) {
  return <span className={`skeleton-block block ${className}`} />;
}

export default function AIInsightsSkeleton() {
  return (
    <div className="space-y-4 lg:space-y-5" aria-busy="true" aria-label="Loading AI insights">
      {/* KPI row placeholder. */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <span className="skeleton-block h-10 w-10 rounded-full" />
              <Block className="h-3 flex-1 rounded-full" />
            </div>
            <Block className="mt-4 h-6 w-16 rounded-lg" />
            <Block className="mt-2 h-3 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Summary + opportunities placeholder. */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-3xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <span className="skeleton-block h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <Block className="h-4 w-40 rounded-lg" />
              <Block className="h-3 w-52 rounded-full" />
            </div>
          </div>
          <Block className="mt-6 h-24 w-4/5 rounded-2xl" />
          <Block className="mt-3 h-3 w-3/5 rounded-full" />
        </div>
        <div className="rounded-3xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <span className="skeleton-block h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <Block className="h-4 w-36 rounded-lg" />
              <Block className="h-3 w-44 rounded-full" />
            </div>
          </div>
          <Block className="mt-5 h-16 w-full rounded-2xl" />
          <Block className="mt-2.5 h-16 w-full rounded-2xl" />
        </div>
      </div>

      {/* Trend + recommendations placeholder. */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-3xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <span className="skeleton-block h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <Block className="h-4 w-32 rounded-lg" />
              <Block className="h-3 w-48 rounded-full" />
            </div>
          </div>
          <div className="mt-5 flex gap-5">
            <Block className="h-52 w-full rounded-2xl" />
            <Block className="hidden h-40 w-24 rounded-xl md:block" />
          </div>
        </div>
        <div className="rounded-3xl bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <span className="skeleton-block h-11 w-11 rounded-full" />
            <div className="space-y-2">
              <Block className="h-4 w-40 rounded-lg" />
              <Block className="h-3 w-44 rounded-full" />
            </div>
          </div>
          <Block className="mt-5 h-14 w-full rounded-2xl" />
          <Block className="mt-2.5 h-14 w-full rounded-2xl" />
        </div>
      </div>

      {/* Four-card breakdown placeholder. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-[var(--bg-card)] p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2.5">
              <span className="skeleton-block h-9 w-9 rounded-xl" />
              <Block className="h-3 flex-1 rounded-full" />
            </div>
            <Block className="mt-4 h-20 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}