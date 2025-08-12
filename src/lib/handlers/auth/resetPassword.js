const UserStore = require('@/lib/stores/UserStore.js');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * Reset user password using reset token
 * @param {string} token - Reset token from URL
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Reset result
 */
async function handlePasswordReset(token, newPassword) {
  try {
    // Hash the token from the URL to compare with the one in the database
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with the hashed token and check if token is still valid
    const user = await UserStore.findByResetToken(resetTokenHash);

    if (!user || !user.reset_token_expiry || new Date(user.reset_token_expiry) <= new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password and clear the reset token fields
    await UserStore.update(user.id, {
      password: hashedPassword,
      reset_token: null,
      reset_token_expiry: null,
    });

    return {
      success: true,
      message: 'Password reset successful'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}

module.exports = {
  handlePasswordReset
}; 