// src/app/api/auth/lessons/remove-swimmer/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request) {
  try {
    const { lessonId, swimmerId } = await request.json();

    if (!lessonId || !swimmerId) {
      return NextResponse.json(
        { error: 'Lesson ID and Swimmer ID are required' },
        { status: 400 }
      );
    }

    await prisma.swimmer_lessons.delete({
      where: {
        swimmer_id_lesson_id: {
          swimmer_id: parseInt(swimmerId),
          lesson_id: parseInt(lessonId)
        }
      }
    });

    return NextResponse.json({ message: 'Swimmer removed successfully' });
  } catch (error) {
    console.error('Error removing swimmer:', error);
    return NextResponse.json(
      { error: 'Failed to remove swimmer from lesson' },
      { status: 500 }
    );
  }
}