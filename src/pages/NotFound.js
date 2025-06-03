// File: src/pages/NotFound.js
// Simple 404 component for unknown routes. Uses NotFound.css for layout/colors.

import React from 'react';
import './NotFound.css';

/**
 * NotFound: Simple 404 component for unknown routes.
 */
const NotFound = () => (
    <div className="notfound-container">
        <h1>404 - Page Not Found</h1>
        <p>The page you’re looking for does not exist.</p>
    </div>
);

export default NotFound;
