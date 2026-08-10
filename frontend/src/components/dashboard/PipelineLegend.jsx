import React from "react";
import { motion } from "framer-motion";

/* --------------------------------------------------------------------------
   PipelineLegend — stage-by-stage breakdown for the RFQ Pipeline card:
   colored indicator, status name, count and backend-computed percentage.
   Rows fade in with a gentle stagger.
   -------------------------------------------------------------------------- */

const PASTEL_COLORS = {
  pending: "#C4B5FD",
  quoted: "#7DD3FC",
  negotiation: "#FCD34D",
  accepted: "#5EEAD4",
  completed: "#86EFAC",
};

export default function PipelineLegend({ stages }) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col justify-center gap-2">
      {stages.map((stage, i) => {
        const color = PASTEL_COLORS[stage.key] ?? stage.color;
        return (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: "easeOut" }}
            className="flex items-center justify-between gap-3"
          >
            <span className="flex min-w-0 items-center gap-2 text-[12px] font-medium text-[var(--text-secondary)]">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/60"
                style={{ background: color }}
              />
              <span className="truncate">{stage.name}</span>
            </span>
            <span className="shrink-0 font-mono text-[12px] font-bold text-[var(--text-primary)] tabular-nums">
              {stage.value}
              <span className="ml-1 text-[10px] font-medium text-[var(--text-muted)]">({stage.percentage}%)</span>
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
