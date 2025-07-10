import moment from 'moment';

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @param {string} format - The format to use (default: 'MMM D, YYYY h:mm A')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'MMM D, YYYY h:mm A') => {
  if (!dateString) return '';
  return moment(dateString).format(format);
};

/**
 * Get relative time from a date (e.g., "2 hours ago")
 * @param {string} dateString - The date string
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  return moment(dateString).fromNow();
};

/**
 * Format a date as a calendar date (Today, Yesterday, etc.)
 * @param {string} dateString - The date string
 * @returns {string} Calendar date string
 */
export const getCalendarDate = (dateString) => {
  if (!dateString) return '';
  return moment(dateString).calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'MMM D, YYYY'
  });
};

/**
 * Check if a date is in the past
 * @param {string} dateString - The date string
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  return moment(dateString).isBefore(moment());
};

/**
 * Get the date for a specific number of days ago
 * @param {number} days - Number of days ago
 * @returns {string} ISO date string
 */
export const getDaysAgo = (days) => {
  return moment().subtract(days, 'days').toISOString();
};

/**
 * Group dates by a time period
 * @param {Array} items - Array of objects containing dates
 * @param {string} dateField - Field name containing the date
 * @param {string} groupBy - Group by period ('day', 'week', 'month', 'year')
 * @returns {Object} Grouped date objects
 */
export const groupByDate = (items, dateField, groupBy = 'day') => {
  const groupedItems = {};
  
  items.forEach(item => {
    const date = moment(item[dateField]);
    let groupKey;
    
    switch (groupBy) {
      case 'day':
        groupKey = date.format('YYYY-MM-DD');
        break;
      case 'week':
        groupKey = `Week ${date.week()}, ${date.year()}`;
        break;
      case 'month':
        groupKey = date.format('MMMM YYYY');
        break;
      case 'year':
        groupKey = date.format('YYYY');
        break;
      default:
        groupKey = date.format('YYYY-MM-DD');
    }
    
    if (!groupedItems[groupKey]) {
      groupedItems[groupKey] = [];
    }
    
    groupedItems[groupKey].push(item);
  });
  
  return groupedItems;
};