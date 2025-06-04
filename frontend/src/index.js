// C:\Users\jilli\bride\bridebloom\frontend\src\index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Required for React 18
import './index.css'; // Link to your global CSS file (if you have one)
import BrideBlooms from './BrideBlooms'; // <--- THIS IS THE CHANGE! It imports your main component by its new name.
import reportWebVitals from './reportWebVitals'; // Optional: for performance metrics

// Get the root HTML element from public/index.html where your React app will be mounted
const rootElement = document.getElementById('root');

// Create a React root using React 18's createRoot API
const root = ReactDOM.createRoot(rootElement);

// Render your main application component into the root
root.render(
  <React.StrictMode>
    <BrideBlooms /> {/* <--- THIS IS THE CHANGE! It renders your main component by its new name. */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();