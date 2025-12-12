// src/context/AuthContext.js (Updated with real API calls)

import React, { createContext, useState, useEffect } from 'react';

// Define the base URL for your Express server
const API_BASE_URL = 'http://localhost:5500/api/auth'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // State to hold user data, often initialized from local storage
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 

    // --- Helper function to retrieve JWT token ---
    const getToken = () => localStorage.getItem('token');

    // --- 1. Login Function (Connects to POST /api/auth/login) ---
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Throw an error if the server returns non-2xx status (e.g., 401 Invalid Credentials)
                throw new Error(data.message || 'Login failed due to network or server error.');
            }

            // Success: Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); 
            setUser(data.user);
            
        } catch (error) {
            console.error('Login Error:', error.message);
            throw error; // Re-throw to be handled by the Login.js component
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Register Function (Connects to POST /api/auth/register) ---
    const register = async (userData) => {
        setLoading(true);
        try {
            // userData should be the full object from the Register form
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                // Throw an error if the server returns non-2xx status (e.g., 400 User Exists)
                throw new Error(data.message || 'Registration failed.');
            }
            
            // Success: Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); 
            setUser(data.user);

        } catch (error) {
            console.error('Registration Error:', error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // --- 3. Logout Function (Clears local storage) ---
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    // Context Value exposed to children
    const value = {
        user,
        loading,
        getToken,
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