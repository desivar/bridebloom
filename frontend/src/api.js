// frontend/src/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/api/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/api/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const response = await api.get('/api/auth/me');
        return response.data;
    },
};

export const flowersAPI = {
    getBySeason: async (season) => {
        const response = await api.get(`/api/flowers?season=${season}`);
        return response.data;
    },
};

export const consultationAPI = {
    schedule: async (consultationData) => {
        const response = await api.post('/api/consultations', consultationData);
        return response.data;
    },
};

export const cartAPI = {
    getCart: () => {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    addToCart: (item) => {
        const cart = cartAPI.getCart();
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cart.push({ ...item, quantity: item.quantity || 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    },

    removeFromCart: (itemId) => {
        const cart = cartAPI.getCart();
        const updatedCart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        return updatedCart;
    },

    updateQuantity: (itemId, quantity) => {
        const cart = cartAPI.getCart();
        const item = cart.find(cartItem => cartItem.id === itemId);

        if (item) {
            if (quantity <= 0) {
                return cartAPI.removeFromCart(itemId);
            }
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        return cart;
    },

    clearCart: () => {
        localStorage.removeItem('cart');
        return [];
    },

    getCartTotal: () => {
        const cart = cartAPI.getCart();
        return cart.reduce((total, item) => {
            const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace('$', ''))
                : item.price;
            return total + (price * item.quantity);
        }, 0);
    },

    getCartItemCount: () => {
        const cart = cartAPI.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },
};

export default api;