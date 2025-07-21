// src/app/api/auth/lesson-register/register/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function POST(req) {
  try {
    // Validate request body
    const body = await req.json();
    
    if (!body || !body.swimmerId || !body.lessonId) {
      return NextResponse.json(
        { error: 'Missing required fields: swimmerId and lessonId' },
        { status: 400 }
      );
    }

    const { swimmerId, lessonId, preferredInstructorId, instructorNotes } = body;

    // Convert IDs to integers
    const swimmerIdInt = parseInt(swimmerId);
    const lessonIdInt = parseInt(lessonId);
    const preferredInstructorIdInt = preferredInstructorId ? parseInt(preferredInstructorId) : null;

    if (isNaN(swimmerIdInt) || isNaN(lessonIdInt)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Check if the lesson exists
    const lesson = await LessonStore.findById(lessonIdInt);

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Check if the lesson is full
    const currentParticipants = await SwimmerLessonStore.countByLessonId(lessonIdInt);
    if (currentParticipants >= lesson.max_slots) {
      return NextResponse.json(
        { error: 'This lesson is full' },
        { status: 400 }
      );
    }

    // Check if swimmer exists
    const swimmer = await SwimmerStore.findById(swimmerIdInt);

    if (!swimmer) {
      return NextResponse.json(
        { error: 'Swimmer not found' },
        { status: 404 }
      );
    }

    // Check if swimmer is already registered for this lesson
    const existingRegistration = await SwimmerLessonStore.findBySwimmerAndLesson(swimmerIdInt, lessonIdInt);

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Swimmer is already registered for this lesson' },
        { status: 400 }
      );
    }

    const registration = await SwimmerLessonStore.create({
      swimmer_id: swimmerIdInt,
      lesson_id: lessonIdInt,
      preferred_instructor_id: preferredInstructorIdInt,
      instructor_notes: instructorNotes || null
    });
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Fetch the updated lesson with participants
    const updatedLesson = await LessonStore.findWithParticipants();
    const targetLesson = updatedLesson.find(l => l.id === lessonIdInt);

    if (!targetLesson) {
      return NextResponse.json(
        { error: 'Failed to fetch updated lesson' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...targetLesson,
      registered: targetLesson.participants.length,
      success: true,
      message: 'Registration successful',
      registrationId: registration.swimmer_id + '_' + registration.lesson_id
    });

  } catch (error) {
    console.error('Error registering for lesson:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // Handle unique constraint violations
    if (error.message.includes('already registered')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to register for lesson',
        details: error.message 
      }, 
      { status: 500 }
    );
  }
}