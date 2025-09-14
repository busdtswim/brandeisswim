const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');
const { hasLessonStarted, isRegistrationAllowed } = require('@/lib/utils/timeUtils.js');

/**
 * Register a swimmer for a lesson
 * @param {Object} registrationData - Registration data
 * @returns {Promise<Object>} Registration result
 */
async function handleLessonRegistration(registrationData) {
  try {
    const { swimmerId, lessonId, preferredInstructorId, instructorNotes, missingDates } = registrationData;

    // Convert IDs to integers
    const swimmerIdInt = parseInt(swimmerId);
    const lessonIdInt = parseInt(lessonId);
    const preferredInstructorIdInt = preferredInstructorId ? parseInt(preferredInstructorId) : null;

    if (isNaN(swimmerIdInt) || isNaN(lessonIdInt)) {
      throw new Error('Invalid ID format');
    }

    // Check if the lesson exists
    const lesson = await LessonStore.findById(lessonIdInt);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check if the lesson has already started
    if (hasLessonStarted(lesson)) {
      throw new Error('Cannot register for a lesson that has already started');
    }

    // Check if registration is still allowed (one-day buffer rule)
    if (!isRegistrationAllowed(lesson)) {
      throw new Error('Registration is no longer allowed for this lesson. Please join the waitlist instead.');
    }

    // Check if the lesson is full
    const currentParticipants = await SwimmerLessonStore.countByLessonId(lessonIdInt);
    if (currentParticipants >= lesson.max_slots) {
      throw new Error('This lesson is full');
    }

    // Check if swimmer exists
    const swimmer = await SwimmerStore.findById(swimmerIdInt);
    if (!swimmer) {
      throw new Error('Swimmer not found');
    }

    // Check if swimmer is already registered for this lesson
    const existingRegistration = await SwimmerLessonStore.findBySwimmerAndLesson(swimmerIdInt, lessonIdInt);
    if (existingRegistration) {
      throw new Error('Swimmer is already registered for this lesson');
    }

    // Create the registration
    const registration = await SwimmerLessonStore.create({
      swimmer_id: swimmerIdInt,
      lesson_id: lessonIdInt,
      preferred_instructor_id: preferredInstructorIdInt,
      instructor_notes: instructorNotes || null,
      missing_dates: missingDates || null
    });
    
    if (!registration) {
      throw new Error('Failed to create registration');
    }

    // Fetch the updated lesson with participants
    const updatedLesson = await LessonStore.findWithParticipants();
    const targetLesson = updatedLesson.find(l => l.id === lessonIdInt);

    if (!targetLesson) {
      throw new Error('Failed to fetch updated lesson');
    }

    return {
      success: true,
      message: 'Registration successful',
      registration: registration,
      lesson: targetLesson
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  handleLessonRegistration
};
