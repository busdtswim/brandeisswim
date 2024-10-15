import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();

    const newInstructor = await prisma.swimmer_lessons.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });

    return NextResponse.json(newInstructor);
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json({ error: 'Failed to create instructor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const instructors = await prisma.instructors.findMany();
    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
  }
}