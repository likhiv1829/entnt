// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CompanyProvider } from './context/CompanyContext'; // Ensure correct import
import HomePage from './components/HomePage';
import AdminDashboard from './components/Admin/AdminDashboard';
import CompanyManagement from './components/Admin/CompanyManagement';
import CommunicationMethodManagement from './components/Admin/CommunicationMethodManagement';
import Dashboard from './components/User/Dashboard';

function App() {
  return (
    <CompanyProvider> {/* Make sure this is wrapping your components */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/company-management" element={<CompanyManagement />} />
        <Route path="/admin/communication-method-management" element={<CommunicationMethodManagement />} />
      </Routes>
    </CompanyProvider>
  );
}

export default App;
