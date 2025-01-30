// src/utils/formatUtils.js
class DateFormatter {
  static formatWithTimezone(dateString) {
    const date = new Date(dateString);
    // Add timezone offset to keep the date consistent
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
  }

  static adjustDateForTimezone(dateStr) {
    const date = new Date(dateStr);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return adjustedDate.toISOString().split('T')[0];
  }

  static formatFullDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC' 
    });
  }

  static formatExceptionDates(dates) {
    if (!dates) return 'None';
    if (typeof dates === 'string') {
      dates = dates.split(',').filter(date => date.trim());
    }
    if (!Array.isArray(dates)) return 'None';
    
    return dates.map(date => this.formatFullDate(date)).join(', ');
  }
}

class TimeFormatter {
  static formatTime(timeString) {
    try {
      if (timeString instanceof Date) {
        timeString = timeString.toTimeString().slice(0, 5);
      }
      
      let hours, minutes;
      if (timeString.includes('T')) {
        [hours, minutes] = timeString.split('T')[1].split(':');
      } else {
        [hours, minutes] = timeString.split(':');
      }
      
      hours = parseInt(hours);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      
      return `${hour12}:${minutes}${period}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  }

  static formatWithTimezone(date, timeZone = 'America/New_York') {
    const localDate = new Date(date);
    return localDate.toLocaleString('en-US', { timeZone });
  }

  static formatToISO(time, timeZone = 'America/New_York') {
    const date = new Date(`1970-01-01T${time}:00`);
    return date.toISOString();
  }

  static parseFromDB(timeString) {
    const time = new Date(`1970-01-01T${timeString}`);
    return this.formatTime(time);
  }
}

export { DateFormatter, TimeFormatter };