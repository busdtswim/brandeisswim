// src/utils/timeUtils.js
import { DateTime } from 'luxon'; // Add this import

const NY_TIMEZONE = 'America/New_York';

// Check if two time ranges overlap
export const isTimeOverlap = (time1Start, time1End, time2Start, time2End) => {
  // Parse times in Eastern Time
  const t1s = typeof time1Start === 'string' 
    ? DateTime.fromFormat(time1Start, 'HH:mm', { zone: NY_TIMEZONE }) 
    : DateTime.fromJSDate(time1Start, { zone: NY_TIMEZONE });
    
  const t1e = typeof time1End === 'string'
    ? DateTime.fromFormat(time1End, 'HH:mm', { zone: NY_TIMEZONE })
    : DateTime.fromJSDate(time1End, { zone: NY_TIMEZONE });
    
  const t2s = typeof time2Start === 'string'
    ? DateTime.fromFormat(time2Start, 'HH:mm', { zone: NY_TIMEZONE })
    : DateTime.fromJSDate(time2Start, { zone: NY_TIMEZONE });
    
  const t2e = typeof time2End === 'string'
    ? DateTime.fromFormat(time2End, 'HH:mm', { zone: NY_TIMEZONE })
    : DateTime.fromJSDate(time2End, { zone: NY_TIMEZONE });

  // Exclusive end: no overlap if t1e <= t2s or t2e <= t1s
  return !(t1e <= t2s || t2e <= t1s);
};
  
// Check if two sets of days overlap
export const isDaysOverlap = (days1, days2) => {
  const daysArray1 = typeof days1 === 'string' ? days1.split(',').map(d => d.trim()) : days1;
  const daysArray2 = typeof days2 === 'string' ? days2.split(',').map(d => d.trim()) : days2;
  
  return daysArray1.some(day => daysArray2.includes(day));
};
  
// Check for schedule conflicts
export const hasScheduleConflict = (lesson1, lesson2) => {
  // Ensure we're working with DateTime objects in correct timezone
  const lesson1Start = DateTime.fromJSDate(new Date(lesson1.start_date), { zone: NY_TIMEZONE });
  const lesson1End = DateTime.fromJSDate(new Date(lesson1.end_date), { zone: NY_TIMEZONE });
  const lesson2Start = DateTime.fromJSDate(new Date(lesson2.start_date), { zone: NY_TIMEZONE });
  const lesson2End = DateTime.fromJSDate(new Date(lesson2.end_date), { zone: NY_TIMEZONE });

  if (lesson1Start <= lesson2End && lesson1End >= lesson2Start) {
    let days1 = lesson1.meeting_days;
    let days2 = lesson2.meeting_days;
    
    // Handle the case where meeting_days might be an array
    if (Array.isArray(days1)) {
      days1 = days1.join(',');
    }
    
    if (Array.isArray(days2)) {
      days2 = days2.join(',');
    }
    
    if (isDaysOverlap(days1, days2)) {
      // Get time strings in consistent format
      let l1StartTime, l1EndTime, l2StartTime, l2EndTime;
      
      if (lesson1.start_time instanceof Date) {
        l1StartTime = DateTime.fromJSDate(lesson1.start_time, { zone: NY_TIMEZONE });
        l1EndTime = DateTime.fromJSDate(lesson1.end_time, { zone: NY_TIMEZONE });
      } else {
        // Handle cases where time might be provided as a string or another format
        l1StartTime = typeof lesson1.start_time === 'string' && lesson1.start_time.includes(':')
          ? DateTime.fromFormat(lesson1.start_time, 'HH:mm', { zone: NY_TIMEZONE })
          : DateTime.fromISO(lesson1.start_time, { zone: NY_TIMEZONE });
        
        l1EndTime = typeof lesson1.end_time === 'string' && lesson1.end_time.includes(':')
          ? DateTime.fromFormat(lesson1.end_time, 'HH:mm', { zone: NY_TIMEZONE })
          : DateTime.fromISO(lesson1.end_time, { zone: NY_TIMEZONE });
      }
      
      if (lesson2.start_time instanceof Date) {
        l2StartTime = DateTime.fromJSDate(lesson2.start_time, { zone: NY_TIMEZONE });
        l2EndTime = DateTime.fromJSDate(lesson2.end_time, { zone: NY_TIMEZONE });
      } else {
        l2StartTime = typeof lesson2.start_time === 'string' && lesson2.start_time.includes(':')
          ? DateTime.fromFormat(lesson2.start_time, 'HH:mm', { zone: NY_TIMEZONE })
          : DateTime.fromISO(lesson2.start_time, { zone: NY_TIMEZONE });
        
        l2EndTime = typeof lesson2.end_time === 'string' && lesson2.end_time.includes(':')
          ? DateTime.fromFormat(lesson2.end_time, 'HH:mm', { zone: NY_TIMEZONE })
          : DateTime.fromISO(lesson2.end_time, { zone: NY_TIMEZONE });
      }
      
      // Convert to consistent format for comparison
      const time1Start = l1StartTime.toFormat('HH:mm');
      const time1End = l1EndTime.toFormat('HH:mm');
      const time2Start = l2StartTime.toFormat('HH:mm');
      const time2End = l2EndTime.toFormat('HH:mm');

      return isTimeOverlap(time1Start, time1End, time2Start, time2End);
    }
  }
  return false;
};