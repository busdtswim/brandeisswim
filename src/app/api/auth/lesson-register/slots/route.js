import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const lessons = await prisma.lessons.findMany({
      include: {
        _count: {
          select: { swimmer_lessons: true }
        }
      }
    });

    const lessonsWithRegistrationCount = lessons.map(lesson => ({
      ...lesson,
      registered: lesson._count.swimmer_lessons
    }));

    return NextResponse.json(lessonsWithRegistrationCount);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}