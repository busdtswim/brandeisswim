// src/app/api/auth/admin/waitlist/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
const WaitlistStore = require('@/lib/stores/WaitlistStore.js');

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const waitlistId = parseInt(id);
    
    if (isNaN(waitlistId)) {
      return NextResponse.json({ error: 'Invalid waitlist ID' }, { status: 400 });
    }
    
    // Update status to inactive
    const updatedEntry = await WaitlistStore.update(waitlistId, { status: 'inactive' });

    if (!updatedEntry) {
      return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 });
    }

    // Reorder remaining waitlist entries
    await WaitlistStore.reorderPositions();

    return NextResponse.json({ 
      message: 'Waitlist entry updated successfully',
      entry: updatedEntry
    });
  } catch (error) {
    console.error('Error updating waitlist entry:', error);
    return NextResponse.json({ error: 'Failed to update waitlist entry' }, { status: 500 });
  }
}