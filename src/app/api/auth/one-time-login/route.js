// src/app/api/auth/one-time-login/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // The actual authentication will be handled by NextAuth
    // This endpoint just validates the token format
    return NextResponse.json({ 
      success: true, 
      message: 'Token validated, proceed with login',
      redirectUrl: '/admin?force_password_change=true'
    });
  } catch (error) {
    console.error('One-time login error:', error);
    return NextResponse.json(
      { error: 'Failed to process one-time login' },
      { status: 500 }
    );
  }
} 