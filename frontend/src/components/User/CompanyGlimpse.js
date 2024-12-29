import React from "react";
const CompanyGlimpse = ({ company }) => {
  if (!company) {
    return <p>Please select a company to view its details.</p>;
  }

  return (
    <div className="company-glimpse">
      <h2>{company.name}</h2>
      <p>
        <strong>Location:</strong> {company.location || "N/A"}
      </p>
      <p>
        <strong>LinkedIn Profile:</strong>{" "}
        {company.linkedInProfile ? (
          <a href={company.linkedInProfile} target="_blank" rel="noopener noreferrer">
            {company.linkedInProfile}
          </a>
        ) : (
          "N/A"
        )}
      </p>
      <p>
        <strong>Emails:</strong> {company.emails || "N/A"}
      </p>
      <p>
        <strong>Phone Numbers:</strong> {company.phoneNumbers || "N/A"}
      </p>
      <p>
        <strong>Comments:</strong> {company.comments || "N/A"}
      </p>
      <p>
        <strong>Communication Periodicity:</strong> {company.communicationPeriodicity || "N/A"} days
      </p>
    </div>
  );
};

export default CompanyGlimpse;
