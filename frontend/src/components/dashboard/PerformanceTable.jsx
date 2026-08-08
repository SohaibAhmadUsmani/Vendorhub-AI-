import React from "react";
import { motion } from "framer-motion";
import { Minus, PackageSearch, TrendingDown, TrendingUp } from "lucide-react";

/* --------------------------------------------------------------------------
   PerformanceTable — product performance rows (ProductPerformanceCard body).
   Every cell is backend-driven: RFQ count, order count, revenue, conversion
   rate, trend and status badge. Rows are memoized and horizontally
   scrollable on small screens so the card never overflows. The table is
   always rendered — with no listings it shows a single elegant empty row so
   the card never collapses.
   -------------------------------------------------------------------------- */

const STATUS_STYLES = {
  Trending: "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]",
  Rising: "bg-[var(--accent-cyan-light)] text-[#0E7490]",
  New: "bg-[var(--primary-purple-light)] text-[var(--primary-purple)]",
  Steady: "bg-[var(--border-card)]/60 text-[var(--text-secondary)]",
  Listed: "bg-[var(--border-card)]/50 text-[var(--text-muted)]",
  Cooling: "bg-[#FEF3C7] text-[#B45309]",
};

const COLUMNS = ["Product", "RFQs", "Orders", "Revenue", "Conv.", "Trend", "Status"];

function formatRevenue(value) {
  const amount = Number(value) || 0;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}k`;
  return `$${amount.toFixed(0)}`;
}

function formatCount(value) {
  const n = Number(value) || 0;
  return n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n);
}

function TrendBadge({ trend }) {
  if (trend == null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--border-card)]/60 px-2 py-0.5 text-[10px] font-bold text-[var(--text-muted)]">
        <Minus className="h-3 w-3" strokeWidth={2.5} />
        flat
      </span>
    );
  }
  const up = trend >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
        up
          ? "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]"
          : "bg-[#FEE2E2] text-[#B91C1C]"
      }`}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {up ? "+" : ""}
      {Math.round(Math.abs(trend))}%
    </span>
  );
}

function ProductCell({ product }) {
  const initials = (product.name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {product.thumbnail ? (
        <img
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-1 ring-[var(--border-card)]"
        />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-purple-light)] to-[var(--accent-cyan-light)] font-heading text-xs font-extrabold text-[var(--primary-purple)]">
          {initials || "?"}
        </span>
      )}
      <div className="min-w-0">
        <p className="max-w-[14rem] truncate text-[14px] font-semibold leading-tight text-[var(--text-primary)]">
          {product.name}
        </p>
        <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
          {product.category}
        </p>
      </div>
    </div>
  );
}

const PerformanceRow = React.memo(function PerformanceRow({ product, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.04, duration: 0.35, ease: "easeOut" }}
      className="group border-b border-[var(--border-card)]/60 transition-colors last:border-b-0 hover:bg-[var(--primary-purple-light)]/40"
    >
      <td className="px-4 py-4">
        <ProductCell product={product} />
      </td>
      <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-[var(--text-primary)]">
        {formatCount(product.rfqCount)}
      </td>
      <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-[var(--text-primary)]">
        {formatCount(product.orderCount)}
      </td>
      <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-bold text-[var(--text-primary)]">
        {formatRevenue(product.revenue)}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-[var(--text-secondary)]">
        {product.conversionRate != null ? `${product.conversionRate}%` : "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-4">
        <TrendBadge trend={product.trend} />
      </td>
      <td className="whitespace-nowrap px-4 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            STATUS_STYLES[product.status] ?? STATUS_STYLES.Listed
          }`}
        >
          {product.status}
        </span>
      </td>
    </motion.tr>
  );
});

export default function PerformanceTable({ products }) {
  return (
    <div className="max-h-[440px] overflow-y-auto overflow-x-hidden rounded-2xl" aria-label="Product performance table">
      <table className="w-full border-separate border-spacing-0 text-left">
        <thead className="sticky top-0 z-10 bg-[var(--bg-card)]">
          <tr>
            {COLUMNS.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="border-b border-[var(--border-card)]/60"
            >
              <td colSpan={COLUMNS.length} className="px-4 py-10 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-purple-light)] to-[var(--accent-cyan-light)]">
                    <PackageSearch className="h-5 w-5 text-[var(--primary-purple)]" strokeWidth={1.75} />
                  </span>
                  <p className="font-heading text-sm font-bold text-[var(--text-primary)]">No products yet</p>
                  <p className="max-w-[16rem] text-[12px] leading-5 text-[var(--text-muted)]">
                    Add products to your catalog and they'll rank here by revenue and demand.
                  </p>
                </div>
              </td>
            </motion.tr>
          ) : (
            products.map((product, i) => (
              <PerformanceRow key={product.id ?? product.key} product={product} index={i} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
