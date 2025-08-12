const WaitlistStore = require('@/lib/stores/WaitlistStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');

/**
 * Join waitlist for a swimmer
 * @param {number} swimmerId - Swimmer ID
 * @param {string} userEmail - Current user's email
 * @returns {Promise<Object>} Waitlist join result
 */
async function handleWaitlistJoin(swimmerId, userEmail) {
  try {
    const swimmerIdInt = parseInt(swimmerId);
    if (isNaN(swimmerIdInt)) {
      throw new Error('Invalid swimmer ID');
    }

    // Check if swimmer belongs to the current user
    const swimmer = await SwimmerStore.findByIdWithUser(swimmerIdInt);

    if (!swimmer || swimmer.email !== userEmail) {
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
    console.error('Waitlist join error:', error);
    throw error;
  }
}

module.exports = {
  handleWaitlistJoin
}; 