import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchOverview, selectOverview } from "../../redux/dashboardSlice";

/* --------------------------------------------------------------------------
   DashboardGreeting — page hero, matched to the premium SaaS reference.
   Top left: small purple "Vendor Dashboard" eyebrow label, a 34–38px bold
   dark greeting heading (time-of-day + vendor name, with a wave emoji) and
   a muted 16px business subtitle. Top right: the current date in a rounded
   chip with a calendar icon. Greeting/name/date are server-driven (GET
   /api/dashboard/overview); a client-side greeting + today's date keep the
   header intact while loading or on failure.
   -------------------------------------------------------------------------- */

function greetingFallback() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatDate(value) {
  const fallback = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

function GreetingSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading greeting" className="flex flex-col gap-3">
      <Skeleton width={140} height={12} borderRadius={9999} />
      <Skeleton width="58%" height={38} borderRadius={10} />
      <Skeleton width="38%" height={15} borderRadius={9999} />
    </div>
  );
}

export default function DashboardGreeting({ type = "vendor" }) {
  const dispatch = useDispatch();
  const { status, data } = useSelector(selectOverview);
  const isBuyer = type === "buyer";

  useEffect(() => {
    if (status === "idle") dispatch(fetchOverview());
  }, [status, dispatch]);

  const loading = status === "loading" || status === "idle";
  const name = isBuyer
    ? data?.buyerName ?? data?.userName ?? null
    : data?.vendorName;
  const greeting = data?.greeting ?? greetingFallback();
  const dateLabel = formatDate(data?.currentDate);
  const subtitle = isBuyer
    ? "Here's what's happening with your procurement today."
    : "Here's what's happening with your business today.";

  return (
    <header className="mb-1 flex flex-wrap items-end justify-between gap-6 xl:mb-0">
      <div className="min-w-0">
        {loading ? (
          <GreetingSkeleton />
        ) : (
          <>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--primary-purple)]">
              {isBuyer ? "Buyer Dashboard" : "Vendor Dashboard"}
            </p>
            <h1 className="mt-2 font-heading text-[34px] font-bold leading-[1.15] tracking-tight text-[var(--text-primary)] sm:text-[36px] xl:text-[38px]">
              {greeting}{name ? `, ${name}` : ""}
              <span aria-hidden="true" className="ml-2 inline-block">
                👋
              </span>
            </h1>
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-[var(--text-secondary)]">
              {subtitle}            </p>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#EEF1F6] bg-white px-4 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <Calendar className="h-4 w-4 text-[var(--primary-purple)]" strokeWidth={2} />
        <span className="text-[13px] font-semibold text-[var(--text-secondary)]">{dateLabel}</span>
      </div>
    </header>
  );
}