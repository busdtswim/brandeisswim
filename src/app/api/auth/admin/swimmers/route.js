// src/app/api/auth/admin/swimmers/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateAge } from '@/utils/dateUtils';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const swimmers = await prisma.swimmers.findMany({
      select: {
        id: true,
        user_id: true,
        name: true,
        birthdate: true,
        proficiency: true,
        gender: true,
        _count: {
          select: {
            swimmer_lessons: true
          }
        },
        users: {
          select: {
            id: true,
            email: true
          }
        }
      },
    });

    const formattedSwimmers = swimmers.map(swimmer => ({
      id: swimmer.id,
      user_id: swimmer.user_id,
      name: swimmer.name,
      age: swimmer.birthdate ? calculateAge(swimmer.birthdate) : null,
      proficiency: swimmer.proficiency || 'N/A',
      gender: swimmer.gender || 'N/A',
      total_lessons: swimmer._count.swimmer_lessons
    }));

    return NextResponse.json(formattedSwimmers);
  } catch (error) {
    console.error('Error fetching swimmers:', error);
    return NextResponse.json({ error: 'Failed to fetch swimmers' }, { status: 500 });
  }
}