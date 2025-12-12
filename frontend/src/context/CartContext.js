// frontend/src/context/CartContext.js (Updated checkout function)

import React, { createContext, useState, useContext } from 'react';
// ⚠️ Import the ordersAPI you defined, and useAuth to get the token/user
import { ordersAPI } from '../api'; 
import { useAuth } from './AuthContext'; // Need auth context to get the token

// ... (existing context definition and initial state) ...

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { getToken, user } = useAuth(); // Access auth methods/state

    // ... (existing helper functions like getNumericPrice, calculateTotal) ...
    const getNumericPrice = (price) => parseFloat(price.toString().replace('$', ''));
    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + (getNumericPrice(item.price) * item.quantity), 0);
    };

    // ... (existing functions: addToCart, removeFromCart, updateQuantity) ...
    // ... (keep these the same, as they manage local storage/state) ...

    // --- New Checkout/Place Order Logic ---
    const checkout = async (deliveryDetails) => {
        if (!user) {
            throw new Error("User must be logged in to checkout.");
        }
        
        if (cartItems.length === 0) {
            throw new Error("Cannot checkout with an empty cart.");
        }

        // 1. Format items for the OrderSchema
        const itemsForOrder = cartItems.map(item => ({
            // Use _id from the Flower object which is now retrieved from the API
            flowerId: item._id || item.id, 
            quantity: item.quantity,
            customizations: item.customizations || '' 
        }));

        // 2. Build the final order object
        const totalAmount = calculateTotal(cartItems);
        
        const orderData = {
            items: itemsForOrder,
            totalAmount: totalAmount,
            deliveryDate: deliveryDetails.deliveryDate,
            deliveryAddress: deliveryDetails.deliveryAddress,
            specialInstructions: deliveryDetails.specialInstructions,
        };

        try {
            // 🚀 Call the centralized API function (Token is automatically added by the axios interceptor!)
            const newOrder = await ordersAPI.create(orderData);

            // 3. Success: Clear the client-side cart
            setCartItems([]);
            // Optional: Also clear cart from localStorage if you rely on cartAPI.getCart
            // cartAPI.clearCart(); 
            
            return newOrder;
        } catch (error) {
            // Re-throw for the Checkout component to handle
            throw new Error(error.response?.data?.message || 'Order placement failed.');
        }
    };
    
    const value = {
        cartItems,
        // ... (all other cart functions)
        checkout, // Expose checkout
        getCartTotal: () => calculateTotal(cartItems),
        // ...
    };

    // ... (return CartContext.Provider) ...
};