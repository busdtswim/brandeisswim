// src/app/api/auth/lesson-register/slots/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

// Format time from 24h to 12h format
function formatTo12Hour(timeStr) {
  if (!timeStr) return '';
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current date
    const today = new Date();
    const todayString = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    // Get all lessons
    const lessons = await LessonStore.findAll();

    // Filter lessons that haven't ended yet
    const activeLessons = lessons.filter(lesson => {
      if (!lesson.end_date) return true;
      return lesson.end_date >= todayString;
    });

    // Format the lessons for the frontend
    const formattedLessons = await Promise.all(activeLessons.map(async (lesson) => {
      const registeredCount = await SwimmerLessonStore.countByLessonId(lesson.id);
      
      return {
        id: lesson.id,
        start_date: lesson.start_date,
        end_date: lesson.end_date,
        meeting_days: lesson.meeting_days,
        start_time: lesson.start_time,
        end_time: lesson.end_time,
        max_slots: lesson.max_slots,
        registered: registeredCount,
        exception_dates: lesson.exception_dates
      };
    }));

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Error fetching lesson slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson slots' }, 
      { status: 500 }
    );
  }
}