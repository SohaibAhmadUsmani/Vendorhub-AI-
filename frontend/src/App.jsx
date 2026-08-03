import React from "react";
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard";
import VendorProfileView from "./components/vendor/VendorProfileView";
import ProductCatalogView from "./components/catalog/ProductCatalogView";
import AnalyticsPage from "./pages/AnalyticsPage";
import TeammateModulePlaceholder from "./components/layout/TeammateModulePlaceholder";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/buyer/dashboard" replace />} />
        <Route path="/buyer" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-search" element={<TeammateModulePlaceholder pageTitle="AI Search" />} />
          <Route path="rfqs" element={<TeammateModulePlaceholder pageTitle="RFQs" />} />
          <Route path="quotes" element={<TeammateModulePlaceholder pageTitle="Quotes" />} />
          <Route path="orders" element={<TeammateModulePlaceholder pageTitle="Orders" />} />
          
          {/* Muzammil's Module 5 & Module 6 Views */}
          <Route path="vendors" element={<VendorProfileView />} />
          <Route path="product-catalog" element={<ProductCatalogView />} />
          
          <Route path="saved-vendors" element={<TeammateModulePlaceholder pageTitle="Saved Vendors" />} />
          <Route path="messages" element={<TeammateModulePlaceholder pageTitle="Messages" />} />
          <Route path="contracts" element={<TeammateModulePlaceholder pageTitle="Contracts" />} />
          <Route path="documents" element={<TeammateModulePlaceholder pageTitle="Documents" />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="spend-summary" element={<TeammateModulePlaceholder pageTitle="Spend Summary" />} />
          <Route path="settings" element={<TeammateModulePlaceholder pageTitle="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
