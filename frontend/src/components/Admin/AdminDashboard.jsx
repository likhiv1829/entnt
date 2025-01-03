import React, { useState, useEffect } from 'react';
import { useCompanyContext } from "../../context/CompanyContext"; // Import Context
import { Link, useNavigate } from "react-router-dom";
import CompanyManagement from './CompanyManagement'; // Import Company Management Component
import CommunicationMethodManagement from './CommunicationMethodManagement'; // Import Communication Method Management Component
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { companies, updateCompanyCommunication } = useCompanyContext();  // Use context to get companies
  const [newCommunication, setNewCommunication] = useState({
    type: "",
    date: "",
    description: "",
    companyId: "", // New field for company selection
  });
  const [activeSection, setActiveSection] = useState('currentCompanies'); // Track active section

  const navigate = useNavigate(); // Hook to navigate programmatically

  // Load saved company data (including communications) from localStorage on component mount
  useEffect(() => {
    const savedCompanies = JSON.parse(localStorage.getItem('companies'));
    if (savedCompanies) {
      updateCompanyCommunication(savedCompanies);  // Update context with saved data
    }
  }, []); // Runs only once on component mount.

  // Update localStorage every time companies data (including communications) changes
  useEffect(() => {
    if (companies.length > 0) {
      localStorage.setItem('companies', JSON.stringify(companies));  // Save companies (with communications) to localStorage
    }
  }, [companies]);  // Runs every time companies state changes.

  // Handle Communication Form Submit
  const handleCommunicationSubmit = (e) => {
    e.preventDefault();

    if (!newCommunication.type || !newCommunication.date || !newCommunication.description || !newCommunication.companyId) {
      alert("Please fill in all fields.");
      return;
    }

    // Add communication to selected company
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

    // Update the company context and save to localStorage
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

    // Update the company context and localStorage
    updateCompanyCommunication(updatedCompanies);
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear authentication data (e.g., token, user info)
    localStorage.removeItem("authToken");
    // Do NOT remove communication data when logging out
    // localStorage.removeItem("newCommunication"); // This line should be commented out to keep data
    // Redirect to login page
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage companies and ensure they reflect on the User Dashboard.</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button> {/* Logout Button */}
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

        {/* Render Manage Companies Section */}
        {activeSection === 'manageCompanies' && (
          <section className="admin-companies">
            <h2>Manage Companies</h2>
            <CompanyManagement /> {/* Render CompanyManagement Component */}
          </section>
        )}

        {/* Render Manage Communications Section */}
        {activeSection === 'manageCommunications' && (
          <section className="admin-communications">
            <h2>Manage Communications</h2>
            <CommunicationMethodManagement /> {/* Render CommunicationMethodManagement Component */}
          </section>
        )}

        {/* Render Current Companies Section */}
        {activeSection === 'currentCompanies' && (
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
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Render Log Communication Form Section */}
        {activeSection === 'logCommunication' && (
          <section className="admin-log-communication">
            <h2>Log Communication</h2>
            <form onSubmit={handleCommunicationSubmit}>
              <div>
                <label>Company</label>
                <select
                  value={newCommunication.companyId}
                  onChange={(e) => setNewCommunication({ ...newCommunication, companyId: e.target.value })}
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company._id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Communication Type</label>
                <select
                  value={newCommunication.type}
                  onChange={(e) => setNewCommunication({ ...newCommunication, type: e.target.value })}
                  required
                >
                  <option value="">Select Communication Type</option>
                  <option value="LinkedIn Post">LinkedIn Post</option>
                  <option value="LinkedIn Message">LinkedIn Message</option>
                  <option value="Email">Email</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label>Date</label>
                <input
                  type="date"
                  value={newCommunication.date}
                  onChange={(e) => setNewCommunication({ ...newCommunication, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  value={newCommunication.description}
                  onChange={(e) => setNewCommunication({ ...newCommunication, description: e.target.value })}
                  required
                />
              </div>
              <button type="submit">Log Communication</button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
