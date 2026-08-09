import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* --------------------------------------------------------------------------
   OverviewCardSkeleton — loading placeholder that mirrors the real KPI
   card's exact structure and dimensions (48px circular icon + menu dot, title
   row, large value, growth badge, full-width sparkline slot at the bottom)
   so the grid never shifts while data loads. Subtle shimmer comes from the
   shared skeleton theme in index.css.
   -------------------------------------------------------------------------- */

export default function OverviewCardSkeleton() {
  return (
    <div
      className="dash-card relative flex h-full flex-col overflow-hidden p-6"
      aria-busy="true"
      aria-label="Loading metric"
    >
      {/* Header: circular icon + overflow placeholder */}
      <div className="flex items-start justify-between gap-3">
        <Skeleton circle width={48} height={48} />
        <Skeleton circle width={20} height={20} />
      </div>

      {/* Title */}
      <div className="mt-4">
        <Skeleton width="55%" height={13} borderRadius={6} />
      </div>

      {/* Value */}
      <div className="mt-2">
        <Skeleton width="45%" height={28} borderRadius={8} />
      </div>

      {/* Bottom block: growth badge + sparkline slot */}
      <div className="mt-auto pt-4">
        <Skeleton width={64} height={20} borderRadius={9999} />
        <div className="mt-2 h-10 w-full">
          <Skeleton height="100%" borderRadius={10} />
        </div>
      </div>
    </div>
  );
}
