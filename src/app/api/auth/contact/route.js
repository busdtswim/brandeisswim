// src/app/api/auth/contact/route.js
import { NextResponse } from 'next/server';
import { contactLimiter } from '@/lib/rateLimit';
import { handleContactSubmission } from '@/lib/handlers/contact/contact';

export async function POST(req) {
  // Apply rate limiting
  const rateLimitResult = await contactLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: rateLimitResult.error }, { status: 429 });
  }

  try {
    const contactData = await req.json();
    
    if (!contactData) {
      return NextResponse.json({ 
        error: 'Contact data is required' 
      }, { status: 400 });
    }
    
    // Handle contact submission
    const result = await handleContactSubmission(contactData);
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error.message 
    }, { status: 500 });
  }
}