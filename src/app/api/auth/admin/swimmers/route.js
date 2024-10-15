import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const swimmers = await prisma.swimmers.findMany({
      select: {
        id: true,
        name: true,
        age: true,
        proficiency: true,
        total_lessons: true,
      },
    });

    return NextResponse.json(swimmers);
  } catch (error) {
    console.error('Error fetching swimmers:', error);
    return NextResponse.json({ error: 'Failed to fetch swimmers' }, { status: 500 });
  }
}