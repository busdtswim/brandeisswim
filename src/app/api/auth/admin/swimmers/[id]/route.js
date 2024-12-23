// src/app/api/auth/admin/swimmers/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, context) {
  try {
    const id = context.params.id;
    
    if (!id) {
      return NextResponse.json({ error: 'Swimmer ID is required' }, { status: 400 });
    }

    // Delete all swim lesson registrations first
    await prisma.swimmer_lessons.deleteMany({
      where: { swimmer_id: parseInt(id) }
    });

    // Then delete the swimmer
    await prisma.swimmers.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Swimmer deleted successfully' });
  } catch (error) {
    console.error('Error deleting swimmer:', error.message);
    return NextResponse.json({ error: 'Failed to delete swimmer' }, { status: 500 });
  }
}