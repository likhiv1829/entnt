// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Importing the CSS file 

function HomePage() {
  return (
    <div className="homepage-container">
      <h1 className="welcome-message">Welcome to the Application</h1>
      <p className="role-instructions">Choose a role to proceed:</p>
      <div className="button-container">
        <Link to="/admin" className="role-button">Go to Admin Dashboard</Link> {/* Link to Admin */}
        <Link to="/user/dashboard" className="role-button">Go to User Dashboard</Link> {/* Link to User */}
      </div>
    </div>
  );
}

export default HomePage;
