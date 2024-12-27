// components/Admin/CommunicationMethodManagement.js
import './AdminDashboard.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommunicationMethodManagement = () => {
  const [methods, setMethods] = useState([]);
  const [newMethod, setNewMethod] = useState({
    name: '',
    description: '',
    sequence: 1,
    mandatory: false,
  });

  useEffect(() => {
    // Make sure you're pointing to the correct backend API
    axios.get('http://localhost:5000/api/communication-methods') // Ensure this URL is correct
      .then(response => {
        setMethods(response.data);
      })
      .catch(error => {
        console.error('Error fetching communication methods:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMethod({ ...newMethod, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/communication-methods', newMethod) // Ensure this URL is correct
      .then(response => {
        setMethods([...methods, response.data]);
        setNewMethod({
          name: '',
          description: '',
          sequence: 1,
          mandatory: false,
        });
      })
      .catch(error => {
        console.error('Error adding communication method:', error);
      });
  };

  return (
    <div>
      <h2>Manage Communication Methods</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newMethod.name}
          onChange={handleChange}
          placeholder="Method Name"
        />
        <textarea
          name="description"
          value={newMethod.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="number"
          name="sequence"
          value={newMethod.sequence}
          onChange={handleChange}
          placeholder="Sequence"
        />
        <label>
          Mandatory:
          <input
            type="checkbox"
            name="mandatory"
            checked={newMethod.mandatory}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Method</button>
      </form>

      <h3>Existing Communication Methods</h3>
      <ul>
        {methods.map((method) => (
          <li key={method._id}>
            {method.name} - {method.description} (Sequence: {method.sequence})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunicationMethodManagement;
