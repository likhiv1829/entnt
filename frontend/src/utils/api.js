import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ensure this is the correct base URL for your API

// Fetch companies from the API
export const getCompanies = async () => {
  try {
    console.log('Fetching companies from:', `${API_URL}/companies`);
    const response = await axios.get(`${API_URL}/companies`);
    console.log('Response status:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

// Create a new company
export const createCompany = async (company) => {
  try {
    const response = await axios.post(`${API_URL}/companies`, company, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Created company:', response.data);  // Added logging for debugging
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

// Update an existing company
export const updateCompany = async (id, company) => {
  try {
    const response = await axios.put(`${API_URL}/companies/${id}`, company, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Updated company:', response.data);  // Added logging for debugging
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

// Delete a company
export const deleteCompany = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/companies/${id}`);
    console.log('Deleted company:', response.data);  // Added logging for debugging
    return response.data;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

// Fetch communications for a specific company
export const getCompanyCommunications = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/companies/${companyId}/communications`);
    console.log('Fetched communications:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching communications:', error);
    throw error;
  }
};

// Create a new communication for a company
export const createCommunication = async (companyId, communication) => {
  try {
    // Ensure that communication includes periodicity information
    const communicationData = {
      ...communication,
      communicationPeriodicity: communication.communicationPeriodicity, // E.g., "weekly", "monthly"
      customRecurrence: communication.customRecurrence, // Handle if there's custom recurrence
    };

    const response = await axios.post(`${API_URL}/companies/${companyId}/communications`, communicationData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Created communication:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating communication:', error);
    throw error;
  }
};

// Update an existing communication for a company
export const updateCommunication = async (companyId, communicationId, communication) => {
  try {
    // Ensure that communication includes periodicity information
    const communicationData = {
      ...communication,
      communicationPeriodicity: communication.communicationPeriodicity, // E.g., "weekly", "monthly"
      customRecurrence: communication.customRecurrence, // Handle if there's custom recurrence
    };

    const response = await axios.put(`${API_URL}/companies/${companyId}/communications/${communicationId}`, communicationData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Updated communication:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating communication:', error);
    throw error;
  }
};

// Delete a communication for a company
export const deleteCommunication = async (companyId, communicationId) => {
  try {
    const response = await axios.delete(`${API_URL}/companies/${companyId}/communications/${communicationId}`);
    console.log('Deleted communication:', response.data);  // Added logging for debugging
    return response.data;
  } catch (error) {
    console.error('Error deleting communication:', error);
    throw error;
  }
};
