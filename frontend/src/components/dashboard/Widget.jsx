import React from "react";
import { motion } from "framer-motion";

/* --------------------------------------------------------------------------
   Widget — Premium glass card shell + section header used by every vendor
   dashboard widget. Fade-up entrance handled by framer-motion.

   Typography scale (Stripe / Linear inspired):
     - Card titles:  13–14px
     - Card eyebrow: 10px uppercase
     - Card values:  26–32px
   -------------------------------------------------------------------------- */

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
};

export function GlassCard({ children, className = "", delay = 0 }) {
  return (
    <motion.section
      custom={delay}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`glass-panel group relative flex flex-col overflow-hidden rounded-3xl p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-hover)] sm:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-[var(--primary-purple)]/10 to-transparent blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary-purple)]/40 to-transparent" />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.section>
  );
}

export function WidgetHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 space-y-1">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--primary-purple)]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-sm font-bold tracking-tight text-[var(--text-primary)] sm:text-[15px]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs leading-5 text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}