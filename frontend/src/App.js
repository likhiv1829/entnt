import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/User/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CompanyManagement from "./components/Admin/CompanyManagement";
import CommunicationMethodManagement from "./components/Admin/CommunicationMethodManagement";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/user/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/company-management" element={<CompanyManagement />} />
      <Route path="/admin/communication-method-management" element={<CommunicationMethodManagement />} />
    </Routes>
  );
}

export default App;
