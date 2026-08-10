import React from "react";
import { motion } from "framer-motion";
import { CloudOff, RotateCcw } from "lucide-react";

/* --------------------------------------------------------------------------
   DashboardErrorState — canonical error state for dashboard widgets.
   Friendly message + illustration + retry. Never raw red error text.
   -------------------------------------------------------------------------- */

export default function DashboardErrorState({ icon, title, hint, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-main)] px-4 py-10 text-center"
      role="alert"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--border-card)]/40 text-[var(--text-muted)]">
        {icon ?? <CloudOff className="h-6 w-6" strokeWidth={2} />}
      </span>
      <p className="mt-4 font-heading text-[13px] font-bold text-[var(--text-primary)]">{title}</p>
      {hint && (
        <p className="mt-1 max-w-[18rem] text-xs leading-5 text-[var(--text-muted)]">{hint}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)] hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Retry
        </button>
      )}
    </motion.div>
  );
}
