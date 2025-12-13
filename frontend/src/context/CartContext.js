// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI as localCartAPI } from '../api'; // Local storage API
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Convert flower data to cart item format
  const createCartItem = (flower, quantity = 1) => ({
    id: flower._id || flower.id,
    flowerId: flower._id || flower.id,
    name: flower.name,
    price: typeof flower.price === 'string' 
      ? parseFloat(flower.price.replace('$', ''))
      : flower.price,
    image: flower.image || flower.imageUrl,
    season: flower.season,
    category: flower.category,
    quantity
  });

  // Load cart from localStorage
  const loadCart = () => {
    const items = localCartAPI.getCart();
    setCartItems(items);
  };

  // Save cart to localStorage
  const saveCart = (items) => {
    localCartAPI.clearCart();
    items.forEach(item => {
      localCartAPI.addToCart(item);
    });
  };

  // Add item to cart
  const addToCart = (flower, quantity = 1) => {
    const newItem = createCartItem(flower, quantity);
    
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === newItem.id);
      
      let updatedItems;
      if (existingIndex !== -1) {
        // Update quantity for existing item
        updatedItems = prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...prevItems, newItem];
      }
      
      // Save to localStorage
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        const updatedItems = prevItems.filter(item => item.id !== itemId);
        saveCart(updatedItems);
        return updatedItems;
      }

      const updatedItems = prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localCartAPI.clearCart();
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Get item count
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Sync cart to backend (when user logs in/registers)
  const syncCartToBackend = async () => {
    if (!isAuthenticated || cartItems.length === 0) return;
    
    setIsLoading(true);
    try {
      // Here you would make API calls to sync cart to backend
      // For now, we'll just use localStorage
      console.log('Cart would be synced to backend for user:', user.email);
    } catch (error) {
      console.error('Failed to sync cart to backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    cartItems,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    syncCartToBackend,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};