import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/* --------------------------------------------------------------------------
   PipelineSkeleton — loading placeholder for the RFQ Pipeline card:
   a circular ring + legend rows, matching the populated layout so the card
   holds its dimensions.
   -------------------------------------------------------------------------- */

export default function PipelineSkeleton() {
  return (
    <div
      className="mt-4 flex flex-col items-center gap-6 xl:flex-row"
      aria-busy="true"
      aria-label="Loading pipeline"
    >
      <Skeleton circle width={208} height={208} />
      <div className="w-full flex-1 space-y-3.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Skeleton circle width={10} height={10} />
              <Skeleton width={92} height={12} borderRadius={6} />
            </div>
            <Skeleton width={64} height={12} borderRadius={6} />
          </div>
        ))}
      </div>
    </div>
  );
}
