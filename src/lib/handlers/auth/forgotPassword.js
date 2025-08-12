const UserStore = require('@/lib/stores/UserStore.js');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

/**
 * Generate reset token and expiry
 * @returns {Object} Token and expiry
 */
function generateResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { token, expiry: expiry.toISOString() };
}

/**
 * Send password reset email
 * @param {string} email - User's email
 * @param {string} resetToken - Reset token
 * @param {string} userName - User's name
 */
async function sendResetEmail(email, resetToken, userName) {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.APP_EMAIL,
    to: email,
    subject: 'Password Reset Request - Brandeis Swimming Lessons',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello ${userName},</p>
      <p>You requested a password reset for your Brandeis Swimming Lessons account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't request this reset, please ignore this email.</p>
      <p>Best regards,<br>Brandeis Swimming Lessons Team</p>
    `,
    text: `
      Password Reset Request
      
      Hello ${userName},
      
      You requested a password reset for your Brandeis Swimming Lessons account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 24 hours.
      
      If you didn't request this reset, please ignore this email.
      
      Best regards,
      Brandeis Swimming Lessons Team
    `
  });
}

/**
 * Handle forgot password request
 * @param {string} email - User's email
 * @returns {Promise<Object>} Result
 */
async function handleForgotPassword(email) {
  try {
    // Find user by email
    const user = await UserStore.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      };
    }

    // Generate reset token
    const { token, expiry } = generateResetToken();

    // Update user with reset token
    await UserStore.update(user.id, {
      reset_token: token,
      reset_token_expiry: expiry
    });

    // Send reset email
    await sendResetEmail(email, token, user.fullname);

    return {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    };
  } catch (error) {
    console.error('Forgot password error:', error);
    throw new Error('Failed to process password reset request');
  }
}

module.exports = {
  handleForgotPassword
}; 