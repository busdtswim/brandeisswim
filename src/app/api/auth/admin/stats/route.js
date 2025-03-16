// src/app/api/auth/admin/stats/route.js
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

    // Run all queries in parallel for better performance
    const [
      // User stats
      userStats,
      
      // Swimmer stats
      swimmerCount,
      
      // Class stats
      activeLessonCount,
      
      // Waitlist stats
      waitlistCount
    ] = await Promise.all([
      // User stats
      prisma.users.count({
        where: { role: 'customer' }
      }),
      
      // Swimmer stats
      prisma.swimmers.count(),
      
      // Active lessons
      prisma.lessons.count({
        where: {
          start_date: { lte: currentDate },
          end_date: { gte: currentDate }
        }
      }),
      
      // Active waitlist entries
      prisma.waitlist.count({
        where: { status: 'active' }
      })
    ]);

    return NextResponse.json({
      totalUsers: userStats,
      totalSwimmers: swimmerCount,
      activeClasses: activeLessonCount,
      waitlistEntries: waitlistCount
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}