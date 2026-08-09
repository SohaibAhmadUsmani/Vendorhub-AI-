import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, FileText, FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useVendorRfqs,
  normalizeRfqs,
  getRfqPageMeta,
} from "../../services/dashboard/dashboardService";
import { SkeletonRows } from "./DashboardSkeleton";
import DashboardErrorState from "./DashboardErrorState";

/* --------------------------------------------------------------------------
   RecentRFQs — professional data table. Hover rows, priority + status
   badges, API-driven pagination (prev/next + page indicator). Loading uses
   skeletons; a failed request shows an inline error with retry; an empty
   list offers a "Create RFQ" CTA.
   -------------------------------------------------------------------------- */

const PAGE_SIZE = 8;

const STATUS_STYLES = {
  pending: "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]",
  quoted: "bg-[var(--status-review-bg)] text-[var(--status-review-text)]",
  accepted: "bg-[var(--accent-cyan-light)] text-[#0E7490]",
  completed: "bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]",
  rejected: "bg-[#FEE2E2] text-[#B91C1C]",
  draft: "bg-[var(--border-card)]/60 text-[var(--text-muted)]",
  closed: "bg-[var(--border-card)]/60 text-[var(--text-muted)]",
  sent: "bg-[var(--match-badge-bg)] text-[var(--match-badge-text)]",
};

const PRIORITY_STYLES = {
  high: "bg-[#FEE2E2] text-[#B91C1C]",
  critical: "bg-[#FEE2E2] text-[#991B1B]",
  medium: "bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]",
  low: "bg-[#E0F2FE] text-[#0369A1]",
  normal: "bg-[var(--border-card)]/50 text-[var(--text-muted)]",
};

const COLUMNS = ["Buyer", "Product", "Qty", "Deadline", "Priority", "Status"];

function capitalize(value) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ") : "—";
}

function formatQuantity(value) {
  return value != null ? Number(value).toLocaleString("en-US") : "—";
}

function formatDeadline(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function InitialsAvatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-purple)] to-[var(--accent-cyan)] font-heading text-[11px] font-extrabold text-white">
      {initials || "?"}
    </span>
  );
}

const RfqRow = React.memo(function RfqRow({ rfq, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 + index * 0.04, duration: 0.35, ease: "easeOut" }}
      className="group border-b border-[var(--border-card)]/60 transition-colors last:border-b-0 hover:bg-[var(--primary-purple-light)]/40"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <InitialsAvatar name={rfq.buyerName} />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold leading-tight text-[var(--text-primary)]">
              {rfq.buyerName}
            </p>
            <p className="truncate font-mono text-[10px] text-[var(--text-muted)]">{rfq.id}</p>
          </div>
        </div>
      </td>
      <td className="max-w-[10rem] px-5 py-4">
        <p className="truncate text-[13px] font-medium text-[var(--text-secondary)]">{rfq.product}</p>
      </td>
      <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-[var(--text-primary)]">
        {formatQuantity(rfq.quantity)}
      </td>
      <td className="whitespace-nowrap px-5 py-4 text-xs text-[var(--text-secondary)]">
        {formatDeadline(rfq.deadline)}
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            PRIORITY_STYLES[rfq.priority] ?? PRIORITY_STYLES.normal
          }`}
        >
          {capitalize(rfq.priority)}
        </span>
      </td>
      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            STATUS_STYLES[rfq.status] ?? STATUS_STYLES.pending
          }`}
        >
          {capitalize(rfq.status)}
        </span>
      </td>
      <td className="px-2 py-4 text-right">
        <button
          type="button"
          aria-label={`View RFQ ${rfq.id}`}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-all hover:border-[var(--primary-purple)] hover:bg-[var(--primary-purple)] hover:text-white"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </td>
    </motion.tr>
  );
});

function PaginationBar({ page, pages, total, onPageChange }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 border-t border-[var(--border-card)] px-4 py-3">
      <p className="text-[11px] font-medium text-[var(--text-muted)]">
        {total} result{total === 1 ? "" : "s"}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition disabled:cursor-not-allowed disabled:text-[var(--text-light)] enabled:hover:bg-[var(--primary-purple-light)] enabled:hover:text-[var(--primary-purple)] cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <span className="rounded-lg bg-[var(--primary-purple-light)] px-2.5 py-1 text-[11px] font-bold text-[var(--primary-purple)]">
          {page} / {pages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition disabled:cursor-not-allowed disabled:text-[var(--text-light)] enabled:hover:bg-[var(--primary-purple-light)] enabled:hover:text-[var(--primary-purple)] cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default function RecentRFQs() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isSuccess, isLoading, isError, refetch } = useVendorRfqs(page, PAGE_SIZE);

  const rfqs = useMemo(
    () => (isSuccess ? normalizeRfqs(data) : []),
    [isSuccess, data],
  );
  const meta = useMemo(
    () => (isSuccess ? getRfqPageMeta(data) : { total: 0, page, pages: 1 }),
    [isSuccess, data, page],
  );

  return (
    <section className="dash-card flex min-w-0 flex-col p-5 sm:p-6" aria-label="Recent RFQs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span className="icon-tile bg-[var(--pastel-cyan)] text-[#0E7490]">
            <FileText className="h-6 w-6" strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
              Recent RFQs
            </h2>
            <p className="text-[11px] font-medium text-[var(--text-muted)]">
              Latest requests from buyers
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/buyer/rfqs")}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary-purple)] hover:text-[var(--primary-purple)]"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-4 flex-1">
        {isLoading && <SkeletonRows rows={6} />}

        {isError && (
          <DashboardErrorState
            icon={<FileSearch className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load your RFQs"
            hint="The list is temporarily unavailable. Retry and it should come right back."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <>
<div className="max-h-[420px] overflow-y-auto overflow-x-hidden rounded-2xl">
          <table className="w-full border-separate border-spacing-0 text-left">
                <thead className="sticky top-0 z-10 bg-[var(--bg-card)]">
                  <tr>
                    {COLUMNS.map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]"
                      >
                        {h}
                      </th>
                    ))}
                    <th className="px-2 py-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {rfqs.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[220px]"
                    >
                      <td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-purple-light)] to-[var(--accent-cyan-light)]">
                            <FileSearch className="h-5 w-5 text-[var(--primary-purple)]" strokeWidth={1.75} />
                          </span>
                          <p className="font-heading text-sm font-bold text-[var(--text-primary)]">No RFQs yet</p>
                          <p className="max-w-[18rem] text-[12px] leading-5 text-[var(--text-muted)]">
                            When buyers send you requests, they'll appear here.
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  ) : (
                    rfqs.map((rfq, i) => <RfqRow key={rfq.id} rfq={rfq} index={i} />)
                  )}
                </tbody>
              </table>
            </div>
            {rfqs.length > 0 && (
              <PaginationBar
                page={meta.page}
                pages={meta.pages}
                total={meta.total}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
