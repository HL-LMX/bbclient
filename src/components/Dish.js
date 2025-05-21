// src/components/Dish.js

import React from 'react';

/**
 * Dish: Simple display component for a single dish row (name and calories).
 */
const Dish = ({ dish }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '10px',
        marginBottom: '20px'
    }}>
        <div style={{ gridColumn: 'span 5', color: 'black' }}>
            {dish.dish.dish_name}
        </div>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black'
        }}>
            {dish.dish.dish_calories}
        </div>
    </div>
);

export default Dish;
