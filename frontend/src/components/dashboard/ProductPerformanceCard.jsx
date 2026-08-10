import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, Check, ChevronDown, Package, PackageSearch } from "lucide-react";
import {
  useVendorProductPerformance,
  getProductPerformance,
} from "../../services/dashboard/dashboardService";
import { SkeletonRows } from "./DashboardSkeleton";
import DashboardErrorState from "./DashboardErrorState";
import PerformanceTable from "./PerformanceTable";
import useClickOutside from "../../hooks/useClickOutside";

/* --------------------------------------------------------------------------
   ProductPerformanceCard — top products ranked by revenue & demand. The range
   dropdown (Last 7 Days → This Year) triggers a fresh backend request per
   period; RFQ counts, conversion and status badges are all server-computed.
   Loading uses dimension-stable skeletons; failures offer an inline retry;
   a catalog with no listings keeps the widget visible with an empty state.
   -------------------------------------------------------------------------- */

const RANGE_OPTIONS = [
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "90d", label: "Last 90 Days" },
  { key: "year", label: "This Year" },
];

function RangeFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [highlighted, setHighlighted] = useState(value);
  const containerRef = useRef(null);
  useClickOutside(containerRef, () => setOpen(false), open);

  const selected = RANGE_OPTIONS.find((o) => o.key === value) ?? RANGE_OPTIONS[1];

  /* Open downward when there is room, otherwise flip the panel above the
     button so the options are never hidden below the viewport fold. */
  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = containerRef.current?.getBoundingClientRect();
    const spaceBelow = rect ? window.innerHeight - rect.bottom : 0;
    setOpenUp(spaceBelow < 240);
    setOpen(true);
  };

  useEffect(() => {
    if (open) setHighlighted(value);
  }, [open, value]);

  const moveHighlight = (direction) => {
    const idx = RANGE_OPTIONS.findIndex((o) => o.key === highlighted);
    const nextIdx = (idx + direction + RANGE_OPTIONS.length) % RANGE_OPTIONS.length;
    setHighlighted(RANGE_OPTIONS[nextIdx].key);
  };

  const onKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveHighlight(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveHighlight(-1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const current = RANGE_OPTIONS.find((o) => o.key === highlighted);
      if (current) {
        onChange(current.key);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative shrink-0" onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Product performance period"
        className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] px-3.5 text-[13px] font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)] transition-all hover:border-[var(--primary-purple)] hover:text-[var(--primary-purple)]"
      >
        <CalendarRange className="h-4 w-4 text-[var(--primary-purple)]" strokeWidth={2} />
        <span className="whitespace-nowrap">{selected.label}</span>
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className={`text-[var(--text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Product performance periods"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute right-0 z-40 w-44 overflow-hidden rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] p-1.5 shadow-2xl shadow-black/10 ${
              openUp ? "bottom-full mb-2 origin-bottom-right" : "top-full mt-2 origin-top-right"
            }`}
          >
            {RANGE_OPTIONS.map((option) => {
              const isActive = option.key === value;
              const isHighlighted = option.key === highlighted;
              return (
                <li key={option.key} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.key);
                      setOpen(false);
                    }}
                    onMouseEnter={() => setHighlighted(option.key)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--primary-purple-light)] text-[var(--primary-purple)]"
                        : isHighlighted
                          ? "bg-[var(--bg-main)] text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-main)]"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isActive && <Check size={14} strokeWidth={2.5} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductPerformanceCard() {
  const [range, setRange] = useState("30d");
  const { data, isSuccess, isLoading, isError, refetch } = useVendorProductPerformance(range);

  const products = useMemo(
    () => (isSuccess ? getProductPerformance(data) : []),
    [isSuccess, data],
  );

  return (
    <section className="dash-card flex min-w-0 flex-col p-5 sm:p-6" aria-label="Product Performance">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="icon-tile bg-[var(--pastel-purple)] text-[var(--primary-purple)]">
            <Package className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
              Product Performance
            </h2>
            <p className="text-[13px] font-medium text-[var(--text-muted)]">
              Ranked by revenue & demand
            </p>
          </div>
        </div>
        <RangeFilter value={range} onChange={setRange} />
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {isLoading && <SkeletonRows rows={6} />}

        {isError && (
          <DashboardErrorState
            icon={<PackageSearch className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load product performance"
            hint="Your catalog insights are temporarily unavailable. Retry to refresh them."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && products.length > 0 && (
          <p className="mb-2 px-1 text-[11px] font-medium text-[var(--text-muted)]">
            {products.length} product{products.length === 1 ? "" : "s"} · {RANGE_OPTIONS.find((o) => o.key === range)?.label}
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <PerformanceTable products={products} />
          </>
        )}
      </div>
    </section>
  );
}
