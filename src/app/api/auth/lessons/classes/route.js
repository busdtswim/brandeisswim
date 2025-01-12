// src/app/api/auth/lessons/classes/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateAge } from '@/utils/dateUtils';

const prisma = new PrismaClient();

const formatTimeString = (time) => {
  // Ensure we're working with a Date object
  const date = time instanceof Date ? time : new Date(time);
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  
  return `${hours}:${minutes}${period}`;
};

export async function GET() {
  try {
    const classes = await prisma.lessons.findMany({
      include: {
        swimmer_lessons: {
          include: {
            swimmers: true,
            instructors: true,
          },
        },
      },
    });

    const formattedClasses = classes.map(cls => ({
      id: cls.id,
      startDate: cls.start_date.toISOString().split('T')[0],
      endDate: cls.end_date.toISOString().split('T')[0],
      time: `${formatTimeString(cls.start_time)} - ${formatTimeString(cls.end_time)}`,
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
        instructor: sl.instructors ? {
          id: sl.instructors.id,
          name: sl.instructors.name,
          email: sl.instructors.email
        } : null,
        instructor_id: sl.instructor_id
      })),
    }));

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}