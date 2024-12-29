import axios from 'axios';

// Base URL for API calls
const BASE_URL = 'http://localhost:5000/api';

// API calls for Company
export const getCompanies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/companies`); // Use BASE_URL here
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const createCompany = async (company) => {
  try {
    const response = await axios.post(`${BASE_URL}/companies`, company); // Use BASE_URL here
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

// Update an existing company
export const updateCompany = async (companyId, companyData) => {
  try {
    const response = await axios.put(`${BASE_URL}/companies/${companyId}`, companyData);
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

export const deleteCompany = async (companyId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/companies/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

export const getCommunications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/communication`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching communications:', error);
    throw error;
  }
};

export const createCommunication = async (communicationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/communication`, communicationData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating communication:', error);
    throw error;
  }
};
