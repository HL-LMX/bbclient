// File: src/components/Booking/Booking.js
// Main booking/attendance screen. Uses only Booking.css for styling.

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { API_URL, API_ENDPOINTS, DAYS_OF_WEEK } from '../../utils/constants';
import Day from './Day';
import { Feedback } from '../../pages/Feedback';

import './Booking.css';  // only global/component CSS—no CSS modules

/**
 * PopupMessage: Displays a transient popup for feedback (e.g., “Changes saved”).
 *
 * @param {Object} props
 * @param {string} props.message  The message to show in the popup.
 */
const PopupMessage = ({ message }) => (
    <div className="popup">
        <span className="popup-message">{message}</span>
    </div>
);

/**
 * calculateAvailableDishesByDayAndType:
 *   Groups available dishes fetched from API by weekday name and dish type.
 *
 * @param {Date} currentDate         The date representing the start of the week.
 * @param {Array} availableDishes    Array of dish objects returned by the API.
 * @param {string[]} DAYS_OF_WEEK    ["Monday", "Tuesday", …, "Friday"].
 * @returns {Object}  Mapping from weekday → { [dishType]: [dishes] }.
 */
const calculateAvailableDishesByDayAndType = (currentDate, availableDishes, DAYS_OF_WEEK) => {
    const availableDishesByDayAndType = {};

    DAYS_OF_WEEK.forEach((day) => {
        availableDishesByDayAndType[day] = availableDishes
            .filter((dish) => {
                const dishDate = new Date(dish.date + 'T00:00:00Z');
                const options = { weekday: 'long', timeZone: 'UTC' };
                const dayName = dishDate.toLocaleDateString('en-US', options);
                return dayName === day;
            })
            .reduce((acc, dish) => {
                const type = dish.dish.dish_type;
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(dish);
                return acc;
            }, {});
    });

    return availableDishesByDayAndType;
};

/**
 * Booking: Main component that renders the weekly Lunch and allows saving attendance.
 *
 * - Fetches available dishes for each week.
 * - Tracks selected days (unsavedChanges) vs. persisted days (savedDays).
 * - Renders a 5-column top grid (empty, merged center, empty).
 * - Renders a grid of <Day> elements.
 */
export const Booking = () => {
    const [availableDishes, setAvailableDishes] = useState([]);
    const [currentDate, setCurrentDate] = useState(() => {
        // Initialize to today
        const date = new Date();
        return date;
    });
    const [unsavedChanges, setUnsavedChanges] = useState([]);
    const [savedDays, setSavedDays] = useState([]);
    const [changesSaved, setChangesSaved] = useState(false);

    // On mount: load savedDays from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedDays')) || [];
        setSavedDays(saved);
        setUnsavedChanges(saved.map((dateStr) => new Date(dateStr)));
    }, []);

    // Whenever currentDate changes, re-fetch available dishes and reload savedDays
    useEffect(() => {
        refreshAvailableDishes();

        const saved = JSON.parse(localStorage.getItem('savedDays')) || [];
        setSavedDays(saved);
        setUnsavedChanges(saved.map((dateStr) => new Date(dateStr)));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate]);

    /**
     * refreshAvailableDishes:
     *   Fetch available dishes for the week starting at currentDate.
     */
    const refreshAvailableDishes = () => {
        const selectedDate = currentDate.toISOString().split('T')[0];
        fetch(`${API_URL}${API_ENDPOINTS.DISHES_AVAILABLE_WEEK(selectedDate)}`, { cache: 'no-store' })
            .then((response) => response.json())
            .then((data) => setAvailableDishes(data.dishes))
            .catch((error) => console.error('Error fetching dishes:', error));
    };

    /**
     * handleDateChange:
     *   Shift currentDate by a given number of days (usually ±7 for week navigation).
     *
     * @param {number} days  Number of days to add (negative to go backwards).
     */
    const handleDateChange = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
    };

    /**
     * handleSave:
     *   Compare unsavedChanges vs. savedDays. Calls add/remove APIs accordingly.
     *   Persists new savedDays into localStorage.
     */
    const handleSave = () => {
        const selectedDates = unsavedChanges.map((d) => d.toISOString().split('T')[0]);
        const newDatesToAdd = selectedDates.filter((d) => !savedDays.includes(d));
        const datesToRemove = savedDays.filter((d) => !selectedDates.includes(d));

        if (!newDatesToAdd.length && !datesToRemove.length) {
            return;
        }

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

        // Hide popup after 3 seconds
        setTimeout(() => {
            setChangesSaved(false);
        }, 3000);
    };

    /**
     * addToAttendance:
     *   POST API call to add attendance for an array of date strings (YYYY-MM-DD).
     *
     * @param {string[]} dates
     */
    const addToAttendance = (dates) => {
        fetch(`${API_URL}${API_ENDPOINTS.ADD_ATTENDANCE}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dates),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to add attendance');
                }
                return response.json();
            })
            .then((data) => console.log('Attendance added successfully:', data))
            .catch((error) => console.error('Error adding attendance:', error));
    };

    /**
     * removeFromAttendance:
     *   DELETE API call to remove attendance for an array of date strings (YYYY-MM-DD).
     *
     * @param {string[]} dates
     */
    const removeFromAttendance = (dates) => {
        fetch(`${API_URL}${API_ENDPOINTS.REMOVE_ATTENDANCE}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dates),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to remove attendance');
                }
                return response.json();
            })
            .then((data) => console.log('Attendance removed successfully:', data))
            .catch((error) => console.error('Error removing attendance:', error));
    };

    /**
     * toggleDaySelection:
     *   Add or remove a date (YYYY-MM-DD) from unsavedChanges.
     *
     * @param {string} day  Date string in 'YYYY-MM-DD' format.
     */
    const toggleDaySelection = (day) => {
        const iso = new Date(day).toISOString().split('T')[0];
        setUnsavedChanges((prev) => {
            const exists = prev.some((d) => d.toISOString().split('T')[0] === iso);

            return exists
                ? prev.filter((d) => d.toISOString().split('T')[0] !== iso)
                : [...prev, new Date(day)];
        });
    };

    // Compute first (Monday) and last (Friday) day of the week based on currentDate
    const firstDayOfWeek = new Date(currentDate);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + DAYS_OF_WEEK.length - 1);

    // Determine if there’s at least one day on or after today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const hasActiveDays = lastDayOfWeek >= today;

    // Format week range as “DD MMM - DD MMM” (e.g., “01 Jun - 05 Jun”)
    const options = { day: '2-digit', month: 'short' };
    const weekRange = `${firstDayOfWeek.toLocaleDateString('en-GB', options)} - ${lastDayOfWeek.toLocaleDateString('en-GB', options)}`;

    // Group available dishes by weekday and type for rendering
    const availableDishesByDayAndType = calculateAvailableDishesByDayAndType(
        currentDate,
        availableDishes,
        DAYS_OF_WEEK
    );

    const popup = changesSaved ? <PopupMessage message="Attendance Saved" /> : null;

    return (
        <div>
            {/* Top Grid: 5 Columns (empty, merged center, empty) */}
            <div className="topGrid">
                <div className="col-center">
                    <h3 className="title">Lunch</h3>

                    <div className="navigation">
                        <button
                            onClick={() => handleDateChange(-7)}
                            className="arrow-button navigationButton"
                        >
                            &lt; Previous Week
                        </button>

                        <label className="weekLabel">{weekRange}</label>

                        <button
                            onClick={() => handleDateChange(7)}
                            className="arrow-button navigationButton"
                        >
                            Next Week &gt;
                        </button>
                    </div>

                    

                    <div className="saveContainer">
                        {hasActiveDays && (
                            <>
                                <button onClick={handleSave} className="save-button">
                                    Save Attendance*
                                </button>
                                {popup}
                            </>
                        )}
                    </div>
                </div>

                <div className="col-empty" >
                    <div className="reminderContainer">
                        <p className="reminderTextSmall">
                            *Saving attendance is purely for statistical purposes and will <b>never result in any charge</b>.
                        </p>
                        <p className="reminderTextSmall">
                            **Rating is only available on days with saved attendance.
                        </p>
                    </div> 
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="gridContainer">
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
                            isSelected={unsavedChanges.some((selectedDay) =>
                                selectedDay.toISOString().split('T')[0] ===
                                dayDate.toISOString().split('T')[0]
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
