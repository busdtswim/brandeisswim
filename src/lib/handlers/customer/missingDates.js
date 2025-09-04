const SwimmerLessonStore = require('../../stores/SwimmerLessonStore');
const EmailStore = require('../../stores/EmailStore');
const UserStore = require('../../stores/UserStore');
const SwimmerStore = require('../../stores/SwimmerStore');
const LessonStore = require('../../stores/LessonStore');

/**
 * Add missing dates for a swimmer's lesson
 * @param {Object} data - Request data
 * @param {number} data.swimmerId - Swimmer ID
 * @param {number} data.lessonId - Lesson ID
 * @param {string} data.missingDates - Comma-separated dates (MM/DD/YYYY format)
 * @param {number} data.userId - User ID making the request
 * @returns {Promise<Object>} Result of the operation
 */
async function addMissingDates(data) {
  try {
    const { swimmerId, lessonId, missingDates, userId } = data;

    // Validate required fields
    if (!swimmerId || !lessonId || !missingDates || !userId) {
      throw new Error('Missing required fields: swimmerId, lessonId, missingDates, userId');
    }

    // Get user information
    const user = await UserStore.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get swimmer information
    const swimmer = await SwimmerStore.findById(swimmerId);
    if (!swimmer) {
      throw new Error('Swimmer not found');
    }

    // Verify the swimmer belongs to the user
    if (swimmer.user_id !== userId) {
      throw new Error('Unauthorized: Swimmer does not belong to user');
    }

    // Get lesson information
    const lesson = await LessonStore.findById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Verify the swimmer is enrolled in this lesson
    const isEnrolled = await SwimmerLessonStore.isSwimmerEnrolledInLesson(swimmerId, lessonId);
    if (!isEnrolled) {
      throw new Error('Swimmer is not enrolled in this lesson');
    }

    // Add missing dates
    const result = await SwimmerLessonStore.addMissingDates(swimmerId, lessonId, missingDates);

    // Send email notification to Brandeis
    try {
      const lessonDetails = `${lesson.meeting_days} at ${lesson.start_time || 'TBD'} - ${lesson.start_date || 'TBD'} to ${lesson.end_date || 'TBD'}`;
      
      await EmailStore.sendMissingDateNotification({
        swimmerName: swimmer.name,
        parentName: `${user.fullname}`,
        parentEmail: user.email,
        lessonDetails: lessonDetails,
        missingDates: result.missing_dates,
        changeType: 'added'
      });
    } catch (emailError) {
      // Log email error but don't fail the operation
      console.error('Failed to send missing dates notification email:', emailError);
    }

    return {
      success: true,
      message: 'Missing dates added successfully',
      data: {
        swimmerId: result.swimmer_id,
        lessonId: result.lesson_id,
        missingDates: result.missing_dates
      }
    };
  } catch (error) {
    throw new Error(`Failed to add missing dates: ${error.message}`);
  }
}

/**
 * Get missing dates for a swimmer's lesson
 * @param {Object} data - Request data
 * @param {number} data.swimmerId - Swimmer ID
 * @param {number} data.lessonId - Lesson ID
 * @param {number} data.userId - User ID making the request
 * @returns {Promise<Object>} Result of the operation
 */
async function getMissingDates(data) {
  try {
    const { swimmerId, lessonId, userId } = data;

    // Validate required fields
    if (!swimmerId || !lessonId || !userId) {
      throw new Error('Missing required fields: swimmerId, lessonId, userId');
    }

    // Get user information
    const user = await UserStore.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get swimmer information
    const swimmer = await SwimmerStore.findById(swimmerId);
    if (!swimmer) {
      throw new Error('Swimmer not found');
    }

    // Verify the swimmer belongs to the user
    if (swimmer.user_id !== userId) {
      throw new Error('Unauthorized: Swimmer does not belong to user');
    }

    // Get missing dates
    const missingDates = await SwimmerLessonStore.getMissingDates(swimmerId, lessonId);

    return {
      success: true,
      data: {
        swimmerId,
        lessonId,
        missingDates: missingDates || ''
      }
    };
  } catch (error) {
    throw new Error(`Failed to get missing dates: ${error.message}`);
  }
}

/**
 * Validate missing dates format
 * @param {string} dates - Comma-separated dates string
 * @returns {Object} Validation result
 */
function validateMissingDates(dates) {
  try {
    const dateArray = dates.split(',').map(date => date.trim());
    const validDates = [];
    const invalidDates = [];
    
    for (const date of dateArray) {
      if (date === '') continue;
      
      // Check if date matches MM/DD/YYYY format
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (dateRegex.test(date)) {
        // Check if date is in the future
        const [month, day, year] = date.split('/');
        const dateObj = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (dateObj >= today) {
          validDates.push(date);
        } else {
          invalidDates.push(`${date} (past date)`);
        }
      } else {
        invalidDates.push(`${date} (invalid format)`);
      }
    }
    
    if (invalidDates.length > 0) {
      return {
        valid: false,
        errors: invalidDates,
        message: `Invalid dates: ${invalidDates.join(', ')}`
      };
    }
    
    return {
      valid: true,
      validDates: validDates,
      message: 'All dates are valid'
    };
  } catch (error) {
    return {
      valid: false,
      errors: ['Invalid date format'],
      message: 'Failed to validate dates'
    };
  }
}

module.exports = {
  addMissingDates,
  getMissingDates,
  validateMissingDates
}; 