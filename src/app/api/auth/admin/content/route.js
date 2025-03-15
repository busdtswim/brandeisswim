// src/app/api/auth/admin/content/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

// Create a DOM environment for server-side sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

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
    
    // Server-side sanitization
    const sanitizedContent = DOMPurify.sanitize(data.content, {
      FORBID_ATTR: ['onloadstart', 'onerror', 'onload', 'onmouseover', 'onclick'],
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 
        'ul', 'ol', 'li', 'a', 'img', 'span', 'blockquote', 
        'pre', 'code', 'div'
      ]
    });

    const updatedContent = await prisma.site_content.update({
      where: { section: data.section },
      data: {
        title: data.title,
        content: sanitizedContent, // Use sanitized content
        order_num: data.order_num || 0
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

    // Sanitize content before saving
    const sanitizedContent = DOMPurify.sanitize(content || '', {
      FORBID_ATTR: ['onloadstart', 'onerror', 'onload', 'onmouseover', 'onclick'],
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 
        'ul', 'ol', 'li', 'a', 'img', 'span', 'blockquote', 
        'pre', 'code', 'div'
      ]
    });

    const newContent = await prisma.site_content.create({
      data: {
        section,
        title,
        content: sanitizedContent,
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