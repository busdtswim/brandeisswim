// src/app/api/auth/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Get all swimmers for this user
    const swimmers = await SwimmerStore.findByUserId(userId);
    
    // Delete all swim lesson registrations for all swimmers of this user
    for (const swimmer of swimmers) {
      const swimmerLessons = await SwimmerLessonStore.findBySwimmerId(swimmer.id);
      for (const swimmerLesson of swimmerLessons) {
        await SwimmerLessonStore.delete(swimmer.id, swimmerLesson.lesson_id);
      }
    }

    // Delete all swimmers belonging to this user
    for (const swimmer of swimmers) {
      await SwimmerStore.delete(swimmer.id);
    }

    // Finally delete the user
    const deletedUser = await UserStore.delete(userId);
    
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
  }
}