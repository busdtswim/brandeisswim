const CoverageStore = require('@/lib/stores/CoverageStore.js');
const LessonStore = require('@/lib/stores/LessonStore.js');
const InstructorStore = require('@/lib/stores/InstructorStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');
const { getCurrentDateString } = require('@/lib/utils/dateUtils');

/**
 * Get instructor ID from user email
 * @param {string} userEmail
 * @returns {Promise<number|null>} Instructor ID
 */
async function getInstructorIdFromEmail(userEmail) {
  try {
    const instructor = await InstructorStore.findByEmail(userEmail);
    return instructor ? instructor.id : null;
  } catch (error) {
    throw new Error(`Failed to get instructor ID from email: ${error.message}`);
  }
}

/**
 * Get coverage statistics for an instructor
 * @param {string} userEmail
 * @returns {Promise<Object>} Coverage statistics
 */
async function getCoverageStats(userEmail) {
  try {
    const instructorId = await getInstructorIdFromEmail(userEmail);
    if (!instructorId) {
      throw new Error('Instructor not found');
    }
    
    const stats = await CoverageStore.getStats(instructorId);
    return stats;
  } catch (error) {
    throw new Error(`Failed to get coverage stats: ${error.message}`);
  }
}

/**
 * Get coverage data for an instructor's dashboard
 * @param {string} userEmail
 * @returns {Promise<Object>}
 */
async function getInstructorCoverage(userEmail) {
  try {
    const instructorId = await getInstructorIdFromEmail(userEmail);
    if (!instructorId) {
      throw new Error('Instructor not found');
    }

    // Get all pending requests
    const allPendingRequests = await CoverageStore.findPending();
    
    // Separate into own requests and others' requests
    const ownRequests = allPendingRequests.filter(req => req.requesting_instructor_id === instructorId);
    const availableRequests = allPendingRequests.filter(req => req.requesting_instructor_id !== instructorId);

    // Get accepted coverage requests where this instructor is covering OR requesting
    const acceptedCoverage = await CoverageStore.findByCoveringInstructor(instructorId);
    const requestedCoverage = await CoverageStore.findByRequestingInstructor(instructorId);
    
    // Filter to only show accepted coverage (not pending ones)
    const acceptedRequestedCoverage = requestedCoverage.filter(req => req.status === 'accepted');

    const result = {
      ownRequests: ownRequests, // All own requests (pending)
      availableRequests: availableRequests.map(req => ({
        ...req,
        canVolunteer: true
      })), // All others' pending requests
      acceptedCoverage: acceptedCoverage.filter(req => req.status === 'accepted'), // Where this instructor is covering
      acceptedRequestedCoverage: acceptedRequestedCoverage // Where this instructor requested coverage and it was accepted
    };

    return result;
  } catch (error) {
    throw new Error(`Failed to get instructor coverage: ${error.message}`);
  }
}

/**
 * Get all pending coverage requests
 * @returns {Promise<Array>} Pending coverage requests
 */
async function getPendingCoverage() {
  try {
    const pendingRequests = await CoverageStore.findPending();
    return pendingRequests;
  } catch (error) {
    throw new Error(`Failed to get pending coverage: ${error.message}`);
  }
}

/**
 * Create a new coverage request
 * @param {Object} requestData
 * @returns {Promise<Object>} Created coverage request
 */
async function createCoverageRequest(requestData) {
  try {
    // Get instructor ID from user email
    const instructorId = await getInstructorIdFromEmail(requestData.requesting_instructor_email);
    if (!instructorId) {
      throw new Error('Instructor not found');
    }
    
    // Update the request data with the actual instructor ID
    const updatedRequestData = {
      ...requestData,
      requesting_instructor_id: instructorId
    };

    // Validate that the lesson exists
    const lesson = await LessonStore.findById(requestData.lesson_id);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Validate that the swimmer exists and is enrolled in this lesson
    if (requestData.swimmer_id) {
      const isEnrolled = await SwimmerLessonStore.isSwimmerEnrolledInLesson(
        requestData.swimmer_id, 
        requestData.lesson_id
      );
      
      if (!isEnrolled) {
        throw new Error('Swimmer is not enrolled in this lesson');
      }
    }

    // Check if there's already a pending request for this lesson, date, and swimmer
    const existingRequests = await CoverageStore.findByLesson(updatedRequestData.lesson_id);
    const hasPendingRequest = existingRequests.some(req => 
      req.requesting_instructor_id === instructorId && 
      req.status === 'pending' &&
      req.request_date === requestData.request_date &&
      req.swimmer_id === requestData.swimmer_id
    );

    if (hasPendingRequest) {
      throw new Error('You already have a pending coverage request for this swimmer on this date');
    }

    // Create the coverage request
    const coverageRequest = await CoverageStore.create(updatedRequestData);
    return coverageRequest;
  } catch (error) {
    throw new Error(`Failed to create coverage request: ${error.message}`);
  }
}

/**
 * Accept a coverage request
 * @param {number} requestId
 * @param {string} coveringInstructorEmail
 * @returns {Promise<Object>} Updated coverage request
 */
async function acceptCoverageRequest(requestId, coveringInstructorEmail) {
  try {
    // Get instructor ID from user email
    const coveringInstructorId = await getInstructorIdFromEmail(coveringInstructorEmail);
    if (!coveringInstructorId) {
      throw new Error('Instructor not found');
    }

    // Get the coverage request
    const coverageRequest = await CoverageStore.findById(requestId);
    if (!coverageRequest) {
      throw new Error('Coverage request not found');
    }

    // Check if request is still pending
    if (coverageRequest.status !== 'pending') {
      throw new Error('Coverage request is no longer pending');
    }

    // Check if the instructor is trying to accept their own request
    if (coverageRequest.requesting_instructor_id === coveringInstructorId) {
      throw new Error('You cannot accept your own coverage request');
    }

    // Update the coverage request to accepted
    const updatedRequest = await CoverageStore.update(requestId, {
      status: 'accepted',
      covering_instructor_id: coveringInstructorId
    });

    return updatedRequest;
  } catch (error) {
    throw new Error(`Failed to accept coverage request: ${error.message}`);
  }
}

/**
 * Decline a coverage request
 * @param {number} requestId
 * @returns {Promise<Object>} Updated coverage request
 */
async function declineCoverageRequest(requestId) {
  try {
    const coverageRequest = await CoverageStore.decline(requestId);
    if (!coverageRequest) {
      throw new Error('Coverage request not found or already processed');
    }

    return coverageRequest;
  } catch (error) {
    throw new Error(`Failed to decline coverage request: ${error.message}`);
  }
}

/**
 * Re-request coverage (instructor giving up responsibility, putting it back to pending)
 * @param {number} requestId
 * @param {string} coveringInstructorEmail
 * @returns {Promise<Object>} Updated coverage request
 */
async function reRequestCoverage(requestId, coveringInstructorEmail) {
  try {
    // Get instructor ID from user email
    const coveringInstructorId = await getInstructorIdFromEmail(coveringInstructorEmail);
    if (!coveringInstructorId) {
      throw new Error('Instructor not found');
    }

    // Get the coverage request
    const coverageRequest = await CoverageStore.findById(requestId);
    if (!coverageRequest) {
      throw new Error('Coverage request not found');
    }

    // Check if this instructor is actually covering this request
    if (coverageRequest.covering_instructor_id !== coveringInstructorId) {
      throw new Error('You are not covering this request');
    }

    // Check if request is accepted
    if (coverageRequest.status !== 'accepted') {
      throw new Error('Coverage request is not accepted');
    }

    // When re-requesting, the covering instructor becomes the new requesting instructor
    // Reset the coverage request back to pending and update the requesting instructor
    const updateData = {
      status: 'pending',
      requesting_instructor_id: coveringInstructorId, // The covering instructor becomes the new requesting instructor
      covering_instructor_id: null
    };

    const updatedRequest = await CoverageStore.update(requestId, updateData);

    return updatedRequest;
  } catch (error) {
    throw new Error(`Failed to re-request coverage: ${error.message}`);
  }
}

/**
 * Delete a coverage request (for the instructor who created it)
 * @param {number} requestId
 * @param {string} userEmail
 * @returns {Promise<boolean>} Success status
 */
async function deleteCoverageRequest(requestId, userEmail) {
  try {
    const instructorId = await getInstructorIdFromEmail(userEmail);
    if (!instructorId) {
      throw new Error('Instructor not found');
    }
    
    // First check if this instructor created the request
    const coverageRequest = await CoverageStore.findById(requestId);
    if (!coverageRequest) {
      throw new Error('Coverage request not found');
    }
    
    if (coverageRequest.requesting_instructor_id !== instructorId) {
      throw new Error('You can only delete your own coverage requests');
    }
    
    // Delete the request
    const success = await CoverageStore.delete(requestId);
    if (!success) {
      throw new Error('Failed to delete coverage request');
    }

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete coverage request: ${error.message}`);
  }
}

/**
 * Get available lessons for coverage requests
 * @param {string} userEmail
 * @returns {Promise<Array>} Available lessons with participants
 */
async function getAvailableLessons(userEmail) {
  try {
    const instructorId = await getInstructorIdFromEmail(userEmail);
    if (!instructorId) {
      throw new Error('Instructor not found');
    }

    // Get lessons assigned to this instructor
    const lessons = await LessonStore.findByInstructor(instructorId);
    const currentDate = getCurrentDateString();
    
    // Filter for active/future lessons and add participant data
    const availableLessons = await Promise.all(
      lessons
        .filter(lesson => {
          // Only show lessons that haven't ended yet
          return lesson.end_date >= currentDate;
        })
        .map(async (lesson) => {
          // Get participants for this lesson using the store method
          const participants = await SwimmerLessonStore.getLessonParticipants(lesson.id, instructorId);
          
          return {
            ...lesson,
            participants: participants
          };
        })
    );

    return availableLessons;
  } catch (error) {
    throw new Error(`Failed to get available lessons: ${error.message}`);
  }
}

module.exports = {
  getCoverageStats,
  getInstructorCoverage,
  getPendingCoverage,
  createCoverageRequest,
  acceptCoverageRequest,
  declineCoverageRequest,
  reRequestCoverage,
  deleteCoverageRequest,
  getAvailableLessons
}; 