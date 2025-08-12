// src/utils/timezoneUtils.js

/**
 * Format time from 24h to 12h format
 * @param {string} timeStr - Time string in HH:MM format
 * @returns {string} Formatted time string
 */
export const formatTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  
  // If it's already a string, try to parse it
  if (typeof timeStr === 'string') {
    // First check if it's a time with AM/PM already
    if (timeStr.includes('AM') || timeStr.includes('PM')) {
      return timeStr; // Already formatted
    }
    
    // Try to parse a time string like "08:00"
    const [hoursStr, minutesStr] = timeStr.split(':');
    if (hoursStr && minutesStr) {
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      
      if (!isNaN(hours) && !isNaN(minutes)) {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
      }
    }
  }
  
  // Fallback for other formats or invalid inputs
  return timeStr.toString();
};