// File: src/utils/constants.js
// Centralized application constants (API URL, endpoints, colors, days, etc.)


// 1) API base URL
export const API_URL = "http://127.0.0.1:8000";
// export const API_URL = "/api";


// 2) Locking logic for the Chef (e.g. days ahead)
export const LOCKED_DAYS_AHEAD = 0;


// 3) Days of week
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


// 4) API endpoint helpers (if you want to use them)
export const API_ENDPOINTS = {
  DISHES_AVAILABLE_WEEK: (date) => `/booking/week?date=${date}`,
  ADD_ATTENDANCE: '/booking/add-attendance/',
  REMOVE_ATTENDANCE: '/booking/remove-attendance/', 
  RATE: '/booking/rate/',
  CHEF_DAY_DISHES: (date) => `/chef-management/day-dishes/${date}/`,
  CHEF_CREATE_DISH: '/chef-management/create/',
  CHEF_DELETE_DISH: '/chef-management/delete-dish-from-date/',
  SEARCH_DISHES: '/chef-management/search-dishes/?',
};

// 5) Color palette for days
export const SATURATED_COLORS = {
    Monday: '#2F0FAF',    // Dark Blue
    Tuesday: '#940A59',   // Dark Magenta
    Wednesday: '#E41057', // Vivid Red-Pink
    Thursday: '#EC5E17',  // Bright Orange
    Friday: '#FFBD00',    // Vibrant Yellow
};
export const DESATURATED_COLORS = {
    Monday: '#BBA6D6',    // Desaturated Deep Purple
    Tuesday: '#D5A5BB',   // Desaturated Magenta
    Wednesday: '#FFB3C1', // Light Pink
    Thursday: '#FFC2A6',  // Light Orange
    Friday: '#FFE7A8',    // Pale Yellow
};




// 6) Color palette for course types
// export const COURSE_COLORS = {
//   'Main Course': 'hsl(44, 100%, 67%)',    // Pastel yellow
//   Dessert: 'hsl(315, 67%, 42%)',          // Tomato
//   Soup: 'hsl(13, 75%, 56%)',              // Sky blue
//   Side: 'hsl(166, 79%, 40%)',             // Pale green
//   Water: 'hsl(211, 67%, 57%)',            // Hot pink
// };