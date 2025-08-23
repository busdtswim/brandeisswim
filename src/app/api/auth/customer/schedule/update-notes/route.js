// src/app/api/auth/customer/schedule/update-notes/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateInstructorNotes } from '@/lib/handlers/customer/schedule';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, swimmerId, notes } = await request.json();
    
    if (!lessonId || !swimmerId) {
      return NextResponse.json(
        { error: 'Lesson ID and Swimmer ID are required' },
        { status: 400 }
      );
    }

    // Update the instructor notes using the handler
    const result = await updateInstructorNotes(
      lessonId, 
      swimmerId, 
      notes, 
      session.user.email, 
      session.user.id
    );

    return NextResponse.json({ 
      message: 'Instructor notes updated successfully',
      result
    });

  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update instructor notes', details: error.message }, 
      { status: 500 }
    );
  }
} 