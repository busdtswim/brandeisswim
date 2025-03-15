// src/app/api/auth/waitlist/status/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // We'll consider the waitlist active if the status button has been clicked by an admin
    // This is tracked by a special system-level setting in the database
    // We're using a simple boolean flag in the application state for this demo
    // In a production system, you might want to store this in a settings table
    
    // For now, we'll just assume the waitlist is active if we have any entries
    // or if we've marked it as active in some other way (like a status flag in another table)
    const activeEntries = await prisma.waitlist.findFirst({
      where: {
        status: 'active'
      }
    });

    return NextResponse.json({
      isActive: !!activeEntries || true // Setting to true for demo purposes - replace with your logic
    });
  } catch (error) {
    console.error('Error checking waitlist status:', error);
    return NextResponse.json(
      { error: 'Failed to check waitlist status', isActive: false },
      { status: 500 }
    );
  }
}