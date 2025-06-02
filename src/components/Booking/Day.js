import React from 'react';
import Dish from './Dish';

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
    const saturatedColors = {
        Monday: '#2F0FAF',    // Dark Blue
        Tuesday: '#940A59',   // Dark Magenta
        Wednesday: '#E41057', // Vivid Red-Pink
        Thursday: '#EC5E17',  // Bright Orange
        Friday: '#FFBD00',    // Vibrant Yellow
    };
    const desaturatedColors = {
        Monday: '#BBA6D6',    // Desaturated Deep Purple
        Tuesday: '#D5A5BB',   // Desaturated Magenta
        Wednesday: '#FFB3C1', // Light Pink
        Thursday: '#FFC2A6',  // Light Orange
        Friday: '#FFE7A8',    // Pale Yellow
    };


    let titleColor = '';
    let backgroundColor = '';
    
    if (isSelected && !isPastDate) {
        // Selected Future day
        titleColor = 'white';
        backgroundColor = saturatedColors[dayName];
    } else if (isSelected && isPastDate) {
        // Selected past day
        titleColor = 'grey';
        backgroundColor = desaturatedColors[dayName];
    } else if (isPastDate) {
        // Past day
        titleColor = 'grey';
        backgroundColor = "lightgrey";
    } else {
        // Future day
        titleColor = 'black';
        backgroundColor = desaturatedColors[dayName] || '#FFFFFF';
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
