// src/app/api/auth/reset-password/route.js
import { NextResponse } from 'next/server';
import { handlePasswordReset } from '@/lib/handlers/auth/resetPassword';

export async function POST(req) {
  try {
    const requestData = await req.json();

    if (!requestData || !requestData.token || !requestData.password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    const { token, password } = requestData;

    // Handle password reset
    const result = await handlePasswordReset(token, password);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in reset password:', error);
    
    if (error.message.includes('Invalid or expired')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to reset password',
      details: error.message 
    }, { status: 500 });
  }
}