// src/app/api/auth/customer/schedule/remove-swimmer/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, swimmerId } = await request.json();
    
    if (!lessonId || !swimmerId) {
      return NextResponse.json(
        { error: 'Lesson ID and Swimmer ID are required' },
        { status: 400 }
      );
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
      return NextResponse.json({ error: 'Unauthorized to remove this swimmer' }, { status: 403 });
    }

    // Remove the swimmer from the lesson
    const result = await SwimmerLessonStore.delete(swimmerId, lessonId);
    
    if (!result) {
      return NextResponse.json({ error: 'Failed to remove swimmer from lesson' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Swimmer removed from lesson successfully',
      result
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove swimmer from lesson', details: error.message }, 
      { status: 500 }
    );
  }
} 