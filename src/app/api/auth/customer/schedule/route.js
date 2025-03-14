// src/app/api/auth/customer/schedule/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

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
      swimmer.swimmer_lessons.map(sl => ({
        id: sl.lessons.id,
        swimmerId: swimmer.id,
        startDate: sl.lessons.start_date.toISOString().split('T')[0],
        endDate: sl.lessons.end_date.toISOString().split('T')[0],
        time: `${sl.lessons.start_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${sl.lessons.end_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
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
      }))
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