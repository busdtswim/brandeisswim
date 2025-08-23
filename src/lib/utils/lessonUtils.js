/**
 * Format lesson information consistently across components
 * @param {Object} lesson - Lesson object with date and time properties
 * @param {boolean} includeTime - Whether to include time information
 * @returns {string} Formatted lesson string
 */
export function formatLessonInfo(lesson, includeTime = true) {
  if (!lesson) return 'Unknown Lesson';
  
  // Handle lessons with date ranges
  if (lesson.start_date && lesson.end_date) {
    const startDate = lesson.start_date;
    const endDate = lesson.end_date;
    const dateRange = `${startDate} to ${endDate}`;
    
    if (includeTime && lesson.start_time && lesson.end_time) {
      return `${dateRange} (${lesson.start_time} - ${lesson.end_time})`;
    }
    
    return dateRange;
  }
  
  // Handle lessons with just an ID
  if (lesson.id) {
    return `Class ${lesson.id}`;
  }
  
  return 'Unknown Lesson';
}

/**
 * Format meeting days for display
 * @param {string} meetingDays - Comma-separated meeting days string
 * @returns {string} Formatted meeting days string
 */
export function formatMeetingDays(meetingDays) {
  if (!meetingDays) return 'No meeting days set';
  
  return meetingDays.split(',').map(day => day.trim()).join(', ');
} 