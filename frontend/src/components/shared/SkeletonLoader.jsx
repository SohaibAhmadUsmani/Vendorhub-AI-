import React from 'react';

/**
 * SkeletonLoader — Enterprise Grade Pulsating Placeholder Component
 * Replaces raw spinners and layout shifts with smooth CSS shimmer skeletons
 */
export function SkeletonLoader({ type = 'card', count = 3 }) {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="w-full space-y-3 animate-pulse">
        {items.map((_, idx) => (
          <div 
            key={idx} 
            className="h-16 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-xl" 
          />
        ))}
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {items.map((_, idx) => (
          <div 
            key={idx} 
            className="h-32 bg-slate-200/70 dark:bg-slate-800/70 rounded-2xl p-6 flex flex-col justify-between"
          >
            <div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded" />
            <div className="h-8 w-16 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Default 'card' skeleton (for Product Cards & Vendor Cards)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {items.map((_, idx) => (
        <div 
          key={idx} 
          className="bg-white dark:bg-[#151D30] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <div className="h-48 w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-xl" />
          <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="pt-2 flex justify-between items-center">
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
