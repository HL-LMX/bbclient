// File: bbclient/src/components/Booking/Day.js

import React from 'react';
import Dish from './Dish';
import './Day.css';

const Day = ({
    date,
    dayName,
    availableDishesByType,
    isSelected,
    isPastDate,
    onClick
}) => {
    const baseClass = 'day-card';
    const timeClass = isPastDate ? 'past' : 'future';
    const selectClass = isSelected ? 'selected' : '';
    const dayClass = dayName.toLowerCase();

    const classNames = `${baseClass} ${timeClass} ${dayClass} ${selectClass}`.trim();

    const handleDayClick = () => {
        if (!isPastDate) {
            onClick(date.toISOString().split('T')[0]);
        }
    };

    const typeOrder = ['Soup', 'Main Course', 'Side', 'Dessert', 'Water'];

    return (
        <div className={classNames} onClick={handleDayClick}>
            <div className="day-header">
                <h4 className="day-name">
                    {dayName} {date.getDate()}
                </h4>
            </div>

            {typeOrder.map(type => (
                availableDishesByType[type] && availableDishesByType[type].length > 0 && (
                    <div key={`${dayName}-${type}`} className="dish-type-block">
                        <h5 className="dish-type-title">{type}</h5>

                        <div className="dish-type-grid">
                            <div className="spacer"></div>
                            <div className="calories-label">Calories</div>
                        </div>

                        {availableDishesByType[type].map(dish => (
                            <Dish
                                key={dish.dish.dish_id}
                                dish={dish}
                                isSelected={isSelected}
                            />
                        ))}
                    </div>
                )
            ))}
        </div>
    );
};

export default Day;