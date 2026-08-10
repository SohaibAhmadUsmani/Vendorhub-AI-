import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";

/* --------------------------------------------------------------------------
   AIInsightEmptyState — the AI Insights card's zero-data placeholder.
   Keeps the widget fully visible with the exact copy from the spec.
   -------------------------------------------------------------------------- */

export default function AIInsightEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-main)] px-4 py-10 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-purple-light)] to-[var(--accent-cyan-light)]">
        <BrainCircuit className="h-6 w-6 text-[var(--primary-purple)]" strokeWidth={2} />
      </span>
      <p className="mt-4 font-heading text-[13px] font-bold text-[var(--text-primary)]">
        No AI insights available yet.
      </p>
      <p className="mt-1 max-w-[17rem] text-xs leading-5 text-[var(--text-muted)]">
        Insights will automatically appear as your business activity grows.
      </p>
    </motion.div>
  );
}
