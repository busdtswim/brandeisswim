const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const { formatTo12Hour } = require('@/lib/utils/timezoneUtils');

/**
 * Get customer schedule with all lessons
 * @param {string} userEmail - User's email
 * @returns {Promise<Array>} Array of lesson classes
 */
async function getCustomerSchedule(userEmail) {
  try {
    const user = await UserStore.findByEmail(userEmail);
    if (!user) {
      throw new Error('User not found');
    }

    const swimmers = await SwimmerStore.findByUserId(user.id);
    const classes = [];
    
    for (const swimmer of swimmers) {
      const swimmerWithLessons = await SwimmerStore.findWithLessons(swimmer.id);
      
      for (const lessonData of swimmerWithLessons) {
        if (lessonData.lesson_id) {
          // Format the time strings directly
          const startTimeFormatted = lessonData.start_time ? formatTo12Hour(lessonData.start_time) : '';
          const endTimeFormatted = lessonData.end_time ? formatTo12Hour(lessonData.end_time) : '';
          
          classes.push({
            id: lessonData.lesson_id,
            swimmerId: swimmer.id,
            startDate: lessonData.start_date, // Use the string date directly
            endDate: lessonData.end_date,     // Use the string date directly
            time: startTimeFormatted && endTimeFormatted ? `${startTimeFormatted} - ${endTimeFormatted}` : '',
            meetingDays: lessonData.meeting_days ? lessonData.meeting_days.split(',') : [],
            swimmerName: swimmer.name,
            instructor: lessonData.instructor_name ? {
              name: lessonData.instructor_name,
              id: lessonData.instructor_id
            } : null,
            preferredInstructor: lessonData.preferred_instructor_name ? {
              name: lessonData.preferred_instructor_name,
              id: lessonData.preferred_instructor_id
            } : null,
            instructorNotes: lessonData.instructor_notes
          });
        }
      }
    }

    return classes;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
}

module.exports = {
  getCustomerSchedule
}; 