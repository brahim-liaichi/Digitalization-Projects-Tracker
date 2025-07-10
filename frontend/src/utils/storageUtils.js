/**
 * Get an item from localStorage with type conversion
 * @param {string} key - The key to get
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} The stored value or defaultValue
 */
export const getLocalStorageItem = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // Try to parse as JSON, but fall back to original value if it fails
      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return defaultValue;
    }
  };
  
  /**
   * Set an item in localStorage with automatic JSON conversion
   * @param {string} key - The key to set
   * @param {*} value - The value to store
   * @returns {boolean} Success status
   */
  export const setLocalStorageItem = (key, value) => {
    try {
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
      localStorage.setItem(key, valueToStore);
      return true;
    } catch (error) {
      console.error('Error storing in localStorage:', error);
      return false;
    }
  };
  
  /**
   * Remove an item from localStorage
   * @param {string} key - The key to remove
   * @returns {boolean} Success status
   */
  export const removeLocalStorageItem = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  };
  
  /**
   * Clear all items from localStorage
   * @returns {boolean} Success status
   */
  export const clearLocalStorage = () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  };
  
  /**
   * Get an item from sessionStorage with type conversion
   * @param {string} key - The key to get
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} The stored value or defaultValue
   */
  export const getSessionStorageItem = (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // Try to parse as JSON, but fall back to original value if it fails
      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    } catch (error) {
      console.error('Error accessing sessionStorage:', error);
      return defaultValue;
    }
  };
  
  /**
   * Set an item in sessionStorage with automatic JSON conversion
   * @param {string} key - The key to set
   * @param {*} value - The value to store
   * @returns {boolean} Success status
   */
  export const setSessionStorageItem = (key, value) => {
    try {
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
      sessionStorage.setItem(key, valueToStore);
      return true;
    } catch (error) {
      console.error('Error storing in sessionStorage:', error);
      return false;
    }
  };