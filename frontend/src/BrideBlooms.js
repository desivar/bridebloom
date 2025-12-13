// src/components/BrideBlooms.jsx
import React, { useState, useEffect } from 'react';
import { Heart, Star, Calendar, MapPin, Phone, Mail, Menu, X, ShoppingCart, User, ChevronRight, Trash2, Plus, Minus } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { flowersAPI, consultationAPI } from './api';

const BrideBlooms = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState('spring');
  const [flowers, setFlowers] = useState([]);
  const [filteredFlowers, setFilteredFlowers] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    message: '',
    preferredDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    weddingDate: ''
  });
  const [isRegister, setIsRegister] = useState(false);
  
  const { user, isAuthenticated, login, register, logout, loading: authLoading } = useAuth();
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount } = useCart();

  // Load flowers on component mount
  useEffect(() => {
    loadFlowers();
  }, []);

  // Filter flowers by season when currentSeason or flowers change
  useEffect(() => {
    if (flowers.length > 0) {
      const filtered = flowers.filter(flower => 
        flower.season === currentSeason || flower.season === 'all-season'
      );
      setFilteredFlowers(filtered);
    }
  }, [currentSeason, flowers]);

  const loadFlowers = async () => {
    try {
      setLoading(true);
      
      // Direct API call to fetch all flowers
      const response = await fetch('http://localhost:5000/api/flowers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setFlowers(data); // Store all 12 flowers in state
      
    } catch (error) {
      console.error('Error loading flowers from API:', error);
      // Fallback: Only use sample data if the API connection fails completely
      setFlowers(getSampleFlowers()); 
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (flower) => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }
    
    addToCart(flower);
    alert(`${flower.name} added to cart!`);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleScheduleConsultation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const consultationData = {
        ...consultationForm,
        userId: isAuthenticated ? user._id : null
      };
      
      await consultationAPI.schedule(consultationData);
      
      alert('Consultation scheduled successfully! We will contact you soon.');
      setShowConsultation(false);
      setConsultationForm({
        name: '',
        email: '',
        phone: '',
        weddingDate: '',
        message: '',
        preferredDate: ''
      });
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      alert('Failed to schedule consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrowseCollections = () => {
    document.getElementById('seasons').scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoginError('');
      await login(loginForm.email, loginForm.password);
      setShowLogin(false);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setLoginError(error.message || 'Login failed');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setRegisterError('');
      await register(registerForm);
      setShowLogin(false);
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        weddingDate: ''
      });
      setIsRegister(false);
    } catch (error) {
      setRegisterError(error.message || 'Registration failed');
    }
  };

  const getSampleFlowers = () => {
    return [
      {
        _id: '1',
        name: 'Romantic Rose Bouquet',
        description: 'Classic red roses perfect for any season',
        price: 89.99,
        season: 'all-season',
        category: 'bouquet',
        imageUrl: 'https://img.freepik.com/premium-psd/red-roses-wedding-arrangement_176841-58423.jpg'
      },
      {
        _id: '2',
        name: 'Spring Tulip Centerpiece',
        description: 'Vibrant tulips for spring celebrations',
        price: 65.99,
        season: 'spring',
        category: 'centerpiece',
        imageUrl: 'https://th.bing.com/th/id/OIP.-mjdzxOQeE5rVwmeoGynUwAAAA?rs=1&pid=ImgDetMain&cb=idpwebpc2'
      }
    ];
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Absolutely stunning flowers for my wedding! They had the perfect spring bouquet ready despite the unpredictable weather.",
      image: "https://static.vecteezy.com/system/resources/previews/024/183/520/original/female-avatar-portrait-of-a-cute-brunette-woman-illustration-of-a-female-character-in-a-modern-color-style-vector.jpg"
    },
    {
      name: "Emily Chen", 
      rating: 5,
      text: "Their 4-season guarantee saved my winter wedding! Beautiful arrangements that looked fresh and vibrant.",
      image: "https://cdn.icon-icons.com/icons2/1736/PNG/512/4043247-1-avatar-female-portrait-woman_113261.png"
    },
    {
      name: "Maria Rodriguez",
      rating: 5,
      text: "Professional service and gorgeous flowers. They understood my vision perfectly and delivered beyond expectations.",
      image: "https://static.vecteezy.com/system/resources/previews/004/773/704/original/a-girl-s-face-with-a-beautiful-smile-a-female-avatar-for-a-website-and-social-network-vector.jpg"
    }
  ];

  const LoginModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
      if (isRegister) {
        handleRegisterSubmit(e);
      } else {
        handleLoginSubmit(e);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isRegister ? 'Join Us' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isRegister ? 'Create your account' : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <input
                type="text"
                placeholder="Full Name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            )}
            
            <input
              type="email"
              placeholder="Email Address"
              value={isRegister ? registerForm.email : loginForm.email}
              onChange={(e) => isRegister 
                ? setRegisterForm({...registerForm, email: e.target.value})
                : setLoginForm({...loginForm, email: e.target.value})
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={isRegister ? registerForm.password : loginForm.password}
              onChange={(e) => isRegister
                ? setRegisterForm({...registerForm, password: e.target.value})
                : setLoginForm({...loginForm, password: e.target.value})
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            
            {isRegister && (
              <>
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="Wedding Date"
                  value={registerForm.weddingDate}
                  onChange={(e) => setRegisterForm({...registerForm, weddingDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </>
            )}
            
            <button
              type="submit"
              disabled={authLoading || loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50"
            >
              {authLoading || loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
            </button>
            
            {(loginError || registerError) && (
              <p className="text-red-500 text-center">
                {isRegister ? registerError : loginError}
              </p>
            )}
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setLoginError('');
                setRegisterError('');
              }}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CartModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
                <button 
                  onClick={() => {
                    onClose();
                    handleBrowseCollections();
                  }}
                  className="mt-4 text-pink-600 hover:text-pink-800 font-medium"
                >
                  Browse Collections
                </button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center py-4 border-b">
                    <img 
                      src={item.image || 'https://via.placeholder.com/80'} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg" 
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-pink-600 font-bold">${item.price.toFixed(2)} × {item.quantity}</p>
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border rounded-l hover:bg-gray-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border rounded-r hover:bg-gray-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 ml-4 p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-pink-600">${getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleClearCart}
                      className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Cart
                    </button>
                    <button
                      className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ConsultationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Schedule a Consultation</h2>
            <p className="text-gray-600">Let's discuss your dream wedding flowers</p>
          </div>

          <form onSubmit={handleScheduleConsultation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name"
                value={consultationForm.name}
                onChange={(e) => setConsultationForm({...consultationForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={consultationForm.email}
                onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            
            <input
              type="tel"
              placeholder="Phone Number"
              value={consultationForm.phone}
              onChange={(e) => setConsultationForm({...consultationForm, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            
            <input
              type="date"
              placeholder="Wedding Date"
              value={consultationForm.weddingDate}
              onChange={(e) => setConsultationForm({...consultationForm, weddingDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            
            <input
              type="date"
              placeholder="Preferred Consultation Date"
              value={consultationForm.preferredDate}
              onChange={(e) => setConsultationForm({...consultationForm, preferredDate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            
            <textarea
              rows={4}
              placeholder="Tell us about your dream wedding..."
              value={consultationForm.message}
              onChange={(e) => setConsultationForm({...consultationForm, message: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            ></textarea>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Scheduling...' : 'Schedule Consultation'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-500 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Bride Blooms
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-pink-600 transition-colors">Home</a>
              <a href="#seasons" className="text-gray-700 hover:text-pink-600 transition-colors">Collections</a>
              <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</a>
              
              {/* Shopping Cart with badge */}
              <button 
                onClick={() => setShowCart(true)}
                className="text-gray-700 hover:text-pink-600 transition-colors relative"
              >
                <ShoppingCart size={20} />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </button>
              
              {/* Sign In / User Profile Button */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Hi, {user?.name || 'User'}!</span>
                  <button 
                    onClick={logout}
                    className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    <User size={20} className="mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="flex items-center text-pink-600 hover:text-pink-800 transition-colors"
                >
                  <User size={20} className="mr-1" />
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700">Home</a>
              <a href="#seasons" className="block px-3 py-2 text-gray-700">Collections</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700">Reviews</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700">Contact</a>
              
              <div className="px-3 py-2 border-t">
                <button 
                  onClick={() => {
                    setShowCart(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full text-gray-700 hover:text-pink-600 py-2"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Cart {getItemCount() > 0 && `(${getItemCount()})`}
                </button>
                
                {isAuthenticated ? (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-700">Hi, {user?.name || 'User'}!</span>
                    <button 
                      onClick={logout}
                      className="flex items-center text-pink-600 hover:text-pink-800"
                    >
                      <User size={20} className="mr-1" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setShowLogin(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-pink-600 hover:text-pink-800 py-2"
                  >
                    <User size={20} className="mr-2" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-rose-600/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: 'url("https://50gramwedding.com/wp-content/uploads/2023/05/Wedding-2-9.png")'
          }}
        ></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Dream Wedding
            <span className="block bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Blooms Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            Perfect flowers for every season, guaranteed fresh and beautiful for your special day, 
            no matter the weather
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleBrowseCollections}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all shadow-xl"
            >
              Browse Collections
            </button>
            <button 
              onClick={() => setShowConsultation(true)}
              className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all border border-white/30"
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="seasons" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Seasonal Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our curated collections for every season
            </p>
          </div>

          {/* Season Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {['spring', 'summer', 'fall', 'winter'].map((season) => (
              <button
                key={season}
                onClick={() => setCurrentSeason(season)}
                className={`p-4 rounded-xl text-center capitalize transition-all ${
                  currentSeason === season
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl mb-2">
                  {season === 'spring' ? '🌸' : 
                   season === 'summer' ? '🌻' : 
                   season === 'fall' ? '🍂' : '❄️'}
                </div>
                <span className="font-semibold">{season}</span>
              </button>
            ))}
          </div>

          {/* Flower Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              <p className="mt-4 text-gray-600">Loading flowers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFlowers.map((flower) => (
                <div key={flower._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group border border-gray-100">
                  <div className="relative overflow-hidden h-64">
                    <img 
                      src={flower.imageUrl || flower.image} 
                      alt={flower.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 right-4">
                      <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-white">
                        <Heart size={20} className="text-pink-500" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {flower.season}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{flower.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{flower.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-pink-600">${flower.price.toFixed(2)}</span>
                        <span className="text-gray-500 text-sm ml-2">{flower.category}</span>
                      </div>
                      <button 
                        onClick={() => handleAddToCart(flower)}
                        disabled={loading}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 flex items-center"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredFlowers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No flowers found for this season. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Choose Bride Blooms?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We go above and beyond to make your wedding day perfect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">4-Season Guarantee</h3>
              <p className="text-gray-600">
                Rain or shine, snow or heat - we guarantee fresh, beautiful flowers for your special day, 
                with backup arrangements ready for any weather condition.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Personalized Service</h3>
              <p className="text-gray-600">
                Every bride is unique. We work closely with you to understand your vision and create 
                custom arrangements that perfectly match your dream wedding.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Quality</h3>
              <p className="text-gray-600">
                We source only the finest, freshest flowers from trusted growers worldwide. 
                Each arrangement is crafted with love and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Happy Brides</h2>
            <p className="text-xl text-gray-600">See what our beautiful brides have to say</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-pink-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Let's Make Your Dream Wedding Bloom</h2>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto">
              Ready to create the perfect floral arrangements for your special day? 
              Contact us today for a personalized consultation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-8">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="mr-4" size={24} />
                  <span className="text-lg">(555) 123-BLOOM</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-4" size={24} />
                  <span className="text-lg">hello@brideblooms.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-4" size={24} />
                  <span className="text-lg">123 Flower Street, Bloom City, BC 12345</span>
                </div>
              </div>
              
              <div className="mt-12">
                <button 
                  onClick={() => setShowConsultation(true)}
                  className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-50 transition-all shadow-lg"
                >
                  Schedule Free Consultation
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-pink-200 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-pink-200 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                  />
                </div>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-pink-200 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-white text-pink-600 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-pink-500 mr-2" />
                <span className="text-2xl font-bold">Bride Blooms</span>
              </div>
              <p className="text-gray-400">
                Creating unforgettable wedding moments with beautiful flowers, guaranteed fresh in every season.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Bridal Bouquets</li>
                <li>Ceremony Decorations</li>
                <li>Reception Centerpieces</li>
                <li>Consultation Services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Seasons</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Spring Collections</li>
                <li>Summer Arrangements</li>
                <li>Fall Designs</li>
                <li>Winter Specials</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <button className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition-colors">
                  <Heart size={20} />
                </button>
                <button className="bg-pink-600 p-2 rounded-full hover:bg-pink-700 transition-colors">
                  <Star size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Bride Blooms. All rights reserved. Making dreams bloom in every season.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
      <ConsultationModal isOpen={showConsultation} onClose={() => setShowConsultation(false)} />
    </div>
  );
};

export default BrideBlooms;