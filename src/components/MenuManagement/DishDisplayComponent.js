// File: src/components/DishDisplayComponent.js
// Displays a single dish row in CourseComponent.
// All static layout/styles have been moved into DishDisplayComponent.css. :contentReference[oaicite:0]{index=0}

import React from 'react';
import './DishDisplayComponent.css';

/**
 * DishDisplayComponent: Renders one row in the chef’s daily menu list.
 *
 * - For past dates: shows average rating (if available) in a 2-column cell.
 * - For future dates: shows a trash(delete)‐button in a 1-column cell.
 * - Always displays read‐only inputs for name (6 cols) and calories (2 cols).
 * - Always displays two read‐only checkboxes (each 1 column).
 *
 * @param {Object}   props
 * @param {Object}   props.dish
 *   @param {number} props.dish.date_has_dish_id    Unique ID linking date & dish.
 *   @param {Object} props.dish.dish                Dish details: { dish_id, dish_name, dish_calories, light_healthy, sugar_free }.
 *   @param {number} props.dish.average_rating      Average rating (null if none).
 *   @param {number} props.dish.rating_count        Number of ratings (0 if none).
 *   @param {string} props.dish.date                ISO date string (YYYY-MM-DD).
 * @param {function} props.onDishNameChange         (dishId, newName) => void; only matters if was editable (here disabled).
 * @param {function} props.onCaloriesChange         (dishId, newCalories) => void; only matters if was editable (here disabled).
 * @param {function} props.onCheckboxChange         (dishId, fieldName) => void; only matters if was editable (here disabled).
 * @param {function} props.onDelete                 (dateHasDishId) => void; called when delete‐button clicked.
 * @param {boolean}  props.isPastDate               True if the dish’s date is in the past.
 */
const DishDisplayComponent = ({
    dish,
    onDishNameChange,
    onCaloriesChange,
    onCheckboxChange,
    onDelete,
    isPastDate
}) => {
    const handleDelete = () => {
        onDelete(dish.date_has_dish_id);
    };


    return (
        <div className="dish-display-row">
            {/* First cell: either average rating (past) or delete‐button (future) */}
            {isPastDate ? (
                <div
                    className="average-rating-cell"
                >
                    {dish.average_rating !== null ? (
                        <span>
                            {dish.average_rating.toFixed(1)} ⭐️ ({dish.rating_count ?? 0})
                        </span>
                    ) : (
                        <span>-</span>
                    )}
                </div>
            ) : (
                <div
                    className="average-rating-cell"
                >
                    <button
                    className="delete-button delete-button-cell"
                    onClick={handleDelete}
                    aria-label="Remove dish"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="white"
                            className="bi bi-trash3-fill"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1
                                    11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0
                                    0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11
                                    1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5
                                    5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06
                                    m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058
                                    l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5
                                    a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Dish name (read‐only input spanning 6 columns) */}
            <input
                type="text"
                value={dish.dish.dish_name}
                onChange={(e) => onDishNameChange(dish.dish.dish_id, e.target.value)}
                className="dish-name-input"
                disabled
            />

            {/* Calories (read‐only input spanning 2 columns, right-aligned) */}
            <input
                type="text"
                value={dish.dish.dish_calories}
                onChange={(e) => onCaloriesChange(dish.dish.dish_id, e.target.value)}
                className="calories-input-display"
                disabled
            />

            {/* “Light & Healthy” checkbox (1 column, centered) */}
            <input
                type="checkbox"
                checked={dish.dish.light_healthy}
                onChange={() => onCheckboxChange(dish.dish.dish_id, 'light_healthy')}
                className="checkbox-cell"
                disabled
            />

            {/* “Sugar Free” checkbox (1 column, centered) */}
            <input
                type="checkbox"
                checked={dish.dish.sugar_free}
                onChange={() => onCheckboxChange(dish.dish.dish_id, 'sugar_free')}
                className="checkbox-cell"
                disabled
            />
        </div>
    );
};

export default React.memo(DishDisplayComponent);