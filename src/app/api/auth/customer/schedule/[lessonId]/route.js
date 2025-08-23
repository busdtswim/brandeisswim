// src/app/api/auth/customer/schedule/[lessonId]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

// Update preferences
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const { swimmerId, preferredInstructorId, instructorNotes } = await request.json();

    if (!lessonId || isNaN(parseInt(lessonId)) || !swimmerId || isNaN(parseInt(swimmerId))) {
      return NextResponse.json({ error: 'Invalid lesson ID or swimmer ID' }, { status: 400 });
    }

    const updated = await SwimmerLessonStore.update(parseInt(swimmerId), parseInt(lessonId), {
      preferred_instructor_id: preferredInstructorId ? parseInt(preferredInstructorId) : null,
      instructor_notes: instructorNotes
    });

    if (!updated) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update preferences', details: error.message }, { status: 500 });
  }
}

// Cancel registration
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = await params;
    const { swimmerId } = await request.json();

    if (!lessonId || isNaN(parseInt(lessonId)) || !swimmerId || isNaN(parseInt(swimmerId))) {
      return NextResponse.json({ error: 'Invalid lesson ID or swimmer ID' }, { status: 400 });
    }

    const deleted = await SwimmerLessonStore.delete(parseInt(swimmerId), parseInt(lessonId));

    if (!deleted) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to cancel registration', details: error.message }, { status: 500 });
  }
}