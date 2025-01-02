import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleAdminLogin = () => {
    setShowAdminModal(true);
    setDropdownVisible(false);
  };

  const handleUserLogin = () => {
    setShowUserModal(true);
    setDropdownVisible(false);
  };

  const closeModals = () => {
    setShowAdminModal(false);
    setShowUserModal(false);
    setFormData({ email: "", password: "", name: "" });
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Admin Login
  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/admin/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("token", response.data.token);
      setShowAdminModal(false);
      navigate("/admin");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle User Login
  const handleUserLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("token", response.data.token);
      setShowUserModal(false);
      navigate("/user/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1>Communication Tracker</h1>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#careers">Careers</a></li>
          <li><a href="#contact">Contact Us</a></li>
          <li
            className="dropdown"
            onMouseEnter={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            Login
            {dropdownVisible && (
              <ul className="dropdown-menu">
                <li onClick={handleAdminLogin}>Login as Admin</li>
                <li onClick={handleUserLogin}>Login as User</li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Section: About */}
      <section id="about">
        <h2>About Us</h2>
        <p>Welcome to Communication Tracker! Manage and track communications efficiently.</p>
      </section>

      {/* Section: Careers */}
      <section id="careers">
        <h2>Careers</h2>
        <p>Join our team and help build the future of communication management.</p>
      </section>

      {/* Section: Contact */}
      <section id="contact">
        <h2>Contact Us</h2>
        <p>Email: support@communicationtracker.com</p>
        <p>Phone: +1 (555) 123-4567</p>
      </section>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLoginSubmit}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <button type="submit">Login</button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
            <button onClick={closeModals}>Close</button>
          </div>
        </div>
      )}

      {/* User Login Modal */}
      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>User Login</h2>
            <form onSubmit={handleUserLoginSubmit}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
              <button type="submit">Login</button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
            <button onClick={closeModals}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
