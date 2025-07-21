// src/app/api/content/route.js
import { NextResponse } from 'next/server';
const ContentStore = require('@/lib/stores/ContentStore.js');

export const dynamic = 'force-dynamic';

// This is a public API endpoint that doesn't require authentication
export async function GET() {
  try {
    const content = await ContentStore.findAll();
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}