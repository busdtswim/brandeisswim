// src/utils/timeUtils.js

// Check if two time ranges overlap
export const isTimeOverlap = (time1Start, time1End, time2Start, time2End) => {
    const t1s = new Date(`1970-01-01T${time1Start}`);
    const t1e = new Date(`1970-01-01T${time1End}`);
    const t2s = new Date(`1970-01-01T${time2Start}`);
    const t2e = new Date(`1970-01-01T${time2End}`);
  
    return (t1s < t2e && t1e > t2s);
};
  
// Check if two sets of days overlap
export const isDaysOverlap = (days1, days2) => {
    const daysArray1 = days1.split(',').map(d => d.trim());
    const daysArray2 = days2.split(',').map(d => d.trim());
    
    return daysArray1.some(day => daysArray2.includes(day));
};
  
// Check for schedule conflicts
export const hasScheduleConflict = (lesson1, lesson2) => {
    const lesson1Start = new Date(lesson1.start_date);
    const lesson1End = new Date(lesson1.end_date);
    const lesson2Start = new Date(lesson2.start_date);
    const lesson2End = new Date(lesson2.end_date);
  
    if (lesson1Start <= lesson2End && lesson1End >= lesson2Start) {
      if (isDaysOverlap(lesson1.meeting_days, lesson2.meeting_days)) {
        const l1StartTime = lesson1.start_time.toTimeString().slice(0, 5);
        const l1EndTime = lesson1.end_time.toTimeString().slice(0, 5);
        const l2StartTime = lesson2.start_time.toTimeString().slice(0, 5);
        const l2EndTime = lesson2.end_time.toTimeString().slice(0, 5);
  
        return isTimeOverlap(l1StartTime, l1EndTime, l2StartTime, l2EndTime);
      }
    }
    return false;
};