import React, { createContext, useContext, useState } from 'react';

// Create context for companies
const CompanyContext = createContext();

// Custom hook to use the CompanyContext
export const useCompanyContext = () => {
  return useContext(CompanyContext);
};

// Company provider to wrap the app and manage the companies state
export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);  // Manage companies state

  // Add a new company to the list (Avoid duplicates)
  const addCompany = (company) => {
    setCompanies((prevCompanies) => {
      // Check if the company already exists (based on name or id)
      const exists = prevCompanies.some((existingCompany) => existingCompany.id === company.id || existingCompany.name === company.name);
      if (exists) {
        return prevCompanies;  // Don't add if company already exists
      }
      return [...prevCompanies, company];  // Add company if it's new
    });
  };

  // Update an existing company by its ID
  const updateCompanyCommunication = (updatedCompany) => {
    setCompanies((prevCompanies) => {
      return prevCompanies.map((company) => 
        company.id === updatedCompany.id ? updatedCompany : company
      );
    });
  };

  return (
    <CompanyContext.Provider value={{ companies, addCompany, updateCompanyCommunication }}>
      {children}
    </CompanyContext.Provider>
  );
};
