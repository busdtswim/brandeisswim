// src/app/api/auth/admin/swimmers/[id]/route.js
import { NextResponse } from 'next/server';
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Swimmer ID is required' }, { status: 400 });
    }

    const swimmerId = parseInt(id);
    if (isNaN(swimmerId)) {
      return NextResponse.json({ error: 'Invalid swimmer ID' }, { status: 400 });
    }

    const swimmer = await SwimmerStore.findById(swimmerId);

    if (!swimmer) {
      return NextResponse.json({ error: 'Swimmer not found' }, { status: 404 });
    }

    // Delete all lesson registrations for this swimmer
    const swimmerLessons = await SwimmerLessonStore.findBySwimmerId(swimmerId);
    for (const swimmerLesson of swimmerLessons) {
      await SwimmerLessonStore.delete(swimmerId, swimmerLesson.lesson_id);
    }

    // Delete the swimmer
    await SwimmerStore.delete(swimmerId);

    return NextResponse.json({ message: 'Swimmer deleted successfully' });
  } catch (error) {
    console.error('Error deleting swimmer:', error.message);
    return NextResponse.json({ error: 'Failed to delete swimmer' }, { status: 500 });
  }
}