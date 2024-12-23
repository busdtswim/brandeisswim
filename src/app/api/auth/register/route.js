// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password, phoneNumber, fullName, swimmers } = await req.json();

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create swimmers first
      const createdSwimmers = await Promise.all(
        swimmers.map((swimmer) =>
          prisma.swimmers.create({
            data: {
              name: swimmer.name,
              birthdate: new Date(swimmer.birthdate),
              gender: swimmer.gender,
              proficiency: swimmer.proficiency,
            },
          })
        )
      );

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create the user and associate swimmers
      const user = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          role: 'customer',
          phone_number: phoneNumber,
          fullname: fullName,
          swimmers: {
            connect: createdSwimmers.map((swimmer) => ({ id: swimmer.id })),
          },
        },
        include: {
          swimmers: true,
        },
      });

      return user;
    });

    return NextResponse.json({
      message: 'User and swimmers created successfully',
      user: {
        id: result.id,
        email: result.email,
        fullname: result.fullname,
        role: result.role,
        swimmers: result.swimmers.map((swimmer) => ({
          id: swimmer.id,
          name: swimmer.name,
          age: swimmer.age,
          proficiency: swimmer.proficiency,
        })),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Error creating user', error: error.message }, { status: 400 });
  }
}