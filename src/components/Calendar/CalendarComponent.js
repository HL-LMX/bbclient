// File: src/components/CalendarComponent.js
// Simple month‐view calendar for date selection. All fixed cell sizes moved to CSS.

import React, { useState } from 'react';
import './CalendarComponent.css';

/**
 * CalendarComponent: Renders a month‐view calendar with clickable days.
 *
 * @param {Date}    currentDate  Currently selected date.
 * @param {function} onChange    Callback invoked with a new Date when user clicks a cell.
 */
const CalendarComponent = ({ currentDate, onChange }) => {
    const [currentMonth, setCurrentMonth] = useState(currentDate || new Date());

    const monthOptions = { month: 'long' };
    const yearOptions = { year: 'numeric' };

    const renderHeader = () => (
        <div className="header">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <h2>
                {currentMonth.toLocaleDateString(undefined, monthOptions)}{' '}
                {currentMonth.toLocaleDateString(undefined, yearOptions)}
            </h2>
            <button onClick={() => changeMonth(1)}>&gt;</button>
        </div>
    );

    const renderDays = () => {
        const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return weekdays.map(day => (
            <div key={day} className="day">
                {day}
            </div>
        ));
    };

    const renderCells = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        const endDate = new Date(monthEnd);
        const cells = [];

        // Blank cells for days before month starts
        const startDayOfWeek = startDate.getDay();
        for (let i = 0; i < startDayOfWeek; i++) {
            cells.push(
                <div
                    key={`blank-${i}`}
                    className="cell blank-cell"
                />
            );
        }

        // Helper to compare without time
        const isSameDay = (date1, date2) => (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );

        // Render each day cell
        while (startDate <= endDate) {
            const isToday = isSameDay(startDate, new Date());
            const isSelected = isSameDay(startDate, currentDate);

            cells.push(
                <div
                    key={startDate.toISOString()}
                    className={`cell${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
                    onClick={() => handleCellClick(new Date(startDate))}
                >
                    {startDate.getDate()}
                </div>
            );
            startDate.setDate(startDate.getDate() + 1);
        }
        return cells;
    };

    const handleCellClick = (selectedDate) => {
        if (onChange) {
            onChange(selectedDate);
        }
    };

    const changeMonth = (delta) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentMonth(newDate);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        if (onChange) {
            onChange(today);
        }
    };

    return (
        <div>
            {renderHeader()}

            <div className="calendar-grid">
                {renderDays()}
                {renderCells()}
            </div>

            <button className="btn btn-primary" onClick={goToToday}>
                Today
            </button>
        </div>
    );
};

export default CalendarComponent;
