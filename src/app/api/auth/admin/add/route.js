// src/app/api/auth/admin/add/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const instructors = await prisma.instructors.findMany({
        select: {
            id: true,
            name: true,
            email: true,
        }},
    );
    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ message: 'Failed to fetch instructors' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || !body.name || !body.email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }
    const { name, email } = body;
    const newInstructor = await prisma.instructors.create({
      data: { name, email },
    });
    return NextResponse.json(newInstructor, { status: 201 });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return NextResponse.json({ message: 'Failed to create instructor' }, { status: 500 });
  }
}