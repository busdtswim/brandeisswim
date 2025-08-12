// src/app/api/auth/customer/profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCustomerProfile, updateCustomerProfile } from '@/lib/handlers/customer/profile';

// GET user profile data
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer profile
    const result = await getCustomerProfile(session.user.email);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch user profile' }, 
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();
    
    // Update customer profile
    const result = await updateCustomerProfile(session.user.email, updateData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update profile' }, 
      { status: 500 }
    );
  }
}