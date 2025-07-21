// src/app/api/auth/admin/add/route.js
import { NextResponse } from 'next/server';
const InstructorStore = require('@/lib/stores/InstructorStore.js');

export async function GET() {
  try {
    const instructors = await InstructorStore.findAll();
    return NextResponse.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json({ message: 'Failed to fetch instructors' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || !body.name || !body.email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
    }
    const { name, email } = body;
    const newInstructor = await InstructorStore.create({ name, email });
    return NextResponse.json(newInstructor, { status: 201 });
  } catch (error) {
    console.error('Error creating instructor:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    
    // Handle unique constraint violations
    if (error.message.includes('already exists')) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    
    return NextResponse.json({ message: 'Failed to create instructor' }, { status: 500 });
  }
}