import React from "react";

/* --------------------------------------------------------------------------
   OverviewCardEmptyState — shown inside a KPI card when its value is zero
   (or missing). The card stays fully visible with the value (0), its icon
   and a friendly backend-driven hint ("Waiting for new RFQs") above a
   subtle dashed placeholder line — never a blank surface.
   -------------------------------------------------------------------------- */

export default function OverviewCardEmptyState({ hint, accent = "#6C5CE7" }) {
  return (
    <div className="mt-5 flex flex-1 flex-col justify-end">
      <div className="h-8 w-full" aria-hidden="true">
        <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="h-full w-full">
          <line
            x1="4"
            y1="32"
            x2="196"
            y2="32"
            stroke={`${accent}30`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 8"
          />
        </svg>
      </div>
      <p className="mt-2 text-[11px] font-medium text-[var(--text-muted)]">
        {hint ?? "No activity yet"}
      </p>
    </div>
  );
}
