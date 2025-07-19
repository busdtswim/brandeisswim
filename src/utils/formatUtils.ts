// src/utils/formatUtils.ts
import { DateTime } from 'luxon'; // Add this import

const NY_TIMEZONE = 'America/New_York';

class DateFormatter {
  static formatForDisplay(dateStr: string | Date | null | undefined): string {
    try {
      if (!dateStr) return '';

      // First try to parse as ISO
      let dt = DateTime.fromISO(dateStr as string, { zone: NY_TIMEZONE });
      
      // If that didn't work, try MM/dd/yyyy format
      if (!dt.isValid) {
        dt = DateTime.fromFormat(dateStr as string, 'MM/dd/yyyy', { zone: NY_TIMEZONE });
      }

      // If it's already a Date object converted to string, try parsing as native date
      if (!dt.isValid && typeof dateStr === 'string' && dateStr.includes('T')) {
        dt = DateTime.fromJSDate(new Date(dateStr), { zone: NY_TIMEZONE });
      }

      return dt.isValid ? dt.toFormat('MM/dd/yyyy') : (dateStr as string);
    } catch (error) {
      console.error('Error formatting date:', dateStr, error);
      return dateStr as string;
    }
  }

  static formatExceptionDates(dates: string | string[] | null | undefined): string {
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
const formatTimeWithTimezone = (timeObj: string | Date | null | undefined): string => {
  if (!timeObj) return '';
  
  try {
    // If it's a JavaScript Date
    if (timeObj instanceof Date) {
      return DateTime.fromJSDate(timeObj, { zone: NY_TIMEZONE })
        .toFormat('h:mm a');
    }
    
    // If it's an ISO string or similar
    const dt = DateTime.fromISO(timeObj as string, { zone: NY_TIMEZONE });
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