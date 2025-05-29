// src/Booking.js

import React, { useState, useEffect } from 'react';
import { variables as bookingVariables } from './Variables';
import Day from './components/Day';
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
const calculateAvailableDishesByDayAndType = (currentDate, availableDishes, daysOfWeek) => {
    const availableDishesByDayAndType = {};

    daysOfWeek.forEach(day => {
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
        date.setDate(date.getDate() + 0); // Default to current week
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

    // Fetch dishes for the selected week
    useEffect(() => {
        refreshAvailableDishes();
        // Load saved days again if needed
        // Note: This will reload on week change (could be made more efficient)
        const saved = JSON.parse(localStorage.getItem('savedDays')) || [];
        setSavedDays(saved);
        setUnsavedChanges(saved.map(date => new Date(date)));
        // eslint-disable-next-line
    }, [currentDate]);

    const refreshAvailableDishes = () => {
        const selectedDate = currentDate.toISOString().split('T')[0];
        fetch(bookingVariables.API_URL + 'booking/week/?date=' + selectedDate)
        .then(response => response.json())
        .then(data => setAvailableDishes(data.dishes))
        .catch(error => console.error('Error:', error));
    };

    const handleDateChange = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
    };

    const handleSave = () => {
        const selectedDates = unsavedChanges.map(date => date.toISOString().split('T')[0]);
        const newDatesToAdd = selectedDates.filter(date => !savedDays.includes(date));
        const datesToRemove = savedDays.filter(date => !unsavedChanges.some(day => day.toISOString().split('T')[0] === date));

        if (newDatesToAdd.length === 0 && datesToRemove.length === 0) {
        console.log("No changes to save.");
        return;
        }

        if (newDatesToAdd.length > 0) {
        addToAttendance(newDatesToAdd);
        setChangesSaved(true);
        }
        if (datesToRemove.length > 0) {
        removeFromAttendance(datesToRemove);
        setChangesSaved(true);
        }

        const newSavedDays = [...unsavedChanges.map(date => date.toISOString().split('T')[0])];
        setSavedDays(newSavedDays);
        localStorage.setItem('savedDays', JSON.stringify(newSavedDays));

        setTimeout(() => setChangesSaved(false), 3000);
    };

    const addToAttendance = (dates) => {
        fetch(bookingVariables.API_URL + 'booking/add-attendance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dates),
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to add attendance');
            return response.json();
        })
        .then(data => {
            console.log('Attendance added successfully:', data);
        })
        .catch(error => {
            console.error('Error adding attendance:', error);
        });
    };

    const removeFromAttendance = (dates) => {
        fetch(bookingVariables.API_URL + 'booking/remove-attendance/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dates),
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to remove attendance');
            return response.json();
        })
        .then(data => {
            console.log('Attendance removed successfully:', data);
        })
        .catch(error => {
            console.error('Error removing attendance:', error);
        });
    };

    const toggleDaySelection = (day) => {
        const selectedDateString = new Date(day).toISOString().split('T')[0];
        const index = unsavedChanges.findIndex(
        selectedDay => selectedDay.toISOString().split('T')[0] === selectedDateString
        );
        if (index === -1) {
        setUnsavedChanges(prev => [...prev, new Date(day)]);
        } else {
        setUnsavedChanges(prev => prev.filter((_, idx) => idx !== index));
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Calculate Monday of the week for currentDate
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + daysOfWeek.length - 1);

    const options = { day: '2-digit', month: 'short' };
    const weekRange = `${firstDayOfWeek.toLocaleDateString('en-GB', options)} - ${lastDayOfWeek.toLocaleDateString('en-GB', options)}`;

    const availableDishesByDayAndType = calculateAvailableDishesByDayAndType(currentDate, availableDishes, daysOfWeek);

    const popup = changesSaved ? <PopupMessage message="Changes saved" /> : null;

    return (
        <div>
        <h3 className="text-center" style={{ fontSize: '32px', margin: '1rem 0' }}>Visit Booking</h3>
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

        <div className="text-center mb-3">
            <button onClick={handleSave} className="save-button">Save Changes</button>
            {popup}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gridGap: '20px' }}>
            {daysOfWeek.map((day, index) => {
            const dayDate = new Date(firstDayOfWeek);
            dayDate.setDate(dayDate.getDate() + index);

            // For disabling "past" or "within next 7 days" logic
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
            const isPastDate = dayDate < oneWeekFromNow;

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