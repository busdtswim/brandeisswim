// src/app/api/auth/customer/swimmers/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');
const WaitlistStore = require('@/lib/stores/WaitlistStore.js');

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Swimmer ID is required' }, { status: 400 });
    }

    const swimmerId = parseInt(id);
    if (isNaN(swimmerId)) {
      return NextResponse.json({ error: 'Invalid swimmer ID' }, { status: 400 });
    }

    // Get user by ID first (more reliable), fallback to email
    let user;
    if (session.user.id) {
      user = await UserStore.findById(session.user.id);
    }
    if (!user && session.user.email) {
      user = await UserStore.findByEmail(session.user.email);
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the swimmer belongs to this user
    const swimmer = await SwimmerStore.findById(swimmerId);
    if (!swimmer) {
      return NextResponse.json({ error: 'Swimmer not found' }, { status: 404 });
    }

    if (swimmer.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this swimmer' }, { status: 403 });
    }

    // Delete all lesson registrations for this swimmer
    const swimmerLessons = await SwimmerLessonStore.findBySwimmerId(swimmerId);
    for (const swimmerLesson of swimmerLessons) {
      await SwimmerLessonStore.delete(swimmerId, swimmerLesson.lesson_id);
    }

    // Delete all waitlist entries for this swimmer
    const waitlistEntries = await WaitlistStore.findBySwimmerId(swimmerId);
    for (const waitlistEntry of waitlistEntries) {
      await WaitlistStore.delete(waitlistEntry.id);
    }

    // Finally, delete the swimmer
    const deletedSwimmer = await SwimmerStore.delete(swimmerId);
    if (!deletedSwimmer) {
      return NextResponse.json({ error: 'Failed to delete swimmer' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Swimmer deleted successfully',
      deletedSwimmer,
      deletedLessonRegistrations: swimmerLessons.length,
      deletedWaitlistEntries: waitlistEntries.length
    });

  } catch (error) {
    console.error('Error deleting swimmer:', error);
    return NextResponse.json(
      { error: 'Failed to delete swimmer', details: error.message }, 
      { status: 500 }
    );
  }
} 