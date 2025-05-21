// src/components/Day.js

import React from 'react';
import Dish from './Dish';

/**
 * Day: Renders a single day's card in the booking grid.
 * Shows dishes by type, color codes days, and handles selection.
 */
const Day = ({
    date,
    dayName,
    availableDishesByType,
    isSelected,
    isPastDate,
    onClick
}) => {
    const dayColors = {
        Monday: 'hsl(345, 60%, 40%)',    // Pink
        Tuesday: 'hsl(45, 60%, 50%)',     // Yellow
        Wednesday: 'hsl(145, 60%, 40%)',  // Green
        Thursday: 'hsl(185, 70%,40%)',    // Cyan
        Friday: 'hsl(285, 40%, 40%)',     // Purple
    };

    let backgroundColor = '';
    if (isSelected && !isPastDate) {
        backgroundColor = '#FF6600';
    } else if (isSelected && isPastDate) {
        backgroundColor = '#ffbe95';
    } else if (isPastDate) {
        backgroundColor = 'lightgrey';
    } else {
        backgroundColor = dayColors[dayName] || '#FFFFFF';
    }

    // Order of dish types
    const typeOrder = ['Soup', 'Main Course', 'Side', 'Dessert', 'Water'];

    const handleDayClick = () => {
        if (!isPastDate) {
            onClick(date.toISOString().split('T')[0]);
        }
    };

    return (
        <div
            style={{
                backgroundColor,
                padding: '1em',
                borderRadius: '0.5em',
                marginBottom: '1em',
                cursor: isPastDate ? 'default' : 'pointer'
            }}
            onClick={handleDayClick}
        >
            <h4 style={{ textAlign: 'center', color: 'white' }}>
                {dayName} {date.getDate()}
            </h4>
            {typeOrder.map(type => (
                availableDishesByType[type] && availableDishesByType[type].length > 0 && (
                    <div
                        key={`${dayName}-${type}`}
                        style={{
                            marginBottom: '1em',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            padding: '1em',
                            borderRadius: '0.5em'
                        }}
                    >
                        <h5 style={{ color: 'black', margin: '0.5rem 0' }}>{type}</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                            <div style={{ gridColumn: 'span 5', color: 'black', fontWeight: 'bold' }}></div>
                            <div style={{ color: 'black', fontWeight: 'bold', fontSize: '.8rem' }}>Calories</div>
                        </div>
                        {availableDishesByType[type].map(dish => (
                            <Dish key={dish.dish.dish_id} dish={dish} />
                        ))}
                    </div>
                )
            ))}
        </div>
    );
};

export default Day;