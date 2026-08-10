import React from "react";

/* --------------------------------------------------------------------------
   RevenueTooltip — modern tooltip for the revenue area chart. Shows the
   date label, the revenue amount and the point-to-point percentage change
   (computed server-side per timeline point). Matches the dashboard's card
   language: white surface, soft shadow, rounded corners.
   -------------------------------------------------------------------------- */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload ?? {};
  const amount = Number(payload[0]?.value ?? 0);
  const change = point.changePercent != null ? Number(point.changePercent) : null;

  return (
    <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] px-4 py-3 shadow-2xl shadow-black/10">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 font-heading text-lg font-extrabold leading-none tracking-tight text-[var(--text-primary)] tabular-nums">
        {currency.format(amount)}
      </p>
      {change != null && (
        <p
          className={`mt-1.5 flex items-center gap-1 text-[11px] font-bold ${
            change >= 0 ? "text-[#059669]" : "text-[#DC2626]"
          }`}
        >
          <span aria-hidden="true">{change >= 0 ? "▲" : "▼"}</span>
          {Math.abs(change)}% vs previous period
        </p>
      )}
    </div>
  );
}
