class DateFormatter {
  static formatWithTimezone(dateString, timeZone = 'America/New_York') {
    const date = new Date(dateString);
    // Use Intl.DateTimeFormat to format the date in the specified time zone
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);

    // Convert the formatted date back to an ISO string
    const isoDate = new Date(formattedDate).toISOString();
    return isoDate;
  }

  static adjustDateForTimezone(dateStr, timeZone = 'America/New_York') {
    const date = new Date(dateStr);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);

    const isoDate = new Date(formattedDate).toISOString();
    return isoDate;
  }

  static formatFullDate(dateString, timeZone = 'America/New_York') {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);

    const isoDate = new Date(formattedDate).toISOString();
    return isoDate;
  }

  static formatExceptionDates(dates, timeZone = 'America/New_York') {
    if (!dates) return 'None';
    if (typeof dates === 'string') {
      dates = dates.split(',').filter(date => date.trim());
    }
    if (!Array.isArray(dates)) return 'None';
    
    return dates.map(date => this.formatFullDate(date, timeZone)).join(', ');
  }
}

class TimeFormatter {
  static formatTime(timeString, timeZone = 'America/New_York') {
    try {
      const date = new Date(`1970-01-01T${timeString}:00`);
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  }

  static formatWithTimezone(date, timeZone = 'America/New_York') {
    const localDate = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(localDate);
  }

  static formatToISO(time, timeZone = 'America/New_York') {
    const date = new Date(`1970-01-01T${time}:00`);
    return date.toISOString();
  }

  static parseFromDB(timeString, timeZone = 'America/New_York') {
    const time = new Date(`1970-01-01T${timeString}`);
    return this.formatTime(time, timeZone);
  }
}

export { DateFormatter, TimeFormatter };