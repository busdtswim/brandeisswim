// src/app/api/auth/admin/add/[id]/route.js
import { NextResponse } from 'next/server';
const InstructorStore = require('@/lib/stores/InstructorStore.js');
const UserStore = require('@/lib/stores/UserStore.js');
const SwimmerLessonStore = require('@/lib/stores/SwimmerLessonStore.js');

export async function DELETE(request, { params }) {
    try {
      const { id } = await params;
      const instructorId = parseInt(id);
      
      if (isNaN(instructorId)) {
        return NextResponse.json({ message: 'Invalid instructor ID' }, { status: 400 });
      }

      // Get instructor details before deletion
      const instructor = await InstructorStore.findById(instructorId);
      if (!instructor) {
        return NextResponse.json({ message: 'Instructor not found' }, { status: 404 });
      }

      // Unassign instructor from all current lessons
      await SwimmerLessonStore.unassignInstructorFromAllLessons(instructorId);

      // Delete user account if it exists
      try {
        const user = await UserStore.findByEmail(instructor.email);
        if (user) {
          await UserStore.delete(user.id);
        }
      } catch (userError) {
        // Continue with instructor deletion even if user deletion fails
      }

      // Delete instructor record
      const deletedInstructor = await InstructorStore.delete(instructorId);
      
      if (!deletedInstructor) {
        return NextResponse.json({ message: 'Instructor not found' }, { status: 404 });
      }
      
      return NextResponse.json({ message: 'Instructor deleted successfully' });
    } catch (error) {
      console.error('Error deleting instructor:', error);
      return NextResponse.json({ message: 'Failed to delete instructor' }, { status: 500 });
    }
}