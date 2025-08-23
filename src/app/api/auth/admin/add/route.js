// src/app/api/auth/admin/add/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
const InstructorStore = require('@/lib/stores/InstructorStore.js');
const UserStore = require('@/lib/stores/UserStore.js');

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

    // Check if user with this email already exists
    const existingUser = await UserStore.findByEmail(email);
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    // Generate random 10-character password
    const randomPassword = crypto.randomBytes(5).toString('hex'); // 10 characters
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

    // Generate one-time login token
    const oneTimeToken = crypto.randomBytes(32).toString('hex');

    // Create instructor record
    const newInstructor = await InstructorStore.create({ name, email });

    // Create user account for instructor
    await UserStore.create({
      email,
      password: hashedPassword,
      role: 'instructor',
      fullname: name,
      must_change_password: true,
      one_time_login_token: oneTimeToken
    });

    return NextResponse.json({
      ...newInstructor,
      userCreated: true
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create instructor', details: error.message }, 
      { status: 500 }
    );
  }
}