// src/app/api/auth/admin/waitlist/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const WaitlistStore = require('@/lib/stores/WaitlistStore.js');

// Get waitlist entries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !['admin', 'instructor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const waitlistEntries = await WaitlistStore.findByStatus('active');

    return NextResponse.json(waitlistEntries);
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}

// Create waitlist option (admin only)
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if waitlist already exists (if there are any active entries)
    const existingEntries = await WaitlistStore.findByStatus('active');
    
    if (existingEntries.length > 0) {
      return NextResponse.json({ message: 'Waitlist already exists' });
    }

    // We don't need to create a dummy entry - just mark the waitlist as active
    // The waitlist will be created when the first swimmer joins
    return NextResponse.json({ message: 'Waitlist created successfully' });
  } catch (error) {
    console.error('Error creating waitlist:', error);
    return NextResponse.json({ error: 'Failed to create waitlist' }, { status: 500 });
  }
}

// Clear waitlist (mark all as inactive)
export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeEntries = await WaitlistStore.findByStatus('active');
    let updatedCount = 0;

    // Update each active entry to inactive
    for (const entry of activeEntries) {
      await WaitlistStore.update(entry.id, { status: 'inactive' });
      updatedCount++;
    }

    return NextResponse.json({ 
      message: 'Waitlist cleared successfully',
      count: updatedCount
    });
  } catch (error) {
    console.error('Error clearing waitlist:', error);
    return NextResponse.json({ error: 'Failed to clear waitlist' }, { status: 500 });
  }
}