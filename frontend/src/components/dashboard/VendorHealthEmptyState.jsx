import React from "react";
import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";

/* --------------------------------------------------------------------------
   VendorHealthEmptyState — shown when the backend has insufficient data to
   score any health metric. Exact copy from the spec; widget stays visible.
   -------------------------------------------------------------------------- */

export default function VendorHealthEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-card)] bg-[var(--bg-main)] px-4 py-10 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-cyan-light)]">
        <HeartPulse className="h-6 w-6 text-[var(--accent-cyan)]" strokeWidth={2} />
      </span>
      <p className="mt-4 max-w-[17rem] font-heading text-[13px] font-bold leading-snug text-[var(--text-primary)]">
        Vendor health metrics will appear once sufficient business activity has been recorded.
      </p>
    </motion.div>
  );
}
