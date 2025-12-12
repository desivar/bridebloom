// BrideBlooms.js

import React, { useState, useEffect } from 'react';
import { Heart, Star, Calendar, MapPin, Phone, Mail, Menu, X, ShoppingCart, User } from 'lucide-react';

// --- API SIMULATIONS (Your current code, kept for context) ---
export const AuthService = {
  login: async (credentials) => {
    // Simulate successful login
    return { token: 'mock-token', user: { name: credentials.email.split('@')[0], email: credentials.email } };
  }, 
  register: async (userData) => {
    // Simulate successful registration
    return { token: 'mock-token', user: { name: userData.name, email: userData.email } };
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
const cartAPI = {
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  addToCart: (item) => {
    const cart = cartAPI.getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },
  // ... (other cartAPI functions remain the same) ...
  removeFromCart: (itemId) => {
    const cart = cartAPI.getCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  },
  clearCart: () => {
    localStorage.removeItem('cart');
    return [];
  },
  getCartItemCount: () => {
    const cart = cartAPI.getCart();
    // Use optional chaining for safety, though cart is initialized to []
    return cart.reduce((count, item) => count + item.quantity, 0); 
  },
  getCartTotal: () => {
    const cart = cartAPI.getCart();
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  }
};
const consultationAPI = {
  schedule: async (data) => {
    // Simulate API call
    return { success: true, message: 'Consultation scheduled successfully!' };
  }
};

const BrideBlooms = () => {
  // --- STATE SETUP ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState('spring');
  // Initialize isLoggedIn based on whether a token exists in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(false);
  
  // NEW STATE: Used solely to force a re-render when cart state changes locally
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0); 

  // ... (flowersBySeasonData, testimonials, useEffect for season rotation remain the same) ...

  // --- HANDLER FUNCTIONS ---
  
  // Function to trigger re-render of the cart count
  const forceCartUpdate = () => {
    setCartUpdateTrigger(prev => prev + 1);
  };

  // Handle Add to Cart
  const handleAddToCart = (flower) => {
    const itemToAdd = {
      id: flower.id,
      name: flower.name,
      price: flower.price, // e.g., '$89'
      quantity: 1
    };
    cartAPI.addToCart(itemToAdd);
    forceCartUpdate(); // Trigger re-render of the cart count
    console.log(`Added ${flower.name} to cart. Current items: ${cartAPI.getCartItemCount()}`);
  };

  // Handle Login/Register
  const handleAuth = async (type, data) => {
    try {
      if (type === 'login') {
        await AuthService.login(data);
      } else {
        await AuthService.register(data);
      }
      // Since it's a mock, manually set token/user
      localStorage.setItem('token', 'mock-token-123');
      localStorage.setItem('user', JSON.stringify({ name: data.name || data.email.split('@')[0] }));
      
      setIsLoggedIn(true); // Update state
      setShowLogin(false); // Close modal
      console.log(`${type} successful.`);

    } catch (error) {
      console.error(`${type} failed:`, error);
      alert(`${type} failed. Check console for details.`);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    console.log('User logged out.');
  };


  // --- LOGIN MODAL COMPONENT (UPDATED TO USE STATE & HANDLERS) ---
  const LoginModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    // Add state to control form input values
    const [formData, setFormData] = useState({ name: '', email: '', password: '', weddingDate: '' });

    if (!isOpen) return null;

    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const { name, email, password, weddingDate } = formData;

      // Call the main component's handleAuth function
      if (isLogin) {
        handleAuth('login', { email, password });
      } else {
        handleAuth('register', { name, email, password, weddingDate });
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Join Us'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          {/* 🚀 FORM WIRED UP: onSubmit calls handleSubmit */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <input
                type="text"
                name="name" 
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required={!isLogin}
              />
            )}
            <input
              type="email"
              name="email" 
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            <input
              type="password"
              name="password" 
              value={formData.password}
              onChange={handleFormChange}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            {!isLogin && (
              <input
                type="date"
                name="weddingDate" 
                value={formData.weddingDate}
                onChange={handleFormChange}
                placeholder="Wedding Date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  };


  // ... (The rest of the component rendering) ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand (Kept the same) */}
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-500 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Bride Blooms
              </span>
            </div>

            {/* Desktop Links & Icons (UPDATED) */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-pink-600 transition-colors">Home</a>
              <a href="#seasons" className="text-gray-700 hover:text-pink-600 transition-colors">4 Seasons</a>
              <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</a>
              
              <div className="flex items-center space-x-4">
                {/* 🛒 CART ICON: Now displays the count and relies on cartUpdateTrigger */}
                <button className="text-gray-700 hover:text-pink-600 transition-colors relative">
                  <ShoppingCart size={20} />
                  <span key={cartUpdateTrigger} className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartAPI.getCartItemCount()}
                  </span>
                </button>
                
                {/* 👤 DYNAMIC AUTH BUTTON (Login/Register or Logout) */}
                {isLoggedIn ? (
                  <button 
                    onClick={handleLogout}
                    className="text-white bg-pink-500 hover:bg-pink-600 px-3 py-1 rounded-full text-sm transition-colors flex items-center"
                  >
                    <User size={16} className="mr-1" />
                    Logout
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="text-pink-600 border border-pink-600 hover:bg-pink-50 px-3 py-1 rounded-full text-sm transition-colors flex items-center"
                  >
                    <User size={16} className="mr-1" />
                    Login / Register
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button (Kept the same) */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ... (Mobile Menu JSX remains the same) ... */}
      {/* ... (Hero Section JSX remains the same) ... */}
      
      {/* 4 Seasons Guarantee Section - Dynamic Flower Display (UPDATED) */}
      <section id="seasons" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ... (Season selection buttons) ... */}

          {/* Dynamic Flower Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flowersBySeasonData[currentSeason].map((flower) => (
              <div key={flower.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative overflow-hidden">
                  <img 
                    src={flower.image} 
                    alt={flower.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* ... (Heart icon) ... */}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{flower.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pink-600">{flower.price}</span>
                    {/* 🚀 ADD TO CART BUTTON IS NOW WIRED UP */}
                    <button 
                      onClick={() => handleAddToCart(flower)}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... (Features Section JSX remains the same) ... */}
      {/* ... (Testimonials Section JSX remains the same) ... */}
      {/* ... (Contact Section JSX remains the same) ... */}
      {/* ... (Footer JSX remains the same) ... */}

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};


export default BrideBlooms;