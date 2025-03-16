// src/utils/formatUtils.js
import { DateTime } from 'luxon'; // Add this import

const NY_TIMEZONE = 'America/New_York';

class DateFormatter {
  static formatForDisplay(dateStr) {
    try {
      if (!dateStr) return '';

      // First try to parse as ISO
      let dt = DateTime.fromISO(dateStr, { zone: NY_TIMEZONE });
      
      // If that didn't work, try MM/dd/yyyy format
      if (!dt.isValid) {
        dt = DateTime.fromFormat(dateStr, 'MM/dd/yyyy', { zone: NY_TIMEZONE });
      }

      // If it's already a Date object converted to string, try parsing as native date
      if (!dt.isValid && typeof dateStr === 'string' && dateStr.includes('T')) {
        dt = DateTime.fromJSDate(new Date(dateStr), { zone: NY_TIMEZONE });
      }

      return dt.isValid ? dt.toFormat('MM/dd/yyyy') : dateStr;
    } catch (error) {
      console.error('Error formatting date:', dateStr, error);
      return dateStr;
    }
  }

  static formatExceptionDates(dates) {
    try {
      if (!dates) return '';
      const dateArray = Array.isArray(dates) 
        ? dates 
        : dates.split(',').map(d => d.trim());
      
      return dateArray
        .map(date => this.formatForDisplay(date))
        .filter(Boolean)
        .join(', ');
    } catch (error) {
      console.error('Error formatting exception dates:', dates, error);
      return '';
    }
  }
}

// A utility to format time with consistent timezone handling
const formatTimeWithTimezone = (timeObj) => {
  if (!timeObj) return '';
  
  try {
    // If it's a JavaScript Date
    if (timeObj instanceof Date) {
      return DateTime.fromJSDate(timeObj, { zone: NY_TIMEZONE })
        .toFormat('h:mm a');
    }
    
    // If it's an ISO string or similar
    const dt = DateTime.fromISO(timeObj, { zone: NY_TIMEZONE });
    if (dt.isValid) {
      return dt.toFormat('h:mm a');
    }
    
    // Fallback for other formats
    return timeObj.toString();
  } catch (error) {
    console.error('Error formatting time:', timeObj, error);
    return timeObj.toString();
  }
};

export { DateFormatter, formatTimeWithTimezone };