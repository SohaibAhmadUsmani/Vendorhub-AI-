import React from "react";

/* --------------------------------------------------------------------------
   VendorHealthSkeleton — shimmer rows mirroring VendorHealthMetric's layout
   (icon, label + value, bar, detail) so the card holds its shape while the
   health payload loads.
   -------------------------------------------------------------------------- */

const ROWS = 5;

export default function VendorHealthSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading vendor health">
      {Array.from({ length: ROWS }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="skeleton-block h-8 w-8 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="skeleton-block block h-3.5 w-32 rounded-full" />
              <span className="skeleton-block block h-3.5 w-8 rounded-full" />
            </div>
            <span className="skeleton-block block h-1.5 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
