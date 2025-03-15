// src/app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    // Hash the token from the URL to compare with the one in the database
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with the hashed token and check if token is still valid
    const user = await prisma.users.findFirst({
      where: {
        reset_token: resetTokenHash,
        reset_token_expiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user's password and clear the reset token fields
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      },
    });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}