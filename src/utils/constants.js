// src/constants.js

/**
 * Application-wide constants (colors, day names, API endpoints, etc.).
 * Centralize all magic values here for easy management and updates.
 */

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const DAY_COLORS = {
    Monday: 'hsl(345, 60%, 40%)',    // Pink
    Tuesday: 'hsl(45, 60%, 50%)',    // Yellow
    Wednesday: 'hsl(145, 60%, 40%)', // Green
    Thursday: 'hsl(185, 70%,40%)',   // Cyan
    Friday: 'hsl(285, 40%, 40%)',    // Purple
};

export const COURSE_COLORS = {
    'Main Course': 'hsl(44, 100%, 67%)',    // Pastel yellow
    Dessert: 'hsl(315, 67%, 42%)',          // Tomato
    Soup: 'hsl(13, 75%, 56%)',              // Sky blue
    Side: 'hsl(166, 79%, 40%)',             // Pale green
    Water: 'hsl(211, 67%, 57%)',            // Hot pink
};

export const API_ENDPOINTS = {
    BOOKING_WEEK: (date) => `/api/booking/week?date=${date}`,
    ADD_ATTENDANCE: '/api/booking/add-attendance/',
    REMOVE_ATTENDANCE: '/api/booking/remove-attendance/',
    CHEF_DAY_DISHES: (date) => `/api/chef-management/day-dishes/${date}/`,
    CHEF_CREATE_DISH: '/api/chef-management/create/',
    CHEF_DELETE_DISH: '/api/chef-management/delete-dish-from-date/',
};

// Days ahead for lock logic
export const LOCKED_DAYS_AHEAD = -1;
