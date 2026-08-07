import React from 'react';

/**
 * SkeletonLoader — High-Taste Shimmer Skeletons (taste-skill & ui-ux-pro-max-skill)
 * Used during API loading states across Vendors and Product Catalog
 */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-xl bg-slate-700/40 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-700/40" />
          <div className="h-3 w-1/2 rounded bg-slate-700/20" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-slate-700/30" />
        <div className="h-3 w-5/6 rounded bg-slate-700/30" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
        <div className="h-4 w-20 rounded bg-slate-700/40" />
        <div className="h-8 w-24 rounded-lg bg-slate-700/40" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
