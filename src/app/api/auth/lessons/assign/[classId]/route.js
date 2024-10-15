// pages/api/auth/lessons/assign/[classId].js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request) {
  try {
    const classId = request.nextUrl.pathname.split('/').pop();
    const { instructorId } = await request.json();

    await prisma.lessons.update({
      where: { id: parseInt(classId) },
      data: { instructor_id: instructorId ? parseInt(instructorId) : null },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error assigning instructor:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}