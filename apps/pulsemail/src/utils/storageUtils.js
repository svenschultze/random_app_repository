/**
 * Storage utility functions for persisting application data
 */

// Storage keys
export const STORAGE_KEYS = {
  INBOX_EMAILS: 'pulsemail:inbox-emails',
  SENT_EMAILS: 'pulsemail:sent-emails',
  APP_STATE: 'pulsemail:app-state',
  INITIALIZED: 'pulsemail:initialized'
};

/**
 * Save data to local storage
 * @param {string} key - Storage key
 * @param {any} data - Data to save (will be JSON stringified)
 */
export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load data from local storage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} Parsed data or default value
 */
export function loadFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Clear data for a specific key from storage
 * @param {string} key - Storage key to clear
 */
export function clearStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Check if app has been initialized before
 * @returns {boolean} True if app has been initialized
 */
export function isAppInitialized() {
  return !!loadFromStorage(STORAGE_KEYS.INITIALIZED, false);
}

/**
 * Mark app as initialized
 */
export function markAppAsInitialized() {
  saveToStorage(STORAGE_KEYS.INITIALIZED, true);
}