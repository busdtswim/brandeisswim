import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { addMissingDates, getMissingDates, validateMissingDates } from '@/lib/handlers/customer/missingDates';

/**
 * GET - Retrieve missing dates for a swimmer's lesson
 */
export async function GET(req, { params }) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params for Next.js 15 compatibility
    const resolvedParams = await params;

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const swimmerId = searchParams.get('swimmerId');
    const lessonId = resolvedParams.lessonId;

    if (!swimmerId) {
      return NextResponse.json({ error: 'Swimmer ID is required' }, { status: 400 });
    }

    // Get missing dates
    const result = await getMissingDates({
      swimmerId: parseInt(swimmerId),
      lessonId: parseInt(lessonId),
      userId: session.user.id
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET missing dates error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve missing dates',
      details: error.message 
    }, { status: 500 });
  }
}

/**
 * POST - Add missing dates for a swimmer's lesson
 */
export async function POST(req, { params }) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params for Next.js 15 compatibility
    const resolvedParams = await params;

    // Get request body
    const body = await req.json();
    const { swimmerId, missingDates } = body;
    const lessonId = resolvedParams.lessonId;

    // Validate required fields
    if (!swimmerId || !missingDates) {
      return NextResponse.json({ 
        error: 'Swimmer ID and missing dates are required' 
      }, { status: 400 });
    }

    // Validate date format
    const validation = validateMissingDates(missingDates);
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.message,
        details: validation.errors 
      }, { status: 400 });
    }

    // Add missing dates
    const result = await addMissingDates({
      swimmerId: parseInt(swimmerId),
      lessonId: parseInt(lessonId),
      missingDates: validation.validDates.join(','),
      userId: session.user.id
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('POST missing dates error:', error);
    return NextResponse.json({ 
      error: 'Failed to add missing dates',
      details: error.message 
    }, { status: 500 });
  }
} 