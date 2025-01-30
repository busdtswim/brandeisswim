// src/app/api/auth/admin/create/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { TimeFormatter, DateFormatter } from '@/utils/formatUtils';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessons = await prisma.lessons.findMany();
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const timeZone = 'America/New_York'; // Replace with your desired timezone

    const lesson = await prisma.lessons.create({
      data: {
        start_date: DateFormatter.formatWithTimezone(data.start_date, timeZone),
        end_date: DateFormatter.formatWithTimezone(data.end_date, timeZone),
        meeting_days: data.meeting_days,
        start_time: TimeFormatter.formatToISO(data.start_time, timeZone),
        end_time: TimeFormatter.formatToISO(data.end_time, timeZone),
        max_slots: data.max_slots,
        exception_dates: data.exception_dates || null
      },
    });
    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}