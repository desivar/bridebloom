import React, { createContext, useState, useContext } from 'react';

// Create the Context object
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State for authentication status and user data
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // To handle async operations

  // Placeholder function for logging in
  const login = async (email, password) => {
    setLoading(true);
    // *** Placeholder for API call ***
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    // Simple mock authentication logic
    if (email === 'test@example.com' && password === 'password') {
      setIsLoggedIn(true);
      setUser({ email, name: 'Test Bride' });
      alert('Login successful!');
    } else {
      alert('Invalid credentials (Use test@example.com / password)');
    }
    setLoading(false);
  };

  // Placeholder function for registering
  const register = async (name, email, password, weddingDate) => {
    setLoading(true);
    // *** Placeholder for API call ***
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoggedIn(true);
    setUser({ email, name, weddingDate });
    alert(`Welcome, ${name}! Registration successful.`);
    setLoading(false);
  };

  // Function to log out
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context
export const useAuth = () => useContext(AuthContext);