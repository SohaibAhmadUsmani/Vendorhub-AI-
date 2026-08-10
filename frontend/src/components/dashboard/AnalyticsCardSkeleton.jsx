import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* --------------------------------------------------------------------------
   AnalyticsCardSkeleton — loading placeholder that mirrors the compact
   analytics tile's exact structure (40px icon + menu dot, uppercase title,
   26px value, trend footer) so the grid never shifts while loading.
   -------------------------------------------------------------------------- */

export default function AnalyticsCardSkeleton() {
  return (
    <div
      className="dash-card relative flex h-full w-full min-h-[150px] flex-col overflow-hidden p-5"
      aria-busy="true"
      aria-label="Loading analytics metric"
    >
      {/* Icon + menu */}
      <div className="flex items-start justify-between gap-2">
        <Skeleton circle width={40} height={40} />
        <Skeleton circle width={16} height={16} />
      </div>

      {/* Title */}
      <div className="mt-3">
        <Skeleton width="60%" height={10} borderRadius={6} />
      </div>

      {/* Value */}
      <div className="mt-1">
        <Skeleton width="42%" height={20} borderRadius={8} />
      </div>

      {/* Trend footer */}
      <div className="mt-auto pt-2">
        <Skeleton width={120} height={22} borderRadius={9999} />
      </div>
    </div>
  );
}
