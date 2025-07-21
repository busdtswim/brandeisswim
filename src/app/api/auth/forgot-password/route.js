// src/app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
const UserStore = require('@/lib/stores/UserStore.js');

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user by email
    const user = await UserStore.findByEmail(email);

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({ 
        message: 'If your email is registered, you will receive a password reset link' 
      });
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token valid for 1 hour

    // Store token in database
    await UserStore.update(user.id, {
      reset_token: resetTokenHash,
      reset_token_expiry: resetTokenExpiry,
    });

    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.APP_EMAIL,
      to: user.email,
      subject: 'Brandeis Swim Lessons - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #003478;">Reset Your Password</h2>
          <p>Hello ${user.fullname || user.email},</p>
          <p>We've received a request to reset your password for your Brandeis Swim Lessons account.</p>
          <p>Please click the button below to reset your password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #003478; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 14px;">Brandeis Swim Lessons</p>
        </div>
      `,
    });

    return NextResponse.json({ 
      message: 'If your email is registered, you will receive a password reset link' 
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}