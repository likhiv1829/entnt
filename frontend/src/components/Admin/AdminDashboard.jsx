import React, { useState, useEffect } from "react";
import { useCompanyContext } from "../../context/CompanyContext";
import CompanyManagement from "./CompanyManagement"; // Import CompanyManagement
import CommunicationMethodManagement from "./CommunicationMethodManagement"; // Import CommunicationMethodManagement
import './AdminDashboard.css';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminDashboard = () => {
  const { companies, addCommunication, removeCommunication, fetchCompanies, setCompanies } = useCompanyContext();
  const [activePage, setActivePage] = useState("welcome");
  const [newCommunication, setNewCommunication] = useState({
    companyId: "",
    type: "",
    date: "",
    description: "",
  });
  const [loading, setLoading] = useState(true); // Loading state for companies

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch companies when component mounts
  useEffect(() => {
    const loadCompanies = async () => {
      await fetchCompanies(); // Fetch the latest companies from the database
      setLoading(false); // Set loading to false after fetching
    };
    loadCompanies();
  }, [fetchCompanies]);

  // Handle form change for logging communication
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunication((prevComm) => ({
      ...prevComm,
      [name]: value,
    }));
  };

  // Handle Logout
  const handleLogout = () => {
    // Clear authentication data and navigate to login page
    localStorage.removeItem("authToken");
    navigate("/"); // Use the navigate function from useNavigate
  };

  // Handle submit for logging communication
  const handleCommunicationSubmit = (e) => {
    e.preventDefault();

    // Ensure that all fields are filled
    if (!newCommunication.type || !newCommunication.date || !newCommunication.description || !newCommunication.companyId) {
      alert("Please fill in all fields.");
      return;
    }

    // Add the new communication to the selected company using addCommunication
    addCommunication(newCommunication.companyId, {
      type: newCommunication.type,
      date: newCommunication.date,
      description: newCommunication.description,
    });

    // Optionally reset form fields
    setNewCommunication({
      companyId: "",
      type: "",
      date: "",
      description: "",
    });

    // Update the companies list after adding communication (non-mutating update)
    const updatedCompanies = companies.map((company) => {
      if (company._id === newCommunication.companyId) {
        return {
          ...company,
          communications: Array.isArray(company.communications)
            ? [...company.communications, {
                type: newCommunication.type,
                date: newCommunication.date,
                description: newCommunication.description,
            }]
            : [{
                type: newCommunication.type,
                date: newCommunication.date,
                description: newCommunication.description,
            }],
        };
      }
      return company;
    });

    setCompanies(updatedCompanies); // Update the companies state
  };

  // Handle Delete Communication
  const handleDeleteCommunication = (companyId, commId) => {
    removeCommunication(companyId, commId); // Make sure removeCommunication is available from context
  };

  // Handle Delete Company
  const handleDeleteCompany = (companyId) => {
    deleteCompany(companyId); // You'll need to define `deleteCompany` in your context
    fetchCompanies(); // Refetch companies after deletion
  };

  // Render content based on active page
  const renderContent = () => {
    switch (activePage) {
      case "home":
        return (
          <div>
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
                      {company.communications && Array.isArray(company.communications) && company.communications.map((comm, idx) => (
                        <li key={comm._id || idx}>
                          <p>{comm.type} on {comm.date}</p>
                          <p>{comm.description}</p>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteCommunication(company._id, comm._id)}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "logCommunication":
        return (
          <div className="admin-log-communication">
            <h2>Log Communication</h2>
            <form onSubmit={handleCommunicationSubmit}>
              <div>
                <label>Company</label>
                <select
                  name="companyId"
                  value={newCommunication.companyId}
                  onChange={handleInputChange}
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
                  name="type"
                  value={newCommunication.type}
                  onChange={handleInputChange}
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
                  name="date"
                  value={newCommunication.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  name="description"
                  value={newCommunication.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit">Log Communication</button>
            </form>
          </div>
        );
      case "manageCompanies":
        return <CompanyManagement />; // Render CompanyManagement Component
      case "manageCommunicationMethods":
        return <CommunicationMethodManagement />; // Render CommunicationMethodManagement Component
      default:
        return (
          <div>
            <h2>Welcome to the Admin Dashboard</h2>
            <p>Select an option from the left menu to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </header>
      <div className="admin-content">
        {loading ? (
          <div>Loading companies...</div>
        ) : (
          <>
            {/* Sidebar Menu */}
            <nav className="admin-sidebar">
              <ul>
                <li>
                  <button onClick={() => setActivePage("home")}>Home</button>
                </li>
                <li>
                  <button onClick={() => setActivePage("logCommunication")}>Log Communication</button>
                </li>
                <li>
                  <button onClick={() => setActivePage("manageCompanies")}>Manage Companies</button>
                </li>
                <li>
                  <button onClick={() => setActivePage("manageCommunicationMethods")}>
                    Manage Communication Methods
                  </button>
                </li>
              </ul>
            </nav>

            {/* Target Div for Dynamic Content */}
            <div className="admin-target-content">{renderContent()}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
