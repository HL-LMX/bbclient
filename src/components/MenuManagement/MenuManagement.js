// File: src/components/MenuManagement/MenuManagement.js
// Displays daily menu management: navigation + attendees + per-category CourseComponent.
// We replicate the exact “look” of the buttons and date label from the original,
// and ensure that fetchDishes runs whenever selectedDate changes (so the UI updates).

import { API_URL, API_ENDPOINTS, DAYS_OF_WEEK, CHEF_LOCKED_DAYS_AHEAD, DEFAULT_MENU_MANAGEMENT_LOAD_DATE } from '../../utils/constants';
import React, { useState, useEffect } from 'react';
import MuiCalendar from './MuiCalendar';
import CourseComponent from './CourseComponent';
import './MenuManagement.css';

/**
 * MenuManagement: Allows chefs/admins to manage dishes for each day.
 * Features:
 *   - Daily navigation (Previous/Next Day).
 *   - Displays attendees count.
 *   - Shows a mini‐calendar and per‐category CourseComponents.
 *
 * @returns {JSX.Element}
 */
export const MenuManagement = () => {
  // 1) Compute next Monday as initial “currentDate”
  const [currentDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + DEFAULT_MENU_MANAGEMENT_LOAD_DATE);
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  });

  // 2) Track the user‐selectable date (defaults to next Monday)
  const [selectedDate, setSelectedDate] = useState(() => new Date(currentDate));
  const [dishes, setDishes] = useState([]);
  const [attendees, setAttendees] = useState(0);

  
  // 4) Whenever selectedDate changes, fetch that day’s dishes + attendance
  useEffect(() => {
    fetchDishes(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  /**
   * fetchDishes: Retrieve dishes + attendance for a given date.
   *
   * @param {Date} date 
   */
  const fetchDishes = async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const endpoint = `${API_URL}${API_ENDPOINTS.CHEF_DAY_DISHES(formattedDate)}`;

    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      updateDishes(data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  /**
   * updateDishes: Populate local state with fetched dishes & attendance.
   *
   * @param {Object} data  { dishes: Array<...>, attendance: number|null }
   */
  const updateDishes = (data) => {
    const { dishes, attendance } = data;
    // Ensure each dish has a quantity field (fallback to 0)
    setDishes(
      dishes.map((dish) => ({
        ...dish,
        quantity: dish.quantity || 0,
      }))
    );
    setAttendees(attendance ?? 0);
  };

  /**
   * handleSave: Called by CourseComponent when a new dish is added.
   * After saving, re‐fetch for the same selectedDate to update UI immediately.
   */
  const handleSave = async (category, payloadData) => {
    const endpoint = `${API_URL}${API_ENDPOINTS.CHEF_CREATE_DISH}`;
    const formattedDate = selectedDate.toISOString().split('T')[0];

    let payload;
    if (payloadData.existing_dish_id) {
      payload = {
        existing_dish_id: payloadData.existing_dish_id,
        dates: [formattedDate],
      };
    } else if (payloadData.dish) {
      payload = {
        dish: {
          ...payloadData.dish,
          dish_type: category,
        },
        dates: [formattedDate],
      };
    } else {
      console.error('Unexpected payload in handleSave:', payloadData);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        console.error('Server error:', err);
        throw new Error(`HTTP ${response.status}`);
      }
      // After saving successfully, reload the list
      await fetchDishes(selectedDate);
    } catch (e) {
      console.error('Error in handleSave:', e);
    }
  };

  /**
   * handleDelete: Called by DishDisplayComponent when the user deletes a dish.
   * After deletion, re‐fetch the same selectedDate to update UI immediately.
   *
   * @param {number} dateHasDishId 
   */
  const handleDelete = async (dateHasDishId) => {
    const endpoint = `${API_URL}${API_ENDPOINTS.CHEF_DELETE_DISH}`;
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date_has_dish_ids: [dateHasDishId] }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error response from server:', errorResponse);
        throw new Error(`HTTP ${response.status}`);
      }
      await fetchDishes(selectedDate);
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  /**
   * handleDateChange: Shift selectedDate forward/backward by `days` (±1).
   * Skips weekends and only lands on Monday–Friday.
   *
   * @param {number} days  Positive (next) or negative (previous).
   */
  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);

    // Skip until the newDate falls on one of Monday–Friday
    while (!DAYS_OF_WEEK.includes(getDayName(newDate))) {
      newDate.setDate(newDate.getDate() + (days > 0 ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  /**
   * handleCalendarChange: Called by the embedded mini‐calendar (MuiCalendar).
   * We set selectedDate and immediately fetchDishes for it.
   *
   * @param {Date} newValue 
   */
  const handleCalendarChange = (newValue) => {
    setSelectedDate(newValue);
    // fetchDishes is also triggered by useEffect, but we can call it immediately if desired
    fetchDishes(newValue);
  };

  /**
   * getDayName: Helper to extract weekday (e.g., “Monday”) from a Date.
   *
   * @param {Date} date 
   * @returns {string} Weekday name
   */
  const getDayName = (date) => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[date.getDay()];
  };

  // Build a map of category → dishes
  const categories = {
    Soup: [],
    'Main Course': [],
    Side: [],
    Dessert: [],
    Water: [],
  };
  dishes.forEach((dish) => {
    const cat = dish.dish.dish_type || 'Other';
    if (categories[cat]) {
      categories[cat].push(dish);
    }
  });

  // Determine if selectedDate is “past” (CHEF_LOCKED_DAYS_AHEAD)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const modificationDueDate = new Date();
  modificationDueDate.setDate(today.getDate() + CHEF_LOCKED_DAYS_AHEAD);
  const isPastDate = selectedDate < modificationDueDate;

  // Format the “Weekday MMM DD” label exactly as before
  const formattedLabel = `${selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
  })} ${selectedDate.toLocaleDateString('en-US', {
    month: 'short',
  })} ${selectedDate.getDate()}`;

  return (
    <div>
      {/* 1) Title (same as before) */}
      <h3
        className="text-center"
        style={{ fontSize: '32px', margin: '1rem 0' }}
      >
        Menu Management
      </h3>

      {/* 2) Navigation Buttons + Date Label (same wrapper/inline‐styles as original) */}
      <div
        className="d-flex justify-content-center mb-3"
        style={{ padding: '2rem 0' }}
      >
        <button
          className="btn btn-light mm-btn"
          onClick={() => handleDateChange(-1)}
        >
          Previous Day
        </button>

        <span
          className="mx-3"
          style={{
            fontSize: '24px',
            margin: '1rem auto',
            width: '200px',
            display: 'inline-block',
            textAlign: 'center',
          }}
        >
          {formattedLabel}
        </span>

        <button
          className="btn btn-light mm-btn"
          onClick={() => handleDateChange(1)}
        >
          Next Day
        </button>
      </div>

      {/* 3) Attendees Count (inline style for font size as original) */}
      <div className="text-center mb-3" style={{ fontSize: '24px' }}>
        <div>Attendees: {attendees}</div>
      </div>

      {/* 4) Main Grid: Calendar + per-category CourseComponents */}
      <div className="menu-sections">
        {/* 4a) Mini‐Calendar */}
        <div className="bg-secondary text-light rounded p-3">
          <h4 className="text-center">Calendar</h4>
          <MuiCalendar
            currentDate={selectedDate}
            onChange={handleCalendarChange}
          />
        </div>

        {/* 4b) One CourseComponent per category */}
        {Object.keys(categories).map((category) => (
          <CourseComponent
            key={category}
            category={category}
            title={category}
            dishes={categories[category]}
            onSave={handleSave}
            onDelete={handleDelete}
            isPastDate={isPastDate}
          />
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;