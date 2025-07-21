// src/app/api/auth/admin/add/[id]/route.js
import { NextResponse } from 'next/server';
const InstructorStore = require('@/lib/stores/InstructorStore.js');

export async function DELETE(request, { params }) {
    try {
      const { id } = await params;
      const instructorId = parseInt(id);
      
      if (isNaN(instructorId)) {
        return NextResponse.json({ message: 'Invalid instructor ID' }, { status: 400 });
      }
      
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