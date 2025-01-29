// src/app/api/auth/customer/schedule/[lessonId]/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Update preferences
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = params;
    const { swimmerId, preferredInstructorId, instructorNotes } = await request.json();

    const updated = await prisma.swimmer_lessons.update({
      where: {
        swimmer_id_lesson_id: {
          swimmer_id: parseInt(swimmerId),
          lesson_id: parseInt(lessonId)
        }
      },
      data: {
        preferred_instructor_id: preferredInstructorId ? parseInt(preferredInstructorId) : null,
        instructor_notes: instructorNotes
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}

// Cancel registration
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = params;
    const { swimmerId } = await request.json();

    await prisma.swimmer_lessons.delete({
      where: {
        swimmer_id_lesson_id: {
          swimmer_id: parseInt(swimmerId),
          lesson_id: parseInt(lessonId)
        }
      }
    });

    return NextResponse.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    return NextResponse.json({ error: 'Failed to cancel registration' }, { status: 500 });
  }
}