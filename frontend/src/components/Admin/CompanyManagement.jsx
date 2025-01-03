import React, { useState, useEffect } from 'react';
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../../utils/api'; // Replace with actual API utility path

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    _id: '',
    name: '',
    location: '',
    linkedInProfile: '',
    emails: '',
    phoneNumbers: '',
    comments: '',
    communicationPeriodicity: 14,
  });
  const [error, setError] = useState('');

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);  // Update local state with companies from API
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to fetch companies.');
      }
    };
    fetchCompanies();
  }, []);

  // Handle input changes for new or updating company
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value, // Correctly update the state
    }));
  };

  // Add or update company
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    
    try {
      let updatedCompany;

      if (newCompany._id) {
        // Update company
        updatedCompany = await updateCompany(newCompany._id, newCompany);
        console.log('Updated company:', updatedCompany);

        // Re-fetch companies from API after update
        const data = await getCompanies();
        setCompanies(data);  // Set updated companies list
      } else {
        // Create new company
        const createdCompany = await createCompany(newCompany);
        console.log('Created company:', createdCompany);

        // Re-fetch companies from API after creation
        const data = await getCompanies();
        setCompanies(data);  // Set updated companies list
      }

      // Reset form after submission
      setNewCompany({
        _id: '',
        name: '',
        location: '',
        linkedInProfile: '',
        emails: '',
        phoneNumbers: '',
        comments: '',
        communicationPeriodicity: 14,
      });

    } catch (err) {
      console.error('Error saving company:', err);
      setError('Failed to save company.');
    }
  };

  // Delete company
  const handleDelete = async (id) => {
    try {
      // Delete company from API
      await deleteCompany(id);

      // Re-fetch companies from API after deletion
      const data = await getCompanies();
      setCompanies(data);  // Set updated companies list
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company.');
    }
  };

  const handleDeleteCommunication = (companyId, commId) => {
    removeCommunication(companyId, commId);  // Call the function from context
  };

  return (
    <div>
      <h2>Company Management</h2>

      {/* Add or Update Company Form */}
      <div>
        <h3>{newCompany._id ? 'Update Company' : 'Add New Company'}</h3>
        <form onSubmit={handleCompanySubmit}>
          <input
            type="text"
            name="name"
            value={newCompany.name}
            onChange={handleCompanyChange}
            placeholder="Company Name"
            required
          />
          <input
            type="text"
            name="location"
            value={newCompany.location}
            onChange={handleCompanyChange}
            placeholder="Location"
            required
          />
          <input
            type="url"
            name="linkedInProfile"
            value={newCompany.linkedInProfile}
            onChange={handleCompanyChange}
            placeholder="LinkedIn Profile"
          />
          <input
            type="text"
            name="emails"
            value={newCompany.emails}
            onChange={handleCompanyChange}
            placeholder="Emails (comma-separated)"
          />
          <input
            type="text"
            name="phoneNumbers"
            value={newCompany.phoneNumbers}
            onChange={handleCompanyChange}
            placeholder="Phone Numbers (comma-separated)"
          />
          <textarea
            name="comments"
            value={newCompany.comments}
            onChange={handleCompanyChange}
            placeholder="Comments"
          ></textarea>
          <input
            type="number"
            name="communicationPeriodicity"
            value={newCompany.communicationPeriodicity}
            onChange={handleCompanyChange}
            placeholder="Communication Periodicity (days)"
            required
          />
          <button type="submit">
            {newCompany._id ? 'Update Company' : 'Add Company'}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && <p className="error">{error}</p>}

      {/* Companies List */}
      <h3>Companies</h3>
      <ul>
        {companies.map((company) => (
          <li key={company._id}>
            <h4>{company.name}</h4>
            <p>{company.location}</p>
            <p>LinkedIn: {company.linkedInProfile}</p>
            <p>Emails: {company.emails}</p>
            <p>Phone Numbers: {company.phoneNumbers}</p>
            <p>Communication Periodicity: {company.communicationPeriodicity} days</p>
            <button onClick={() => setNewCompany(company)}>Edit</button>
            <button onClick={() => handleDelete(company._id)}>Delete</button>

            {/* Communications */}
            <h5>Communications</h5>
            <ul>
              {company.communications && Array.isArray(company.communications) && company.communications.length > 0 ? (
                company.communications.map((comm, idx) => (
                  <li key={idx}>
                    {comm.type} on {comm.date}: {comm.description}
                    <button onClick={() => handleDeleteCommunication(company._id, comm._id)}>
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p>No communications available</p>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyManagement;
