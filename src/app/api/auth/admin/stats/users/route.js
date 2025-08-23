// src/app/api/auth/admin/stats/users/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const InstructorStore = require('@/lib/stores/InstructorStore.js');

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !['admin', 'instructor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Count total users and their swimmers
    const users = await UserStore.findAll();
    const customerUsers = users.filter(user => user.role === 'customer');

    const totalUsers = customerUsers.length;
    
    // Count total swimmers
    const allSwimmers = await SwimmerStore.findAll();
    const totalSwimmers = allSwimmers.length;
    
    // Count instructors
    const allInstructors = await InstructorStore.findAll();
    const totalInstructors = allInstructors.length;
    
    // Get new users (registered in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Format to MM/DD/YYYY
    const formattedThirtyDaysAgo = `${(thirtyDaysAgo.getMonth() + 1).toString().padStart(2, '0')}/${thirtyDaysAgo.getDate().toString().padStart(2, '0')}/${thirtyDaysAgo.getFullYear()}`;
    
    // Count new users by comparing createdAt dates
    const newUsers = customerUsers.filter(user => {
      if (!user.createdAt) return false;
      
      // If createdAt is a string in MM/DD/YYYY format, parse it
      if (typeof user.createdAt === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(user.createdAt)) {
        const [month, day, year] = user.createdAt.split('/');
        const userDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return userDate >= thirtyDaysAgo;
      }
      
      // If createdAt is a Date object or other format
      const userDate = new Date(user.createdAt);
      return userDate >= thirtyDaysAgo;
    }).length;

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
  }
}