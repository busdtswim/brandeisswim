// src/app/api/auth/lessons/exceptions/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const LessonStore = require('@/lib/stores/LessonStore.js');

// Update exceptions for a specific lesson
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { exception_dates } = await request.json();

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    const lesson = await LessonStore.update(parseInt(id), {
      exception_dates: Array.isArray(exception_dates) ? exception_dates.join(',') : exception_dates
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

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
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid lesson ID' }, { status: 400 });
    }

    const lesson = await LessonStore.findById(parseInt(id));

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