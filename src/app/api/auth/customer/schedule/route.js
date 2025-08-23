// src/app/api/auth/customer/schedule/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCustomerSchedule } from '@/lib/handlers/customer/schedule';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer schedule using both email and ID for robustness
    const result = await getCustomerSchedule(session.user.email, session.user.id);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch schedule', details: error.message }, 
      { status: 500 }
    );
  }
}