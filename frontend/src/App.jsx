import React from "react";
import {
  Navigate,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/dashboard";
import VendorProfileView from "./components/vendor/VendorProfileView";
import ProductCatalogView from "./components/catalog/ProductCatalogView";
import AnalyticsPage from "./pages/AnalyticsPage";
import AIInsightsPage from "./pages/AIInsightsPage";
import QuotesPage from "./pages/QuotesPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import VendorMatchingPage from "./pages/VendorMatchingPage";
import RFQGeneratorPage from "./pages/RFQGeneratorPage";

import TeammateModulePlaceholder from "./components/layout/TeammateModulePlaceholder";

import OrdersPage from "./pages/OrdersPage";
import RiskAnalysisPage from "./pages/RiskAnalysisPage";
import DocumentsPage from "./pages/DocumentsPage";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================================
            PUBLIC AUTH ROUTES
        ========================================================= */}

        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* =========================================================
            ROOT
        ========================================================= */}

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* =========================================================
            BUYER ROUTES
        ========================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["buyer"]} />
          }
        >
          <Route path="/buyer" element={<DashboardLayout />}>

            {/* Dashboard */}
            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* AI Search / Supplier Search */}
            <Route
              path="ai-search"
              element={<VendorMatchingPage />}
            />

            {/* AI Vendor Matching */}
            <Route
              path="vendor-matching"
              element={<VendorMatchingPage />}
            />

            {/* Vendors */}
            <Route
              path="vendors"
              element={<VendorProfileView />}
            />

            <Route
              path="vendors/:id"
              element={<VendorProfileView />}
            />

            {/* Product Catalog */}
            <Route
              path="product-catalog"
              element={<ProductCatalogView />}
            />

            <Route
              path="product-catalog/:id"
              element={<ProductCatalogView />}
            />

            {/* RFQs */}
            <Route
              path="rfqs"
              element={<RFQGeneratorPage />}
            />

            {/* Quotes */}
            <Route
              path="quotes"
              element={<QuotesPage />}
            />

            {/* AI Negotiation */}
            <Route
              path="negotiation"
              element={<QuotesPage />}
            />

            {/* Orders */}
            <Route
              path="orders"
              element={<OrdersPage />}
            />

            {/* Saved Vendors */}
            <Route
              path="saved-vendors"
              element={<VendorProfileView />}
            />

            {/* Messages */}
            <Route
              path="messages"
              element={<MessagesPage />}
            />

            {/* Contracts */}
            <Route
              path="contracts"
              element={<DocumentsPage />}
            />

            {/* Documents */}
            <Route
              path="documents"
              element={<DocumentsPage />}
            />

            {/* Risk Analysis */}
            <Route
              path="risk-analysis"
              element={<RiskAnalysisPage />}
            />

            <Route
              path="risk-analysis/:vendorId"
              element={<RiskAnalysisPage />}
            />

            {/* Reviews */}
            <Route
              path="reviews"
              element={<VendorProfileView />}
            />

            {/* Notifications */}
            <Route
              path="notifications"
              element={<NotificationsPage />}
            />

            {/* Analytics */}
            <Route
              path="analytics"
              element={<AnalyticsPage />}
            />

            {/* AI Insights */}
            <Route
              path="ai-insights"
              element={<AIInsightsPage />}
            />

            {/* Vendor Analytics */}
            <Route
              path="vendor-analytics"
              element={<AnalyticsPage />}
            />

            {/* Spend Summary */}
            <Route
              path="spend-summary"
              element={<AnalyticsPage />}
            />

            {/* Settings */}
            <Route
              path="settings"
              element={<VendorProfileView />}
            />

          </Route>
        </Route>

        {/* =========================================================
            VENDOR ROUTES
        ========================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["vendor"]} />
          }
        >
          <Route path="/vendor" element={<DashboardLayout />}>

            {/* Vendor Dashboard */}
            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* Company Profile */}
            <Route
              path="profile"
              element={<VendorProfileView />}
            />

            {/* Products */}
            <Route
              path="products"
              element={<ProductCatalogView />}
            />

            {/* Certifications */}
            <Route
              path="certifications"
              element={<VendorProfileView />}
            />

            {/* Pricing */}
            <Route
              path="pricing"
              element={<AnalyticsPage />}
            />

            {/* Received RFQs */}
            <Route
              path="rfqs"
              element={<RFQGeneratorPage />}
            />

            {/* Quotations */}
            <Route
              path="quotes"
              element={<QuotesPage />}
            />

            {/* Orders */}
            <Route
              path="orders"
              element={<OrdersPage />}
            />

            {/* Messages */}
            <Route
              path="messages"
              element={<MessagesPage />}
            />

            {/* Analytics */}
            <Route
              path="analytics"
              element={<AnalyticsPage />}
            />

            {/* Documents */}
            <Route
              path="documents"
              element={<DocumentsPage />}
            />

            {/* Notifications */}
            <Route
              path="notifications"
              element={<NotificationsPage />}

            />

            {/* Settings */}
            <Route
              path="settings"
              element={<VendorProfileView />}
            />

          </Route>
        </Route>

        {/* =========================================================
            ADMIN ROUTES
        ========================================================= */}

        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]} />
          }
        >
          <Route path="/admin" element={<DashboardLayout />}>

            {/* Admin Dashboard */}
            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            {/* Manage Users */}
            <Route
              path="users"
              element={<VendorProfileView />}
            />

            {/* Verify Vendors */}
            <Route
              path="vendors"
              element={<VendorProfileView />}
            />

            {/* Categories */}
            <Route
              path="categories"
              element={<ProductCatalogView />}
            />

            {/* Reports */}
            <Route
              path="reports"
              element={<AnalyticsPage />}
            />

            {/* Subscription Plans */}
            <Route
              path="subscriptions"
              element={<AnalyticsPage />}
            />

            {/* Fraud Monitoring */}
            <Route
              path="fraud-monitoring"
              element={<RiskAnalysisPage />}
            />

            {/* Platform Analytics */}
            <Route
              path="analytics"
              element={<AnalyticsPage />}
            />

            {/* Settings */}
            <Route
              path="settings"
              element={<VendorProfileView />}
            />

          </Route>
        </Route>

        {/* =========================================================
            FALLBACK
        ========================================================= */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
