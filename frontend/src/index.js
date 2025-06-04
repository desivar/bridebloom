// C:\Users\jilli\bride\bridebloom\frontend\src\index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // This import is for React 18, which your project uses.
import './index.css'; // This line imports your global CSS file, if you have one.
import App from './'; // <-- This is crucial! It imports your main application component (App.js).
import reportWebVitals from './reportWebVitals'; // This is optional, for performance metrics.

// Get the HTML element from public/index.html where your React app will be mounted.
// It's typically a div with the id "root".
const rootElement = document.getElementById('root');

// Create a React "root" instance. This is the modern way to render React apps in React 18.
const root = ReactDOM.createRoot(rootElement);

// Render your main App component into the root.
// <React.StrictMode> helps identify potential problems in your application during development.
root.render(
  <React.StrictMode>
    <App /> {/* This tells React to display the content defined in your App.js file! */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();