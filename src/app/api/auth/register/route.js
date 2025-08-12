// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { registrationLimiter } from '@/lib/rateLimit';
import { handleRegistration } from '@/lib/handlers/auth/registration';

export async function POST(req) {
  // Apply rate limiting
  const rateLimitResult = await registrationLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: rateLimitResult.error }, { status: 429 });
  }

  try {
    const userData = await req.json();
    
    // Handle registration (validation happens in stores)
    const result = await handleRegistration(userData);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error types
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to register user', 
      details: error.message 
    }, { status: 500 });
  }
}