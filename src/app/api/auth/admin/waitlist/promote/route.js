import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const { handleWaitlistPromotion } = require('@/lib/handlers/admin/waitlistPromote.js');

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { waitlistId, lessonId, preferredInstructorId, adminNote } = body || {};

    if (!waitlistId || !lessonId) {
      return NextResponse.json({ error: 'waitlistId and lessonId are required' }, { status: 400 });
    }

    const result = await handleWaitlistPromotion({
      waitlistId,
      lessonId,
      preferredInstructorId: preferredInstructorId ?? null,
      adminNote: adminNote ?? null,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error promoting waitlist entry:', error);
    return NextResponse.json({ error: error.message || 'Failed to promote waitlist entry' }, { status: 400 });
  }
} 