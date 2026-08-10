import React from "react";

/* --------------------------------------------------------------------------
   DashboardSection — semantic section wrapper for composed dashboard groups
   (analytics grid, business activity grid). Optional header row when the
   section needs a title; otherwise a plain labeled <section>.
   -------------------------------------------------------------------------- */

export default function DashboardSection({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
  className = "",
  bodyClassName = "",
  "aria-label": ariaLabel,
}) {
  return (
    <section className={className} aria-label={ariaLabel}>
      {(eyebrow || title || subtitle) && (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            {eyebrow && (
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-purple)]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-[28px] xl:text-[32px]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[16px] leading-6 text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
