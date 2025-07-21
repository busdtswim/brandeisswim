// src/app/api/auth/customer/password/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcrypt';
const UserStore = require('@/lib/stores/UserStore.js');

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { oldPassword, password } = await request.json();
    if (!oldPassword || !password) {
      return NextResponse.json({ error: 'Old password and new password are required.' }, { status: 400 });
    }

    // Password policy: 8+ chars, upper, lower, number, special
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordPolicy.test(password)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.' }, { status: 400 });
    }

    // Find user by email
    const user = await UserStore.findByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Old password is incorrect.' }, { status: 400 });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the password
    await UserStore.update(user.id, { password: hashedPassword });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' }, 
      { status: 500 }
    );
  }
}