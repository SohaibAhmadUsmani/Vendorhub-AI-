import React, { Suspense, lazy } from "react";
import DashboardGreeting from "../components/layout/DashboardGreeting";
import DashboardRightSidebar from "../components/layout/DashboardRightSidebar";
import DashboardSection from "../components/dashboard/DashboardSection";
import DashboardOverviewCards from "../components/dashboard/DashboardOverviewCards";
import DashboardAnalytics from "../components/dashboard/DashboardAnalytics";
import ProductPerformanceCard from "../components/dashboard/ProductPerformanceCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import NotificationPreview from "../components/dashboard/NotificationPreview";
import RecentRFQs from "../components/dashboard/RecentRFQs";
import LatestRequests from "../components/dashboard/LatestRequests";
import AIInsightsCard from "../components/dashboard/AIInsightsCard";
import VendorHealth from "../components/dashboard/VendorHealth";
import QuickActionsCard from "../components/dashboard/QuickActionsCard";
import AIBanner from "../components/dashboard/AIBanner";
import { SkeletonChart } from "../components/dashboard/DashboardSkeleton";

/* The welcome robot is heavy (1.2 MB image) and playful — lazy-render it so
   it never blocks the dashboard bundle or layout. */
const WelcomeRobot = lazy(() =>
  import("../components/dashboard/DashboardWelcomeRobot").then((m) => ({ default: m.default })),
);

/* --------------------------------------------------------------------------
   Vendor Dashboard — premium enterprise composition.
   Greeting → KPI row → [ Advanced Analytics strip | AI Insights rail ] →
   [ main (Revenue + Pipeline, RFQs + Requests, Product Performance,
   Activity & Notifications) | right rail (Vendor Health, Quick Actions) ]
   → AI banner. Every widget is independent and fetches through the
   Dashboard Service API (axios + React Query). The analytics pair (Revenue
   Overview + RFQ Pipeline) is lazy-loaded so the heavy recharts library
   splits out of the initial bundle. Sections give the page consistent
   typographic hierarchy.
   -------------------------------------------------------------------------- */

const AnalyticsSection = lazy(() => import("../components/dashboard/AnalyticsSection"));

function ChartFallback() {
  return (
    <section className="dash-card flex min-w-0 flex-col p-5 sm:p-6" aria-busy="true" aria-label="Loading chart">
      <div className="flex items-center gap-3">
        <span className="skeleton-block h-10 w-10 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <span className="skeleton-block block h-4 w-40 rounded-lg" />
          <span className="skeleton-block block h-3 w-24 rounded-full" />
        </div>
      </div>
      <div className="mt-6 h-52">
        <SkeletonChart />
      </div>
    </section>
  );
}

export default function Dashboard() {
  return (
    <div className="relative mx-auto w-full">
      <div className="relative z-10 space-y-7 xl:space-y-8">
        <DashboardGreeting />
        <DashboardOverviewCards />

        {/* Advanced Analytics — sits beside the AI Insights rail on desktop.
            The grid stretches both columns to equal height so the AI panel
            ends exactly where the analytics grid ends. */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <DashboardSection
            eyebrow="Business Analytics"
            title="Advanced Analytics"
            subtitle="Your catalog, pipeline and revenue at a glance — every metric computed live from your data."
            className="min-w-0"
          >
            <DashboardAnalytics />
          </DashboardSection>

          <DashboardRightSidebar>
            <AIInsightsCard />
          </DashboardRightSidebar>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-7 xl:space-y-8">
            <DashboardSection
              eyebrow="Performance"
              title="Revenue & RFQ Pipeline"
              subtitle="Track revenue trends and your pipeline health at a glance."
            >
              <Suspense fallback={<ChartFallback />}>
                <AnalyticsSection />
              </Suspense>
            </DashboardSection>

            <DashboardSection
              eyebrow="Business Activity"
              title="Recent RFQs & Customer Requests"
              subtitle="The latest buyer requests and conversations across your account."
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <RecentRFQs />
                <LatestRequests />
              </div>
            </DashboardSection>
          </div>

          <DashboardRightSidebar>
            <VendorHealth />
            <QuickActionsCard />
          </DashboardRightSidebar>
        </div>

        {/* Product Performance + live feed — parallel row: table left, the
            two live-feed cards stacked right. Both columns stretch to equal
            height so the feed ends exactly where the table ends. */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <DashboardSection
            eyebrow="Catalog Insights"
            title="Product Performance"
            subtitle="Your best-selling products with conversion and revenue trends per period."
            className="min-w-0"
          >
            <ProductPerformanceCard />
          </DashboardSection>

          <DashboardSection
            eyebrow="Live Feed"
            title="Activity & Notifications"
            subtitle="The latest events and updates across your account."
            className="min-w-0"
          >
            <div className="flex min-w-0 flex-col gap-6">
              <RecentActivity />
              <NotificationPreview />
            </div>
          </DashboardSection>
        </div>

        <AIBanner />
      </div>

      <Suspense fallback={null}>
        <WelcomeRobot />
      </Suspense>
    </div>
  );
}
