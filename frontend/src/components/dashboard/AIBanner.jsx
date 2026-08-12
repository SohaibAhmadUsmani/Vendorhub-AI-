import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import robotPng from "../../assets/images/robot.png";
import { getRoleRoute } from "../../utils/routeUtils";

/* --------------------------------------------------------------------------
   AIBanner — bottom-of-page AI growth CTA. Default: robot mascot on the
   left, headline, subtitle and a purple-gradient "Explore AI Tools" button.
   Pure marketing UI, no business data. CTA routes to the AI Search module.
   -------------------------------------------------------------------------- */

export default function AIBanner() {
  const navigate = useNavigate();
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[1150px] overflow-hidden rounded-[24px] border border-[#C9C2F2] bg-gradient-to-br from-[#D5C9FF] via-[#E3DCFF] to-[#C3D4FF] p-6 sm:p-8"
      aria-label="AI Features"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-[#6C63FF]/20 to-[#0EA5E9]/20 blur-3xl"
      />

      <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#0EA5E9] text-white shadow-md shadow-[#6C63FF]/25">
            <Sparkles className="h-6 w-6" strokeWidth={2} />
          </span>

          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#6C63FF]">
              AI Procurement Engine
            </p>
            <h2 className="mt-1 font-heading text-2xl font-extrabold leading-tight tracking-tight text-[var(--text-primary)] sm:text-3xl">
              Let AI work for your business.
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
              Sharper pricing, smarter matches and faster quotes — powered by
              real-time insights across your entire catalog.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(getRoleRoute("ai-search"))}
          className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#0EA5E9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6C63FF]/30 transition-transform hover:scale-[1.03] active:scale-95"
        >
          Explore AI Tools
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </button>
      </div>
    </motion.section>
  );
}