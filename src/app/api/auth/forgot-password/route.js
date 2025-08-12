// src/app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import { handleForgotPassword } from '@/lib/handlers/auth/forgotPassword';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Handle forgot password request
    const result = await handleForgotPassword(email);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error.message 
    }, { status: 500 });
  }
}