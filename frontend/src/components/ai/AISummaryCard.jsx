import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import summaryRobotPng from "../../assets/images/summary robot.png";

/* --------------------------------------------------------------------------
   AISummaryCard — the executive summary on the AI Insights page, presented
   as the page's hero card: a clean white surface with purple accents. It is
   a true two-column layout: the left column holds the AI prose plus dynamic
   insight bullets, the right column is a reserved area for the robot mascot
   (transparent PNG), so text never renders underneath the robot. On small
   screens the columns stack with the robot centered below the content. All
   content is backend/Groq-driven.
   -------------------------------------------------------------------------- */

const PRIORITY_DOT = {
  high: { dot: "bg-[#EF4444]", label: "High" },
  medium: { dot: "bg-[#F59E0B]", label: "Medium" },
  low: { dot: "bg-[#22C55E]", label: "Low" },
};

export default function AISummaryCard({ page }) {
  const summary = page?.summary;
  const observations = page?.observations ?? [];
  const bullets = observations.slice(0, 3);
  const text = summary?.text ?? null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="dash-card relative flex min-w-0 flex-col overflow-hidden rounded-3xl p-5 sm:p-6"
      aria-label="AI executive summary"
    >
      {/* Soft purple glows — AI accent, never heavy. */}
      <span aria-hidden="true" className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[var(--primary-purple)]/10 blur-2xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-10 h-44 w-44 rounded-full bg-[var(--accent-cyan)]/10 blur-2xl" />

      <div className="relative z-10 flex h-full min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="icon-tile shrink-0 bg-gradient-to-br from-[var(--primary-purple)] to-[var(--accent-cyan)] shadow-[var(--shadow-sm)]">
            <Sparkles className="h-6 w-6 text-white" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[17px] font-bold tracking-tight text-[var(--text-primary)]">
              Executive Summary
            </h2>
            <p className="truncate text-[12px] font-medium text-[var(--text-muted)]">
              {page?.periodLabel ?? "Your business at a glance"} · composed from live data
            </p>
          </div>
        </div>

        {/*
          Two-column body —
          LEFT  : prose + insight bullets, flex-1 so it takes all remaining space.
          RIGHT : dedicated mascot area (shrink-0, fixed responsive width) so the
                  robot is a real sibling column and text never sits underneath it.
          Below md the two stack (robot centered under the content) instead of
          overlapping. .ai-mascot-idle keeps the gentle idle sway.
        */}
        <div className="my-auto flex min-w-0 flex-1 flex-col gap-4 py-5 md:flex-row md:items-stretch md:gap-5">
          {/* LEFT — text + insights, wraps naturally within its own column. */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <p className="border-l-[3px] border-[var(--primary-purple)] pl-3 text-[12px] leading-[1.7] text-[var(--text-secondary)] lg:text-[12.5px]">
              {text ??
                "There isn't enough activity in this period yet to summarize — new RFQs, orders and inquiries will appear here as they happen."}
            </p>

            {bullets.length > 0 && (
              <ul className="space-y-2.5">
                {bullets.map((item) => {
                  const meta = PRIORITY_DOT[item.priority] ?? PRIORITY_DOT.medium;
                  return (
                    <li
                      key={item.id}
                      className="flex items-start gap-2.5 rounded-xl border border-[#EEF1F6] bg-[var(--bg-subtle)] px-3 py-2.5"
                    >
                      <span aria-hidden="true" className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-bold leading-snug text-[var(--text-primary)]">{item.title}</p>
                        {item.description && (
                          <p className="line-clamp-1 text-[12px] leading-[1.5] text-[var(--text-muted)]">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* RIGHT — reserved mascot area, robot fully visible and unobstructed. */}
          <div className="flex w-full shrink-0 items-center justify-center md:w-[150px] md:justify-end md:pr-1 lg:w-[176px] xl:w-[196px]">
            <img
              src={summaryRobotPng}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="ai-mascot-idle pointer-events-none w-[118px] select-none object-contain drop-shadow-[0_16px_28px_rgba(108,99,255,0.35)] md:w-[134px] lg:w-[158px] xl:w-[178px]"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}