// src/app/api/auth/lessons/assign/[classId]/route.js
import { NextResponse } from 'next/server';
import { hasScheduleConflict } from '@/lib/utils/timeUtils';
const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function PUT(request, { params }) {
  try {
    const { classId } = await params;
    const { swimmerId, instructorId } = await request.json();

    if (!classId || !swimmerId) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    const classIdInt = parseInt(classId);
    const swimmerIdInt = parseInt(swimmerId);

    if (isNaN(classIdInt) || isNaN(swimmerIdInt)) {
      return NextResponse.json(
        { error: 'Invalid class ID or swimmer ID' }, 
        { status: 400 }
      );
    }

    // If removing instructor assignment
    if (!instructorId) {
      const updatedAssignment = await SwimmerLessonStore.update(swimmerIdInt, classIdInt, {
        instructor_id: null
      });
      
      if (!updatedAssignment) {
        return NextResponse.json(
          { error: 'Swimmer not found in this lesson' }, 
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedAssignment);
    }

    const instructorIdInt = parseInt(instructorId);
    if (isNaN(instructorIdInt)) {
      return NextResponse.json(
        { error: 'Invalid instructor ID' }, 
        { status: 400 }
      );
    }

    // Get the current lesson
    const currentLesson = await LessonStore.findById(classIdInt);
    if (!currentLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' }, 
        { status: 404 }
      );
    }

    // Get instructor's other assignments
    const instructorAssignments = await SwimmerLessonStore.findByLessonId(classIdInt);
    const instructorSchedule = instructorAssignments.filter(assignment => 
      assignment.instructor_id === instructorIdInt && 
      assignment.swimmer_id !== swimmerIdInt
    );

    // Check for conflicts
    for (const assignment of instructorSchedule) {
      const assignmentLesson = await LessonStore.findById(assignment.lesson_id);
      if (assignmentLesson && hasScheduleConflict(currentLesson, assignmentLesson)) {
        return NextResponse.json(
          { error: 'Instructor has a scheduling conflict' }, 
          { status: 400 }
        );
      }
    }

    // If no conflicts, update the assignment
    const updatedAssignment = await SwimmerLessonStore.update(swimmerIdInt, classIdInt, {
      instructor_id: instructorIdInt
    });

    if (!updatedAssignment) {
      return NextResponse.json(
        { error: 'Swimmer not found in this lesson' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error('Error assigning instructor:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to assign instructor' }, 
      { status: 500 }
    );
  }
}