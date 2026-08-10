import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OverviewCardSkeleton from "./OverviewCardSkeleton";

/* --------------------------------------------------------------------------
   DashboardSkeleton — canonical loading skeletons built on react-loading-skeleton.
   Every widget renders these while its own query loads; no spinners, no text.
   -------------------------------------------------------------------------- */

export function SkeletonRows({ rows = 5 }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading rows">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl p-2">
          <Skeleton circle width={38} height={38} />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={12} />
            <Skeleton width="40%" height={10} />
          </div>
          <Skeleton width={72} height={30} borderRadius={12} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ bars = 7 }) {
  const heights = [40, 62, 28, 72, 50, 84, 36];
  return (
    <div className="flex h-full flex-col justify-end space-y-4" aria-busy="true" aria-label="Loading chart">
      <div className="flex items-end gap-2 overflow-hidden sm:gap-3">
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} className="flex-1">
            <Skeleton height={`${heights[i % heights.length]}%`} borderRadius={12} />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        {[5, 6, 5, 6, 5].map((w, i) => (
          <Skeleton key={i} width={`${w}rem`} height={10} borderRadius={9999} />
        ))}
      </div>
    </div>
  );
}

/** KPI card skeleton — delegates to the dedicated OverviewCardSkeleton so
    the loading surface always mirrors the real card's exact dimensions. */
export function KpiSkeleton() {
  return <OverviewCardSkeleton />;
}

export function SkeletonBlock({ width, height, circle = false, borderRadius, className = "" }) {
  return (
    <Skeleton
      width={width}
      height={height}
      circle={circle}
      borderRadius={borderRadius}
      className={className}
      aria-hidden="true"
    />
  );
}
