// src/components/Dish.js
import React, { useState, useEffect } from 'react';
import { variables as bookingVariables } from '../Variables';

const RatingStars = ({ dateHasDishId, initialAverage, initialCount }) => {
    const key = `rating_${dateHasDishId}`;
    const [userRating, setUserRating] = useState(null);
    const [avg, setAvg] = useState(initialAverage);
    const [count, setCount] = useState(initialCount);

    // On mount: load previous rating
    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
        setUserRating(Number(saved));
        }
    }, [key]);

    // Handler for both new and updated ratings
    const handleRating = (newRating) => {
        const payload = { date_has_dish_id: dateHasDishId };

        // Decide POST vs. PUT
        let url = `${bookingVariables.API_URL}booking/rate/`;
        let method;
        if (userRating === null) {
        method = 'POST';
        payload.rating = newRating;
        } else {
        method = 'PUT';
        payload.old_rating = userRating;
        payload.new_rating = newRating;
        }

        fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        })
        .then(res => res.json())
        .then(data => {
            // Update UI + localStorage
            setAvg(data.average_rating);
            setCount(data.rating_count);
            setUserRating(newRating);
            localStorage.setItem(key, newRating);
        })
        .catch(console.error);
    };

    return (
  <div style={{ marginTop: '-1em', display: 'flex', alignItems: 'center' }}>
    <div>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => handleRating(star)}
          style={{
            cursor: 'pointer',
            fontSize: '1.5rem',
            marginRight: '4px',
            color: star <= (userRating || 0) ? '#DAA520' : '#CCC'
          }}
        >
          {star <= (userRating || 0) ? '★' : '☆'}
        </span>
      ))}
    </div>

    {userRating != null && (
        <div style={{ marginLeft: '10px', color: '#555' }}>
            <button
                onClick={() => {
                fetch(`${bookingVariables.API_URL}booking/rate/`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    date_has_dish_id: dateHasDishId,
                    rating: userRating
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                    setAvg(data.average_rating);
                    setCount(data.rating_count);
                    setUserRating(null);
                    localStorage.removeItem(key);
                    })
                    .catch(console.error);
                }}
                style={{
                marginLeft: '12px',
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
                }}
                aria-label="Remove rating"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#A9A9A5"
                className="bi bi-trash3-fill"
                viewBox="0 0 16 16"
                >
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 
                        10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 
                        0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 
                        0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 
                        0h3A1.5 1.5 0 0 1 11 
                        1.5m-5 0v1h4v-1a.5.5 0 0 
                        0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 
                        5.029l.5 8.5a.5.5 0 1 0 
                        .998-.06l-.5-8.5a.5.5 0 1 
                        0-.998.06m6.53-.528a.5.5 0 
                        0 0-.528.47l-.5 8.5a.5.5 0 0 
                        0 .998.058l.5-8.5a.5.5 0 0 
                        0-.47-.528M8 4.5a.5.5 0 0 
                        0-.5.5v8.5a.5.5 0 0 0 1 
                        0V5a.5.5 0 0 0-.5-.5"/>
                </svg>
            </button>
        </div>
    )}
  </div>
);


};



/**
 * Dish: Simple display component for a single dish row (name and calories).
 */

const Dish = ({ dish }) => {
  const {
    date_has_dish_id,
    dish: { dish_name, dish_calories },
    date,
    average_rating,
    rating_count
  } = dish;

  // Only allow rating on past dates
  const isPast = new Date(date) < new Date();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '5fr 1fr', gap: '10px', marginBottom: '20px' }}>
      <div style={{ color: 'black' }}>{dish_name}</div>
      <div style={{ textAlign: 'center', color: 'black' }}>{dish_calories}</div>

      {isPast && (
        <div style={{ gridColumn: '1 / -1' }}>
          <RatingStars
            dateHasDishId={date_has_dish_id}
            initialAverage={average_rating || 0}
            initialCount={rating_count || 0}
          />
        </div>
      )}
    </div>
  );
};

export default Dish;
