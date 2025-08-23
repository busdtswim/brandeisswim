// src/app/api/auth/lessons/classes/route.js
import { NextResponse } from 'next/server';
import { calculateAge } from '@/lib/utils/dateUtils';
import { formatTo12Hour } from '@/lib/utils/timezoneUtils';
const LessonStore = require('@/lib/stores/LessonStore.js');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const classes = await LessonStore.findWithParticipants();

    const formattedClasses = classes.map(cls => {
      // Format the time string directly
      const startTimeFormatted = cls.start_time ? formatTo12Hour(cls.start_time) : '';
      const endTimeFormatted = cls.end_time ? formatTo12Hour(cls.end_time) : '';
      const timeStr = startTimeFormatted && endTimeFormatted ? `${startTimeFormatted} - ${endTimeFormatted}` : '';

      return {
        id: cls.id,
        startDate: cls.start_date, // Use the string date directly
        endDate: cls.end_date,     // Use the string date directly
        time: timeStr,
        meetingDays: cls.meeting_days && cls.meeting_days.trim() ? cls.meeting_days.split(',') : [],
        capacity: cls.max_slots,
        exception_dates: cls.exception_dates && cls.exception_dates.trim() ? cls.exception_dates.split(',') : [],
        participants: cls.participants.map(participant => ({
          id: participant.swimmer_id,
          name: participant.name,
          age: participant.birthdate ? calculateAge(participant.birthdate) : null,
          proficiency: participant.proficiency,
          gender: participant.gender,
          payment_status: participant.payment_status,
          instructor: participant.instructor,
          preferred_instructor: participant.preferred_instructor,
          instructor_id: participant.instructor_id,
          preferred_instructor_id: participant.preferred_instructor_id,
          instructor_notes: participant.instructor_notes,
          missing_dates: participant.missing_dates,
          parent_name: participant.parent_name || null,
          parent_email: participant.parent_email || null,
          parent_phone_number: participant.parent_phone_number || null,
        })),
      };
    });

    return NextResponse.json(formattedClasses);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}