const UserStore = require('@/lib/stores/UserStore.js');
const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const WaitlistStore = require('@/lib/stores/WaitlistStore.js');
const { getCurrentDateString } = require('@/lib/utils/dateUtils');

/**
 * Get admin dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
async function getAdminStats() {
  try {
    // Get current date as a string in MM/DD/YYYY format
    const formattedCurrentDate = getCurrentDateString();

    // Run all queries in parallel for better performance
    const [
      allUsers,
      allSwimmers,   
      allLessons,
      activeWaitlistEntries
    ] = await Promise.all([
      // User stats
      UserStore.findAll(),
      
      // Swimmer stats
      SwimmerStore.findAll(),
      
      // All lessons
      LessonStore.findAll(),
      
      // Active waitlist entries
      WaitlistStore.findByStatus('active')
    ]);

    // Calculate user stats - only customer users (not admins)
    const userStats = allUsers.filter(user => user.role === 'customer').length;
    
    // Calculate swimmer stats
    const swimmerCount = allSwimmers.length;
    
    // Calculate active lessons - using string comparison with MM/DD/YYYY format
    const activeLessonCount = allLessons.filter(lesson => {
      if (!lesson.start_date || !lesson.end_date) return false;
      return lesson.start_date <= formattedCurrentDate && lesson.end_date >= formattedCurrentDate;
    }).length;
    
    // Calculate waitlist stats
    const waitlistCount = activeWaitlistEntries.length;

    return {
      totalUsers: userStats,
      totalSwimmers: swimmerCount,
      activeClasses: activeLessonCount,
      waitlistEntries: waitlistCount
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw new Error('Failed to fetch admin statistics');
  }
}

module.exports = {
  getAdminStats
}; 