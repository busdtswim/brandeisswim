// src/app/api/auth/admin/stats/classes/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current date
    const currentDate = new Date();
    
    // Count total lessons
    const totalLessons = await prisma.lessons.count();
    
    // Count active lessons (where current date is between start and end date)
    const activeLessons = await prisma.lessons.count({
      where: {
        start_date: {
          lte: currentDate,
        },
        end_date: {
          gte: currentDate,
        },
      },
    });
    
    // Count future lessons
    const futureLessons = await prisma.lessons.count({
      where: {
        start_date: {
          gt: currentDate,
        },
      },
    });
    
    // Count past lessons
    const pastLessons = await prisma.lessons.count({
      where: {
        end_date: {
          lt: currentDate,
        },
      },
    });

    // Count total enrollments across all lessons
    const totalEnrollments = await prisma.swimmer_lessons.count();
    
    return NextResponse.json({
      totalLessons,
      activeLessons,
      futureLessons,
      pastLessons,
      totalEnrollments
    });
  } catch (error) {
    console.error('Error fetching class statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}