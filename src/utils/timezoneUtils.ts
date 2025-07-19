// src/utils/timezoneUtils.ts

interface TimeData {
  start_time: string | Date;
  end_time: string | Date;
}

interface FormattedTimeData {
  originalStartTime: string | Date;
  originalEndTime: string | Date;
  formattedStartTime: string;
  formattedEndTime: string;
}

/**
 * Directly creates a time string from input time for display
 * This avoids timezone conversion issues by just using the exact time string provided
 * @param {string | Date} timeStr - Time string in format "HH:MM" (24-hour) or Date object
 * @returns {string} - Formatted time string for display (e.g., "8:00 AM")
 */
export const formatTimeForDisplay = (timeStr: string | Date): string => {
  // If the input is a Date object, extract hours and minutes
  if (timeStr instanceof Date) {
    const hours = timeStr.getHours();
    const minutes = timeStr.getMinutes();
    // Format as AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${formattedMinutes} ${period}`;
  }
  
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

/**
 * Stores the exact time string provided by admin when creating a lesson
 * This avoids timezone conversion by just storing the string representation
 * @param {TimeData} data - Data object with time information
 * @returns {FormattedTimeData} - Object with formatted times
 */
export const storeExactTimes = (data: TimeData): FormattedTimeData => {
  // Just extract and save the original time strings
  const startTime = data.start_time;
  const endTime = data.end_time;
  
  return {
    originalStartTime: startTime,
    originalEndTime: endTime,
    formattedStartTime: formatTimeForDisplay(startTime),
    formattedEndTime: formatTimeForDisplay(endTime)
  };
}; 