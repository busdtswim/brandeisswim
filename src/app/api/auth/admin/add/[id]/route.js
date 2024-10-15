// src/app/api/auth/admin/add/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
    try {
      const { id } = params;
      await prisma.instructors.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json({ message: 'Instructor deleted successfully' });
    } catch (error) {
      console.error('Error deleting instructor:', error);
      return NextResponse.json({ message: 'Failed to delete instructor' }, { status: 500 });
    }
}