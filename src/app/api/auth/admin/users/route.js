// src/app/api/auth/admin/users/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { calculateAge } from '@/utils/dateUtils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.users.findMany({
      where: {
        role: 'customer'
      },
      include: {
        swimmers: {
          include: {
            swimmer_lessons: true
          }
        }
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone_number: user.phone_number,
      swimmers: user.swimmers.map(swimmer => ({
        id: swimmer.id,
        name: swimmer.name,
        age: swimmer.birthdate ? calculateAge(swimmer.birthdate) : null,
        proficiency: swimmer.proficiency || 'N/A',
        gender: swimmer.gender || 'N/A',
        total_lessons: swimmer.swimmer_lessons.length
      }))
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    if (error.code === 'P2022') {
      console.error('Database schema mismatch:', error.meta);
    }
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}