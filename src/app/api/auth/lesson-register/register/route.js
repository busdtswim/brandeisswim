// src/app/api/auth/lesson-register/register/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonIdInt },
      include: { 
        _count: { 
          select: { swimmer_lessons: true } 
        } 
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Check if the lesson is full
    if (lesson._count.swimmer_lessons >= lesson.max_slots) {
      return NextResponse.json(
        { error: 'This lesson is full' },
        { status: 400 }
      );
    }

    // Check if swimmer exists
    const swimmer = await prisma.swimmers.findUnique({
      where: { id: swimmerIdInt }
    });

    if (!swimmer) {
      return NextResponse.json(
        { error: 'Swimmer not found' },
        { status: 404 }
      );
    }

    // Check if swimmer is already registered for this lesson
    const existingRegistration = await prisma.swimmer_lessons.findUnique({
      where: {
        swimmer_id_lesson_id: {
          swimmer_id: swimmerIdInt,
          lesson_id: lessonIdInt
        }
      }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Swimmer is already registered for this lesson' },
        { status: 400 }
      );
    }

    const registration = await prisma.swimmer_lessons.create({
      data: {
        swimmer_id: swimmerIdInt,
        lesson_id: lessonIdInt,
        preferred_instructor_id: preferredInstructorIdInt,
        instructor_notes: instructorNotes || null
      }
    });
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Fetch the updated lesson
    const updatedLesson = await prisma.lessons.findUnique({
      where: { id: lessonIdInt },
      include: { 
        _count: { 
          select: { swimmer_lessons: true } 
        },
        swimmer_lessons: {
          include: {
            swimmers: true,
            instructors_swimmer_lessons_instructor_idToinstructors: true,          
            instructors_swimmer_lessons_preferred_instructor_idToinstructors: true 
          }
        }
      }
    });

    return NextResponse.json({
      ...updatedLesson,
      registered: updatedLesson._count.swimmer_lessons,
      success: true,
      message: 'Registration successful',
      registrationId: registration.id
    });

  } catch (error) {
    console.error('Error registering for lesson:', error);
    return NextResponse.json(
      { 
        error: 'Failed to register for lesson',
        details: error.message 
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}