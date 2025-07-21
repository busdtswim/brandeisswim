// src/app/api/auth/lessons/remove-swimmer/route.js
import { NextResponse } from 'next/server';
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function DELETE(request) {
  try {
    const { lessonId, swimmerId } = await request.json();

    if (!lessonId || !swimmerId) {
      return NextResponse.json(
        { error: 'Lesson ID and Swimmer ID are required' },
        { status: 400 }
      );
    }

    const lessonIdInt = parseInt(lessonId);
    const swimmerIdInt = parseInt(swimmerId);

    if (isNaN(lessonIdInt) || isNaN(swimmerIdInt)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID or swimmer ID' },
        { status: 400 }
      );
    }

    const deletedRegistration = await SwimmerLessonStore.delete(swimmerIdInt, lessonIdInt);

    if (!deletedRegistration) {
      return NextResponse.json(
        { error: 'Swimmer not found in this lesson' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Swimmer removed successfully' });
  } catch (error) {
    console.error('Error removing swimmer:', error);
    return NextResponse.json(
      { error: 'Failed to remove swimmer from lesson' },
      { status: 500 }
    );
  }
}