// File: bbclient/src/components/Dish/Dish.js

// Displays a single dish row (name / calories / optional ratings).
// All static layout and star styles moved into Dish.css.

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { API_URL, API_ENDPOINTS } from '../../utils/constants';

import './Dish.css';

/**
 * RatingStars: interactive (or read-only) star rating component.
 *
 * @param {number}  dateHasDishId   Unique ID linking date & dish.
 * @param {number}  initialAverage  Starting average rating.
 * @param {number}  initialCount    Starting rating count.
 * @param {boolean} editable        Whether ratings can still be changed.
 */
const RatingStars = ({
    dateHasDishId,
    initialAverage,
    initialCount,
    editable = true,
}) => {
    const storageKey = `rating_${dateHasDishId}`;
    const [userRating, setUserRating] = useState(null);
    const [average, setAverage] = useState(initialAverage);
    const [count, setCount] = useState(initialCount);

    // Load any saved rating from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setUserRating(Number(saved));
        }
    }, [storageKey]);

    /**
     * handleRating: POST or PUT rating (no-op if not editable).
     *
     * @param {number} newRating  The new rating value (1–5).
     */
    const handleRating = (newRating) => {
        if (!editable) {
            return;
        }

        const payload = { date_has_dish_id: dateHasDishId };
        let method;

        if (userRating == null) {
            // First-time rating
            payload.rating = newRating;
            method = 'POST';
        } else {
            // Update existing rating
            payload.old_rating = userRating;
            payload.new_rating = newRating;
            method = 'PUT';
        }

        fetch(`${API_URL}${API_ENDPOINTS.RATE}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((r) => r.json())
            .then((data) => {
                setAverage(data.average_rating);
                setCount(data.rating_count);
                setUserRating(newRating);
                localStorage.setItem(storageKey, newRating);
            })
            .catch((err) => console.error(err));
    };

    /**
     * handleDelete: DELETE rating (no-op if not editable).
     */
    const handleDelete = () => {
        if (!editable) {
            return;
        }

        fetch(`${API_URL}${API_ENDPOINTS.RATE}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date_has_dish_id: dateHasDishId,
                rating: userRating,
            }),
        })
            .then((r) => r.json())
            .then((data) => {
                setAverage(data.average_rating);
                setCount(data.rating_count);
                setUserRating(null);
                localStorage.removeItem(storageKey);
            })
            .catch((err) => console.error(err));
    };

    return (
        <div
            className="rating-container"
            onClick={(e) => e.stopPropagation()}
        >
            {[1, 2, 3, 4, 5].map((val) => {
                const filled = val <= (userRating || 0);

                // Determine class names for this star
                const modeClass = editable ? 'editable' : 'readonly';
                const fillClass = filled ? 'filled' : 'empty';
                const starClass = `star ${modeClass} ${fillClass}`;

                return (
                    <span
                        key={val}
                        onClick={() => handleRating(val)}
                        className={starClass}
                        style={{ cursor: editable ? 'pointer' : 'default' }}
                    >
                        {filled ? '★' : '☆'}
                    </span>
                );
            })}

            {editable && userRating != null && (
                <button
                    onClick={handleDelete}
                    className="rating-delete-button"
                    aria-label="Remove rating"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="#000"
                        viewBox="0 0 16 16"
                    >
                        <path d="
                            M11 1.5v1h3.5a.5.5 0 0 1 0 1
                            h-.538l-.853 10.66A2 2 0 0 1 11.115 16
                            h-6.23a2 2 0 0 1-1.994-1.84
                            L2.038 3.5H1.5a.5.5 0 0 1 0-1
                            H5v-1A1.5 1.5 0 0 1 6.5 0h3
                            A1.5 1.5 0 0 1 11 1.5
                            m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3
                            a.5.5 0 0 0-.5.5
                            M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06
                            l-.5-8.5a.5.5 0 1 0-.998.06
                            m6.53-.528a.5.5 0 0 0-.528.47
                            l-.5 8.5a.5.5 0 0 0 .998.058
                            l.5-8.5a.5.5 0 0 0-.47-.528
                            M8 4.5a.5.5 0 0 0-.5.5v8.5
                            a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5
                        " />
                    </svg>
                </button>
            )}
        </div>
    );
};

/**
 * Dish: Displays dish info (name, calories) and conditional RatingStars.
 *
 * @param {Object}   props
 * @param {Object}   props.dish        Dish data object with name, calories, rating, date, etc.
 * @param {boolean}  props.isSelected  Whether this dish’s parent day is selected (so we show rating).
 */
const Dish = ({ dish, isSelected }) => {
    const {
        date_has_dish_id: dishId,
        dish: { dish_name: name, dish_calories: calories },
        date,
        average_rating: avgRating,
        rating_count: ratingCount,
    } = dish;

    // Determine if date is past or future relative to today
    const isPastDate = dayjs(date).isBefore(dayjs(), 'day');
    const isAfterToday = dayjs(date).isAfter(dayjs(), 'day');

    // Only show ratings if the day is selected and not in the future
    const showRating = !isAfterToday && isSelected;

    // Define an “edit window” (e.g., 5 days back from today)
    const EDIT_WINDOW_DAYS = 5;
    const editDateLimit = new Date();
    editDateLimit.setDate(editDateLimit.getDate() - EDIT_WINDOW_DAYS);
    // Rating is editable only if date ≥ (today – EDIT_WINDOW_DAYS) and not in future
    const isEditable = !isAfterToday && new Date(date) >= editDateLimit;

    // Text color: grey for past, black otherwise
    const textColorClass = isPastDate ? 'text-grey' : 'text-black';

    return (
        <div className="dish-row">
            {/* Dish name (left column) */}
            <div className={`${textColorClass} dish-name`}>{name}</div>
            {/* Calories (right column, centered) */}
            <div className={`dish-calories ${textColorClass}`}>
                {calories}
            </div>

            {showRating && (
                <div className="rating-full-row">
                    <RatingStars
                        dateHasDishId={dishId}
                        initialAverage={avgRating || 0}
                        initialCount={ratingCount || 0}
                        editable={isEditable}
                    />
                </div>
            )}
        </div>
    );
};

export default React.memo(Dish);