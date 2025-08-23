// src/app/api/auth/admin/users/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { getAdminUsers } from '@/lib/handlers/admin/users';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !['admin', 'instructor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get admin users data
    const users = await getAdminUsers();
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message }, 
      { status: 500 }
    );
  }
}