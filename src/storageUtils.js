// src/storageUtils.js

/**
 * Utility functions for localStorage access, to centralize and safely handle storage.
 */

export function getSavedDays() {
    try {
        const data = localStorage.getItem('savedDays');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading savedDays from localStorage:', e);
        return [];
    }
}

export function setSavedDays(daysArray) {
    try {
        localStorage.setItem('savedDays', JSON.stringify(daysArray));
    } catch (e) {
        console.error('Error writing savedDays to localStorage:', e);
    }
}
