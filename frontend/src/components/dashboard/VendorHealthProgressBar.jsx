import React from "react";
import { motion } from "framer-motion";

/* --------------------------------------------------------------------------
   VendorHealthProgressBar — animated gradient progress bar. Rounds the value
   to a whole number, animates from 0 on enter and supports a per-metric
   gradient. Pure presentation; the value comes from the backend.
   -------------------------------------------------------------------------- */

export default function VendorHealthProgressBar({ value, gradient, delay = 0 }) {
  const width = value != null ? `${Math.max(0, Math.min(100, value))}%` : "0%";

  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-[var(--border-card)]/50"
      role="progressbar"
      aria-valuenow={value ?? 0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Health metric progress"
    >
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        initial={{ width: 0 }}
        whileInView={{ width }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ delay: 0.15 + delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
