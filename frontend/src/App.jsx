import {Navigate ,Routes,Route,BrowserRouter } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard";

function ModulePlaceholder({ name }) {
    return <h1>{name} coming soon...</h1>;
}

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/buyer/dashboard" replace />}  />
        <Route path="/buyer" element={<DashboardLayout />} >
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="ai-search" element={<ModulePlaceholder name="AI Search"/>} />
          <Route path="rfqs" element={<ModulePlaceholder name="RFQs"/>} />
          <Route path="quotes" element={<ModulePlaceholder name="Quotes"/>} />
          <Route path="orders" element={<ModulePlaceholder name="Orders"/>} />
          <Route path="vendors" element={<ModulePlaceholder name="Vendors"/>} />
          <Route path="saved-vendors" element={<ModulePlaceholder name="Saved-vendors"/>} />
          <Route path="messages" element={<ModulePlaceholder name="Messages"/>} />
          <Route path="contracts" element={<ModulePlaceholder name="Contracts"/>} />
          <Route path="documents" element={<ModulePlaceholder name="Documents"/>} />
          <Route path="analytics" element={<ModulePlaceholder name="Analytics"/>} />
          <Route path="spend-summary" element={<ModulePlaceholder name="Spend Summary"/>} />
          <Route path="settings" element={<ModulePlaceholder name="Settings"/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;