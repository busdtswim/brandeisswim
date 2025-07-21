// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');

function formatDate(date) {
  // If it's already a string in MM/DD/YYYY format, return it
  if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    return date;
  }
  
  // If it's in YYYY-MM-DD format, convert it
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-');
    return `${month}/${day}/${year}`;
  }
  
  // Convert to Date object for other formats
  const dateObj = new Date(date);
  
  // Format to MM/DD/YYYY
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${month}/${day}/${year}`;
}

export async function POST(req) {
  try {
    const { email, password, phoneNumber, fullName, swimmers } = await req.json();

    // Check if email already exists
    const existingUser = await UserStore.findByEmail(email);

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await UserStore.create({
      email,
      password: hashedPassword,
      role: 'customer',
      phone_number: phoneNumber,
      fullname: fullName,
    });

    // Create swimmers if provided
    if (swimmers && swimmers.length > 0) {
      for (const swimmer of swimmers) {
        await SwimmerStore.create({
          name: swimmer.name,
          birthdate: formatDate(swimmer.birthdate), // Format as string
          gender: swimmer.gender,
          proficiency: swimmer.proficiency,
          user_id: user.id
        });
      }
    }

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'User and swimmers created successfully',
      user: userWithoutPassword
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // Handle unique constraint violations
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to register user', details: error.message }, { status: 500 });
  }
}