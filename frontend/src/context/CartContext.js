import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // -----------------------------
  // Helpers
  // -----------------------------
  const getNumericPrice = (price) =>
    parseFloat(price.toString().replace('$', ''));

  // -----------------------------
  // Add item to cart
  // -----------------------------
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex !== -1) {
        // Increase quantity for existing item
        return prevItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Add new item
      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
          price: getNumericPrice(product.price), // always numeric
        },
      ];
    });
  };

  // -----------------------------
  // Remove item completely
  // -----------------------------
  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  // -----------------------------
  // Update quantity (or remove if <= 0)
  // -----------------------------
  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.id !== id);
      }

      return prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // -----------------------------
  // Clear Cart
  // -----------------------------
  const clearCart = () => setCartItems([]);

  // -----------------------------
  // Context Value
  // -----------------------------
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
