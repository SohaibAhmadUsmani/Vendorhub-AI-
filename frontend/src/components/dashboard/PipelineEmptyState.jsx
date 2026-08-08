import React from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

/* --------------------------------------------------------------------------
   PipelineEmptyState — shown when the vendor has no RFQs. The card keeps
   its dimensions and a friendly placeholder explains the pipeline will fill
   in as RFQs move through stages.
   -------------------------------------------------------------------------- */

export default function PipelineEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-purple-light)] to-[var(--accent-cyan-light)]">
        <Layers className="h-7 w-7 text-[var(--primary-purple)]" strokeWidth={2} />
      </span>
      <p className="mt-4 font-heading text-sm font-bold text-[var(--text-primary)]">Your pipeline is empty.</p>
      <p className="mt-1 max-w-[18rem] text-[13px] leading-5 text-[var(--text-muted)]">
        It will automatically populate as RFQs move through different stages.
      </p>
    </motion.div>
  );
}
