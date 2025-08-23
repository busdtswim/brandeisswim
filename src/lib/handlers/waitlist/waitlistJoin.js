const WaitlistStore = require('@/lib/stores/WaitlistStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const UserStore = require('@/lib/stores/UserStore.js');

/**
 * Join waitlist for a swimmer
 * @param {number} swimmerId - Swimmer ID
 * @param {string} userEmail - Current user's email
 * @param {number} [userId] - Current user's ID (more reliable)
 * @returns {Promise<Object>} Waitlist join result
 */
async function handleWaitlistJoin(swimmerId, userEmail, userId = null) {
  try {
    const swimmerIdInt = parseInt(swimmerId);
    if (isNaN(swimmerIdInt)) {
      throw new Error('Invalid swimmer ID');
    }

    // Get user by ID first (more reliable), fallback to email
    let user;
    if (userId) {
      user = await UserStore.findById(userId);
    }
    if (!user && userEmail) {
      user = await UserStore.findByEmail(userEmail);
    }
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check if swimmer belongs to the current user by user ID
    const swimmer = await SwimmerStore.findById(swimmerIdInt);

    if (!swimmer || swimmer.user_id !== user.id) {
      throw new Error('Swimmer not found or does not belong to this user');
    }

    // Check if swimmer is already on the waitlist
    const existingEntries = await WaitlistStore.findBySwimmerId(swimmerIdInt);
    const existingEntry = existingEntries.find(entry => entry.status === 'active');

    if (existingEntry) {
      throw new Error('Swimmer is already on the waitlist');
    }

    // Add swimmer to waitlist (position will be auto-assigned)
    const waitlistEntry = await WaitlistStore.create({
      swimmer_id: swimmerIdInt,
      status: 'active'
    });

    return {
      success: true,
      message: 'Successfully added to waitlist',
      position: waitlistEntry.position
    };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  handleWaitlistJoin
}; 