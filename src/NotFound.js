// src/NotFound.js

import React from 'react';

/**
 * NotFound: Simple 404 component for unknown routes.
 */
const NotFound = () => (
    <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#b71c1c'
    }}>
        <h1>404 - Page Not Found</h1>
        <p>The page you’re looking for does not exist.</p>
    </div>
);

export default NotFound;