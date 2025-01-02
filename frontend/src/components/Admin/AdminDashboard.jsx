import React, { useState } from 'react';
import { useCompanyContext } from "../../context/CompanyContext"; // Import Context
import { Link } from "react-router-dom";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { companies, updateCompanyCommunication, addCompany } = useCompanyContext();  // Use context to get companies
  const [newCommunication, setNewCommunication] = useState({
    type: "",
    date: "",
    description: "",
  });
  const [newCompany, setNewCompany] = useState({
    name: "",
    details: "",
  });

  // Handle Communication Form Submit
  const handleCommunicationSubmit = (e) => {
    e.preventDefault();

    if (!newCommunication.type || !newCommunication.date || !newCommunication.description) {
      alert("Please fill in all fields.");
      return;
    }

    // Add communication to selected company
    const updatedCompanies = companies.map((company) => {
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
    });

    // Update the company context
    updateCompanyCommunication(updatedCompanies);
    setNewCommunication({ type: "", date: "", description: "" }); // Reset form fields
  };

  // Handle Company Add Form Submit
  const handleCompanySubmit = (e) => {
    e.preventDefault();

    if (!newCompany.name || !newCompany.details) {
      alert("Please fill in all fields.");
      return;
    }

    // Add new company to the list
    addCompany(newCompany);
    setNewCompany({ name: "", details: "" }); // Reset form fields
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
              <Link className="admin-nav-link" to="/admin/company-management">Manage Companies</Link>
            </li>
            <li>
              <Link className="admin-nav-link" to="/admin/communication-method-management">Manage Communication Methods</Link>
            </li>
          </ul>
        </nav>

        {/* Add Company Form */}
        <section className="admin-add-company">
          <h2>Add New Company</h2>
          <form onSubmit={handleCompanySubmit}>
            <div>
              <label>Company Name</label>
              <input
                type="text"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Company Details</label>
              <textarea
                value={newCompany.details}
                onChange={(e) => setNewCompany({ ...newCompany, details: e.target.value })}
                required
              />
            </div>
            <button type="submit">Add Company</button>
          </form>
        </section>

        {/* Manage Companies */}
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
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Log Communication Form */}
        <section className="admin-log-communication">
          <h2>Log Communication</h2>
          <form onSubmit={handleCommunicationSubmit}>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
