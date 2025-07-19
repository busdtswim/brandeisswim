// src/app/api/auth/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, requireAdmin } from '@/lib/api-utils';
import type { TypedApiResponse } from '@/lib/api-utils';

interface DashboardStats {
  totalUsers: number;
  totalSwimmers: number;
  activeClasses: number;
  waitlistEntries: number;
}

const prisma = new PrismaClient();

export async function GET(): Promise<NextResponse<TypedApiResponse<DashboardStats>>> {
  try {
    const session = await getServerSession(authOptions);
    
    // Check admin authorization
    const authError = requireAdmin(session);
    if (authError) {
      return createErrorResponse(authError, 401);
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

    const stats: DashboardStats = {
      totalUsers: userStats,
      totalSwimmers: swimmerCount,
      activeClasses: activeLessonCount,
      waitlistEntries: waitlistCount
    };

    return createSuccessResponse(stats);
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return createErrorResponse('Failed to fetch dashboard statistics');
  } finally {
    await prisma.$disconnect();
  }
} 