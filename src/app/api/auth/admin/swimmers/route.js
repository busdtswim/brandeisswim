// src/app/api/auth/admin/swimmers/route.js

import { NextResponse } from 'next/server';
import { calculateAge } from '@/utils/dateUtils';
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function GET(req) {
  try {
    const swimmers = await SwimmerStore.findAll();

    const formattedSwimmers = await Promise.all(swimmers.map(async (swimmer) => {
      // Get lesson count for this swimmer
      const swimmerLessons = await SwimmerLessonStore.findBySwimmerId(swimmer.id);
      
      return {
        id: swimmer.id,
        user_id: swimmer.user_id,
        name: swimmer.name,
        age: swimmer.birthdate ? calculateAge(swimmer.birthdate) : null,
        proficiency: swimmer.proficiency || 'N/A',
        gender: swimmer.gender || 'N/A',
        total_lessons: swimmerLessons.length
      };
    }));

    return NextResponse.json(formattedSwimmers);
  } catch (error) {
    console.error('Error fetching swimmers:', error);
    return NextResponse.json({ error: 'Failed to fetch swimmers' }, { status: 500 });
  }
}