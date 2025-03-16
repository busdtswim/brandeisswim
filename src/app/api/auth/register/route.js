// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user
      const user = await tx.users.create({
        data: {
          email,
          password: hashedPassword,
          role: 'customer',
          phone_number: phoneNumber,
          fullname: fullName,
        }
      });

      // Create swimmers if provided
      if (swimmers && swimmers.length > 0) {
        for (const swimmer of swimmers) {
          await tx.swimmers.create({
            data: {
              name: swimmer.name,
              birthdate: formatDate(swimmer.birthdate), // Format as string
              gender: swimmer.gender,
              proficiency: swimmer.proficiency,
              user_id: user.id
            }
          });
        }
      }

      return user;
    });

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = result;

    return NextResponse.json({
      message: 'User and swimmers created successfully',
      user: userWithoutPassword
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register user', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}