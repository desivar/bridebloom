// src/components/Login.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// Assuming you are using React Router for navigation
// import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, loading, error, isAuthenticated } = useAuth();
  // const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);

    if (success) {
      // navigate('/'); // Redirect to the homepage on successful login
      console.log('Login successful!');
    }
  };
  
  // If already logged in, show a message or redirect
  if (isAuthenticated) {
    return <h2>You are already logged in!</h2>;
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Customer Login</h2>
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging In...' : 'Login'}
      </button>
      
      {error && <p className="error-message">Error: {error}</p>}
      
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </form>
  );
};

export default Login;