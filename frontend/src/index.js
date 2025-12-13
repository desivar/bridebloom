// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import BrideBlooms from './BrideBlooms';
import { AuthProvider } from './context/AuthContext';

import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrideBlooms />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
