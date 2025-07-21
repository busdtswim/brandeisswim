// src/app/api/auth/customer/schedule/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');

// Simple function to format time from 24h to 12h format
function formatTo12Hour(timeStr) {
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

    const user = await UserStore.findByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const swimmers = await SwimmerStore.findByUserId(user.id);
    
    const classes = [];
    
    for (const swimmer of swimmers) {
      const swimmerWithLessons = await SwimmerStore.findWithLessons(swimmer.id);
      
      for (const lessonData of swimmerWithLessons) {
        if (lessonData.lesson_id) {
          // Format the time strings directly
          const startTimeFormatted = lessonData.start_time ? formatTo12Hour(lessonData.start_time) : '';
          const endTimeFormatted = lessonData.end_time ? formatTo12Hour(lessonData.end_time) : '';
          
          classes.push({
            id: lessonData.lesson_id,
            swimmerId: swimmer.id,
            startDate: lessonData.start_date, // Use the string date directly
            endDate: lessonData.end_date,     // Use the string date directly
            time: startTimeFormatted && endTimeFormatted ? `${startTimeFormatted} - ${endTimeFormatted}` : '',
            meetingDays: lessonData.meeting_days ? lessonData.meeting_days.split(',') : [],
            swimmerName: swimmer.name,
            instructor: lessonData.instructor_name ? {
              name: lessonData.instructor_name,
              id: lessonData.instructor_id
            } : null,
            preferredInstructor: lessonData.preferred_instructor_name ? {
              name: lessonData.preferred_instructor_name,
              id: lessonData.preferred_instructor_id
            } : null,
            instructorNotes: lessonData.instructor_notes
          });
        }
      }
    }

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' }, 
      { status: 500 }
    );
  }
}