// C:\Users\jilli\bride\bridebloom\frontend\src\api.js


import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication API
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

// Flowers API
export const flowersAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });

        const response = await api.get(`/api/flowers?${params}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/flowers/${id}`);
        return response.data;
    },

    create: async (flowerData) => {
        const response = await api.post('/api/flowers', flowerData);
        return response.data;
    },

    update: async (id, flowerData) => {
        const response = await api.put(`/api/flowers/${id}`, flowerData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/flowers/${id}`);
        return response.data;
    },

    getBySeason: async (season) => {
        const response = await api.get(`/api/flowers?season=${season}`);
        return response.data;
    },

    getByCategory: async (category) => {
        const response = await api.get(`/api/flowers?category=${category}`);
        return response.data;
    },

    getPopular: async () => {
        const response = await api.get('/api/flowers/popular');
        return response.data;
    },
};

// Orders API
export const ordersAPI = {
    create: async (orderData) => {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/api/orders');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/orders/${id}`);
        return response.data;
    },

    update: async (id, orderData) => {
        const response = await api.put(`/api/orders/${id}`, orderData);
        return response.data;
    },

    cancel: async (id) => {
        const response = await api.put(`/api/orders/${id}/cancel`);
        return response.data;
    },

    getOrderHistory: async () => {
        const response = await api.get('/api/orders/history');
        return response.data;
    },
};

// Reviews API
export const reviewsAPI = {
    create: async (reviewData) => {
        const response = await api.post('/api/reviews', reviewData);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/api/reviews');
        return response.data;
    },

    getByOrder: async (orderId) => {
        const response = await api.get(`/api/reviews/order/${orderId}`);
        return response.data;
    },

    update: async (id, reviewData) => {
        const response = await api.put(`/api/reviews/${id}`, reviewData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/reviews/${id}`);
        return response.data;
    },
};

// Consultation API
export const consultationAPI = {
    schedule: async (consultationData) => {
        const response = await api.post('/api/consultations', consultationData);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/api/consultations');
        return response.data;
    },

    update: async (id, consultationData) => {
        const response = await api.put(`/api/consultations/${id}`, consultationData);
        return response.data;
    },

    cancel: async (id) => {
        const response = await api.put(`/api/consultations/${id}/cancel`);
        return response.data;
    },
};

// Cart functionality (using localStorage for simplicity)
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

// Image upload API
export const uploadAPI = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },
};

// Weather API for seasonal recommendations
export const weatherAPI = {
    getCurrentWeather: async (location) => {
        const response = await api.get(`/api/weather?location=${location}`);
        return response.data;
    },

    getSeasonalRecommendations: async (weddingDate, location) => {
        const response = await api.get(`/api/weather/recommendations?date=<span class="math-inline">\{weddingDate\}&location\=</span>{location}`);
        return response.data;
    },
};

// Analytics API (for admin)
export const analyticsAPI = {
    getDashboardStats: async () => {
        const response = await api.get('/api/analytics/dashboard');
        return response.data;
    },

    getPopularFlowers: async (timeframe = 'month') => {
        const response = await api.get(`/api/analytics/popular-flowers?timeframe=${timeframe}`);
        return response.data;
    },

    getOrderTrends: async (timeframe = 'year') => {
        const response = await api.get(`/api/analytics/order-trends?timeframe=${timeframe}`);
        return response.data;
    },

    getSeasonalData: async () => {
        const response = await api.get('/api/analytics/seasonal');
        return response.data;
    },
};

export default api;