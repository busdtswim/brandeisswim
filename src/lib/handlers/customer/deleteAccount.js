const UserStore = require('../../stores/UserStore');

/**
 * Delete a customer account and all associated data
 * @param {number} userId - The ID of the customer to delete
 * @returns {Promise<Object>} - Result of the deletion operation
 */
async function deleteCustomerAccount(userId) {
  try {
    // Use the store method to delete user and all associated data
    const result = await UserStore.deleteUserAndAllData(userId);
    
    return {
      success: true,
      message: 'Account deleted successfully',
      deletedSwimmers: result.deletedSwimmers,
      deletedUser: { id: result.id }
    };

  } catch (error) {
    throw new Error(`Failed to delete customer account: ${error.message}`);
  }
}

module.exports = {
  deleteCustomerAccount
}; 