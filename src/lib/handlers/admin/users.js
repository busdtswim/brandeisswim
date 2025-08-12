const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');
const { calculateAge } = require('@/lib/utils/dateUtils');

/**
 * Get all customer users with their swimmers and lesson counts
 * @returns {Promise<Array>} Formatted user data
 */
async function getAdminUsers() {
  try {
    // Get all users with role 'customer'
    const users = await UserStore.findAll();
    const customerUsers = users.filter(user => user.role === 'customer');

    const formattedUsers = await Promise.all(customerUsers.map(async (user) => {
      // Get swimmers for this user
      const swimmers = await SwimmerStore.findByUserId(user.id);
      
      const formattedSwimmers = await Promise.all(swimmers.map(async (swimmer) => {
        // Get lesson count for this swimmer
        const swimmerLessons = await SwimmerLessonStore.findBySwimmerId(swimmer.id);
        
        return {
          id: swimmer.id,
          name: swimmer.name,
          age: swimmer.birthdate ? calculateAge(swimmer.birthdate) : null,
          proficiency: swimmer.proficiency || 'N/A',
          gender: swimmer.gender || 'N/A',
          total_lessons: swimmerLessons.length
        };
      }));

      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone_number: user.phone_number,
        swimmers: formattedSwimmers
      };
    }));

    return formattedUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

module.exports = {
  getAdminUsers
}; 