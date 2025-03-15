// src/app/api/content/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

// This is a public API endpoint that doesn't require authentication
export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    const content = await prisma.site_content.findMany({
      orderBy: {
        order_num: 'asc'
      }
    });
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}