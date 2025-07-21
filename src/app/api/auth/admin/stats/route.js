// src/app/api/auth/admin/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const UserStore = require('../../../../../lib/stores/UserStore.js');
const SwimmerStore = require('../../../../../lib/stores/SwimmerStore.js');
const LessonStore = require('../../../../../lib/stores/LessonStore.js');
const WaitlistStore = require('../../../../../lib/stores/WaitlistStore.js');

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
      allUsers,
      
      // Swimmer stats
      allSwimmers,
      
      // Class stats
      allLessons,
      
      // Waitlist stats
      activeWaitlistEntries
    ] = await Promise.all([
      // User stats
      UserStore.findAll(),
      
      // Swimmer stats
      SwimmerStore.findAll(),
      
      // All lessons
      LessonStore.findAll(),
      
      // Active waitlist entries
      WaitlistStore.findByStatus('active')
    ]);

    // Calculate user stats
    const userStats = allUsers.filter(user => user.role === 'customer').length;
    
    // Calculate swimmer stats
    const swimmerCount = allSwimmers.length;
    
    // Calculate active lessons - using string comparison with MM/DD/YYYY format
    const activeLessonCount = allLessons.filter(lesson => {
      if (!lesson.start_date || !lesson.end_date) return false;
      return lesson.start_date <= formattedCurrentDate && lesson.end_date >= formattedCurrentDate;
    }).length;
    
    // Calculate waitlist stats
    const waitlistCount = activeWaitlistEntries.length;

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
  }
}