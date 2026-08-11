import React from "react";
import { MoreVertical, SlidersHorizontal, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoleRoute } from "../../utils/routeUtils";

const RFQS = [
  {
    id: "RFQ-2024-125",
    subject: "Stainless Steel Pipes",
    vendor: "MetalCraft Ind.",
    status: "ACTIVE",
    deadline: "25 May 2024",
    value: "$12,500",
  },
  {
    id: "RFQ-2024-124",
    subject: "PCB Manufacturing",
    vendor: "TechCircuit Ltd.",
    status: "PENDING",
    deadline: "22 May 2024",
    value: "$8,750",
  },
  {
    id: "RFQ-2024-123",
    subject: "Cotton T-Shirts",
    vendor: "TexStyle Ltd.",
    status: "REVIEW",
    deadline: "20 May 2024",
    value: "$5,400",
  },
  {
    id: "RFQ-2024-122",
    subject: "Packing Boxes",
    vendor: "PackWell Corp.",
    status: "COMPLETED",
    deadline: "18 May 2024",
    value: "$3,200",
  },
];

const STATUS_STYLES = {
  ACTIVE: "bg-[#ECFDF5] text-[#059669]",
  PENDING: "bg-[#FFF7ED] text-[#EA580C]",
  REVIEW: "bg-[#EFF6FF] text-[#2563EB]",
  COMPLETED: "bg-[#ECFDF5] text-[#16A34A]",
};

export default function RecentRFQTracker() {
  const navigate = useNavigate();
  return (
    <div className="dash-card overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1F6] px-5 py-4">
        <div>
          <h3 className="font-heading text-[16px] font-bold text-[var(--text-primary)]">
            Recent RFQ Tracker
          </h3>
          <p className="mt-1 text-[12px] text-[var(--text-muted)]">
            Track your latest sourcing requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-semibold text-[var(--text-secondary)] transition hover:bg-[#F8F8FC]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-semibold text-[var(--text-secondary)] transition hover:bg-[#F8F8FC]"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-[#EEF1F6] bg-[#FAFBFD]">
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                RFQ ID
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Subject
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Vendor
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Status
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Deadline
              </th>
              <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Value
              </th>
              <th />
            </tr>
          </thead>

          <tbody>
            {RFQS.map((rfq) => (
              <tr
                key={rfq.id}
                className="border-b border-[#F1F3F7] transition hover:bg-[#FAFAFF]"
              >
                <td className="px-5 py-4 text-[12px] font-semibold text-[var(--text-primary)]">
                  {rfq.id}
                </td>

                <td className="px-5 py-4 text-[12px] font-medium text-[var(--text-secondary)]">
                  {rfq.subject}
                </td>

                <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                  {rfq.vendor}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLES[rfq.status]}`}
                  >
                    {rfq.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                  {rfq.deadline}
                </td>

                <td className="px-5 py-4 text-[12px] font-bold text-[var(--text-primary)]">
                  {rfq.value}
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    className="rounded-full p-1.5 text-[var(--text-light)] transition hover:bg-[#F1F2F8] hover:text-[var(--text-primary)]"
                    aria-label={`Actions for ${rfq.id}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-[#EEF1F6] px-5 py-3 text-center">
        <button
          type="button"
          onClick={() => navigate(getRoleRoute("rfqs"))}
          className="text-[12px] font-bold text-[var(--primary-purple)] transition hover:opacity-80 cursor-pointer"
        >
          View All RFQs →
        </button>
      </div>
    </div>
  );
}