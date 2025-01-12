// src/app/api/auth/admin/content/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const content = await prisma.site_content.findMany({
      orderBy: {
        order_num: 'asc'
      }
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { section, title, content, order_num } = data;

    const updatedContent = await prisma.site_content.update({
      where: { section },
      data: {
        title,
        content,
        order_num: order_num || 0
      }
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function POST(request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const data = await request.json();
      const { section, title, content, is_custom, order_num } = data;
  
      const newContent = await prisma.site_content.create({
        data: {
          section,
          title,
          content: content || '',
          is_custom: is_custom || false,
          order_num: order_num || 0
        }
      });
  
      return NextResponse.json(newContent);
    } catch (error) {
      console.error('Error creating content:', error);
      return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
    }
  }