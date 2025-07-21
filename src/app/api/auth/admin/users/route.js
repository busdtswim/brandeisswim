// src/app/api/auth/admin/users/route.js
import { NextResponse } from 'next/server';
import { calculateAge } from '@/utils/dateUtils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerStore = require('@/lib/stores/SwimmerStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all users with role 'customer'
    const users = await UserStore.findAll();
    const customerUsers = users.filter(user => user.role === 'customer');

    const formattedUsers = await Promise.all(customerUsers.map(async (user) => {
      // Get swimmers for this user
      const swimmers = await SwimmerStore.findByUserId(user.id);
      
      const formattedSwimmers = await Promise.all(swimmers.map(async (swimmer) => {
        // Get lesson count for this swimmer
        const swimmerLessons = await SwimmerLessonStore.findBySwimmerId(swimmer.id);
        
        return {
          id: swimmer.id,
          name: swimmer.name,
          age: swimmer.birthdate ? calculateAge(swimmer.birthdate) : null,
          proficiency: swimmer.proficiency || 'N/A',
          gender: swimmer.gender || 'N/A',
          total_lessons: swimmerLessons.length
        };
      }));

      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone_number: user.phone_number,
        swimmers: formattedSwimmers
      };
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message }, 
      { status: 500 }
    );
  }
}