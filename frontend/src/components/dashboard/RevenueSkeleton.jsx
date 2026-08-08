import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonChart } from "./DashboardSkeleton";

/* --------------------------------------------------------------------------
   RevenueSkeleton — loading placeholder for the Revenue Overview card.
   Mirrors the summary row + chart area so the card keeps its dimensions
   while analytics load.
   -------------------------------------------------------------------------- */

export default function RevenueSkeleton() {
  return (
    <div className="mt-6 flex flex-1 flex-col" aria-busy="true" aria-label="Loading revenue analytics">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton width={110} height={12} borderRadius={6} />
          <Skeleton width={170} height={30} borderRadius={8} />
        </div>
        <Skeleton width={120} height={22} borderRadius={9999} />
      </div>
      <div className="mt-6 h-[260px] w-full sm:h-[300px]">
        <SkeletonChart />
      </div>
    </div>
  );
}
