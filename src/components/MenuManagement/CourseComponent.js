// File: src/components/CourseComponent.js
// Displays a section for a single course/category of dishes.
// All static layout styles moved into CourseComponent.css.

import React from 'react';
import DishDisplayComponent from './DishDisplayComponent';
import DishInputComponent from './DishInputComponent';

import './CourseComponent.css';

/**
 * CourseComponent: Displays a section for a single course/category of dishes.
 * Allows for listing and adding dishes within the given category.
 *
 * @param {Object} props
 * @param {string} props.category    Course category (e.g., "Main Course").
 * @param {string} props.title       Human-readable title for this section.
 * @param {Array}  props.dishes      Array of dish objects to display.
 * @param {Function} props.onSave    Callback(category, data) to save a new dish.
 * @param {Function} props.onDelete  Callback(dateHasDishId) to delete an existing dish.
 * @param {boolean}  props.isPastDate  Whether the parent date is in the past.
 */
const CourseComponent = ({
    category,
    title,
    dishes,
    onSave,
    onDelete,
    isPastDate
}) => {
    /**
     * getBackgroundColor: Chooses a background based on category and past/future.
     *
     * @param {string} category
     * @param {boolean} isPastDate
     * @returns {string} CSS-compatible color string.
     */
    const getBackgroundColor = (category, isPastDate) => {
        const dayColors = {
            'Main Course': 'hsl(44, 100%, 67%)',    // Pastel yellow
            'Dessert': 'hsl(315, 67%, 42%)',        // Tomato
            'Soup': 'hsl(13, 75%, 56%)',            // Sky blue
            'Side': 'hsl(166, 79%, 40%)',           // Pale green
            'Water': 'hsl(211, 67%, 57%)'           // Hot pink
        };
        if (isPastDate) {
            return 'grey';
        } else {
            return dayColors[category] || 'light';
        }
    };

    /**
     * handleSave: Wraps onSave to include category context.
     *
     * @param {Object} data  Data payload from DishInputComponent.
     */
    const handleSave = (data) => {
        onSave(category, data);
    };

    return (
        <div
            className="course-container text-light rounded p-3"
            style={{ background: getBackgroundColor(category, isPastDate) }}
        >
            <div>
                {/* Section title */}
                <h4 className="text-center">{title}</h4>

                {/* Title Row */}
                <div className="title-row">
                    <span className="col-span-2"></span>
                    <span className="col-span-6">Dish Name</span>
                    <span className="col-span-2-center">Cal.</span>
                    <span className="col-span-1-right">Light &amp; Healthy</span>
                    <span className="col-span-1-center">Sugar Free</span>
                </div>

                {/* Dish Items */}
                {dishes && dishes.map(dish => (
                    <DishDisplayComponent
                        key={dish.dish.dish_id}
                        dish={dish}
                        onDelete={(dateHasDishId) => onDelete(dateHasDishId)}
                        isPastDate={isPastDate}
                    />
                ))}

                {/* DishInputComponent for adding new dishes (only if not past) */}
                {!isPastDate && 
                    <DishInputComponent 
                        onSave={handleSave} 
                        category={category}
                        isPastDate={isPastDate}
                    />
                }
            </div>
        </div>
    );
};

export default CourseComponent;