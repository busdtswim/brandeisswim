// src/app/api/auth/instructor/coverage/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { 
  acceptCoverageRequest, 
  reRequestCoverage,
  deleteCoverageRequest
} from '@/lib/handlers/instructor/coverage';

// PUT - Accept, decline, or cancel a coverage request
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== 'instructor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const requestId = parseInt(id);
    
    if (isNaN(requestId)) {
      return NextResponse.json({ error: 'Invalid request ID' }, { status: 400 });
    }

    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'accept':
        // For instructors, we need to find their instructor record using their email
        const userEmail = session.user.email;
        if (!userEmail) {
          return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }
        result = await acceptCoverageRequest(requestId, userEmail);
        break;
      
      case 'reRequest':
        // For instructors, we need to find their instructor record using their email
        const requestingUserEmail = session.user.email;
        if (!requestingUserEmail) {
          return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }
        result = await reRequestCoverage(requestId, requestingUserEmail);
        break;
      
      case 'delete':
        // For instructors, we need to find their instructor record using their email
        const deletingUserEmail = session.user.email;
        if (!deletingUserEmail) {
          return NextResponse.json({ error: 'User email not found' }, { status: 400 });
        }
        result = await deleteCoverageRequest(requestId, deletingUserEmail);
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coverageRequest: result
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update coverage request', details: error.message }, 
      { status: 500 }
    );
  }
} 