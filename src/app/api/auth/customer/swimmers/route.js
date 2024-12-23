// src/app/api/auth/customer/swimmers/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {

  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const swimmers = await prisma.swimmers.findMany({
      where: {
        users: {
          email: session.user.email
        }
      }
    });

    // Transform the data to ensure consistent field names
    const transformedSwimmers = swimmers.map(swimmer => ({
      ...swimmer,
      birthday: swimmer.birthdate,
    }));

    return NextResponse.json(transformedSwimmers);
  } catch (error) {
    console.error('Error fetching swimmers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch swimmers' }, 
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.birthday || !data.gender || !data.proficiency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user ID
    const user = await prisma.users.findUnique({
      where: { email: session.user.email }
    });

    // Create new swimmer with proper data mapping
    const newSwimmer = await prisma.swimmers.create({
      data: {
        name: data.name,
        birthdate: new Date(data.birthday),
        gender: data.gender,
        proficiency: data.proficiency,
        user_id: user.id
      }
    });

    return NextResponse.json(newSwimmer, { status: 201 });
  } catch (error) {
    console.error('Error creating swimmer:', error);
    return NextResponse.json(
      { error: 'Failed to create swimmer' }, 
      { status: 500 }
    );
  }
}