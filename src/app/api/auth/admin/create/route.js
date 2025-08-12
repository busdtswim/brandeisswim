// src/app/api/auth/admin/create/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { formatTo12Hour } from '@/lib/utils/timezoneUtils';
import { formatToMMDDYYYY } from '@/lib/utils/dateUtils';
const LessonStore = require('@/lib/stores/LessonStore.js');

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const startDate = formatToMMDDYYYY(data.start_date);
    const endDate = formatToMMDDYYYY(data.end_date);
    
    const startTime = data.start_time; 
    const endTime = data.end_time;    

    // Create the lesson with string dates and times
    const lesson = await LessonStore.create({
      start_date: startDate,
      end_date: endDate,    
      meeting_days: data.meeting_days,
      start_time: startTime,
      end_time: endTime, 
      max_slots: parseInt(data.max_slots),
      exception_dates: data.exception_dates || null
    });

    // Format the response
    const formattedLesson = {
      ...lesson,
      start_time: formatTo12Hour(startTime),
      end_time: formatTo12Hour(endTime)
    };

    return NextResponse.json(formattedLesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create lesson', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessons = await LessonStore.findAll();

    const formattedLessons = lessons.map(lesson => {
      return {
        ...lesson,
        start_time: lesson.start_time ? formatTo12Hour(lesson.start_time) : '',
        end_time: lesson.end_time ? formatTo12Hour(lesson.end_time) : ''
      };
    });

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch lessons', 
      details: error.message 
    }, { status: 500 });
  }
}