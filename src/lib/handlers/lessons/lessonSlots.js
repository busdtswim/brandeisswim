const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');
const { getCurrentDateString } = require('@/lib/utils/dateUtils');

/**
 * Get available lesson slots for registration
 * @returns {Promise<Array>} Formatted lesson data
 */
async function getLessonSlots() {
  try {
    // Get current date
    const todayString = getCurrentDateString();
    
    // Get all lessons
    const lessons = await LessonStore.findAll();

    // Filter lessons that haven't ended yet
    const activeLessons = lessons.filter(lesson => {
      if (!lesson.end_date) return true;
      return lesson.end_date >= todayString;
    });

    // Format the lessons for the frontend
    const formattedLessons = await Promise.all(activeLessons.map(async (lesson) => {
      const registeredCount = await SwimmerLessonStore.countByLessonId(lesson.id);
      
      return {
        id: lesson.id,
        start_date: lesson.start_date,
        end_date: lesson.end_date,
        meeting_days: lesson.meeting_days,
        start_time: lesson.start_time,
        end_time: lesson.end_time,
        max_slots: lesson.max_slots,
        registered: registeredCount,
        exception_dates: lesson.exception_dates
      };
    }));

    return formattedLessons;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getLessonSlots
}; 