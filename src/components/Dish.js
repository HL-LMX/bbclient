// src/components/Dish.js
import React, { useState, useEffect } from 'react';
import { variables as bookingVariables } from '../Variables';
import dayjs from 'dayjs';

/**
 * RatingStars: interactive (or read-only) star rating component.
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
    if (saved) setUserRating(Number(saved));
  }, [storageKey]);

  // POST or PUT rating (no-op if !editable)
  const handleRating = newRating => {
    if (!editable) return;
    const payload = { date_has_dish_id: dateHasDishId };
    const method = userRating == null ? 'POST' : 'PUT';

    if (userRating == null) {
      payload.rating = newRating;
    } else {
      payload.old_rating = userRating;
      payload.new_rating = newRating;
    }

    fetch(`${bookingVariables.API_URL}booking/rate/`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(data => {
        setAverage(data.average_rating);
        setCount(data.rating_count);
        setUserRating(newRating);
        localStorage.setItem(storageKey, newRating);
      })
      .catch(console.error);
  };

  // DELETE rating (no-op if !editable)
  const handleDelete = () => {
    if (!editable) return;
    fetch(`${bookingVariables.API_URL}booking/rate/`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date_has_dish_id: dateHasDishId,
        rating: userRating,
      }),
    })
      .then(r => r.json())
      .then(data => {
        setAverage(data.average_rating);
        setCount(data.rating_count);
        setUserRating(null);
        localStorage.removeItem(storageKey);
      })
      .catch(console.error);
  };

  return (
    <div style={{ marginTop: '-1em', display: 'flex', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(val => {
        const filled = val <= (userRating || 0);
        // if editable: show gold & black; otherwise greyed-out
        const starColor = editable
          ? filled
            ? '#DAA520'
            : '#000'
          : filled
          ? 'grey'
          : 'lightgrey';
        const cursorStyle = editable ? 'pointer' : 'default';

        return (
          <span
            key={val}
            onClick={() => editable && handleRating(val)}
            style={{
              cursor: cursorStyle,
              fontSize: '1.5rem',
              marginRight: '4px',
              color: starColor,
            }}
          >
            {filled ? '★' : '☆'}
          </span>
        );
      })}

      {editable && userRating != null && (
        <button
          onClick={handleDelete}
          style={{
            marginLeft: '12px',
            padding: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
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
 * Dish: displays dish info and conditional rating.
 * @param {Object}  dish       Dish data (name, calories, date, ratings).
 * @param {boolean} isSelected Whether the dish is selected to show ratings.
 */
const Dish = ({ dish, isSelected }) => {
    const {
        date_has_dish_id: dishId,
        dish: { dish_name: name, dish_calories: calories },
        date,
        average_rating: avgRating,
        rating_count: ratingCount,
    } = dish;

    // Past/future logic
    const isPastDate   = dayjs(date).isBefore(dayjs(), 'day');
    const isAfterToday = dayjs(date).isAfter(dayjs(), 'day');

    // Only show ratings for today or earlier days when selected
    const showRating = !isAfterToday && isSelected;

    // Editable window: X days back from today
    const EDIT_WINDOW_DAYS = 5;
    const editDateLimit = new Date();
    editDateLimit.setDate(editDateLimit.getDate() - EDIT_WINDOW_DAYS);
    // only editable if date is ≥ N days ago and not in the future
    const isEditable =
        !isAfterToday && new Date(date) >= editDateLimit;

    const textColor = isPastDate ? 'grey' : 'black';

    return (
        <div
        style={{
            display: 'grid',
            gridTemplateColumns: '5fr 1fr',
            gap: '10px',
            marginBottom: '20px',
        }}
        >
        <div style={{ color: textColor }}>{name}</div>
        <div style={{ textAlign: 'center', color: textColor }}>
            {calories}
        </div>

        {showRating && (
            <div style={{ gridColumn: '1 / -1' }}>
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
