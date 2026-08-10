import React from "react";
import { Layers } from "lucide-react";
import DashboardCard from "../layout/DashboardCard";
import DashboardErrorState from "./DashboardErrorState";
import PipelineChart from "./PipelineChart";
import PipelineLegend from "./PipelineLegend";
import PipelineSkeleton from "./PipelineSkeleton";

/* --------------------------------------------------------------------------
   RFQPipelineCard — right analytics card. Donut + legend breakdown of the
   RFQ lifecycle (Pending → Quoted → Negotiation → Accepted → Completed),
   fully driven by the backend pipeline payload. The donut is ALWAYS
   rendered: an empty period draws a muted empty-ring with a centered "0" and
   a subtle "No pipeline data yet" note — the chart never disappears. Loading
   skeleton and inline error with retry keep the card complete in every state.
   -------------------------------------------------------------------------- */

export default function RFQPipelineCard({ pipeline, query }) {
  const { isLoading, isError, refetch } = query;
  const stages = pipeline?.stages ?? [];
  const total = pipeline?.total ?? 0;
  const isEmpty = total <= 0;

  return (
    <DashboardCard aria-label="RFQ Pipeline" className="flex min-w-0 flex-col p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="icon-tile bg-[var(--pastel-cyan)] text-[var(--accent-cyan)]">
            <Layers className="h-6 w-6" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate font-heading text-[20px] font-bold tracking-tight text-[var(--text-primary)]">
              RFQ Pipeline
            </h2>
            <p className="truncate text-[13px] font-medium text-[var(--text-muted)]">Quote-to-order at a glance</p>
          </div>
        </div>
        {!isEmpty && (
          <span className="shrink-0 rounded-full bg-[var(--bg-main)] px-2.5 py-1 text-xs font-bold text-[var(--text-secondary)] ring-1 ring-[var(--border-card)]">
            {total} total
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {isLoading && <PipelineSkeleton />}

        {isError && (
          <DashboardErrorState
            icon={<Layers className="h-6 w-6" strokeWidth={2} />}
            title="Couldn't load pipeline data"
            hint="Your quote-to-order breakdown is temporarily unavailable. Retry to refresh."
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && (
          <>
            <div className="flex flex-col items-center gap-4 xl:flex-row xl:items-center">
              <PipelineChart stages={stages} total={total} />
              <PipelineLegend stages={stages} />
            </div>
            {isEmpty && (
              <p className="mt-3 border-t border-[var(--border-card)] pt-3 text-center text-[11px] font-semibold text-[var(--text-muted)]">
                No pipeline data yet — the donut fills as RFQs move through stages.
              </p>
            )}
          </>
        )}
      </div>
    </DashboardCard>
  );
}