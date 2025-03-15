// src/app/api/auth/waitlist/join/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

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

    // Check if swimmer belongs to the current user
    const swimmer = await prisma.swimmers.findUnique({
      where: { 
        id: parseInt(swimmerId),
      },
      include: {
        users: {
          select: {
            email: true
          }
        }
      }
    });

    if (!swimmer || swimmer.users?.email !== session.user.email) {
      return NextResponse.json(
        { error: 'Swimmer not found or does not belong to this user' },
        { status: 404 }
      );
    }

    // Check if swimmer is already on the waitlist
    const existingEntry = await prisma.waitlist.findFirst({
      where: {
        swimmer_id: parseInt(swimmerId),
        status: 'active'
      }
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Swimmer is already on the waitlist', position: existingEntry.position },
        { status: 400 }
      );
    }

    // Get the current highest position number
    const lastEntry = await prisma.waitlist.findFirst({
      where: {
        status: 'active'
      },
      orderBy: {
        position: 'desc'
      }
    });

    const nextPosition = lastEntry ? lastEntry.position + 1 : 1;

    // Add swimmer to waitlist
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        swimmer_id: parseInt(swimmerId),
        position: nextPosition,
        status: 'active'
      }
    });

    return NextResponse.json({
      message: 'Successfully added to waitlist',
      position: waitlistEntry.position
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}