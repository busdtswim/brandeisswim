// src/app/api/auth/instructor/change-password/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcrypt';
const UserStore = require('@/lib/stores/UserStore.js');

export async function PUT(request) {
  try {
    const { newPassword, token } = await request.json();

    if (!newPassword) {
      return NextResponse.json({ error: 'New password is required' }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find user by token
    const user = await UserStore.findByOneTimeToken(token);
    if (!user || !user.must_change_password) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user with new password and clear must_change_password flags
    await UserStore.update(user.id, {
      password: hashedPassword,
      must_change_password: false,
      one_time_login_token: null
    });

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to change password', details: error.message }, 
      { status: 500 }
    );
  }
} 