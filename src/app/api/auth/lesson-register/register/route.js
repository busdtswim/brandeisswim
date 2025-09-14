// src/app/api/auth/lesson-register/register/route.js
import { NextResponse } from 'next/server';
import { lessonRegistrationLimiter } from '@/lib/rateLimit';
import { handleLessonRegistration } from '@/lib/handlers/lessons/lessonRegistration';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  // Apply rate limiting
  const rateLimitResult = await lessonRegistrationLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: rateLimitResult.error }, { status: 429 });
  }

  try {
    const registrationData = await req.json();
    
    // Validate required fields
    if (!registrationData || !registrationData.swimmerId || !registrationData.lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields: swimmerId and lessonId' },
        { status: 400 }
      );
    }

    // Handle lesson registration
    const result = await handleLessonRegistration(registrationData);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Lesson registration error:', error);
    
    // Handle specific error types
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    if (error.message.includes('already registered') || error.message.includes('full')) {
    
    if (error.message.includes('Registration is no longer allowed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to register for lesson',
      details: error.message 
    }, { status: 500 });
  }
}