// src/app/api/auth/waitlist/join/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { handleWaitlistJoin } from '@/lib/handlers/waitlist/waitlistJoin';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const requestData = await req.json();
    
    if (!requestData || !requestData.swimmerId) {
      return NextResponse.json(
        { error: 'Swimmer ID is required' },
        { status: 400 }
      );
    }
    
    const { swimmerId } = requestData;

    // Handle waitlist join
    const result = await handleWaitlistJoin(swimmerId, session.user.email);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error joining waitlist:', error);
    
    // Handle specific error types
    if (error.message.includes('Invalid') || error.message.includes('required') || error.message.includes('Required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (error.message.includes('not found') || error.message.includes('does not belong')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    if (error.message.includes('already on the waitlist')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // For any other errors, return 500
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}