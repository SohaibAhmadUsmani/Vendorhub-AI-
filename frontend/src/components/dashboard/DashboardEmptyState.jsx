import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3 } from "lucide-react";

/* --------------------------------------------------------------------------
   DashboardEmptyState — canonical empty state for dashboard widgets.
   Centered composition: icon → message → hint → optional CTA. `action` is
   `{ label, to }` (renders a React Router Link) or `{ label, onClick }`
   (renders a button), so empty widgets always offer a next step.
   `icon` is an optional Lucide icon node; falls back to the default
   trend illustration used across the dashboard.
   -------------------------------------------------------------------------- */

function DefaultIllustration() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-purple-light)] to-[var(--accent-cyan-light)]">
      <TrendingUp className="h-7 w-7 text-[var(--primary-purple)]" strokeWidth={2} />
      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--bg-card)] p-1 shadow-sm ring-1 ring-[var(--border-card)]">
        <BarChart3 className="h-3 w-3 text-[var(--accent-cyan)]" strokeWidth={2.5} />
      </span>
    </div>
  );
}

function ActionButton({ action }) {
  if (!action) return null;
  const className =
    "mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)] hover:text-white";
  return action.to ? (
    <Link to={action.to} className={className}>
      {action.label}
    </Link>
  ) : (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

function LegacyRetryButton({ onRetry }) {
  return (
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)] hover:text-white"
    >
      Retry
    </button>
  );
}

export default function DashboardEmptyState({ icon, title, hint, action, onRetry, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-1 flex-col items-center justify-center px-4 text-center ${
        compact ? "py-8" : "py-12"
      }`}
    >
      {icon ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-purple-light)] to-[var(--accent-cyan-light)]">
          <span className="text-[var(--primary-purple)]">{icon}</span>
        </span>
      ) : (
        <DefaultIllustration />
      )}
      <p className="mt-4 font-heading text-[13px] font-bold text-[var(--text-primary)]">{title}</p>
      {hint && (
        <p className="mt-1 max-w-[17rem] text-xs leading-5 text-[var(--text-muted)]">{hint}</p>
      )}
      <ActionButton action={action} />
      {!action && onRetry && <LegacyRetryButton onRetry={onRetry} />}
    </motion.div>
  );
}
