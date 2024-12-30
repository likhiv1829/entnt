import React, { useState, useEffect } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../utils/api'; // Ensure this path is correct

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

  // Fetch companies when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to fetch companies. Please try again later.');
      }
    };

    fetchCompanies();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCompany(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission for adding or updating companies
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newCompany._id) {
        // Update existing company
        await updateCompany(newCompany._id, newCompany);
      } else {
        // Add new company
        await createCompany(newCompany);
      }

      const updatedCompanies = await getCompanies();
      setCompanies(updatedCompanies);

      // Reset the form
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
      setError('');
    } catch (err) {
      console.error('Error saving company:', err);
      setError('Failed to save company. Please try again later.');
    }
  };

  // Handle editing (updating) a company
  const handleUpdate = (id) => {
    const company = companies.find(c => c._id === id);
    setNewCompany(company);
  };

  // Handle deleting a company
  const handleDelete = async (id) => {
    try {
      await deleteCompany(id); // Delete the company
      const updatedCompanies = await getCompanies(); // Fetch updated list of companies
      setCompanies(updatedCompanies); // Update the local state
      setError('');
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company. Please try again later.');
    }
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
          placeholder="Communication Periodicity"
        />
        <button type="submit">{newCompany._id ? 'Update Company' : 'Add Company'}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h3>Existing Companies</h3>
      <ul>
        {companies.map((company) => (
          <li key={company._id}>
            <h4>{company.name} - {company.location}</h4>
            <p>{company.linkedInProfile}</p>
            <p>{company.emails}</p>
            <button onClick={() => handleUpdate(company._id)}>Update</button>
            <button onClick={() => handleDelete(company._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyManagement;