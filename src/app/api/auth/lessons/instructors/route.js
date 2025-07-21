// src/app/api/auth/lessons/instructors/route.js

import { NextResponse } from 'next/server';
const InstructorStore = require('@/lib/stores/InstructorStore.js');

export async function POST(request) {
  try {
    const data = await request.json();

    const newInstructor = await InstructorStore.create({
      name: data.name,
      email: data.email,
    });

    return NextResponse.json(newInstructor);
  } catch (error) {
    console.error('Error creating instructor:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // Handle unique constraint violations
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create instructor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const instructors = await InstructorStore.findAll();
    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
  }
}