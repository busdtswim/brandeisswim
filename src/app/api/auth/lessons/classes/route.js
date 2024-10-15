// api/auth/lessons/classes.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function GET() {
  try {
    const classes = await prisma.lessons.findMany({
      include: {
        instructors: true,
        swimmer_lessons: {
          include: {
            swimmers: true,
          },
        },
      },
    });

    const formattedClasses = classes.map(cls => ({
      id: cls.id,
      startDate: cls.start_date.toISOString().split('T')[0],
      endDate: cls.end_date.toISOString().split('T')[0],
      time: `${cls.start_time.toTimeString().slice(0,5)} - ${cls.end_time.toTimeString().slice(0,5)}`,
      meetingDays: cls.meeting_days.split(','),
      capacity: cls.max_slots,
      instructor: cls.instructors ? { id: cls.instructors.id, name: cls.instructors.name, email: cls.instructors.email } : null,
      participants: cls.swimmer_lessons.map(sl => ({
        id: sl.swimmers.id,
        name: sl.swimmers.name,
        age: sl.swimmers.age,
        proficiency: sl.swimmers.proficiency,
      })),
    }));

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}