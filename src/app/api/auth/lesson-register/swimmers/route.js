import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]';

export const dynamic = 'force-dynamic'

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

    return NextResponse.json(swimmers);
  } catch (error) {
    console.error('Error fetching swimmers:', error);
    return NextResponse.json({ error: 'Failed to fetch swimmers' }, { status: 500 });
  }
}