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

    // Get current date as a string in MM/DD/YYYY format
    const currentDate = new Date();
    const formattedCurrentDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Run all queries in parallel for better performance
    const [
      // User stats
      userStats,
      
      // Swimmer stats
      swimmerCount,
      
      // Class stats - modified to work with string dates in MM/DD/YYYY format
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
      
      // Active lessons - using string comparison with MM/DD/YYYY format
      prisma.lessons.count({
        where: {
          start_date: {
            lte: formattedCurrentDate
          },
          end_date: {
            gte: formattedCurrentDate
          }
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