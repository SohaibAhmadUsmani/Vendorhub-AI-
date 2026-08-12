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
import BuyerDashboard from "./pages/buyerDashboard";
import TeammateModulePlaceholder from "./components/layout/TeammateModulePlaceholder";

import OrdersPage from "./pages/OrdersPage";
import RiskAnalysisPage from "./pages/RiskAnalysisPage";
import DocumentsPage from "./pages/DocumentsPage";

import SettingsPage from "./pages/SettingsPage";
import CertificationsPage from "./pages/CertificationsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminVendorsPage from "./pages/AdminVendorsPage";
import SavedVendorsPage from "./pages/SavedVendorsPage";

import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import OAuthSuccess from "./pages/auth/OAuthSuccess";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================================================
            PUBLIC AUTH ROUTES
        ========================================================= */}

        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

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
              element={<BuyerDashboard />}
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
              element={<SavedVendorsPage />}
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
              element={<SettingsPage />}
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

            {/* Vendors View */}
            <Route
              path="vendors"
              element={<VendorProfileView />}
            />

            {/* Products & Catalog */}
            <Route
              path="products"
              element={<ProductCatalogView />}
            />
            <Route
              path="product-catalog"
              element={<ProductCatalogView />}
            />

            {/* Certifications */}
            <Route
              path="certifications"
              element={<CertificationsPage />}
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

            {/* Analytics & Insights */}
            <Route
              path="analytics"
              element={<AnalyticsPage />}
            />
            <Route
              path="ai-insights"
              element={<AIInsightsPage />}
            />
            <Route
              path="ai-search"
              element={<VendorMatchingPage />}
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

            {/* Risk Analysis */}
            <Route
              path="risk-analysis"
              element={<RiskAnalysisPage />}
            />

            {/* Settings */}
            <Route
              path="settings"
              element={<SettingsPage />}
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
              element={<AdminUsersPage />}
            />

            {/* Verify Vendors */}
            <Route
              path="vendors"
              element={<AdminVendorsPage />}
            />

            {/* All Vendors */}
            <Route
              path="all-vendors"
              element={<VendorProfileView />}
            />

            {/* Admin Search */}
            <Route
              path="search"
              element={<VendorMatchingPage />}
            />

            {/* Product Catalog & Categories */}
            <Route
              path="categories"
              element={<ProductCatalogView />}
            />
            <Route
              path="product-catalog"
              element={<ProductCatalogView />}
            />
            <Route
              path="products"
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

            {/* AI Insights & Sourcing */}
            <Route
              path="ai-insights"
              element={<AIInsightsPage />}
            />
            <Route
              path="ai-search"
              element={<VendorMatchingPage />}
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

            {/* Fraud Monitoring & Risk Analysis */}
            <Route
              path="fraud-monitoring"
              element={<RiskAnalysisPage />}
            />
            <Route
              path="risk-analysis"
              element={<RiskAnalysisPage />}
            />
            <Route
              path="risk-analysis/:vendorId"
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
              element={<SettingsPage />}
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
