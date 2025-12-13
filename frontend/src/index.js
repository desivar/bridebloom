// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import BrideBlooms from './components/BrideBlooms'; // Updated path
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Add CartProvider

import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrideBlooms />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();