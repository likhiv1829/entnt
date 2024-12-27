import React, { useState, useEffect } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../utils/api'; // Import API functions
import './AdminDashboard.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: '',
    location: '',
    linkedInProfile: '',
    emails: '',
    phoneNumbers: '',
    comments: '',
    communicationPeriodicity: 14, // Default 14 days
  });
  const [error, setError] = useState(''); // State to handle error messages

  useEffect(() => {
    // Fetch existing companies using the API function
    getCompanies()
      .then(data => setCompanies(data))
      .catch(err => {
        console.error('Error fetching companies:', err);
        setError('Failed to fetch companies. Please try again later.');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCompany({ ...newCompany, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation: Check if required fields are filled
    if (!newCompany.name || !newCompany.location || !newCompany.emails) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(''); // Clear any previous errors

    createCompany(newCompany)
      .then(data => {
        setCompanies([...companies, data]);
        setNewCompany({
          name: '',
          location: '',
          linkedInProfile: '',
          emails: '',
          phoneNumbers: '',
          comments: '',
          communicationPeriodicity: 14,
        });
      })
      .catch(err => {
        setError('Failed to add company. Please try again later.');
      });
  };

  const handleUpdate = (companyId) => {
    const companyToUpdate = companies.find(company => company._id === companyId);
    if (companyToUpdate) {
      setNewCompany({
        name: companyToUpdate.name,
        location: companyToUpdate.location,
        linkedInProfile: companyToUpdate.linkedInProfile,
        emails: companyToUpdate.emails,
        phoneNumbers: companyToUpdate.phoneNumbers,
        comments: companyToUpdate.comments,
        communicationPeriodicity: companyToUpdate.communicationPeriodicity,
      });
    }
  };

  const handleDelete = (companyId) => {
    deleteCompany(companyId)
      .then(() => {
        setCompanies(companies.filter(company => company._id !== companyId));
      })
      .catch(err => {
        setError('Failed to delete company. Please try again later.');
      });
  };

  return (
    <div>
      <h2>Manage Companies</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newCompany.name}
          onChange={handleChange}
          placeholder="Company Name"
        />
        <input
          type="text"
          name="location"
          value={newCompany.location}
          onChange={handleChange}
          placeholder="Location"
        />
        <input
          type="text"
          name="linkedInProfile"
          value={newCompany.linkedInProfile}
          onChange={handleChange}
          placeholder="LinkedIn Profile"
        />
        <input
          type="text"
          name="emails"
          value={newCompany.emails}
          onChange={handleChange}
          placeholder="Emails"
        />
        <input
          type="text"
          name="phoneNumbers"
          value={newCompany.phoneNumbers}
          onChange={handleChange}
          placeholder="Phone Numbers"
        />
        <textarea
          name="comments"
          value={newCompany.comments}
          onChange={handleChange}
          placeholder="Comments"
        />
        <input
          type="number"
          name="communicationPeriodicity"
          value={newCompany.communicationPeriodicity}
          onChange={handleChange}
          placeholder="Communication Periodicity (days)"
        />
        <button type="submit">Add Company</button>
      </form>

      {error && <p className="error">{error}</p>} {/* Display error message if exists */}

      <h3>Existing Companies</h3>
      <ul>
        {companies.map((company) => (
          <li key={company._id}>
            {company.name} - {company.location}
            <button onClick={() => handleUpdate(company._id)}>Update</button>
            <button onClick={() => handleDelete(company._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyManagement;
