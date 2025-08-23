// src/app/api/auth/admin/stats/waitlist/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const WaitlistStore = require('@/lib/stores/WaitlistStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const UserStore = require('@/lib/stores/UserStore.js');

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !['admin', 'instructor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all waitlist entries
    const allWaitlistEntries = await WaitlistStore.findAll();
    
    // Count active waitlist entries
    const activeWaitlistEntries = allWaitlistEntries.filter(entry => entry.status === 'active').length;
    
    // Get the most recent active waitlist entries
    const activeEntries = allWaitlistEntries
      .filter(entry => entry.status === 'active')
      .sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date))
      .slice(0, 5);

    // Get detailed information for recent entries
    const recentWaitlistEntries = await Promise.all(activeEntries.map(async (entry) => {
      const swimmer = await SwimmerStore.findById(entry.swimmer_id);
      const user = swimmer ? await UserStore.findById(swimmer.user_id) : null;
      
      return {
        ...entry,
        swimmers: swimmer ? {
          ...swimmer,
          users: user ? {
            fullname: user.fullname,
            email: user.email
          } : null
        } : null
      };
    }));

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
  }
}