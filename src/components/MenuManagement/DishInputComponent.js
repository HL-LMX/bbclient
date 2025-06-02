// src/components/DishInputComponent.js

import React, { useState, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce'; // (or your own debounce)
import { variables } from '../../Variables';

// Props: { onSave: (payload) => void, isPastDate }
const DishInputComponent = ({ onSave, isPastDate, category }) => {

    const [dishName, setDishName] = useState('');
    const [calories, setCalories] = useState(0);
    const [isHealthy, setIsHealthy] = useState(false);
    const [isSugarFree, setIsSugarFree] = useState(false);

    // NEW state:
    const [suggestions, setSuggestions] = useState([]); 
    // holds array of { dish_id, dish_name, dish_calories, light_healthy, sugar_free, dish_type }
    const [selectedDishId, setSelectedDishId] = useState(null);
    const [fieldsEditedAfterSelect, setFieldsEditedAfterSelect] = useState(false);

    const dishNameInputRef = useRef(null);

    // 4.1 Debounced fetch function
    const fetchSuggestions = debounce(async (query) => {
        if (!query) {
        setSuggestions([]);
        return;
        }
        try {
            // Append both q=<query> and category=<category> to the URL:
            const url =
                `${variables.API_URL}chef-management/search-dishes/?` +
                `q=${encodeURIComponent(query)}` +
                (category ? `&category=${encodeURIComponent(category)}` : '');

            const response = await fetch(url);
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            setSuggestions(data.results || []);
        } catch (err) {
            console.error('Error fetching suggestions:', err);
        }
        }, 300);// 300ms debounce

    // 4.2 Trigger fetch when dishName changes
    useEffect(() => {
    // If a suggestion is currently selected and the user hasn’t edited any fields yet,
    // don’t re-fetch. That ensures the dropdown stays closed immediately after click.
    if (selectedDishId && !fieldsEditedAfterSelect) {
      return;
    }

    fetchSuggestions(dishName);
    // If user types (dishName changes) after having selected a suggestion, mark as “edited”
    if (selectedDishId) {
      setFieldsEditedAfterSelect(true);
    }
    }, [dishName]);

    // 4.3 Handlers for field changes
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        // If user changes any field (calories / checkboxes) after selecting, mark as edited
        if (selectedDishId) {
        setFieldsEditedAfterSelect(true);
        }
    };

    const handleCheckboxChange = (setter) => (e) => {
        setter(e.target.checked);
        if (selectedDishId) {
        setFieldsEditedAfterSelect(true);
        }
    };

    // 4.4 When a suggestion is clicked:
    const handleSuggestionClick = (suggestion) => {
        setDishName(suggestion.dish_name);
        setCalories(suggestion.dish_calories || 0);
        setIsHealthy(!!suggestion.light_healthy);
        setIsSugarFree(!!suggestion.sugar_free);
        setSelectedDishId(suggestion.dish_id);
        setFieldsEditedAfterSelect(false);
        setSuggestions([]); // hide dropdown
    };

    // 4.5 On “Save”:
    const handleSaveClick = async (e) => {
        e.preventDefault();

        // A) If user picked an existing dish AND didn’t edit any field thereafter
        if (selectedDishId && !fieldsEditedAfterSelect) {

            console.log('Re‐using existing dish ID:', selectedDishId);
            onSave({
                existing_dish_id: selectedDishId,
                // dates will be appended by parent (MenuManagement) automatically if needed, 
                // or the parent’s handleSave can wrap this payload accordingly.
            });
        }
        // B) Otherwise, create a brand-new dish
        else {
            onSave({
                dish: {
                dish_name: dishName,
                dish_description: '',    // you can default or allow user to fill a description later
                dish_type: '',           // parent knows category; parent’s handleSave should inject `dish_type`
                dish_calories: parseInt(calories, 10) || 0,
                light_healthy: isHealthy,
                sugar_free: isSugarFree,
                },
                // parent’s handleSave will add: dates: [selectedDate]
            });
        }

        // Reset all states
        setDishName('');
        setCalories(0);
        setIsHealthy(false);
        setIsSugarFree(false);
        setSelectedDishId(null);
        setFieldsEditedAfterSelect(false);
        setSuggestions([]);
        dishNameInputRef.current.focus();
    };

        return (
            <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            margin: '4rem 0 1rem',
            gap: '0.8em'
            }}>
                <div style={{ position: 'relative', gridColumn: 'span 6' }}>
                    <input
                    type="text"
                    placeholder="Dish Name"
                    value={dishName}
                    onChange={handleInputChange(setDishName)}
                    style={{
                        width: '100%',
                        padding: '3px 8px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: 'Arial, sans-serif',
                    }}
                    ref={dishNameInputRef}
                    />
                    {/* Dropdown of suggestions */}
                    {!isPastDate && suggestions.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        color: 'grey',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        background: 'white',
                        border: '1px solid #ccc',
                        zIndex: 1000,
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}>
                        {suggestions.map((sug) => (
                        <li
                            key={sug.dish_id}
                            onClick={() => handleSuggestionClick(sug)}
                            style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto auto auto',
                            alignItems: 'center',
                            padding: '8px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #eee',
                            }}
                        >
                            {/* 1. Dish name + calories */}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>{sug.dish_name}</span>
                            {sug.dish_calories != null && (
                                <span style={{ marginLeft: '8px', fontSize: '0.9em', color: '#666' }}>
                                ({sug.dish_calories} cal)
                                </span>
                            )}
                            </div>

                            {/* 2. “Light & Healthy” checkbox (disabled) */}
                            <div style={{ textAlign: 'center' }}>
                            <input
                                type="checkbox"
                                checked={sug.light_healthy}
                                disabled
                                style={{ pointerEvents: 'none' }}
                            />
                            </div>

                            {/* 3. “Sugar-Free” checkbox (disabled) */}
                            <div style={{ textAlign: 'center', margin: '0 8px' }}>
                            <input
                                type="checkbox"
                                checked={sug.sugar_free}
                                disabled
                                style={{ pointerEvents: 'none' }}
                            />
                            </div>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>

                <input
                    type="number"
                    placeholder="Calories"
                    value={calories}
                    onChange={handleInputChange(setCalories)}
                    style={{
                    gridColumn: 'span 2',
                    padding: '3px 8px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                    width: '100%',
                    textAlign: 'right',
                    }}
                />
                <input
                    type="checkbox"
                    checked={isHealthy}
                    onChange={handleCheckboxChange(setIsHealthy)}
                    style={{
                    gridColumn: 'span 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    textAlign: 'center',
                    paddingTop: '6px',
                    }}
                />
                <input
                    type="checkbox"
                    checked={isSugarFree}
                    onChange={handleCheckboxChange(setIsSugarFree)}
                    style={{
                    gridColumn: 'span 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    textAlign: 'center',
                    paddingTop: '6px',
                    }}
                />

                {!isPastDate && (
                    <button
                    type="button"
                    onClick={handleSaveClick}
                    style={{
                        gridColumn: 'span 10',
                        backgroundColor: '#21B211',
                        color: 'white',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        margin: '20px auto',
                        alignSelf: 'center',
                        padding: '.7rem 3rem',
                    }}
                    >
                    Save
                    </button>
                )}
            </div>
        ); 
    };

    export default DishInputComponent;
