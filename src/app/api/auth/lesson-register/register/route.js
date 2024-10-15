import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { swimmerId, lessonId } = await req.json();

    // Check if the lesson is full
    const lesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: { _count: { select: { swimmer_lessons: true } } }
    });

    if (lesson._count.swimmer_lessons >= lesson.max_slots) {
      return NextResponse.json({ error: 'This lesson is full' }, { status: 400 });
    }

    // Register the swimmer for the lesson
    await prisma.swimmer_lessons.create({
      data: {
        swimmer_id: swimmerId,
        lesson_id: lessonId,
      }
    });

    // Fetch the updated lesson
    const updatedLesson = await prisma.lessons.findUnique({
      where: { id: lessonId },
      include: { _count: { select: { swimmer_lessons: true } } }
    });

    return NextResponse.json({
      ...updatedLesson,
      registered: updatedLesson._count.swimmer_lessons
    });
  } catch (error) {
    console.error('Error registering for lesson:', error);
    return NextResponse.json({ error: 'Failed to register for lesson' }, { status: 500 });
  }
}