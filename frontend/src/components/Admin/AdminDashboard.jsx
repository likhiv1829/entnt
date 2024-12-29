import React, { useEffect } from 'react';
import { useCompanyContext } from "../../context/CompanyContext";  // Correct import
import { Link } from "react-router-dom";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { companies, addCompany } = useCompanyContext();  // Call the custom hook directly

  // This effect ensures the companies list gets updated only once
  useEffect(() => {
    // Add default companies only if companies array is empty
    if (companies.length === 0) {
      const defaultCompanies = [
        { id: Date.now() + 1, name: 'Accenture', details: 'Consulting Company' },
        { id: Date.now() + 2, name: 'TCS', details: 'IT Services' },
        { id: Date.now() + 3, name: 'Fractal', details: 'Data and AI' },
      ];

      // Add companies to context only if they don't already exist
      defaultCompanies.forEach((company) => {
        const exists = companies.some((existingCompany) => existingCompany.name === company.name);
        if (!exists) {
          addCompany(company);
        }
      });
    }
  }, [companies, addCompany]);

  const handleAddCompany = () => {
    // Add new company logic
    const newCompany = { id: Date.now(), name: 'New Company', details: 'Company Details' };
    addCompany(newCompany);  // This updates the context
  };

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
              <Link className="admin-nav-link" to="/admin/company-management">
                Add or Manage Companies
              </Link>
            </li>
            <li>
              <Link className="admin-nav-link" to="/admin/communication-method-management">
                Communication Method Management
              </Link>
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
                <li key={company.id} className="company-item">
                  <h3>{company.name}</h3>
                  <p>{company.details}</p>
                </li>
              ))}
            </ul>
          )}
          <button onClick={handleAddCompany}>Add New Company</button>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
