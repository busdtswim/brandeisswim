/**
 * Generate all lesson dates for a given lesson based on meeting days and date range
 * @param {string|Array} meetingDays - Comma-separated meeting days string or array of days
 * @param {string} startDate - Start date in MM/DD/YYYY format
 * @param {string} endDate - End date in MM/DD/YYYY format
 * @returns {Array} Array of lesson dates in MM/DD/YYYY format
 */
export function generateLessonDates(meetingDays, startDate, endDate) {
  if (!meetingDays || !startDate || !endDate) {
    return [];
  }

  // Handle both string and array formats for meetingDays
  let daysOfWeek;
  if (typeof meetingDays === 'string') {
    daysOfWeek = meetingDays.split(',').map(day => day.trim());
  } else if (Array.isArray(meetingDays)) {
    daysOfWeek = meetingDays.map(day => day.trim());
  } else {
    return [];
  }

  // Parse start and end dates
  const [startMonth, startDay, startYear] = startDate.split('/').map(Number);
  const [endMonth, endDay, endYear] = endDate.split('/').map(Number);
  
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return [];
  }

  const dayMap = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };

  const lessonDates = [];
  const currentDate = new Date(start);

  // Generate dates for each meeting day within the range
  while (currentDate <= end) {
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (daysOfWeek.includes(dayName)) {
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const day = currentDate.getDate().toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      lessonDates.push(`${month}/${day}/${year}`);
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return lessonDates;
}

/**
 * Format lesson dates for display
 * @param {Array} dates - Array of dates in MM/DD/YYYY format
 * @returns {string} Formatted string for display
 */
export function formatLessonDates(dates) {
  if (!dates || dates.length === 0) {
    return 'No dates available';
  }

  if (dates.length === 1) {
    return dates[0];
  }

  if (dates.length === 2) {
    return `${dates[0]} and ${dates[1]}`;
  }

  const lastDate = dates[dates.length - 1];
  const otherDates = dates.slice(0, -1);
  return `${otherDates.join(', ')}, and ${lastDate}`;
}

/**
 * Check if a date is in the future
 * @param {string} dateString - Date in MM/DD/YYYY format
 * @returns {boolean} True if date is in the future
 */
export function isFutureDate(dateString) {
  const [month, day, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date >= today;
}

/**
 * Filter dates to only show future dates
 * @param {Array} dates - Array of dates in MM/DD/YYYY format
 * @returns {Array} Array of future dates only
 */
export function filterFutureDates(dates) {
  return dates.filter(date => isFutureDate(date));
}
/**
 * Check if registration is allowed based on one-day buffer rule
 * If lesson starts on Monday, last day to register is Sunday
 * @param {Object} lesson - Lesson object with start_date or startDate
 * @returns {boolean} Whether registration is allowed
 */
export function isRegistrationAllowed(lesson) {
  if (!lesson || (!lesson.start_date && !lesson.startDate)) {
    return false;
  }

  const now = new Date();
  let lessonStartDate;
  
  // Handle different date formats
  const startDateStr = lesson.start_date || lesson.startDate;
  
  if (startDateStr.includes('/')) {
    // MM/DD/YYYY format
    const [month, day, year] = startDateStr.split("/").map(Number);
    lessonStartDate = new Date(year, month - 1, day);
  } else {
    // ISO format or other
    lessonStartDate = new Date(startDateStr);
  }
  
  if (isNaN(lessonStartDate.getTime())) {
    return false;
  }
  
  // Calculate the registration cutoff date (one day before lesson start)
  const registrationCutoffDate = new Date(lessonStartDate);
  registrationCutoffDate.setDate(registrationCutoffDate.getDate() - 1);
  
  // Allow registration until end of cutoff day (11:59:59 PM)
  registrationCutoffDate.setHours(23, 59, 59, 999);
  
  // Check if current time is before the cutoff
  return now <= registrationCutoffDate;
}
