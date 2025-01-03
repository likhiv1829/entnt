import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context for Company
const CompanyContext = createContext();

// Custom Hook to access Company Context
export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState(() => {
    // Load companies from localStorage if available, otherwise default to empty array
    const savedCompanies = localStorage.getItem("companies");
    return savedCompanies ? JSON.parse(savedCompanies) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch companies from the backend and store in localStorage
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/companies", { timeout: 5000 });
      setCompanies(response.data);
      localStorage.setItem("companies", JSON.stringify(response.data)); // Save to localStorage
    } catch (error) {
      if (error.response) {
        // Server responded with a status code out of range 2xx
        console.error("Error response:", error.response);
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error request:", error.request);
        setError("Network error: No response from the server.");
      } else {
        // Other errors
        console.error("Axios error:", error.message);
        setError(`Axios error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Only fetch companies if they're not already available in localStorage
    if (companies.length === 0) {
      fetchCompanies();
    }
  }, [companies.length]); // Only runs if companies are empty.

  // Add company
  const addCompany = async (newCompany) => {
    try {
      const response = await axios.post("/api/companies", newCompany);
      setCompanies((prev) => {
        const updatedCompanies = [...prev, response.data];
        localStorage.setItem("companies", JSON.stringify(updatedCompanies));
        return updatedCompanies;
      });
    } catch (error) {
      console.error("Error adding company:", error);
      setError("Failed to add company. Please try again.");
    }
  };

  // Remove communication
  const removeCommunication = (companyId, commId) => {
    const updatedCompanies = companies.map((company) => {
      if (company._id === companyId) {
        return {
          ...company,
          communications: company.communications.filter((comm) => comm._id !== commId),
        };
      }
      return company;
    });
    setCompanies(updatedCompanies);
    localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Save updated companies
  };
  
  const addCommunication = (companyId, communication) => {
    setCompanies((prevCompanies) => {
      const updatedCompanies = prevCompanies.map((company) =>
        company._id === companyId
          ? {
              ...company,
              communications: Array.isArray(company.communications)
                ? [...company.communications, communication]
                : [communication],
            }
          : company
      );
      localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Persist the updated companies
      return updatedCompanies;
    });
  };
  
  const updateCompanyCommunication = (updatedCompanies) => {
    setCompanies(updatedCompanies);
    localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Persist the updated companies
  };

  // Delete company
  const deleteCompany = async (companyId) => {
    try {
      await axios.delete(`http://localhost:5000/api/companies/${companyId}`);
      setCompanies((prevCompanies) => {
        const updatedCompanies = prevCompanies.filter((company) => company._id !== companyId);
        localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Persist the updated companies
        return updatedCompanies;
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      setError("Failed to delete company. Please try again.");
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        setCompanies,
        fetchCompanies,
        addCompany,
        removeCommunication,
        updateCompanyCommunication,
        addCommunication,
        deleteCompany,
        loading,
        error,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
