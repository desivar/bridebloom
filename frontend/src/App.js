// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrideBlooms from './BrideBlooms'; // Your main homepage component
import Header from './components/Header'; // Your navigation bar
import Login from './components/Login';
import Register from './components/Register';
import { AuthProvider } from './context/AuthContext'; // Your context provider

const App = () => {
    return (
        <Router>
            {/* 🌟 WRAP EVERYTHING WITH AUTH PROVIDER 🌟 */}
            <AuthProvider> 
                <Header /> {/* Header component needs to be rendered on all pages */}
                <main>
                    <Routes>
                        {/* Route for the main landing page (BrideBlooms.js) */}
                        <Route path="/" element={<BrideBlooms />} />
                        
                        {/* Route for the Login Page */}
                        <Route path="/login" element={<Login />} />
                        
                        {/* Route for the Register Page */}
                        <Route path="/register" element={<Register />} />
                        
                        {/* You can add more routes here, like '/checkout' or '/admin' */}
                    </Routes>
                </main>
            </AuthProvider>
        </Router>
    );
};

export default App;