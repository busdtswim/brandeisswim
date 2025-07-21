// src/app/api/auth/admin/lessons/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const lessonId = parseInt(id);
    
    if (isNaN(lessonId)) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    // Check if lesson exists
    const lesson = await LessonStore.findById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Delete all swimmer lesson registrations for this lesson
    const swimmerLessons = await SwimmerLessonStore.findByLessonId(lessonId);
    for (const swimmerLesson of swimmerLessons) {
      await SwimmerLessonStore.delete(swimmerLesson.swimmer_id, lessonId);
    }

    // Delete the lesson
    await LessonStore.delete(lessonId);

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' }, 
      { status: 500 }
    );
  }
}