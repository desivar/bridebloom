// src/components/Header.js

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 
// Assuming you use React Router Link for navigation
// import { Link } from 'react-router-dom'; 

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart(); // Access cart state to display item count

  // Calculate total items in cart
  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="main-header">
      {/* Assuming a logo or home link */}
      <div className="logo">
        {/* <Link to="/">Bride Blooms</Link> */}
        <h1>Bride Blooms</h1>
      </div>
      
      <nav className="main-nav">
        {/* Standard Navigation Links */}
        {/* <Link to="/">Home</Link> */}
        {/* <Link to="/collections">Collections</Link> */}
        {/* <Link to="/schedule">Schedule</Link> */}
        {/* <Link to="/reviews">Reviews</Link> */}
        
        {/* Cart Icon/Link */}
        <div className="cart-link">
          {/* <Link to="/cart"> */}
            🛒 Cart ({cartItemCount})
          {/* </Link> */}
        </div>

        {/* Dynamic Authentication Links */}
        {isAuthenticated ? (
          <div className="user-info">
            <span>Welcome, **{user.name}**!</span>
            {/* <Link to="/orders">My Orders</Link> */}
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            {/* <Link to="/login">Login</Link> */}
            {/* <Link to="/register">Register</Link> */}
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;