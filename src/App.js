// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home/Home.js';
import { MenuManagement } from './components/MenuManagement/MenuManagement';
import { Booking } from './components/Booking/Booking';
import NotFound from './pages/NotFound'; // This should be created as NotFound.js in your project

/**
 * App Component: Main entry point for BookingBite frontend.
 * Handles routing, global layout, and navigation.
 */
const App = () => {
  return (
    <BrowserRouter>
      <div>
        {/* Header Section */}
        <header
          className="App"
          style={{
            backgroundColor: '#F79800',
            width: '100%',
            height: '200px',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div style={{ color: 'white', maxWidth: '1200px', width: '100%' }}>
            <h1 className="text-center m-3">Booking Bite Mx</h1>
            <nav className="navbar navbar-expand-sm navbar-dark">
              <ul className="navbar-nav">
                <li className="nav-item- m-1">
                  <NavLink className="btn btn-light btn-outline" to="/bookingbite">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item- m-1">
                  <NavLink className="btn btn-light btn-outline" to="/bookingbite/booking">
                    Menu Calendar
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main Content Routes */}
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/bookingbite" />} />
            <Route path="/bookingbite/" element={<Home />} />
            <Route path="/bookingbite/booking" element={<Booking />} />
            <Route path="/bookingbite/menu-management" element={<MenuManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <footer
          style={{
            backgroundColor: '#FFA81C',
            color: 'white',
            textAlign: 'center',
            padding: '30px',
            margin: '50px 0 0'
          }}
        >
          Hapag-Lloyd México 2024
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;