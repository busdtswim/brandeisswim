const nodemailer = require('nodemailer');

/**
 * @typedef {Object} MissingDateNotificationData
 * @property {string} swimmerName - Name of the swimmer
 * @property {string} parentName - Name of the parent/guardian
 * @property {string} parentEmail - Email of the parent/guardian
 * @property {string} lessonDetails - Details about the lesson
 * @property {string} missingDates - Comma-separated list of missing dates
 * @property {string} changeType - Type of change (e.g., "added", "updated")
 */

class EmailStore {
  /**
   * Create email transporter
   * @returns {Object} Nodemailer transporter
   */
  static createTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }

  /**
   * Send missing dates notification to Brandeis email
   * @param {MissingDateNotificationData} data - Notification data
   * @returns {Promise<Object>} Result of email sending
   */
  static async sendMissingDateNotification(data) {
    try {
      const transporter = this.createTransporter();
      
      const subject = `Missing Dates ${data.changeType.charAt(0).toUpperCase() + data.changeType.slice(1)} - ${data.swimmerName}`;
      
      const text = `
Missing Dates ${data.changeType.charAt(0).toUpperCase() + data.changeType.slice(1)}

Swimmer: ${data.swimmerName}
Parent/Guardian: ${data.parentName}
Email: ${data.parentEmail}
Lesson: ${data.lessonDetails}
Action: ${data.changeType} missing dates

Missing Dates: ${data.missingDates}

This change was made on ${new Date().toLocaleString()}.
Note: Missing dates are permanent and help accommodate waitlist swimmers.
      `;

      const html = `
        <h2>Missing Dates ${data.changeType.charAt(0).toUpperCase() + data.changeType.slice(1)}</h2>
        <p><strong>Swimmer:</strong> ${data.swimmerName}</p>
        <p><strong>Parent/Guardian:</strong> ${data.parentName}</p>
        <p><strong>Email:</strong> ${data.parentEmail}</p>
        <p><strong>Lesson:</strong> ${data.lessonDetails}</p>
        <p><strong>Action:</strong> ${data.changeType} missing dates</p>
        <hr>
        <h3>Missing Dates:</h3>
        <p>${data.missingDates}</p>
        <hr>
        <p><em>This change was made on ${new Date().toLocaleString()}.</em></p>
        <p><strong>Note:</strong> Missing dates are permanent and help accommodate waitlist swimmers.</p>
      `;

      await transporter.sendMail({
        from: process.env.APP_EMAIL,
        to: process.env.BRANDEIS_EMAIL,
        subject: subject,
        text: text,
        html: html,
      });

      return {
        success: true,
        message: 'Missing dates notification email sent successfully'
      };
    } catch (error) {
      throw new Error(`Failed to send missing dates notification email: ${error.message}`);
    }
  }

  /**
   * Send general notification email
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} text - Plain text content
   * @param {string} html - HTML content
   * @returns {Promise<Object>} Result of email sending
   */
  static async sendGeneralNotification(to, subject, text, html) {
    try {
      const transporter = this.createTransporter();
      
      await transporter.sendMail({
        from: process.env.APP_EMAIL,
        to: to,
        subject: subject,
        text: text,
        html: html,
      });

      return {
        success: true,
        message: 'General notification email sent successfully'
      };
    } catch (error) {
      throw new Error(`Failed to send general notification email: ${error.message}`);
    }
  }
}

module.exports = EmailStore; 