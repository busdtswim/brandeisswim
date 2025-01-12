// src/app/api/auth/lessons/exceptions/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Update exceptions for a specific lesson
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { exception_dates } = await request.json();

    const lesson = await prisma.lessons.update({
      where: { id: parseInt(id) },
      data: {
        exception_dates: Array.isArray(exception_dates) ? exception_dates.join(',') : exception_dates
      }
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson exceptions:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson exceptions' }, 
      { status: 500 }
    );
  }
}

// Get exceptions for a specific lesson
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const lesson = await prisma.lessons.findUnique({
      where: { id: parseInt(id) },
      select: { exception_dates: true }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const exceptions = lesson.exception_dates ? lesson.exception_dates.split(',') : [];
    return NextResponse.json(exceptions);
  } catch (error) {
    console.error('Error fetching lesson exceptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson exceptions' }, 
      { status: 500 }
    );
  }
}