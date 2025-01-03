import React, { useState, useEffect } from 'react';
import { useCompanyContext } from "../../context/CompanyContext"; // Import Context
import { Link, useNavigate } from "react-router-dom";
import CompanyManagement from './CompanyManagement'; // Import Company Management Component
import CommunicationMethodManagement from './CommunicationMethodManagement'; // Import Communication Method Management Component
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { companies, updateCompanyCommunication, addCompany, deleteCompany, fetchCompanies, loading, error } = useCompanyContext();
  const [newCommunication, setNewCommunication] = useState({
    type: "",
    date: "",
    description: "",
    companyId: "",
  });
  const [activeSection, setActiveSection] = useState('currentCompanies'); // Track active section

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetch companies when the component loads or when the context changes
  useEffect(() => {
    if (companies.length === 0) {
      fetchCompanies(); // Fetch from the backend if the companies array is empty
    }
  }, [companies, fetchCompanies]);

  // Handle Communication Form Submit
  const handleCommunicationSubmit = (e) => {
    e.preventDefault();

    if (!newCommunication.type || !newCommunication.date || !newCommunication.description || !newCommunication.companyId) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedCompanies = companies.map((company) => {
      if (company._id === newCommunication.companyId) {
        return {
          ...company,
          communications: [
            ...(company.communications || []),
            {
              ...newCommunication,
              status: "pending", // Initial status
              highlight: "upcoming", // Highlight for upcoming communications
            },
          ],
        };
      }
      return company;
    });

    updateCompanyCommunication(updatedCompanies);
    setNewCommunication({ type: "", date: "", description: "", companyId: "" }); // Reset form fields
  };

  // Delete a communication from a company
  const handleDeleteCommunication = (companyId, communicationIdx) => {
    const updatedCompanies = companies.map((company) => {
      if (company._id === companyId) {
        return {
          ...company,
          communications: company.communications.filter((_, idx) => idx !== communicationIdx),
        };
      }
      return company;
    });

    updateCompanyCommunication(updatedCompanies);
  };

  // Delete a company
  const handleDeleteCompany = (companyId) => {
    deleteCompany(companyId);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/"); // Redirect to login or homepage after logout
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage companies and ensure they reflect on the User Dashboard.</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="admin-content">
        <nav>
          <ul className="admin-nav-list">
            <li>
              <Link
                className="admin-nav-link"
                to="#"
                onClick={() => setActiveSection('manageCompanies')}
              >
                Manage Companies
              </Link>
            </li>
            <li>
              <Link
                className="admin-nav-link"
                to="#"
                onClick={() => setActiveSection('manageCommunications')}
              >
                Manage Communications
              </Link>
            </li>
            <li>
              <Link
                className="admin-nav-link"
                to="#"
                onClick={() => setActiveSection('currentCompanies')}
              >
                Current Companies
              </Link>
            </li>
            <li>
              <Link
                className="admin-nav-link"
                to="#"
                onClick={() => setActiveSection('logCommunication')}
              >
                Log Communication
              </Link>
            </li>
          </ul>
        </nav>

        {/* Render Current Companies Section */}
        {activeSection === 'currentCompanies' && (
          <section className="admin-companies">
            <h2>Current Companies</h2>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : companies.length === 0 ? (
              <p>No companies have been added yet.</p>
            ) : (
              <ul className="company-list">
                {companies.map((company) => (
                  <li key={company._id} className="company-item">
                    <h3>{company.name}</h3>
                    <p>{company.details}</p>
                    <h4>Communications</h4>
                    <ul>
                      {company.communications?.map((comm, idx) => (
                        <li key={idx}>
                          <p>{comm.type} on {comm.date}</p>
                          <p>{comm.description}</p>
                          <button onClick={() => handleDeleteCommunication(company._id, idx)}>Delete</button>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => handleDeleteCompany(company._id)}>Delete Company</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Render Manage Companies Section */}
        {activeSection === 'manageCompanies' && <CompanyManagement />}
        
        {/* Render Manage Communications Section */}
        {activeSection === 'manageCommunications' && <CommunicationMethodManagement />}

        {/* Render Log Communication Section */}
        {activeSection === 'logCommunication' && (
          <section className="log-communication">
            <h2>Log a Communication</h2>
            <form onSubmit={handleCommunicationSubmit}>
              <select
                name="companyId"
                value={newCommunication.companyId}
                onChange={(e) => setNewCommunication({ ...newCommunication, companyId: e.target.value })}
                required
              >
                <option value="">Select Company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>{company.name}</option>
                ))}
              </select>
              <input
                type="text"
                name="type"
                value={newCommunication.type}
                onChange={(e) => setNewCommunication({ ...newCommunication, type: e.target.value })}
                placeholder="Communication Type"
                required
              />
              <input
                type="date"
                name="date"
                value={newCommunication.date}
                onChange={(e) => setNewCommunication({ ...newCommunication, date: e.target.value })}
                required
              />
              <textarea
                name="description"
                value={newCommunication.description}
                onChange={(e) => setNewCommunication({ ...newCommunication, description: e.target.value })}
                placeholder="Description"
                required
              />
              <button type="submit">Submit</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
