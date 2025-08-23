// src/app/api/auth/validate-token/[token]/route.js
import { NextResponse } from 'next/server';
const UserStore = require('@/lib/stores/UserStore.js');

export async function GET(request, { params }) {
  try {
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Find user by one-time token
    const user = await UserStore.findByOneTimeToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 });
    }

    // Check if user still needs to change password
    if (!user.must_change_password) {
      return NextResponse.json({ error: 'Token already used' }, { status: 400 });
    }

    // Return user email for display (don't return sensitive data)
    return NextResponse.json({
      email: user.email,
      valid: true
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate token' },
      { status: 500 }
    );
  }
} 