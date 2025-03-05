import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import '../styles/Login.css';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call login with { username, password }
      const response = await login(formData);

      // Save token, role, permissions
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      if (response.permissions) {
        localStorage.setItem('permissions', JSON.stringify(response.permissions));
      }

      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <p className="login-link">
          Forgot Password? <a href="/forgot-password">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
