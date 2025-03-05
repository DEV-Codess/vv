import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/RegisterUser.css';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // Default role is user
    center: '',
    permissions: []
  });
  const [centers, setCenters] = useState([]);
  const [message, setMessage] = useState('');

  // Available tables (permissions) for users
  const availablePermissions = [
    'Donor Master',
    'Maharaj Master',
    'Inventory Master',
    'Category Master',
    'Donation Center Master',
    'Donation Mode Master',
    'Unit Master'
  ];

  // Fetch centers from the backend
  useEffect(() => {
    axios.get('/api/centers')
      .then(response => setCenters(response.data))
      .catch(err => console.error('Error fetching centers:', err));
  }, []);

  // Handle text/select/checkbox changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle permissions checkboxes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => {
      let updatedPermissions = prev.permissions;
      if (checked) {
        updatedPermissions = [...prev.permissions, name];
      } else {
        updatedPermissions = prev.permissions.filter(p => p !== name);
      }
      return { ...prev, permissions: updatedPermissions };
    });
  };

  // Submit form to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register-user/register', formData);
      setMessage(response.data.message || 'User registered successfully!');
      
      // Reset the form
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
        center: '',
        permissions: []
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to register user');
    }
  };

  return (
    <div className="register-user-container">
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required 
          />
        </div>
        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>
        {/* Role Selection */}
        <div className="input-group">
          <label>Select Role:</label>
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={formData.role === 'user'}
              onChange={handleChange}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={formData.role === 'admin'}
              onChange={handleChange}
            />
            Admin
          </label>
        </div>

        {/* Centers (Only required for Users) */}
        {formData.role === 'user' && (
          <div className="input-group">
            <label htmlFor="center">Select Vayavach Center</label>
            <select 
              id="center"
              name="center" 
              value={formData.center} 
              onChange={handleChange} 
              required
            >
              <option value="">--Select Center--</option>
              {centers.map(center => (
                <option key={center.code} value={center.code}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Permissions (Only for Users) */}
        {formData.role === 'user' && (
          <div className="permissions-group">
            <label>Assign Access (Select Tables):</label>
            <div className="checkboxes">
              {availablePermissions.map((permission, idx) => (
                <div key={idx} className="checkbox-item">
                  <input 
                    type="checkbox"
                    name={permission}
                    id={`permission-${idx}`}
                    checked={formData.permissions.includes(permission)}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={`permission-${idx}`}>{permission}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <button type="submit">Register</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default RegisterUser;
