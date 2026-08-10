import React from "react";

/* --------------------------------------------------------------------------
   QuickActionsSkeleton — shimmer tiles mirroring the 2×3 action grid so the
   rail keeps its shape if the action config were ever API-driven.
   -------------------------------------------------------------------------- */

const TILES = 6;

export default function QuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5" aria-busy="true" aria-label="Loading quick actions">
      {Array.from({ length: TILES }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-[var(--border-card)] bg-[var(--bg-main)]/50 p-4"
        >
          <span className="skeleton-block h-11 w-11 rounded-2xl" />
          <span className="skeleton-block h-3 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
