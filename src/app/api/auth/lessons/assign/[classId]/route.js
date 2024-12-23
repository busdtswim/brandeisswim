// src/app/api/auth/lessons/assign/[classId]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hasScheduleConflict } from '@/utils/timeUtils';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const classId = params.classId;
    const { swimmerId, instructorId } = await request.json();

    if (!classId || !swimmerId) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    // If removing instructor assignment
    if (!instructorId) {
      const updatedAssignment = await prisma.swimmer_lessons.update({
        where: {
          swimmer_id_lesson_id: {
            swimmer_id: parseInt(swimmerId),
            lesson_id: parseInt(classId)
          }
        },
        data: {
          instructor_id: null
        }
      });
      return NextResponse.json(updatedAssignment);
    }

    // Get the current lesson
    const currentLesson = await prisma.lessons.findUnique({
      where: { id: parseInt(classId) }
    });

    // Get instructor's other assignments
    const instructorSchedule = await prisma.swimmer_lessons.findMany({
      where: {
        instructor_id: parseInt(instructorId),
        NOT: {
          AND: {
            swimmer_id: parseInt(swimmerId),
            lesson_id: parseInt(classId)
          }
        }
      },
      include: {
        lessons: true
      }
    });

    // Check for conflicts
    for (const assignment of instructorSchedule) {
      if (hasScheduleConflict(currentLesson, assignment.lessons)) {
        return NextResponse.json(
          { error: 'Instructor has a scheduling conflict' }, 
          { status: 400 }
        );
      }
    }

    // If no conflicts, update the assignment
    const updatedAssignment = await prisma.swimmer_lessons.update({
      where: {
        swimmer_id_lesson_id: {
          swimmer_id: parseInt(swimmerId),
          lesson_id: parseInt(classId)
        }
      },
      data: {
        instructor_id: parseInt(instructorId)
      }
    });

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error('Error assigning instructor:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assign instructor' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}