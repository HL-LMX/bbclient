// src/components/CalendarComponent.js

import React, { useState } from 'react';
import './CalendarComponent.css';

/**
 * CalendarComponent: Simple month-view calendar for date selection.
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

        const startDayOfWeek = startDate.getDay();
        for (let i = 0; i < startDayOfWeek; i++) {
            cells.push(<div key={`blank-${i}`} className="cell blank-cell"></div>);
        }

        const cellSize = '2em';
        while (startDate <= endDate) {
            const isToday = isSameDay(startDate, new Date());
            const isSelected = isSameDay(startDate, currentDate);
            cells.push(
                <div
                    key={startDate.toISOString()}
                    className={`cell${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
                    style={{ height: cellSize, width: cellSize }}
                    onClick={() => handleCellClick(new Date(startDate))}
                >
                    {startDate.getDate()}
                </div>
            );
            startDate.setDate(startDate.getDate() + 1);
        }
        return cells;
    };

    const isSameDay = (date1, date2) => (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );

    const handleCellClick = (selectedDate) => {
        onChange && onChange(selectedDate);
    };

    const changeMonth = (delta) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentMonth(newDate);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        onChange && onChange(today);
    };

    return (
        <div>
            {renderHeader()}
            <div className="calendar-grid">
                {renderDays()}
                {renderCells()}
            </div>
            <button className="btn btn-primary" onClick={goToToday}>Today</button>
        </div>
    );
};

export default CalendarComponent;