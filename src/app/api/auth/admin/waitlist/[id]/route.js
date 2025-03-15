// src/app/api/auth/admin/waitlist/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    
    // Update status to inactive
    const updatedEntry = await prisma.waitlist.update({
      where: { id: parseInt(id) },
      data: { status: 'inactive' }
    });

    // Reorder remaining waitlist entries
    const activeEntries = await prisma.waitlist.findMany({
      where: { status: 'active' },
      orderBy: { position: 'asc' }
    });

    // Update positions for all active entries
    for (let i = 0; i < activeEntries.length; i++) {
      await prisma.waitlist.update({
        where: { id: activeEntries[i].id },
        data: { position: i + 1 }
      });
    }

    return NextResponse.json({ 
      message: 'Waitlist entry updated successfully',
      entry: updatedEntry
    });
  } catch (error) {
    console.error('Error updating waitlist entry:', error);
    return NextResponse.json({ error: 'Failed to update waitlist entry' }, { status: 500 });
  }
}