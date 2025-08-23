// src/app/api/auth/admin/stats/classes/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const LessonStore = require('@/lib/stores/LessonStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !['admin', 'instructor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current date as a string in MM/DD/YYYY format
    const currentDate = new Date();
    const formattedCurrentDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    
    // Get all lessons
    const allLessons = await LessonStore.findAll();
    
    // Count total lessons
    const totalLessons = allLessons.length;
    
    // Count active lessons (where current date is between start and end date)
    const activeLessons = allLessons.filter(lesson => {
      return lesson.start_date <= formattedCurrentDate && lesson.end_date >= formattedCurrentDate;
    }).length;
    
    // Count future lessons
    const futureLessons = allLessons.filter(lesson => {
      return lesson.start_date > formattedCurrentDate;
    }).length;
    
    // Count past lessons
    const pastLessons = allLessons.filter(lesson => {
      return lesson.end_date < formattedCurrentDate;
    }).length;

    // Count total enrollments across all lessons
    const allEnrollments = await SwimmerLessonStore.findAll();
    const totalEnrollments = allEnrollments.length;
    
    return NextResponse.json({
      totalLessons,
      activeLessons,
      futureLessons,
      pastLessons,
      totalEnrollments
    });
  } catch (error) {
    console.error('Error fetching class statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class statistics' },
      { status: 500 }
    );
  }
}