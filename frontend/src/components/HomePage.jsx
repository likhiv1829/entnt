import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css"; 

const HomePage = () => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleAdminLogin = () => {
    setShowAdminModal(true);
  };

  const handleUserLogin = () => {
    setShowUserModal(true);
    setShowRegisterModal(false); // Ensure registration modal is closed
  };

  const handleRegister = () => {
    setShowRegisterModal(true);
    setShowUserModal(false); // Ensure login modal is closed
  };

  const closeModals = () => {
    setShowAdminModal(false);
    setShowUserModal(false);
    setShowRegisterModal(false);
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
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      setShowAdminModal(false);
      navigate('/admin'); // Redirect to Admin Dashboard
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
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      setShowUserModal(false);
      navigate('/user/dashboard'); // Redirect to User Dashboard
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle User Registration
  const handleUserRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setShowRegisterModal(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="homepage">
      <h1>Welcome to Communication Tracker</h1>
      <button onClick={handleAdminLogin}>Login as Admin</button>
      <button onClick={handleUserLogin}>Login as User</button>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLoginSubmit}>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </label>
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
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </label>
              <div>
                <button type="submit">Login</button>
                <button type="button">Forgot Password?</button>
              </div>
            </form>
            <p>
              New User? <a href="#" onClick={handleRegister}>Register</a>
            </p>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button onClick={closeModals}>Close</button>
          </div>
        </div>
      )}

      {/* User Registration Modal */}
      {showRegisterModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>User Registration</h2>
            <form onSubmit={handleUserRegisterSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </label>
              <button type="submit">Register</button>
              {errorMessage && <p className="error">{errorMessage}</p>}
            </form>
            <p>
              Already have an account? <a href="#" onClick={handleUserLogin}>Login</a>
            </p>
            <button onClick={closeModals}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
