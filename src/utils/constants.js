// File: src/utils/constants.js
// Centralized application constants (API URL, endpoints, colors, days, etc.)


// 1) API base URL
export const API_URL = process.env.REACT_APP_API_URL;


// 2) Number of aditional days to lock the Menu Management (default value is "today is locked, plus/minus the days declared below")
export const CHEF_LOCKED_DAYS_AHEAD = 0;


// 3) Days of week
export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


// 4) API endpoint helpers (if you want to use them)
export const API_ENDPOINTS = {
  DISHES_AVAILABLE_WEEK: (date) => `booking/week?date=${date}`,
  ADD_ATTENDANCE: 'booking/add-attendance/',
  REMOVE_ATTENDANCE: 'booking/remove-attendance/', 
  RATE: 'booking/rate/',
  CHEF_DAY_DISHES: (date) => `chef-management/day-dishes/${date}/`,
  CHEF_CREATE_DISH: 'chef-management/create/',
  CHEF_DELETE_DISH: 'chef-management/delete-dish-from-date/',
  SEARCH_DISHES: 'chef-management/search-dishes/?',
};


// 5) Default number of days to offset for menu management
export const DEFAULT_MENU_MANAGEMENT_LOAD_DATE = 0;