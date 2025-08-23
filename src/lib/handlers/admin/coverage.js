const CoverageStore = require('@/lib/stores/CoverageStore.js');

/**
 * Get coverage data for a specific lesson
 * @param {number} lessonId
 * @returns {Promise<Array>} Coverage requests for the lesson
 */
async function getCoverageByLesson(lessonId) {
  try {
    const coverageRequests = await CoverageStore.findByLesson(lessonId);
    return coverageRequests;
  } catch (error) {
    throw new Error('Failed to fetch coverage data for lesson');
  }
}

/**
 * Get coverage data for a specific swimmer
 * @param {number} swimmerId
 * @returns {Promise<Array>} Coverage requests for the swimmer
 */
async function getCoverageBySwimmer(swimmerId) {
  try {
    const coverageRequests = await CoverageStore.findBySwimmer(swimmerId);
    return coverageRequests;
  } catch (error) {
    throw new Error('Failed to fetch coverage data for swimmer');
  }
}

/**
 * Get all coverage data
 * @returns {Promise<Array>} All coverage requests
 */
async function getAllCoverage() {
  try {
    const coverageRequests = await CoverageStore.findAll();
    return coverageRequests;
  } catch (error) {
    throw new Error('Failed to fetch all coverage data');
  }
}

module.exports = {
  getCoverageByLesson,
  getCoverageBySwimmer,
  getAllCoverage
}; 