import React from "react";

/* --------------------------------------------------------------------------
   AIInsightSkeleton — shimmer rows mirroring AIInsightItem's exact layout so
   the card never collapses or shifts while insights load.
   -------------------------------------------------------------------------- */

const ROWS = 3;

export default function AIInsightSkeleton() {
  return (
    <div className="space-y-2.5" aria-busy="true" aria-label="Loading AI insights">
      {Array.from({ length: ROWS }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-main)]/60 p-3.5"
        >
          <span className="skeleton-block h-9 w-9 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="skeleton-block block h-3.5 w-32 rounded-full" />
              <span className="skeleton-block block h-4 w-12 rounded-full" />
            </div>
            <span className="skeleton-block block h-3 w-full rounded-full" />
            <span className="skeleton-block block h-3 w-2/3 rounded-full" />
            <span className="skeleton-block block h-2.5 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
