import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Helper to ensure price is numeric for calculations
  const getNumericPrice = (price) => parseFloat(price.toString().replace('$', ''));

  // 1. Add to Cart (Existing function, slightly refined)
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Item exists: increase quantity
        return prevItems.map((item, index) => 
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item: add it with quantity 1
        return [...prevItems, { 
            ...product, 
            quantity: 1,
            price: getNumericPrice(product.price) // Store price as a number
        }];
      }
    });
  };

  // 2. Remove an item completely from the cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // 3. Update the quantity of a specific item
  const updateQuantity = (id, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        // If new quantity is 0 or less, remove the item
        return prevItems.filter(item => item.id !== id);
      }
      
      return prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,  // <--- ADDED
    updateQuantity,  // <--- ADDED
    clearCart: () => setCartItems([]), // Optional: for checkout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);