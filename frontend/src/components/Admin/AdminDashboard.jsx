import React from 'react';
import { useCompanyContext } from "../../context/CompanyContext"; // Import Context
import { Link } from "react-router-dom";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { companies } = useCompanyContext();  // Use the context to get companies

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage companies and ensure they reflect on the User Dashboard.</p>
      </header>
      <div className="admin-content">
        <nav>
          <ul className="admin-nav-list">
            <li>
              <Link className="admin-nav-link" to="/admin/company-management">Manage Companies</Link>
            </li>
            <li>
              <Link className="admin-nav-link" to="/admin/communication-method-management">Manage Communication Methods</Link>
            </li>
          </ul>
        </nav>
        <section className="admin-companies">
          <h2>Current Companies</h2>
          {companies.length === 0 ? (
            <p>No companies have been added yet.</p>
          ) : (
            <ul className="company-list">
              {companies.map((company) => (
                <li key={company._id} className="company-item">
                  <h3>{company.name}</h3>
                  <p>{company.details}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
