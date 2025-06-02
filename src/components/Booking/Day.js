import React from 'react';
import Dish from './Dish';
import { SATURATED_COLORS, DESATURATED_COLORS } from '../../utils/constants';

/**
 * Day: Renders a single day's card in the booking grid.
 * Shows dishes by type, color codes days, and handles selection.
 */
const Day = ({
    date,
    dayName,
    availableDishesByType,
    isSelected,
    isPastDate,
    onClick
}) => {



    let titleColor = '';
    let backgroundColor = '';
    
    if (isSelected && !isPastDate) {
        // Selected Future day
        titleColor = 'white';
        backgroundColor = SATURATED_COLORS[dayName];
    } else if (isSelected && isPastDate) {
        // Selected past day
        titleColor = 'grey';
        backgroundColor = DESATURATED_COLORS[dayName];
    } else if (isPastDate) {
        // Past day
        titleColor = 'grey';
        backgroundColor = "lightgrey";
    } else {
        // Future day
        titleColor = 'black';
        backgroundColor = DESATURATED_COLORS[dayName] || '#FFFFFF';
    }

    // Order of dish types
    const typeOrder = ['Soup', 'Main Course', 'Side', 'Dessert', 'Water'];

    const handleDayClick = () => {
        if (!isPastDate) {
            onClick(date.toISOString().split('T')[0]);
        }
    };


      // set text color grey for past dates, black otherwise
    const textColor = isPastDate ? 'grey' : 'black';



    return (
        <div
            style={{
                backgroundColor,
                padding: '1em',
                borderRadius: '0.5em',
                marginBottom: '1em',
                cursor: isPastDate ? 'default' : 'pointer'
            }}
            onClick={handleDayClick}
        >
            <h4 style={{ textAlign: 'center', color: titleColor }}>
                {dayName} {date.getDate()}
            </h4>
            {typeOrder.map(type => (
                availableDishesByType[type] && availableDishesByType[type].length > 0 && (
                    <div
                        key={`${dayName}-${type}`}
                        style={{
                            marginBottom: '1em',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            padding: '1em',
                            borderRadius: '0.5em',
                            boxShadow: '.2rem  .4rem 10px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        <h5 style={{ color: textColor, margin: '0.5rem 0' }}>{type}</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                            <div style={{ gridColumn: 'span 5', color: textColor, fontWeight: 'bold' }}></div>
                            <div style={{ color: textColor, fontWeight: 'bold', fontSize: '.8rem' }}>Calories</div>
                        </div>
                        {availableDishesByType[type].map(dish => (
                            <Dish key={dish.dish.dish_id} dish={dish} isSelected={isSelected} />
                        ))}
                    </div>
                )
            ))}
        </div>
    );
};

export default Day;
