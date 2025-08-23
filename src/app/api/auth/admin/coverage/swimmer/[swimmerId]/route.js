// src/app/api/auth/admin/coverage/swimmer/[swimmerId]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCoverageBySwimmer } from '@/lib/handlers/admin/coverage';

// GET - Get coverage data for a specific swimmer
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !['admin', 'instructor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { swimmerId } = await params;
    const swimmerIdNum = parseInt(swimmerId);
    
    if (isNaN(swimmerIdNum)) {
      return NextResponse.json({ error: 'Invalid swimmer ID' }, { status: 400 });
    }

    const coverageRequests = await getCoverageBySwimmer(swimmerIdNum);

    return NextResponse.json({
      coverageRequests
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch coverage data for swimmer', details: error.message }, 
      { status: 500 }
    );
  }
} 