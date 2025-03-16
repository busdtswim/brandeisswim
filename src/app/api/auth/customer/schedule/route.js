// src/app/api/auth/customer/schedule/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

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

    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      include: {
        swimmers: {
          include: {
            swimmer_lessons: {
              include: {
                lessons: true,
                instructors_swimmer_lessons_instructor_idToinstructors: true,             
                instructors_swimmer_lessons_preferred_instructor_idToinstructors: true  
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const classes = user.swimmers.flatMap(swimmer => 
      swimmer.swimmer_lessons.map(sl => {
        // Format the time strings directly
        const startTimeFormatted = formatTo12Hour(sl.lessons.start_time);
        const endTimeFormatted = formatTo12Hour(sl.lessons.end_time);
        
        return {
          id: sl.lessons.id,
          swimmerId: swimmer.id,
          startDate: sl.lessons.start_date, // Use the string date directly
          endDate: sl.lessons.end_date,     // Use the string date directly
          time: `${startTimeFormatted} - ${endTimeFormatted}`,
          meetingDays: sl.lessons.meeting_days.split(','),
          swimmerName: swimmer.name,
          instructor: sl.instructors_swimmer_lessons_instructor_idToinstructors ? {
            name: sl.instructors_swimmer_lessons_instructor_idToinstructors.name,
            id: sl.instructors_swimmer_lessons_instructor_idToinstructors.id
          } : null,
          preferredInstructor: sl.instructors_swimmer_lessons_preferred_instructor_idToinstructors ? {
            name: sl.instructors_swimmer_lessons_preferred_instructor_idToinstructors.name,
            id: sl.instructors_swimmer_lessons_preferred_instructor_idToinstructors.id
          } : null,
          instructorNotes: sl.instructor_notes
        };
      })
    );

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' }, 
      { status: 500 }
    );
  }
}