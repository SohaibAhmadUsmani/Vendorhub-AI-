import React from 'react';

/**
 * EmptyState — Standardized Enterprise Empty State Component
 * Renders consistent empty states for missing products, orders, RFQs, and search results
 */
export function EmptyState({ 
  icon = '📦', 
  title = 'No Data Found', 
  description = 'There are no items matching your criteria at this time.', 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#151D30] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm my-6">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 flex items-center justify-center text-3xl mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-purple-primary min-h-[48px] px-6 text-sm font-semibold rounded-xl"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
