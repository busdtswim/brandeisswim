// src/app/api/auth/instructor/coverage/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  getCoverageStats, 
  getInstructorCoverage, 
  createCoverageRequest 
} from '@/lib/handlers/instructor/coverage';

// GET - Get coverage data for an instructor
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

    // Get both stats and coverage requests
    const [stats, coverageRequests] = await Promise.all([
      getCoverageStats(userEmail),
      getInstructorCoverage(userEmail)
    ]);

    return NextResponse.json({
      stats,
      coverageRequests
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch coverage data', details: error.message }, 
      { status: 500 }
    );
  }
}

// POST - Create a new coverage request
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lesson_id, swimmer_id, request_date, reason, notes } = body;

    if (!lesson_id || !swimmer_id || !request_date) {
      return NextResponse.json({ 
        error: 'Lesson ID, swimmer ID, and request date are required' 
      }, { status: 400 });
    }

    // For instructors, we need to find their instructor record using their email
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }

    const coverageRequest = await createCoverageRequest({
      requesting_instructor_email: userEmail,
      lesson_id,
      swimmer_id,
      request_date,
      reason,
      notes
    });

    return NextResponse.json({
      success: true,
      coverageRequest
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create coverage request', details: error.message }, 
      { status: 500 }
    );
  }
} 