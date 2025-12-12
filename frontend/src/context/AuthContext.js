// frontend/src/context/AuthContext.js

import React, {
    createContext,
    useState,
    useEffect,
    useContext
} from 'react';

import { authAPI } from '../api';

// Create context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Load user from localStorage on startup
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem('user')) || null
    );

    const [loading, setLoading] = useState(false);

    // ----------------------------------
    // Restore user if token exists but user state is empty
    // ----------------------------------
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && !user) {
            // Optional: fetch "current user" data
            (async () => {
                try {
                    setLoading(true);
                    const data = await authAPI.getCurrentUser();
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setUser(data.user);
                } catch {
                    // Invalid token → clear stored token/user
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [user]);

    const isAuthenticated = Boolean(user);
    const getToken = () => localStorage.getItem('token');

    // ----------------------------------
    // LOGIN
    // ----------------------------------
    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authAPI.login({ email, password });

            // Token saved via axios interceptor
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error) {
            throw new Error(
                error.response?.data?.message || 'Login failed.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------
    // REGISTER
    // ----------------------------------
    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await authAPI.register(userData);

            // Token saved via axios interceptor
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error) {
            throw new Error(
                error.response?.data?.message || 'Registration failed.'
            );
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------
    // LOGOUT
    // ----------------------------------
    const logout = () => {
        authAPI.logout(); // Clears token in api.js
        localStorage.removeItem('user');
        setUser(null);
    };

    // ----------------------------------
    // Context value
    // ----------------------------------
    const value = {
        user,
        loading,
        isAuthenticated,
        getToken,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Export a hook for easier access
export const useAuth = () => useContext(AuthContext);
