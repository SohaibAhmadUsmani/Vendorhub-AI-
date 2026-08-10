import React, { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";

/* --------------------------------------------------------------------------
   PipelineChart — modern donut for the RFQ Pipeline card (Recharts).
   Stages, counts and colors arrive from the backend; zero-value stages are
   skipped so only live slices render. The total RFQ count sits in the
   center. Hovering a slice expands it slightly and dims the rest; an
   empty-ring placeholder keeps the slot filled when there is no activity.
   -------------------------------------------------------------------------- */

function PipelineTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0];
  return (
    <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-card)] px-3.5 py-2.5 shadow-2xl shadow-black/10">
      <p className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
        <span className="h-2 w-2 rounded-full" style={{ background: entry.payload?.color }} />
        {entry.name}
        <span className="ml-1 font-mono text-[var(--text-secondary)]">
          {entry.value}
          {entry.payload?.percentage != null && (
            <span className="ml-1 text-[11px] font-medium text-[var(--text-muted)]">
              · {entry.payload.percentage}%
            </span>
          )}
        </span>
      </p>
    </div>
  );
}

/* Pastel palette (matches the reference design). Keyed by stage so the
   donut reads soft no matter what color the backend advertises. */
const PASTEL_COLORS = {
  pending: "#C4B5FD",
  quoted: "#7DD3FC",
  negotiation: "#FCD34D",
  accepted: "#5EEAD4",
  completed: "#86EFAC",
};

/* Hovered slice draws slightly larger so it visibly pops out of the ring. */
function renderActiveShape(props) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, cornerRadius } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      cornerRadius={cornerRadius}
      fill={fill}
      stroke="var(--bg-card)"
      strokeWidth={2}
    />
  );
}

export default function PipelineChart({ stages, total }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const data = stages
    .filter((s) => s.value > 0)
    .map((s) => ({ ...s, color: PASTEL_COLORS[s.key] ?? s.color }));

  return (
    <div className="relative h-[145px] w-[145px] shrink-0" role="img" aria-label={`RFQ pipeline distribution, ${total} total`}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="66%"
              outerRadius="88%"
              paddingAngle={3}
              cornerRadius={8}
              stroke="var(--bg-card)"
              strokeWidth={2}
              activeIndex={activeIndex ?? undefined}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationDuration={900}
              animationBegin={150}
              animationEasing="ease-out"
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.key}
                  fill={entry.color}
                  opacity={activeIndex == null || activeIndex === i ? 1 : 0.45}
                  style={{ transition: "opacity 200ms ease" }}
                />
              ))}
            </Pie>
            <Tooltip content={<PipelineTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full w-full rounded-full border-[12px] border-[var(--border-card)]/60" aria-hidden="true" />
      )}

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-[22px] font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums">
          {total}
        </span>
        <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Total RFQs
        </span>
      </div>
    </div>
  );
}
