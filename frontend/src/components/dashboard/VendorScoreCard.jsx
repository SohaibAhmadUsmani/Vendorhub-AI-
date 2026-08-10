import React from "react";
import useCountUp from "./useCountUp";

/* --------------------------------------------------------------------------
   VendorScoreCard — animated vendor score ring with trend label.
   -------------------------------------------------------------------------- */

const scopedStyles = `
  .vh-score-glow {
    filter: drop-shadow(0 0 18px var(--primary-purple));
    animation: vhPulse 3s ease-in-out infinite;
  }
  @keyframes vhPulse {
    0%, 100% { filter: drop-shadow(0 0 12px var(--primary-purple-light)); }
    50%      { filter: drop-shadow(0 0 22px var(--primary-purple)); }
  }
`;

function ScoreRing({ score }) {
  const animated = useCountUp(score ?? 0, 1400);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - animated / 100);

  return (
    <div className="flex items-center gap-5">
      <div className="relative h-[128px] w-[128px]">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`Vendor score ${score ?? 0} percent`}>
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--primary-purple-light)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--primary-purple)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="vh-score-glow transition-[stroke-dashoffset]"
            style={{ transitionDuration: "1.4s", transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-[30px] font-extrabold text-[var(--text-primary)]">
            {score != null ? `${animated}%` : "—"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Score
          </span>
        </div>
      </div>
      <div className="space-y-1 text-left">
        <p className="font-heading text-lg font-bold text-[var(--text-primary)]">Performance</p>
        <p className="text-xs font-medium text-[var(--text-secondary)]">Live vendor score</p>
      </div>
    </div>
  );
}

export default function VendorScoreCard({ score, trend }) {
  return (
    <div className="vh-fade-up flex-shrink-0">
      <style>{scopedStyles}</style>
      <ScoreRing score={score} />
      {trend != null && (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--bg-main)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-secondary)] ring-1 ring-[var(--border-card)]">
          {trend >= 0 ? "+" : ""}
          {Math.round(trend)}% this week
        </span>
      )}
    </div>
  );
}
