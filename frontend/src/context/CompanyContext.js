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
    setLoading(true); // Indicate loading state
    setError(null); // Reset error state
    try {
      const response = await axios.get("http://localhost:5000/api/companies");
      setCompanies(response.data);
      localStorage.setItem("companies", JSON.stringify(response.data)); // Cache in localStorage
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to fetch companies. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };
  

  useEffect(() => {
    // Only fetch companies if they're not already available in localStorage
    if (companies.length === 0 && !loading) {
      fetchCompanies();
    }
  }, [companies.length, loading]); // Dependency on companies.length and loading to avoid infinite loop

  // Add company
  const addCompany = async (newCompany) => {
    try {
      const response = await axios.post("http://localhost:5000/api/companies", newCompany);
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

  // Update company communication periodicity
  const updateCompanyCommunicationPeriodicity = async (companyId, communicationPeriodicity) => {
    try {
      const updatedCompanies = companies.map((company) =>
        company._id === companyId
          ? {
              ...company,
              communicationPeriodicity: communicationPeriodicity,
            }
          : company
      );
      setCompanies(updatedCompanies);
      localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Persist the updated companies
    } catch (error) {
      console.error("Error updating communication periodicity:", error);
      setError("Failed to update communication periodicity.");
    }
  };

  // Update custom recurrence
  const updateCustomRecurrence = async (companyId, customRecurrence) => {
    try {
      const updatedCompanies = companies.map((company) =>
        company._id === companyId
          ? {
              ...company,
              customRecurrence: customRecurrence,
            }
          : company
      );
      setCompanies(updatedCompanies);
      localStorage.setItem("companies", JSON.stringify(updatedCompanies)); // Persist the updated companies
    } catch (error) {
      console.error("Error updating custom recurrence:", error);
      setError("Failed to update custom recurrence.");
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
        updateCompanyCommunicationPeriodicity,
        updateCustomRecurrence,
        deleteCompany,
        loading,
        error,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
