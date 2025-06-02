// src/MenuManagement.js

import React, { useState, useEffect } from 'react';
import { variables } from '../../utils/Variables';
import MuiCalendar from './MuiCalendar';
import CourseComponent from './CourseComponent';
import './MenuManagement.css';

/**
 * MenuManagement: Allows chefs/admins to manage dishes for each day.
 * Features daily navigation, viewing/adding/removing dishes by category.
 */
export const MenuManagement = () => {
    const [currentDate, setCurrentDate] = useState(() => {
        // Set initial date to next week's Monday
        const d = new Date();
        d.setDate(d.getDate() + 7);
        while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
        return d;
    });
    const [selectedDate, setSelectedDate] = useState(() => new Date(currentDate));
    const [dishes, setDishes] = useState([]);
    const [attendees, setAttendees] = useState(0);
    const allowedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const lockedDaysAhead = 1; // Days locked from today (no editing past days)

    useEffect(() => {
        fetchDishes(selectedDate);
        // eslint-disable-next-line
    }, [selectedDate]);

    const fetchDishes = async (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        const apiUrl = variables.API_URL + `chef-management/day-dishes/${formattedDate}/`;

        try {
            const response = await fetch(apiUrl, { cache: "no-store" });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            updateDishes(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updateDishes = (data) => {
        const { dishes, attendance } = data;
        setDishes(
            dishes.map(dish => ({
                ...dish,
                quantity: dish.quantity || 0,
            }))
        );
        setAttendees(attendance !== null && attendance !== undefined ? attendance : 0);
    };


    const handleSave = async (category, data) => {
        // 1. build the endpoint URL
        const apiUrl = variables.API_URL + 'chef-management/create/';
        // 2. grab the current date from state (no "this.state")
        const formattedDate = selectedDate.toISOString().split('T')[0];

        let payload;
        if (data.existing_dish_id) {
            // Case A: re‐use an existing Dish
            payload = {
            existing_dish_id: data.existing_dish_id,
            dates: [formattedDate]
            };
        }
        else if (data.dish) {
            // Case B: create a brand‐new Dish (inject the category)
            payload = {
            dish: {
                ...data.dish,
                dish_type: category
            },
            dates: [formattedDate]
            };
        }
        else {
            console.error('Unexpected payload in handleSave:', data);
            return;
        }
        console.log('Payload to backend:', payload);


        try {
            const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
            });
            if (!response.ok) {
            const err = await response.json();
            console.error('Server error:', err);
            throw new Error(`HTTP ${response.status}`);
            }
            // 3. once it’s saved, refresh the list using the hook version
            await fetchDishes(selectedDate);
        }
        catch (e) {
            console.error('Error in handleSave:', e);
        }
    };



    const handleDateChange = async (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        while (!allowedDays.includes(getDayName(newDate))) {
            newDate.setDate(newDate.getDate() + (days > 0 ? 1 : -1));
        }
        setSelectedDate(newDate);
    };

    const handleCalendarChange = (newValue) => {
        setSelectedDate(newValue);
        fetchDishes(newValue);
    };

    const getDayName = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    };

    const handleDelete = async (dateHasDishId) => {
        const apiUrl = variables.API_URL + 'chef-management/delete-dish-from-date/';
        try {
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date_has_dish_ids: [dateHasDishId] }),
            });
            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error response from server:', errorResponse);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            await fetchDishes(selectedDate);
        } catch (error) {
            console.error('Error deleting dish:', error);
        }
    };

    // Prepare dishes by category
    const categories = {
        Soup: [],
        'Main Course': [],
        Side: [],
        Dessert: [],
        Water: [],
    };
    dishes.forEach(dish => {
        const category = dish.dish.dish_type || 'Other';
        if (categories[category]) categories[category].push(dish);
    });

    const modificationDueDate = new Date();
    modificationDueDate.setDate(modificationDueDate.getDate() + lockedDaysAhead);
    const isPastDate = selectedDate < modificationDueDate;



    return (
        <div>
            <h3 className="text-center" style={{ fontSize: '32px', margin: '1rem 0' }}>Menu Management</h3>
            <div className="d-flex justify-content-center mb-3" style={{ padding: '2rem 0' }}>
                <button className="btn btn-light mm-btn" onClick={() => handleDateChange(-1)}>
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
                    {`${selectedDate.toLocaleDateString('en-US', { weekday: 'long' })} ${selectedDate.toLocaleDateString('en-US', { month: 'short' })} ${selectedDate.getDate()}`}
                </span>
                <button className="btn btn-light mm-btn" onClick={() => handleDateChange(1)}>
                    Next Day
                </button>
            </div>

            <div className="text-center mb-3" style={{ fontSize: '24px' }}>
				<div>Attendees: {attendees}</div>
			</div>
            
            <div className="menu-sections">

                <div className="bg-secondary text-light rounded p-3">

                    <h4 className="text-center">Calendar</h4>
                    <MuiCalendar currentDate={selectedDate} onChange={handleCalendarChange} />
                    
                </div>

                {Object.keys(categories).map(category => (
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