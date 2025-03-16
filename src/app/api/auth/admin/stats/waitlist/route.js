// src/app/api/auth/admin/stats/waitlist/route.js
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

    // Count active waitlist entries
    const activeWaitlistEntries = await prisma.waitlist.count({
      where: {
        status: 'active'
      }
    });
    
    // Get the most recent waitlist entries
    const recentWaitlistEntries = await prisma.waitlist.findMany({
      where: {
        status: 'active'
      },
      include: {
        swimmers: {
          include: {
            users: {
              select: {
                fullname: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        registration_date: 'desc'
      },
      take: 5
    });

    return NextResponse.json({
      activeWaitlistEntries,
      recentWaitlistEntries
    });
  } catch (error) {
    console.error('Error fetching waitlist statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}