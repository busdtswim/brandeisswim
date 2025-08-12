const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');

/**
 * Get customer profile with swimmers
 * @param {string} userEmail - User's email
 * @returns {Promise<Object>} User profile with swimmers
 */
async function getCustomerProfile(userEmail) {
  try {
    const user = await UserStore.findByEmail(userEmail);

    if (!user) {
      throw new Error('User not found');
    }

    // Get swimmers for this user
    const swimmers = await SwimmerStore.findByUserId(user.id);

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;
    return {
      success: true,
      ...userWithoutPassword,
      swimmers
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Update customer profile
 * @param {string} userEmail - User's email
 * @param {Object} updateData - Profile update data
 * @returns {Promise<Object>} Updated user profile
 */
async function updateCustomerProfile(userEmail, updateData) {
  try {
    const user = await UserStore.findByEmail(userEmail);
    
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await UserStore.update(user.id, {
      email: updateData.email,
      phone_number: updateData.phoneNumber,
      fullname: updateData.fullName,
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return {
      success: true,
      ...userWithoutPassword
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

module.exports = {
  getCustomerProfile,
  updateCustomerProfile
}; 