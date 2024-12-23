// src/app/api/auth/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Start a transaction to ensure all related data is deleted
    await prisma.$transaction(async (tx) => {
      // First delete all swim lesson registrations for all swimmers of this user
      await tx.swimmer_lessons.deleteMany({
        where: {
          swimmers: {
            user_id: userId
          }
        }
      });

      // Then delete all swimmers belonging to this user
      await tx.swimmers.deleteMany({
        where: { user_id: userId }
      });

      // Finally delete the user
      await tx.users.delete({
        where: { id: userId }
      });
    });

    return NextResponse.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}