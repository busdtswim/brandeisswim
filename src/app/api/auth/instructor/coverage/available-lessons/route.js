// src/app/api/auth/instructor/coverage/available-lessons/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getAvailableLessons } from '@/lib/handlers/instructor/coverage';

// GET - Get available lessons for coverage requests
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For instructors, we need to find their instructor record using their email
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const availableLessons = await getAvailableLessons(userEmail);

    return NextResponse.json({
      availableLessons
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch available lessons', details: error.message },
      { status: 500 }
    );
  }
} 