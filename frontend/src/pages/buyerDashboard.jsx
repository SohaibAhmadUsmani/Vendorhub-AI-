import React from "react";
import {
  FilePlus2,
  Search,
  GitCompareArrows,
  MessageSquare,
  Bookmark,
  Package,
} from "lucide-react";
import QuickActionsCard from "../components/dashboard/QuickActionsCard";
import { Link } from "react-router-dom";

import DashboardGreeting from "../components/layout/DashboardGreeting";
import DashboardSection from "../components/dashboard/DashboardSection";
import DashboardWelcomeRobot from "../components/dashboard/DashboardWelcomeRobot";

import BuyerOverviewCards from "../components/buyerDashboard/BuyerOverviewCards";
import ActiveRFQs from "../components/buyerDashboard/ActiveRFQs";
import AIRecommendations from "../components/buyerDashboard/AIRecommendations";
import Orders from "../components/buyerDashboard/Orders";
import PendingQuotes from "../components/buyerDashboard/PendingQuotes";
import SavedVendors from "../components/buyerDashboard/SavedVendors";
import RecentSearches from "../components/buyerDashboard/RecentSearches";
import SpendingSummary from "../components/buyerDashboard/SpendingSummary";
import BuyerActivityOverview from "../components/buyerDashboard/BuyerActivityOverview";

const buyerQuickActions = [
    {
        id: "create-rfq",
        label: "Create RFQ",
        icon: "FilePlus2",
        route: "/buyer/rfqs",
    },
    {
        id: "buyer-ai-search",
        label: "AI Search",
        icon: "Search",
        route: "/buyer/ai-search",
    },
    {
        id: "compare-quotes",
        label: "Compare Quotes",
        icon: "GitCompareArrows",
        route: "/buyer/quotes",
    },
    {
        id: "messages",
        label: "Messages",
        icon: "MessageSquare",
        route: "/buyer/messages",
    },
    {
        id: "saved-vendors",
        label: "Saved Vendors",
        icon: "Bookmark",
        route: "/buyer/saved-vendors",
    },
    {
        id: "view-orders",
        label: "View Orders",
        icon: "Package",
        route: "/buyer/orders",
    },
];

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto w-full max-w-[1600px] space-y-8">

        {/* =========================================================
            GREETING
        ========================================================= */}
        <DashboardGreeting type="buyer"/>
        <DashboardWelcomeRobot />

        {/* =========================================================
            KEY METRICS
            Active RFQs | Pending Quotes | Orders | Saved Vendors
        ========================================================= */}
        <DashboardSection
          eyebrow="Overview"
          title="Your Procurement Dashboard"
          subtitle="Track your RFQs, quotes, orders and saved vendors at a glance."
        >
          <BuyerOverviewCards />
        </DashboardSection>

        {/* =========================================================
            PRIMARY PROCUREMENT ACTIVITY
        ========================================================= */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* =======================================================
              MAIN COLUMN
          ======================================================= */}
          <div className="min-w-0 space-y-8">

            {/* Active RFQs */}
            <DashboardSection
              eyebrow="Procurement Activity"
              title="Active RFQs"
              subtitle="Track your active requests and monitor supplier responses."
            >
              <ActiveRFQs />
            </DashboardSection>

            {/* Pending Quotes */}
            <DashboardSection
              eyebrow="Supplier Responses"
              title="Pending Quotes"
              subtitle="Review quotes that are currently awaiting your decision."
            >
              <PendingQuotes />
            </DashboardSection>

            {/* Orders + Saved Vendors */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              <DashboardSection
                eyebrow="Purchasing"
                title="Orders"
                subtitle="Monitor your current and completed purchases."
              >
                <Orders />
              </DashboardSection>

              <DashboardSection
                eyebrow="Suppliers"
                title="Saved Vendors"
                subtitle="Quick access to your preferred suppliers."
              >
                <SavedVendors />
              </DashboardSection>

            </div>

            {/* Spending Summary */}
            <DashboardSection
              eyebrow="Financial Overview"
              title="Spending Summary"
              subtitle="Monitor your procurement spending and purchasing trends."
            >
              <SpendingSummary />
            </DashboardSection>

          </div>

          {/* =======================================================
              RIGHT SIDEBAR
          ======================================================= */}
          <aside className="flex min-w-0 flex-col gap-6">

            {/* AI Recommendations */}
            <DashboardSection
              eyebrow="Smart Insights"
              title="AI Recommendations"
              subtitle="Personalized supplier matches based on your procurement activity."
            >
              <AIRecommendations />
            </DashboardSection>

            {/* Recent Searches */}
            <DashboardSection
              eyebrow="Activity"
              title="Recent Searches"
              subtitle="Your recent supplier and product searches."
            >
              <RecentSearches />
            </DashboardSection>

            {/* Quick Actions */}
            <QuickActionsCard actions={buyerQuickActions} />

          </aside>
        </div>

        {/* =========================================================
            BUYER ACTIVITY
        ========================================================= */}
        <BuyerActivityOverview />

      </div>
    </div>
  );
}