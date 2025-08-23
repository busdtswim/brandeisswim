const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

/**
 * Get customer schedule with all lessons
 * @param {string} userEmail - User's email
 * @param {number} [userId] - User's ID (alternative to email)
 * @returns {Promise<Array>} Array of lesson classes
 */
async function getCustomerSchedule(userEmail, userId = null) {
  try {
    let user;
    
    if (userId) {
      // Try to find by ID first (more reliable)
      user = await UserStore.findById(userId);
    }
    
    if (!user && userEmail) {
      // Fallback to email if ID not provided or user not found by ID
      user = await UserStore.findByEmail(userEmail);
    }

    if (!user) {
      throw new Error('User not found');
    }

    const swimmers = await SwimmerStore.findByUserId(user.id);
    const classes = [];
    
    for (const swimmer of swimmers) {
      const swimmerWithLessons = await SwimmerStore.findWithLessons(swimmer.id);
      
      for (const lessonData of swimmerWithLessons) {
        if (lessonData.lesson_id) {
          // Use the time strings directly as they're already formatted
          const timeDisplay = lessonData.start_time && lessonData.end_time ? 
            `${lessonData.start_time} - ${lessonData.end_time}` : '';
          
          classes.push({
            id: lessonData.lesson_id,
            swimmerId: swimmer.id,
            startDate: lessonData.start_date, // Use the string date directly
            endDate: lessonData.end_date,     // Use the string date directly
            time: timeDisplay,
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
            instructorNotes: lessonData.instructor_notes || '', // Instructor notes for the lesson
            isCoverage: lessonData.instructor_id !== lessonData.preferred_instructor_id && lessonData.preferred_instructor_id !== null, // Check if this is a coverage lesson
            originalInstructor: lessonData.preferred_instructor_name ? {
              name: lessonData.preferred_instructor_name,
              id: lessonData.preferred_instructor_id
            } : null,
            paymentStatus: lessonData.payment_status ? 'confirmed' : 'pending', // Convert boolean to string
            paymentConfirmed: lessonData.payment_status === true // Check for boolean true
          });
        
        }
      }
    }

    return classes;
  } catch (error) {
    throw error;
  }
}

/**
 * Update instructor notes for a lesson
 * @param {number} lessonId - Lesson ID
 * @param {number} swimmerId - Swimmer ID (for verification)
 * @param {string} notes - New instructor notes
 * @param {string} userEmail - User's email
 * @param {number} [userId] - User's ID (alternative to email)
 * @returns {Promise<Object>} Update result
 */
async function updateInstructorNotes(lessonId, swimmerId, notes, userEmail, userId = null) {
  try {
    let user;
    
    if (userId) {
      // Try to find by ID first (more reliable)
      user = await UserStore.findById(userId);
    }
    
    if (!user && userEmail) {
      // Fallback to email if ID not provided or user not found by ID
      user = await UserStore.findByEmail(userEmail);
    }
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify the swimmer belongs to this user
    const swimmer = await SwimmerStore.findById(swimmerId);
    if (!swimmer) {
      throw new Error('Swimmer not found');
    }

    if (swimmer.user_id !== user.id) {
      throw new Error('Unauthorized to update notes for this lesson');
    }

    // Update the instructor notes for this lesson
    const result = await SwimmerLessonStore.updateInstructorNotes(swimmerId, lessonId, notes);
    
    if (!result) {
      throw new Error('Failed to update instructor notes');
    }

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCustomerSchedule,
  updateInstructorNotes
}; 