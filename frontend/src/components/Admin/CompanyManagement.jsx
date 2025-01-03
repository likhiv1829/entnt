import React, { useState, useEffect } from 'react';
import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  deleteCommunication,
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
    communicationPeriodicity: 'Does not repeat',
    customRecurrence: {
      frequency: 1,
      unit: 'week',
      endDate: '',
      occurrences: 0,
    },
  });
  const [error, setError] = useState('');

  // Fetch companies on component mount and after adding/deleting/updating
  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);  // Update local state with companies from API
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to fetch companies.');
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []); // Fetch companies only once on initial render

  // Handle input changes for new or updating company
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value, // Correctly update the state
    }));
  };

  const handleCustomRecurrenceChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prevCompany) => ({
      ...prevCompany,
      customRecurrence: {
        ...prevCompany.customRecurrence,
        [name]: value,
      },
    }));
  };

  // Handle communication periodicity selection
  const handleRecurrenceChange = (e) => {
    setNewCompany((prevCompany) => ({
      ...prevCompany,
      communicationPeriodicity: e.target.value,
    }));
  };

  // Add or update company
  const handleCompanySubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate inputs before submission
      if (!newCompany.name || !newCompany.location) {
        setError('Company name and location are required.');
        return;
      }

      let updatedCompany;

      if (newCompany._id) {
        // Update company
        updatedCompany = await updateCompany(newCompany._id, newCompany);
        console.log('Updated company:', updatedCompany);
      } else {
        // Create new company
        const createdCompany = await createCompany(newCompany);
        console.log('Created company:', createdCompany);
      }

      // Re-fetch companies from API after creation or update
      fetchCompanies();

      // Reset form after submission
      setNewCompany({
        _id: '',
        name: '',
        location: '',
        linkedInProfile: '',
        emails: '',
        phoneNumbers: '',
        comments: '',
        communicationPeriodicity: 'Does not repeat',
        customRecurrence: {
          frequency: 1,
          unit: 'week',
          endDate: '',
          occurrences: 0,
        },
      });

    } catch (err) {
      console.error('Error saving company:', err);
      if (err.response && err.response.data) {
        setError(`Failed to save company: ${err.response.data.message || 'Unknown error'}`);
      } else {
        setError(`Failed to save company. ${err.message || ''}`);
      }
    }
  };

  // Delete company
  const handleDelete = async (id) => {
    try {
      // Delete company from API
      await deleteCompany(id);

      // Re-fetch companies from API after deletion
      fetchCompanies();
    } catch (err) {
      console.error('Error deleting company:', err);
      setError('Failed to delete company.');
    }
  };

  // Delete communication from company
  const handleDeleteCommunication = async (companyId, commId) => {
    try {
      // Delete communication from API
      await deleteCommunication(companyId, commId);

      // Re-fetch companies from API after communication deletion
      fetchCompanies();
    } catch (err) {
      console.error('Error deleting communication:', err);
      setError('Failed to delete communication.');
    }
  };

  // Format the communicationPeriodicity
  const formatCommunicationPeriodicity = (periodicity, customRecurrence) => {
    if (periodicity === 'Does not repeat') return 'Does not repeat';
    if (periodicity === 'Daily') return 'Daily';
    if (periodicity === 'Weekly on Friday') return 'Weekly on Friday';
    if (periodicity === 'Monthly on the first Friday') return 'Monthly on the first Friday';
    if (periodicity === 'Annually on January 3') return 'Annually on January 3';
    if (periodicity === 'Every weekday (Monday to Friday)') return 'Every weekday (Monday to Friday)';
    if (periodicity === 'Custom...') {
      return `Repeat every ${customRecurrence.frequency} ${customRecurrence.unit} ${customRecurrence.endDate ? `until ${customRecurrence.endDate}` : `for ${customRecurrence.occurrences} occurrences`}`;
    }
    return '';
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

          {/* Communication Periodicity */}
          <label>
            Communication Periodicity:
            <select
              name="communicationPeriodicity"
              value={newCompany.communicationPeriodicity}
              onChange={handleRecurrenceChange}
            >
              <option value="Does not repeat">Does not repeat</option>
              <option value="Daily">Daily</option>
              <option value="Weekly on Friday">Weekly on Friday</option>
              <option value="Monthly on the first Friday">Monthly on the first Friday</option>
              <option value="Annually on January 3">Annually on January 3</option>
              <option value="Every weekday (Monday to Friday)">Every weekday (Monday to Friday)</option>
              <option value="Custom...">Custom...</option>
            </select>
          </label>

          {/* Custom Recurrence Fields */}
          {newCompany.communicationPeriodicity === 'Custom...' && (
            <div>
              <label>
                Repeat every:
                <input
                  type="number"
                  name="frequency"
                  value={newCompany.customRecurrence.frequency}
                  onChange={handleCustomRecurrenceChange}
                  required
                />
              </label>
              <label>
                <select
                  name="unit"
                  value={newCompany.customRecurrence.unit}
                  onChange={handleCustomRecurrenceChange}
                  required
                >
                  <option value="week">week(s)</option>
                  <option value="month">month(s)</option>
                  <option value="year">year(s)</option>
                </select>
              </label>
              <label>
                Repeat on:
                <input
                  type="date"
                  name="endDate"
                  value={newCompany.customRecurrence.endDate}
                  onChange={handleCustomRecurrenceChange}
                />
              </label>
              <label>
                After:
                <input
                  type="number"
                  name="occurrences"
                  value={newCompany.customRecurrence.occurrences}
                  onChange={handleCustomRecurrenceChange}
                />
                occurrences
              </label>
            </div>
          )}

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
            <p>Communication Periodicity: {formatCommunicationPeriodicity(company.communicationPeriodicity, company.customRecurrence)}</p>
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
