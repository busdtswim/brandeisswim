// src/app/api/auth/admin/content/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../[...nextauth]/route';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
const ContentStore = require('@/lib/stores/ContentStore.js');

// Create a DOM environment for server-side sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const content = await ContentStore.findAll();
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

    const updatedContent = await ContentStore.updateBySection(data.section, {
      title: data.title,
      content: sanitizedContent // Use sanitized content
    });

    if (!updatedContent) {
      return NextResponse.json({ error: 'Content section not found' }, { status: 404 });
    }

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
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

    const newContent = await ContentStore.create({
      section,
      title,
      content: sanitizedContent
    });

    return NextResponse.json(newContent);
  } catch (error) {
    console.error('Error creating content:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    // Handle unique constraint violations
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Valid content ID is required' }, { status: 400 });
    }

    const deletedContent = await ContentStore.delete(parseInt(id));
    
    if (!deletedContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Content deleted successfully',
      deletedId: deletedContent.id
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    
    // Handle validation errors
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}