// src/app/api/auth/admin/create/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

const NY_TIMEZONE = 'America/New_York';
const UTC_TIMEZONE = 'UTC';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    let startDate = DateTime.fromISO(data.start_date, { zone: NY_TIMEZONE });
    let endDate = DateTime.fromISO(data.end_date, { zone: NY_TIMEZONE });

    if (!startDate.isValid || !endDate.isValid) {
      startDate = DateTime.fromFormat(data.start_date, 'MM/dd/yyyy', { zone: NY_TIMEZONE });
      endDate = DateTime.fromFormat(data.end_date, 'MM/dd/yyyy', { zone: NY_TIMEZONE });
    }

    if (!startDate.isValid || !endDate.isValid) {
      console.error('Invalid dates:', { start: data.start_date, end: data.end_date });
      return NextResponse.json({ 
        error: 'Invalid date format',
        details: 'Start date and end date must be valid dates'
      }, { status: 400 });
    }

    const startTime = DateTime.fromFormat(data.start_time, 'HH:mm', { zone: NY_TIMEZONE });
    const endTime = DateTime.fromFormat(data.end_time, 'HH:mm', { zone: NY_TIMEZONE });

    if (!startTime.isValid || !endTime.isValid) {
      console.error('Invalid times:', { start: data.start_time, end: data.end_time });
      return NextResponse.json({ 
        error: 'Invalid time format',
        details: 'Start time and end time must be valid times'
      }, { status: 400 });
    }

    const lesson = await prisma.lessons.create({
      data: {
        start_date: startDate.toUTC().toJSDate(),
        end_date: endDate.toUTC().toJSDate(),
        meeting_days: data.meeting_days,
        start_time: DateTime.fromFormat(data.start_time, 'HH:mm', { zone: NY_TIMEZONE }).toJSDate(),
        end_time: DateTime.fromFormat(data.end_time, 'HH:mm', { zone: NY_TIMEZONE }).toJSDate(),
        max_slots: parseInt(data.max_slots),
        exception_dates: data.exception_dates || null
      },
    });

    const formattedLesson = {
      ...lesson,
      start_date: startDate.toFormat('MM/dd/yyyy'),
      end_date: endDate.toFormat('MM/dd/yyyy'),
      start_time: DateTime.fromJSDate(lesson.start_time)
        .setZone(NY_TIMEZONE)
        .toFormat('h:mm a'),
      end_time: DateTime.fromJSDate(lesson.end_time)
        .setZone(NY_TIMEZONE)
        .toFormat('h:mm a')
    };

    return NextResponse.json(formattedLesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ 
      error: 'Failed to create lesson', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessons = await prisma.lessons.findMany();

    const formattedLessons = lessons.map(lesson => {
      const startDate = DateTime.fromJSDate(lesson.start_date)
        .setZone(UTC_TIMEZONE);
      const endDate = DateTime.fromJSDate(lesson.end_date)
        .setZone(UTC_TIMEZONE);
      const startTime = DateTime.fromJSDate(lesson.start_time)
        .setZone(NY_TIMEZONE);
      const endTime = DateTime.fromJSDate(lesson.end_time)
        .setZone(NY_TIMEZONE);

      return {
        ...lesson,
        start_date: startDate.toFormat('MM/dd/yyyy'),
        end_date: endDate.toFormat('MM/dd/yyyy'),
        start_time: startTime.toFormat('h:mm a'),
        end_time: endTime.toFormat('h:mm a')
      };
    });

    return NextResponse.json(formattedLessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}