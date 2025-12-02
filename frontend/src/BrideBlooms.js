import React, { useState, useEffect } from 'react';
import { Heart, Star, Calendar, MapPin, Phone, Mail, Menu, X, ShoppingCart, User, LogOut, Trash2 } from 'lucide-react';

// Mock API functions (replace with your actual API imports)
const authAPI = {
  login: async (credentials) => {
    // Simulate API call
    return { token: 'mock-token', user: { name: credentials.email.split('@')[0], email: credentials.email } };
  },
  register: async (userData) => {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState('spring');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState(null);

  // Sample data for flowers by season
  const flowersBySeasonData = {
    spring: [
      { id: 1, name: 'Cherry Blossom Bouquet', price: '$89', image: 'https://i.pinimg.com/originals/3a/bf/ca/3abfcac4c97f8ea9be6ebaff99a696a8.jpg' },
      { id: 2, name: 'Tulip Paradise', price: '$65', image: 'https://th.bing.com/th/id/R.f4f5a894e331e2b0b1306df7f5d09cce?rik=xNn50e%2f1mu6URg&riu=http%3a%2f%2fwww.himisspuff.com%2fwp-content%2fuploads%2f2017%2f01%2fWhite-tulip-wedding-bouquets.jpg&ehk=fZQt8xwgN3UJEL5O%2ftsY9nlZ2qFtB72d9vGHY%2f0G1HA%3d&risl=&pid=ImgRaw&r=0' },
      { id: 3, name: 'Daffodil Dreams', price: '$55', image: 'https://www.katherinesflorists.co.uk/wp-content/uploads/2020/03/daffodils-900x1200.jpg' }
    ],
    summer: [
      { id: 4, name: 'Sunflower Splendor', price: '$75', image: 'https://cdn11.bigcommerce.com/s-0023c/images/stencil/1280w/products/2483/7882/IMG20230718114054_002__20230.1689645075.jpg?c=2' },
      { id: 5, name: 'Peony Perfection', price: '$95', image: 'https://th.bing.com/th/id/R.8b8e78c05ffc5d277a86eb41253d6f00?rik=C38d9T6ag9etKg&riu=http%3a%2f%2fassets.marthastewartweddings.com%2fstyles%2fwmax-520-highdpi%2fd44%2fmemree-rich-wedding-bouquet-234-6257086-0217%2fmemree-rich-wedding-bouquet-234-6257086-0217_vert.jpg%3fitok%3dpE7WLQko&ehk=f2gwG8rz%2bHp2gZztlCSIX9qBQPxsw%2bOQZT97nGvQuKs%3d&risl=&pid=ImgRaw&r=0' },
      { id: 6, name: 'Lavender Love', price: '$70', image: 'https://i5.walmartimages.com/seo/Ludlz-Artificial-Lavender-Plant-Silk-Flowers-Wedding-Decor-Table-Centerpieces-1Pc-Flower-Garden-DIY-Party-Home-Craft_488c866c-6391-4305-ac63-5860e99f349f.c4fdce3aac39fddd73fe164d964e4bff.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF' }
    ],
    fall: [
      { id: 7, name: 'Autumn Elegance', price: '$85', image: 'https://s-media-cache-ak0.pinimg.com/736x/ac/0c/18/ac0c1831e5627b38773ca68d8c995593.jpg' },
      { id: 8, name: 'Mum Magnificence', price: '$60', image: 'https://th.bing.com/th/id/OIP.BfGN0IKQ7EfmOyVyKdZRmwHaLH?rs=1&pid=ImgDetMain&cb=idpwebpc2' },
      { id: 9, name: 'Dahlia Delight', price: '$80', image: 'https://i.pinimg.com/originals/bb/62/96/bb629605ff6d55a6df63fe8d89eae66c.jpg' }
    ],
    winter: [
      { id: 10, name: 'Winter White Wonder', price: '$99', image: 'https://www.thebridalflower.com/wp-content/uploads/2017/09/The-Bridal-Flower-5780-768x768.jpg' },
      { id: 11, name: 'Evergreen Elegance', price: '$110', image: 'https://www.loveyouwedding.com/wp-content/uploads/2021/03/306-large-round-white-flowers-and-strings-of-green-leaves.jpg' },
      { id: 12, name: 'Poinsettia Paradise', price: '$65', image: 'https://i.pinimg.com/originals/24/94/70/249470c8ffddf27ea875439e7dd056c2.jpg' }
    ]
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

  // Load user and cart on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
    updateCartCount();
  }, []);

  // Season rotation
  useEffect(() => {
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    const interval = setInterval(() => {
      setCurrentSeason(prev => {
        const currentIndex = seasons.indexOf(prev);
        return seasons[(currentIndex + 1) % seasons.length];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const updateCartCount = () => {
    setCartCount(cartAPI.getCartItemCount());
    setCart(cartAPI.getCart());
  };

  const handleAddToCart = (flower) => {
    cartAPI.addToCart(flower);
    updateCartCount();
    showNotification(`${flower.name} added to cart!`);
  };

  const handleRemoveFromCart = (itemId) => {
    cartAPI.removeFromCart(itemId);
    updateCartCount();
    showNotification('Item removed from cart');
  };

  const toggleFavorite = (flowerId) => {
    setFavorites(prev => {
      if (prev.includes(flowerId)) {
        return prev.filter(id => id !== flowerId);
      } else {
        showNotification('Added to favorites!');
        return [...prev, flowerId];
      }
    });
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsLoggedIn(false);
    setUser(null);
    showNotification('Logged out successfully');
  };

  const LoginModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      weddingDate: ''
    });
    const [loading, setLoading] = useState(false);
    
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        let response;
        if (isLogin) {
          response = await authAPI.login({ email: formData.email, password: formData.password });
        } else {
          response = await authAPI.register(formData);
        }

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setIsLoggedIn(true);
        setUser(response.user);
        showNotification(`Welcome ${response.user.name}!`);
        onClose();
      } catch (error) {
        showNotification('Authentication failed. Please try again.', 'error');
      } finally {
        setLoading(false);
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required={!isLogin}
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
            {!isLogin && (
              <input
                type="date"
                placeholder="Wedding Date"
                value={formData.weddingDate}
                onChange={(e) => setFormData({...formData, weddingDate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
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

  const CartModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const total = cartAPI.getCartTotal();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h2>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-pink-50 p-4 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-pink-600 font-bold">{item.price}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-pink-600">${total.toFixed(2)}</span>
                </div>
                <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-fade-in`}>
          {notification.message}
        </div>
      
      )}

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

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-pink-600 transition-colors">Home</a>
              <a href="#flowers" className="text-gray-700 hover:text-pink-600 transition-colors">4 Seasons</a>
              <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</a>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowCart(true)}
                  className="text-gray-700 hover:text-pink-600 transition-colors relative"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                
                {isLoggedIn ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Hi, {user?.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-pink-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="text-gray-700 hover:text-pink-600 transition-colors"
                  >
                    <User size={20} />
                  </button>
                )}
              </div>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#home" className="block px-3 py-2 text-gray-700">Home</a>
            <a href="#flowers" className="block px-3 py-2 text-gray-700">Flowers</a>
            <a href="#flowers" className="block px-3 py-2 text-gray-700">4 Seasons</a>
            <a href="#testimonials" className="block px-3 py-2 text-gray-700">Reviews</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700">Contact</a>
          </div>
        </div>
      )}

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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Your Dream Wedding
            <span className="block bg-gradient-to-r from-black-300 to-blue-300 bg-clip-text text-transparent">
              Blooms Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            Perfect flowers for every season, guaranteed fresh and beautiful for your special day, 
            no matter the weather
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#flowers"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all shadow-xl text-center"
            >
              Browse Collections
            </a>
            <a 
              href="#contact"
              className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all border border-white/30 text-center"
            >
              Schedule Consultation
            </a>
          </div>
        </div>
      </section>

      {/* 4 Seasons Guarantee */}
      <section id="flowers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Perfect Flowers, 
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Every Season
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our 4-season guarantee ensures you get the most beautiful, fresh flowers 
              regardless of weather conditions or seasonal availability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {['spring', 'summer', 'fall', 'winter'].map((season) => (
              <div 
                key={season}
                className={`relative rounded-2xl p-6 text-center transform transition-all duration-500 cursor-pointer ${
                  currentSeason === season 
                    ? 'scale-105 shadow-2xl' 
                    : 'hover:scale-105 shadow-lg'
                } ${
                  season === 'spring' ? 'bg-gradient-to-br from-green-100 to-pink-100' :
                  season === 'summer' ? 'bg-gradient-to-br from-yellow-100 to-orange-100' :
                  season === 'fall' ? 'bg-gradient-to-br from-orange-100 to-red-100' :
                  'bg-gradient-to-br from-blue-100 to-purple-100'
                }`}
                onClick={() => setCurrentSeason(season)}
              >
                <div className="text-4xl mb-4">
                  {season === 'spring' ? '🌸' : 
                   season === 'summer' ? '🌻' : 
                   season === 'fall' ? '🍂' : '❄️'}
                </div>
                <h3 className="text-2xl font-bold capitalize mb-2 text-gray-800">{season}</h3>
                <p className="text-gray-600">
                  {season === 'spring' ? 'Fresh blooms and delicate pastels' :
                   season === 'summer' ? 'Vibrant colors and bold arrangements' :
                   season === 'fall' ? 'Warm tones and rustic elegance' :
                   'Classic whites and winter wonderland'}
                </p>
                {currentSeason === season && (
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>

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
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                  <button 
                    onClick={() => toggleFavorite(flower.id)}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Heart 
                      size={20} 
                      className={`${favorites.includes(flower.id) ? 'text-pink-500 fill-current' : 'text-pink-500'}`}
                    />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{flower.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pink-600">{flower.price}</span>
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
      