// src/app/api/auth/lesson-register/slots/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getLessonSlots } from '@/lib/handlers/lessons/lessonSlots';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get lesson slots
    const lessons = await getLessonSlots();
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lesson slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson slots' }, 
      { status: 500 }
    );
  }
}