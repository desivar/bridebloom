import React, {
    createContext,
    useState,
    useEffect,
    useContext
} from 'react';

import { authAPI } from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem('user')) || null
    );

    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    /* ===============================
       RESTORE SESSION
    ================================ */
    useEffect(() => {
        if (!token || user) {
            setLoading(false);
            return;
        }

        const restoreUser = async () => {
            try {
                const data = await authAPI.getCurrentUser();
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreUser();
    }, [token, user]);

    const isAuthenticated = Boolean(user);

    /* ===============================
       LOGIN
    ================================ */
    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authAPI.login({ email, password });

            // ✅ SAVE TOKEN HERE
            localStorage.setItem('token', data.token);
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

    /* ===============================
       REGISTER
    ================================ */
    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await authAPI.register(userData);

            // ✅ SAVE TOKEN HERE
            localStorage.setItem('token', data.token);
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

    /* ===============================
       LOGOUT
    ================================ */
    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
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

export const useAuth = () => useContext(AuthContext);
