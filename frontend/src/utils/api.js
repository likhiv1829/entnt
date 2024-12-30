import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Ensure this is the correct base URL for your API

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

export const createCompany = async (company) => {
  try {
    const response = await axios.post(`${API_URL}/companies`, company, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const updateCompany = async (id, company) => {
  try {
    const response = await axios.put(`${API_URL}/companies/${id}`, company, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

export const deleteCompany = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/companies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};
