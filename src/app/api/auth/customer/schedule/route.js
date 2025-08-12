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

    // Get customer schedule
    const classes = await getCustomerSchedule(session.user.email);
    
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch schedule' }, 
      { status: 500 }
    );
  }
}