// src/components/CourseComponent.js

import React from 'react';
import DishDisplayComponent from './DishDisplayComponent';
import DishInputComponent from './DishInputComponent';

/**
 * CourseComponent: Displays a section for a single course/category of dishes.
 * Allows for listing and adding dishes within the given category.
 */
const CourseComponent = ({
    category,
    title,
    dishes,
    onSave,
    onDelete,
    isPastDate
}) => {

    // Helper function to determine background color based on category and past date
    const getBackgroundColor = (category, isPastDate) => {
        const dayColors = {
            'Main Course': 'hsl(44, 100%, 67%)',    // Pastel yellow
            'Dessert': 'hsl(315, 67%, 42%)',        // Tomato
            'Soup': 'hsl(13, 75%, 56%)',            // Sky blue
            'Side': 'hsl(166, 79%, 40%)',           // Pale green
            'Water': 'hsl(211, 67%, 57%)'           // Hot pink
        };
        if (isPastDate) {
            return 'grey'; // If the date is in the past, set background color to grey
        } else {
            return dayColors[category] || 'light';
        }
    };

    // Handles saving a new dish (passes up to parent)
    const handleSave = (data) => {
        onSave(category, data);
    };

    return (
        <div
            className="text-light rounded p-3"
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: getBackgroundColor(category, isPastDate)
            }}
        >
            <div>
                {/* Section title */}
                <h4 className="text-center">{title}</h4>

                {/* Title Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    marginBottom: '1em',
                    gap: '0.5em'
                }}>
                    <span style={{ gridColumn: 'span 2' }}></span>
                    <span style={{
                        gridColumn: 'span 6',
                        fontSize: '1rem',
                        textAlign: 'center',
                        alignSelf: 'flex-end'
                    }}>Dish Name</span>
                    <span style={{
                        gridColumn: 'span 2',
                        fontSize: '1rem',
                        textAlign: 'center',
                        alignSelf: 'flex-end'
                    }}>Cal.</span>
                    <span style={{
                        gridColumn: 'span 1',
                        fontSize: '0.8rem',
                        textAlign: 'right',
                        alignSelf: 'flex-end'
                    }}>Light & Healthy</span>
                    <span style={{
                        gridColumn: 'span 1',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        alignSelf: 'flex-end'
                    }}>Sugar Free</span>
                </div>

                {/* Dish Items */}
                {dishes && dishes.map(dish => (
                    <DishDisplayComponent
                        key={dish.dish.dish_id}
                        dish={dish}
                        onDelete={(dishId, dateHasDishId) => onDelete(category, dishId, dateHasDishId)}
                        isPastDate={isPastDate}
                    />
                ))}

                {/* DishInputComponent for adding new dishes */}
                {!isPastDate && <DishInputComponent onSave={handleSave} />}
            </div>
        </div>
    );
};

export default CourseComponent;