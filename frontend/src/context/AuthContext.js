// frontend/src/context/AuthContext.js (Updated to use axios-based api.js)

import React, { createContext, useState, useEffect } from 'react';
// ⚠️ Import the authAPI functions you defined
import { authAPI } from '../api'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State to hold user data (initialize from local storage)
    const initialUser = JSON.parse(localStorage.getItem('user')) || null;
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);

    // Initial check for a user token (useful on page load)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !user) {
            // Optional: If token exists but user state is missing,
            // you might want to call authAPI.getCurrentUser() here
            // to re-fetch user details and set the state.
            // For now, we rely on the initialUser setup.
        }
    }, [user]); 
    
    // --- Helper function for components ---
    const getToken = () => localStorage.getItem('token');
    const isAuthenticated = !!user;

    // --- 1. Login Function ---
    const login = async (email, password) => {
        setLoading(true);
        try {
            // 🚀 Call the centralized API function
            const data = await authAPI.login({ email, password });
            
            // The token is stored by the interceptor/login function in api.js
            // We just need to set the user state here.
            localStorage.setItem('user', JSON.stringify(data.user)); 
            setUser(data.user);
            
        } catch (error) {
            // Axios errors often include a response object
            throw new Error(error.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Register Function ---
    const register = async (userData) => {
        setLoading(true);
        try {
            // 🚀 Call the centralized API function
            const data = await authAPI.register(userData);
            
            // The token is stored by the interceptor/register function in api.js
            localStorage.setItem('user', JSON.stringify(data.user)); 
            setUser(data.user);

        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    // --- 3. Logout Function ---
    const logout = () => {
        authAPI.logout(); // Clears token via the dedicated API function
        localStorage.removeItem('user');
        setUser(null);
    };

    // Context Value exposed to children
    const value = {
        user,
        loading,
        getToken,
        isAuthenticated, // Expose isAuthenticated for cleaner checks in Header.js, etc.
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);