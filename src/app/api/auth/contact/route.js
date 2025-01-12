// src/app/api/auth/contact/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, email, message } = await req.json();

  // Create a transporter using Gmail
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
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

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}