// src/app/api/auth/lessons/classes/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateAge } from '@/utils/dateUtils';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

function formatTo12Hour(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export async function GET() {
  try {
    const classes = await prisma.lessons.findMany({
      include: {
        swimmer_lessons: {
          include: {
            swimmers: true,
            instructors_swimmer_lessons_instructor_idToinstructors: true,
            instructors_swimmer_lessons_preferred_instructor_idToinstructors: true,
          },
        },
      },
    });

    const formattedClasses = classes.map(cls => {
      // Format the time string directly
      const startTimeFormatted = formatTo12Hour(cls.start_time);
      const endTimeFormatted = formatTo12Hour(cls.end_time);
      const timeStr = `${startTimeFormatted} - ${endTimeFormatted}`;

      return {
        id: cls.id,
        startDate: cls.start_date, // Use the string date directly
        endDate: cls.end_date,     // Use the string date directly
        time: timeStr,
        meetingDays: cls.meeting_days.split(','),
        capacity: cls.max_slots,
        exception_dates: cls.exception_dates ? cls.exception_dates.split(',') : [],
        participants: cls.swimmer_lessons.map(sl => ({
          id: sl.swimmers.id,
          name: sl.swimmers.name,
          age: calculateAge(sl.swimmers.birthdate),
          proficiency: sl.swimmers.proficiency,
          gender: sl.swimmers.gender,
          payment_status: sl.payment_status,
          instructor: sl.instructors_swimmer_lessons_instructor_idToinstructors ? {
            id: sl.instructors_swimmer_lessons_instructor_idToinstructors.id,
            name: sl.instructors_swimmer_lessons_instructor_idToinstructors.name,
            email: sl.instructors_swimmer_lessons_instructor_idToinstructors.email
          } : null,
          preferred_instructor: sl.instructors_swimmer_lessons_preferred_instructor_idToinstructors ? {
            id: sl.instructors_swimmer_lessons_preferred_instructor_idToinstructors.id,
            name: sl.instructors_swimmer_lessons_preferred_instructor_idToinstructors.name,
            email: sl.instructors_swimmer_lessons_preferred_instructor_idToinstructors.email
          } : null,
          instructor_id: sl.instructor_id,
          preferred_instructor_id: sl.preferred_instructor_id,
          instructor_notes: sl.instructor_notes
        })),
      };
    });

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}