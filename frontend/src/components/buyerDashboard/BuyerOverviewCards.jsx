import React from "react";
import OverviewCard from "../dashboard/OverviewCard";

const buyerMetrics = [
  {
    id: "active-rfqs",
    title: "Active RFQs",
    value: 0,
    icon: "FileQuestion",
    changePercent: 0,
    trendDirection: "flat",
    trendLabel: "Currently active",
    sparkline: [],
  },
  {
    id: "pending-quotes",
    title: "Pending Quotes",
    value: 0,
    icon: "MessageSquarePlus",
    changePercent: 0,
    trendDirection: "flat",
    trendLabel: "Awaiting response",
    sparkline: [],
  },
  {
    id: "orders",
    title: "Orders",
    value: 0,
    icon: "PackageCheck",
    changePercent: 0,
    trendDirection: "flat",
    trendLabel: "Total orders",
    sparkline: [],
  },
  {
    id: "saved-vendors",
    title: "Saved Vendors",
    value: 0,
    icon: "Bookmark",
    changePercent: 0,
    trendDirection: "flat",
    trendLabel: "Saved suppliers",
    sparkline: [],
  },
];

export default function BuyerOverviewCards() {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {buyerMetrics.map((metric, index) => (
        <OverviewCard
          key={metric.id}
          metric={metric}
          delay={index}
        />
      ))}
    </div>
  );
}