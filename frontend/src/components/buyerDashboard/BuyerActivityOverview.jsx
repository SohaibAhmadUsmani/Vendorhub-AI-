import React from "react";
import { FileText, MessageSquare, ShoppingCart } from "lucide-react";
import DashboardSection from "../dashboard/DashboardSection";

const activities = [
  {
    id: 1,
    icon: FileText,
    title: "RFQ #1042",
    description: "Waiting for vendor responses",
    status: "Active",
  },
  {
    id: 2,
    icon: MessageSquare,
    title: "Quote from ABC Supplies",
    description: "New quotation received",
    status: "New",
  },
  {
    id: 3,
    icon: ShoppingCart,
    title: "Order #2087",
    description: "Order processing",
    status: "Processing",
  },
];

export default function BuyerActivityOverview() {
  return (
    <DashboardSection
      eyebrow="Recent Activity"
      title="Latest Updates"
      subtitle="Stay up to date with your RFQs, quotes and orders."
    >
      <div className="dash-card overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {activities.map((activity) => {
            const Icon = activity.icon;

            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-5 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-purple)]/10 text-[var(--primary-purple)]">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[var(--text-primary)]">
                    {activity.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                    {activity.description}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[var(--primary-purple)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--primary-purple)]">
                  {activity.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardSection>
  );
}