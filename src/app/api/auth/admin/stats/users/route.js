// src/app/api/auth/admin/stats/users/route.js
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

    // Count total users and their swimmers
    const users = await prisma.users.findMany({
      where: {
        role: 'customer'
      },
      include: {
        _count: {
          select: { swimmers: true }
        }
      }
    });

    const totalUsers = users.length;
    const totalSwimmers = users.reduce((sum, user) => sum + user._count.swimmers, 0);
    
    // Count instructors
    const totalInstructors = await prisma.instructors.count();
    
    // Get new users (registered in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Format to MM/DD/YYYY
    const formattedThirtyDaysAgo = `${(thirtyDaysAgo.getMonth() + 1).toString().padStart(2, '0')}/${thirtyDaysAgo.getDate().toString().padStart(2, '0')}/${thirtyDaysAgo.getFullYear()}`;
    
    // Use string comparison for createdAt if it's stored as a string
    const newUsers = await prisma.users.count({
      where: {
        role: 'customer',
        createdAt: {
          gte: formattedThirtyDaysAgo
        }
      }
    });

    return NextResponse.json({
      totalUsers,
      totalSwimmers,
      totalInstructors,
      newUsers
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}