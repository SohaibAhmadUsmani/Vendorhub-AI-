import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import robotPng from "../../assets/images/robot.png";

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
      aria-label="AI growth banner"
    >
      <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#6C63FF]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-60 w-60 rounded-full bg-[#0EA5E9]/15 blur-3xl" />

      <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4 sm:items-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 16 }}
            className="group relative flex shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            <span className="absolute h-28 w-28 rounded-full bg-[#6C63FF]/20 blur-3xl" />
            <span className="float-y relative inline-block">
              <img
                src={robotPng}
                alt=""
                draggable={false}
                className="h-[120px] w-auto cursor-pointer select-none object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_12px_24px_rgba(108,99,255,0.55)] sm:h-[140px]"
              />
            </span>
            <Sparkles className="absolute -right-1 top-2 h-6 w-6 text-[#FBBF24]" strokeWidth={2.4} fill="currentColor" />
          </motion.div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-purple)]">
              VendorHub Intelligence
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
          onClick={() => navigate("/buyer/ai-search")}
          className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#0EA5E9] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#6C63FF]/30 transition-transform hover:scale-[1.03] active:scale-95"
        >
          Explore AI Tools
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
        </button>
      </div>
    </motion.section>
  );
}