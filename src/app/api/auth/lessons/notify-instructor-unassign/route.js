import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { instructor, lessonDetails } = await req.json();
    if (!instructor?.email || !lessonDetails) {
      return NextResponse.json({ error: 'Missing required information' }, { status: 400 });
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.verify();

    const startDate = lessonDetails.startDate ? new Date(lessonDetails.startDate).toLocaleDateString() : 'Not specified';
    const endDate = lessonDetails.endDate ? new Date(lessonDetails.endDate).toLocaleDateString() : 'Not specified';
    const meetingDays = Array.isArray(lessonDetails.meetingDays) ? lessonDetails.meetingDays.join(', ') : lessonDetails.meetingDays;

    const mailOptions = {
      from: process.env.APP_EMAIL,
      to: instructor.email,
      subject: 'You have been unassigned from a swim lesson',
      text: `
        Hello ${instructor.name},

        You have been unassigned from the following swim lesson:

        Lesson Schedule:
        - Start Date: ${startDate}
        - End Date: ${endDate}
        - Meeting Days: ${meetingDays || 'Not specified'}
        - Time: ${lessonDetails.time || 'Not specified'}

        If you have any questions or concerns, please contact the administration.

        Best regards,
        Brandeis Swimming Lessons Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b91c1c;">Swim Lesson Unassignment Notice</h2>
          <p>Hello ${instructor.name},</p>
          <p>You have been <strong>unassigned</strong> from the following swim lesson:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #003478; margin-top: 0;">Lesson Schedule:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>Start Date:</strong> ${startDate}</li>
              <li><strong>End Date:</strong> ${endDate}</li>
              <li><strong>Meeting Days:</strong> ${meetingDays}</li>
              <li><strong>Time:</strong> ${lessonDetails.time}</li>
            </ul>
          </div>
          <p>If you have any questions or concerns, please contact the administration.</p>
          <p style="margin-top: 20px;">Best regards,<br>Brandeis Swimming Lessons Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'Unassignment notification email sent successfully',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Error sending unassignment notification:', error);
    return NextResponse.json({ error: 'Failed to send unassignment notification', details: error.message }, { status: 500 });
  }
} 