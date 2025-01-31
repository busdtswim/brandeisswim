// src/utils/formatUtils.js
import { DateTime } from 'luxon';

const NY_TIMEZONE = 'America/New_York';

class DateFormatter {
  static formatForDisplay(dateStr) {
    try {
      if (!dateStr) return '';

      let dt = DateTime.fromFormat(dateStr, 'MM/dd/yyyy', { zone: NY_TIMEZONE });
      
      if (!dt.isValid) {
        dt = DateTime.fromISO(dateStr, { zone: NY_TIMEZONE });
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

export { DateFormatter };