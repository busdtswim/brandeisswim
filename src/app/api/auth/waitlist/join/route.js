// src/app/api/auth/waitlist/join/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const WaitlistStore = require('@/lib/stores/WaitlistStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { swimmerId } = await req.json();
    
    if (!swimmerId) {
      return NextResponse.json(
        { error: 'Swimmer ID is required' },
        { status: 400 }
      );
    }

    const swimmerIdInt = parseInt(swimmerId);
    if (isNaN(swimmerIdInt)) {
      return NextResponse.json(
        { error: 'Invalid swimmer ID' },
        { status: 400 }
      );
    }

    // Check if swimmer belongs to the current user
    const swimmer = await SwimmerStore.findByIdWithUser(swimmerIdInt);

    if (!swimmer || swimmer.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Swimmer not found or does not belong to this user' },
        { status: 404 }
      );
    }

    // Check if swimmer is already on the waitlist
    const existingEntries = await WaitlistStore.findBySwimmerId(swimmerIdInt);
    const existingEntry = existingEntries.find(entry => entry.status === 'active');

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Swimmer is already on the waitlist', position: existingEntry.position },
        { status: 400 }
      );
    }

    // Add swimmer to waitlist (position will be auto-assigned)
    const waitlistEntry = await WaitlistStore.create({
      swimmer_id: swimmerIdInt,
      status: 'active'
    });

    return NextResponse.json({
      message: 'Successfully added to waitlist',
      position: waitlistEntry.position
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}