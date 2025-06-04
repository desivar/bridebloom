import React, { useState, useEffect } from 'react';
import { Heart, Star, Calendar, MapPin, Phone, Mail, Menu, X, ShoppingCart, User } from 'lucide-react';

const BrideBlooms = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState('spring');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sample data for flowers by season
  const flowersBySeasonData = {
    spring: [
      { id: 1, name: 'Cherry Blossom Bouquet', price: '$89', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' },
      { id: 2, name: 'Tulip Paradise', price: '$65', image: 'https://images.unsplash.com/photo-1520637736862-4d197d17c90a?w=400&h=400&fit=crop' },
      { id: 3, name: 'Daffodil Dreams', price: '$55', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop' }
    ],
    summer: [
      { id: 4, name: 'Sunflower Splendor', price: '$75', image: 'https://images.unsplash.com/photo-1597848212624-e8877c225bb1?w=400&h=400&fit=crop' },
      { id: 5, name: 'Peony Perfection', price: '$95', image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop' },
      { id: 6, name: 'Lavender Love', price: '$70', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' }
    ],
    fall: [
      { id: 7, name: 'Autumn Elegance', price: '$85', image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400&h=400&fit=crop' },
      { id: 8, name: 'Mum Magnificence', price: '$60', image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=400&fit=crop' },
      { id: 9, name: 'Dahlia Delight', price: '$80', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop' }
    ],
    winter: [
      { id: 10, name: 'Winter White Wonder', price: '$99', image: 'https://images.unsplash.com/photo-1574781330855-d0db6cc7e3c2?w=400&h=400&fit=crop' },
      { id: 11, name: 'Evergreen Elegance', price: '$110', image: 'https://images.unsplash.com/photo-1544886164-39b2e01dcd12?w=400&h=400&fit=crop' },
      { id: 12, name: 'Poinsettia Paradise', price: '$65', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop' }
    ]
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Absolutely stunning flowers for my wedding! They had the perfect spring bouquet ready despite the unpredictable weather.",
      image: "https://images.unsplash.com/photo-1494790108755-2616c04e8e36?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Emily Chen", 
      rating: 5,
      text: "Their 4-season guarantee saved my winter wedding! Beautiful arrangements that looked fresh and vibrant.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
    },
    {
      name: "Maria Rodriguez",
      rating: 5,
      text: "Professional service and gorgeous flowers. They understood my vision perfectly and delivered beyond expectations.",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face"
    }
  ];

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

  const LoginModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    
    if (!isOpen) return null;

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

          <form className="space-y-6">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            {!isLogin && (
              <input
                type="date"
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

  const [showLogin, setShowLogin] = useState(false);

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
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-pink-600 transition-colors">Home</a>
              <a href="#flowers" className="text-gray-700 hover:text-pink-600 transition-colors">Flowers</a>
              <a href="#seasons" className="text-gray-700 hover:text-pink-600 transition-colors">4 Seasons</a>
              <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</a>
              
              <div className="flex items-center space-x-4">
                <button className="text-gray-700 hover:text-pink-600 transition-colors">
                  <ShoppingCart size={20} />
                </button>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all"
                >
                  <User size={16} />
                  <span>Sign In</span>
                </button>
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
            <a href="#seasons" className="block px-3 py-2 text-gray-700">4 Seasons</a>
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
            backgroundImage: 'url("https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&h=1080&fit=crop")'
          }}
        ></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Your Dream Wedding
            <span className="block bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
              Blooms Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Perfect flowers for every season, guaranteed fresh and beautiful for your special day, 
            no matter the weather
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-rose-600 transform hover:scale-105 transition-all shadow-xl">
              Browse Collections
            </button>
            <button className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all border border-white/30">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* 4 Seasons Guarantee */}
      <section id="seasons" className="py-20 bg-white">
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
            {['spring', 'summer', 'fall', 'winter'].map((season, index) => (
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
                  <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all">
                    <Heart size={20} className="text-pink-500" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{flower.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-pink-600">{flower.price}</span>
                    <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full hover:from-pink-600 hover:to-rose-600 transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
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
                <input
                  type="date"
                  placeholder="Wedding Date"
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-pink-200 focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
                <textarea
                  rows={4}
                  placeholder="Tell us about your dream wedding..."
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

      {/* Login Modal */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default BrideBlooms;