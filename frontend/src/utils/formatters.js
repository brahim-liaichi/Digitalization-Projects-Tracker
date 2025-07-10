/**
 * Format file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size (e.g., "1.23 MB")
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    if (!bytes || isNaN(bytes)) return '';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  /**
   * Format a number with commas for thousands separator
   * @param {number} number - The number to format
   * @returns {string} Formatted number
   */
  export const formatNumber = (number) => {
    if (number === null || number === undefined) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  /**
   * Truncate a string to a specified length
   * @param {string} str - The string to truncate
   * @param {number} length - Maximum length
   * @param {boolean} useWordBoundary - Whether to truncate at word boundaries
   * @returns {string} Truncated string
   */
  export const truncateString = (str, length = 50, useWordBoundary = true) => {
    if (!str) return '';
    
    if (str.length <= length) return str;
    
    const subString = str.substring(0, length - 1);
    return (useWordBoundary 
      ? subString.substring(0, subString.lastIndexOf(' ')) 
      : subString) + '...';
  };
  
  /**
   * Format a percentage value
   * @param {number} value - The decimal value (e.g., 0.75)
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage (e.g., "75.00%")
   */
  export const formatPercent = (value, decimals = 2) => {
    if (value === null || value === undefined) return '';
    return (value * 100).toFixed(decimals) + '%';
  };
  
  /**
   * Get file extension from a filename
   * @param {string} filename - The filename
   * @returns {string} The file extension
   */
  export const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
  };
  
  /**
   * Capitalize the first letter of each word in a string
   * @param {string} str - The string to capitalize
   * @returns {string} Capitalized string
   */
  export const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };