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

  // Fetch companies from the backend and store in localStorage
  const fetchCompanies = async () => {
  setLoading(true); // Set loading to true before fetch
  try{
      const response = await axios.get("http://localhost:5000/api/companies");
      setCompanies(response.data);
      localStorage.setItem("companies", JSON.stringify(response.data)); // Store companies in localStorage
    } catch (error) {
      console.error("Error fetching companies:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);  // Set loading to false after fetch completes
    }
  };

  // Add a company
  const addCompany = async (newCompany) => {
    try {
      const response = await axios.post("/api/companies", newCompany);
      setCompanies((prev) => {
        const updatedCompanies = [...prev, response.data];
        localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Update localStorage
        return updatedCompanies;
      });
    } catch (error) {
      console.error("Error adding company:", error);
      setError("Failed to add company. Please try again.");
    }
  };

  // Add communication
  const addCommunication = (companyId, communication) => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company._id === companyId
          ? {
              ...company,
              communications: Array.isArray(company.communications)
                ? [...company.communications, communication]
                : [communication],
            }
          : company
      )
    );
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
    localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Update localStorage
  };

  // Delete company
  const deleteCompany = async (companyId) => {
    try {
      await axios.delete(`http://localhost:5000/api/companies/${companyId}`); // API endpoint for deleting company
      setCompanies((prevCompanies) => {
        const updatedCompanies = prevCompanies.filter((company) => company._id !== companyId);
        localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Update localStorage after deletion
        return updatedCompanies; // Return the updated list
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
        addCommunication,
        addCompany,
        removeCommunication,
        deleteCompany, // Expose deleteCompany
        loading,       // Expose loading state
        error,         // Expose error state
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
