import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context for Company
const CompanyContext = createContext();

// Custom Hook to access Company Context
export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(null); // To store error messages

  // Fetch companies from the backend
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/companies"); // Replace with your API endpoint
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a company
  const addCompany = async (newCompany) => {
    try {
      const response = await axios.post("/api/companies", newCompany); // API endpoint for adding company
      setCompanies((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding company:", error);
      setError("Failed to add company. Please try again.");
    }
  };

  // Update company communications
  const updateCompanyCommunication = (updatedCompanies) => {
    setCompanies(updatedCompanies);
  };

  // Fetch companies when the component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companies,
        addCompany,
        updateCompanyCommunication,
        loading,      // Expose loading state
        error,        // Expose error state
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
