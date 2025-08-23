// src/app/api/auth/admin/coverage/lesson/[lessonId]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCoverageByLesson } from '@/lib/handlers/admin/coverage';

// GET - Get coverage data for a specific lesson
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const lessonIdInt = parseInt(lessonId);
    
    if (isNaN(lessonIdInt)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    const coverageRequests = await getCoverageByLesson(lessonIdInt);

    return NextResponse.json({
      coverageRequests
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lesson coverage', details: error.message }, 
      { status: 500 }
    );
  }
} 