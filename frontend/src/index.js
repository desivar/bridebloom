// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Import from the correct location - it's in src/, not src/components/
import BrideBlooms from './BrideBlooms'; // Changed from './components/BrideBlooms'

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

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