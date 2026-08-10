import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

/* --------------------------------------------------------------------------
   RevenueEmptyState — shown when the vendor has no revenue for the selected
   period. The card stays in place with the exact same dimensions; only the
   content switches to a friendly placeholder.
   -------------------------------------------------------------------------- */

export default function RevenueEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-purple-light)] to-[var(--accent-cyan-light)]">
        <TrendingUp className="h-7 w-7 text-[var(--primary-purple)]" strokeWidth={2} />
      </span>
      <p className="mt-4 font-heading text-sm font-bold text-[var(--text-primary)]">No revenue yet.</p>
      <p className="mt-1 max-w-[18rem] text-[13px] leading-5 text-[var(--text-muted)]">
        Your revenue trends will appear here once sales activity begins.
      </p>
    </motion.div>
  );
}
