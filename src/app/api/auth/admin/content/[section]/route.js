// src/app/api/auth/admin/content/[section]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../[...nextauth]/route';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { section } = params;

    // Check if section is custom before deleting
    const existingContent = await prisma.site_content.findUnique({
      where: { section }
    });

    if (!existingContent?.is_custom) {
      return NextResponse.json(
        { error: 'Cannot delete default sections' }, 
        { status: 400 }
      );
    }

    await prisma.site_content.delete({
      where: { section }
    });

    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' }, 
      { status: 500 }
    );
  }
}