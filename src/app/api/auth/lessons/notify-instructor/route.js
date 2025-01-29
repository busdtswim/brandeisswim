// src/app/api/auth/lessons/notify-instructor/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { instructor, swimmer, lessonDetails } = await req.json();
    
    // Validate the required data
    if (!instructor?.email || !swimmer || !lessonDetails) {
      console.error('Missing required data:', { instructor, swimmer, lessonDetails });
      return NextResponse.json({ 
        error: 'Missing required information' 
      }, { status: 400 });
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
      subject: 'New Swim Lesson Assignment',
      text: `
        Hello ${instructor.name},

        You have been assigned a new swim lesson:

        Student Information:
        - Name: ${swimmer.name || 'Not specified'}
        - Age: ${swimmer.age || 'Not specified'}
        - Gender: ${swimmer.gender || 'Not specified'}
        - Proficiency Level: ${swimmer.proficiency || 'Not specified'}
        ${swimmer.instructor_notes ? `- Special Notes: ${swimmer.instructor_notes}` : ''}

        Lesson Schedule:
        - Start Date: ${startDate}
        - End Date: ${endDate}
        - Meeting Days: ${meetingDays || 'Not specified'}
        - Time: ${lessonDetails.time || 'Not specified'}

        Please make sure to review the schedule and be prepared for your lessons.
        If you have any questions or concerns, please contact the administration.

        Best regards,
        Brandeis Swimming Lessons Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003478;">New Swim Lesson Assignment</h2>
          
          <p>Hello ${instructor.name},</p>
          
          <p>You have been assigned a new swim lesson:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #003478; margin-top: 0;">Student Information:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>Name:</strong> ${swimmer.name}</li>
              <li><strong>Age:</strong> ${swimmer.age}</li>
              <li><strong>Gender:</strong> ${swimmer.gender}</li>
              <li><strong>Proficiency Level:</strong> ${swimmer.proficiency}</li>
              ${swimmer.instructor_notes ? `<li style="margin-top: 10px; color: #666;"><strong>Special Notes:</strong> ${swimmer.instructor_notes}</li>` : ''}
            </ul>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="color: #003478; margin-top: 0;">Lesson Schedule:</h3>
            <ul style="list-style: none; padding-left: 0;">
              <li><strong>Start Date:</strong> ${startDate}</li>
              <li><strong>End Date:</strong> ${endDate}</li>
              <li><strong>Meeting Days:</strong> ${meetingDays}</li>
              <li><strong>Time:</strong> ${lessonDetails.time}</li>
            </ul>
          </div>
          
          <p>Please make sure to review the schedule and be prepared for your lessons.</p>
          <p>If you have any questions or concerns, please contact the administration.</p>
          
          <p style="margin-top: 20px;">Best regards,<br>Brandeis Swimming Lessons Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'Notification email sent successfully',
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('Detailed error in notify-instructor:', error);
    return NextResponse.json({ 
      error: 'Failed to send notification email',
      details: error.message 
    }, { status: 500 });
  }
}