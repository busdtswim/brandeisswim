const nodemailer = require('nodemailer');

/**
 * Send contact form email
 * @param {Object} contactData - Contact form data
 * @returns {Promise<Object>} Result of email sending
 */
async function handleContactSubmission(contactData) {
  try {
    const { name, email, message } = contactData;

    // Create a transporter using Gmail
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    // Send mail with defined transport object
    await transporter.sendMail({
      from: process.env.APP_EMAIL,
      to: process.env.BRANDEIS_EMAIL, 
      subject: `Contact Form Submission from ${email}`,
      text: `From: ${name}\n\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Contact Email:</strong> ${email}</p>
        <hr>
        <h3>Message:</h3>
        <p>${message}</p>
      `,
    });

    return {
      success: true,
      message: 'Email sent successfully'
    };
  } catch (error) {
    throw new Error('Failed to send email');
  }
}

module.exports = {
  handleContactSubmission
}; 