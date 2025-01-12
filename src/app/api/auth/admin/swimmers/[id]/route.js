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

    const swimmer = await prisma.swimmers.findUnique({
      where: { id: parseInt(id) }
    });

    if (!swimmer) {
      return NextResponse.json({ error: 'Swimmer not found' }, { status: 404 });
    }

    await prisma.swimmer_lessons.deleteMany({
      where: { swimmer_id: parseInt(id) }
    });

    await prisma.swimmers.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Swimmer deleted successfully' });
  } catch (error) {
    console.error('Error deleting swimmer:', error.message);
    return NextResponse.json({ error: 'Failed to delete swimmer' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}