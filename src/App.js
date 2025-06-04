// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { MenuManagement } from './components/MenuManagement/MenuManagement';
import { Booking } from './components/Booking/Booking';
import { Suggestions } from './pages/Suggestions';
import NotFound from './pages/NotFound';

/**
 * App Component: Main entry point for Booking Bite Mx frontend.
 * Handles routing, global layout, navigation (left‐aligned buttons), and footer.
 */
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* Header: Title + Left-Aligned Button Nav                             */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <header>
          {/* Page Title */}
          <h1 className="text-center m-3">Booking Bite Mx</h1>

          {/* Navigation Buttons (aligned left) */}
          <nav>
            <ul>
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive ? 'nav-button active-nav' : 'nav-button'
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/bookingbite/booking"
                  className={({ isActive }) =>
                    isActive ? 'nav-button active-nav' : 'nav-button'
                  }
                >
                  Menu Calendar
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* Main Content (Routes)                                              */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <main>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/bookingbite/menu-management" element={<MenuManagement />} />
            <Route path="/bookingbite/booking" element={<Booking />} />
            <Route path="/bookingbite/suggestions" element={<Suggestions />} />
            <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* Footer: original yellow background, dimensions, and typography     */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        <footer className="app-footer">
          Hapag-Lloyd México 2024
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
