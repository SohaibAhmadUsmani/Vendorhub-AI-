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
              element={
                <TeammateModulePlaceholder
                  pageTitle="AI Negotiation"
                />
              }
            />

            {/* Orders */}
            <Route
              path="orders"
              element={<OrdersPage />}
            />

            {/* Saved Vendors */}
            <Route
              path="saved-vendors"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Saved Vendors"
                />
              }
            />

            {/* Messages */}
            <Route
              path="messages"
              element={<MessagesPage />}
            />

            {/* Contracts */}
            <Route
              path="contracts"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Contracts"
                />
              }
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
              element={
                <TeammateModulePlaceholder
                  pageTitle="Reviews & Ratings"
                />
              }
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
              element={
                <TeammateModulePlaceholder
                  pageTitle="Vendor Analytics"
                />
              }
            />

            {/* Spend Summary */}
            <Route
              path="spend-summary"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Spend Summary"
                />
              }
            />

            {/* Settings */}
            <Route
              path="settings"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Settings"
                />
              }
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
              element={
                <TeammateModulePlaceholder
                  pageTitle="Company Profile"
                />
              }
            />

            {/* Products */}
            <Route
              path="products"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Products"
                />
              }
            />

            {/* Certifications */}
            <Route
              path="certifications"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Certifications"
                />
              }
            />

            {/* Pricing */}
            <Route
              path="pricing"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Pricing"
                />
              }
            />

            {/* Received RFQs */}
            <Route
              path="rfqs"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Received RFQs"
                />
              }
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
              element={
                <TeammateModulePlaceholder
                  pageTitle="Messages"
                />
              }
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
              element={
                <TeammateModulePlaceholder
                  pageTitle="Settings"
                />
              }
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
              element={
                <TeammateModulePlaceholder
                  pageTitle="Admin Dashboard"
                />
              }
            />

            {/* Manage Users */}
            <Route
              path="users"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Manage Users"
                />
              }
            />

            {/* Verify Vendors */}
            <Route
              path="vendors"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Verify Vendors"
                />
              }
            />

            {/* Categories */}
            <Route
              path="categories"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Categories"
                />
              }
            />

            {/* Reports */}
            <Route
              path="reports"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Reports"
                />
              }
            />

            {/* Subscription Plans */}
            <Route
              path="subscriptions"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Subscription Plans"
                />
              }
            />

            {/* Fraud Monitoring */}
            <Route
              path="fraud-monitoring"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Fraud Monitoring"
                />
              }
            />

            {/* Platform Analytics */}
            <Route
              path="analytics"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Platform Analytics"
                />
              }
            />

            {/* Settings */}
            <Route
              path="settings"
              element={
                <TeammateModulePlaceholder
                  pageTitle="Settings"
                />
              }
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
