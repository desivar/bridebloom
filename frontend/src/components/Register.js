// src/components/Register.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
// Assuming you use React Router for navigation
// import { useNavigate } from 'react-router-dom'; 

const Register = () => {
  // Initial state includes required fields from your UserSchema
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    phone: '',
    weddingDate: ''
  });
  
  const { register, loading, error, isAuthenticated } = useAuth();
  // const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Perform registration. The register function handles API call,
    // token storage, and sets user state upon success.
    const success = await register(formData);

    if (success) {
      // navigate('/'); // Redirect to the homepage or profile after successful registration
      console.log('Registration successful! User logged in automatically.');
    }
  };
  
  // If already logged in, show a message or redirect
  if (isAuthenticated) {
    return <h2>You are already registered and logged in!</h2>;
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Your Bride Blooms Account</h2>
      
      {/* Required Fields */}
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password (min 6 characters)" required />
      
      {/* Optional/Schema Fields */}
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number (Optional)" />
      <label htmlFor="weddingDate">Wedding Date:</label>
      <input type="date" id="weddingDate" name="weddingDate" value={formData.weddingDate} onChange={handleChange} />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register Account'}
      </button>
      
      {error && <p className="error-message">Error: {error}</p>}
      
      <p>Already have an account? <a href="/login">Login here</a></p>
    </form>
  );
};

export default Register;