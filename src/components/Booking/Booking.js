// src/Booking.js

import { API_URL, API_ENDPOINTS, DAYS_OF_WEEK } from '../../utils/constants';
import React, { useState, useEffect } from 'react';
import Day from './Day';

import './Booking.css';

/**
 * PopupMessage: Displays a popup message for feedback (e.g., on save).
 */
const PopupMessage = ({ message }) => (
  <div className="popup">
    <span className="popup-message">{message}</span>
  </div>
);

/**
 * Calculates available dishes grouped by day and type for the week.
 */
const calculateAvailableDishesByDayAndType = (currentDate, availableDishes, DAYS_OF_WEEK) => {
  const availableDishesByDayAndType = {};

  DAYS_OF_WEEK.forEach(day => {
    availableDishesByDayAndType[day] = availableDishes
      .filter(dish => {
        const dishDate = new Date(dish.date + 'T00:00:00Z');
        const options = { weekday: 'long', timeZone: 'UTC' };
        const dayName = dishDate.toLocaleDateString('en-US', options);
        return dayName === day;
      })
      .reduce((acc, dish) => {
        const type = dish.dish.dish_type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(dish);
        return acc;
      }, {});
  });

  return availableDishesByDayAndType;
};

/**
 * Booking: Main booking/attendance screen.
 * Allows users to select days for booking and displays available dishes for each day.
 */
export const Booking = () => {
  const [availableDishes, setAvailableDishes] = useState([]);
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date();
    // Default to current week
    return date;
  });
  const [unsavedChanges, setUnsavedChanges] = useState([]);
  const [savedDays, setSavedDays] = useState([]);
  const [changesSaved, setChangesSaved] = useState(false);

  // Load saved days from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDays')) || [];
    setSavedDays(saved);
    setUnsavedChanges(saved.map(date => new Date(date)));
  }, []);

  // Fetch dishes for the selected week whenever currentDate changes
  useEffect(() => {
    refreshAvailableDishes();
    const saved = JSON.parse(localStorage.getItem('savedDays')) || [];
    setSavedDays(saved);
    setUnsavedChanges(saved.map(date => new Date(date)));
    // eslint-disable-next-line
  }, [currentDate]);

    const refreshAvailableDishes = () => {
        const selectedDate = currentDate.toISOString().split('T')[0];
        fetch(`${API_URL}${API_ENDPOINTS.DISHES_AVAILABLE_WEEK(selectedDate)}`, { cache: 'no-store' })
        .then(response => response.json())
        .then(data => setAvailableDishes(data.dishes))
        .catch(error => console.error('Error:', error));
    };

  const handleDateChange = days => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleSave = () => {
    const selectedDates = unsavedChanges.map(d => d.toISOString().split('T')[0]);
    const newDatesToAdd = selectedDates.filter(d => !savedDays.includes(d));
    const datesToRemove = savedDays.filter(d => !selectedDates.includes(d));

    if (!newDatesToAdd.length && !datesToRemove.length) return;

    if (newDatesToAdd.length) {
      addToAttendance(newDatesToAdd);
      setChangesSaved(true);
    }
    if (datesToRemove.length) {
      removeFromAttendance(datesToRemove);
      setChangesSaved(true);
    }

    const newSavedDays = [...selectedDates];
    setSavedDays(newSavedDays);
    localStorage.setItem('savedDays', JSON.stringify(newSavedDays));

    setTimeout(() => setChangesSaved(false), 3000);
  };

  const addToAttendance = dates => {
    fetch(`${API_URL}${API_ENDPOINTS.ADD_ATTENDANCE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dates),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to add attendance');
        return response.json();
      })
      .then(data => console.log('Attendance added successfully:', data))
      .catch(error => console.error('Error adding attendance:', error));
  };

  const removeFromAttendance = dates => {
    fetch(`${API_URL}${API_ENDPOINTS.REMOVE_ATTENDANCE}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dates),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to remove attendance');
        return response.json();
      })
      .then(data => console.log('Attendance removed successfully:', data))
      .catch(error => console.error('Error removing attendance:', error));
  };

  const toggleDaySelection = day => {
    const iso = new Date(day).toISOString().split('T')[0];
    setUnsavedChanges(prev => {
      const exists = prev.some(d => d.toISOString().split('T')[0] === iso);
      return exists
        ? prev.filter(d => d.toISOString().split('T')[0] !== iso)
        : [...prev, new Date(day)];
    });
  };


  // Calculate first (Monday) and last (Friday) day of the week
  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1);
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + DAYS_OF_WEEK.length - 1);

  // Show Save Attendance if this week still has at least one day on or after today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hasActiveDays = lastDayOfWeek >= today;

  const options = { day: '2-digit', month: 'short' };
  const weekRange = `${firstDayOfWeek.toLocaleDateString('en-GB', options)} - ${lastDayOfWeek.toLocaleDateString('en-GB', options)}`;

  const availableDishesByDayAndType = calculateAvailableDishesByDayAndType(
    currentDate,
    availableDishes,
    DAYS_OF_WEEK
  );

  const popup = changesSaved ? <PopupMessage message="Changes saved" /> : null;

  

  return (
    <div>
      <h3 className="text-center" style={{ fontSize: '32px', margin: '1rem 0' }}>
        Menu Calendar
      </h3>

      <div className="text-center mb-3" style={{ padding: '1rem 0' }}>
        <button onClick={() => handleDateChange(-7)} className="arrow-button">
          &lt; Previous Week
        </button>
        <label style={{ margin: '0 10px', width: '200px', display: 'inline-block', fontSize: '1.5rem' }}>
          {weekRange}
        </label>
        <button onClick={() => handleDateChange(7)} className="arrow-button">
          Next Week &gt;
        </button>
      </div>
        <div className="text-center mb-3" >
            <p style={{ fontSize: '1.5rem', margin: '1rem 0'}}>
                Remember to rate the dishes you ate with the new <b>rating option</b>*
            </p>
            <p style={{ fontSize: '1rem', margin: '1rem 0'}}>
                *Rating is only available on days with saved attendance.
            </p>
        </div>
      <div className="text-center mb-3">
        {hasActiveDays && (
          <>
            <button onClick={handleSave} className="save-button">
              Save Attendance
            </button>
            {popup}
          </>
        )}
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridGap: '20px' }}>
        {DAYS_OF_WEEK.map((day, index) => {
          const dayDate = new Date(firstDayOfWeek);
          dayDate.setDate(dayDate.getDate() + index);

          // Mark past if before yesterday
          const dateLimit = new Date();
          dateLimit.setDate(dateLimit.getDate() - 1);
          const isPastDate = dayDate < dateLimit;

          return (
            <Day
              key={index}
              date={dayDate}
              dayName={day}
              availableDishesByType={availableDishesByDayAndType[day] || {}}
              isSelected={unsavedChanges.some(selectedDay =>
                selectedDay.toISOString().split('T')[0] === dayDate.toISOString().split('T')[0]
              )}
              isPastDate={isPastDate}
              onClick={toggleDaySelection}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Booking;
