import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../[...nextauth]/route';
const ContentStore = require('@/lib/stores/ContentStore.js');

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Content identifier is required' }, { status: 400 });
    }

    if (!isNaN(Number(slug))) {
      // Delete by ID
      const deletedContent = await ContentStore.delete(Number(slug));
      if (!deletedContent) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      return NextResponse.json({ 
        message: 'Content deleted successfully',
        deletedId: deletedContent.id
      });
    } else {
      // Delete by section
      const existingContent = await ContentStore.findBySection(slug);
      if (!existingContent) {
        return NextResponse.json(
          { error: 'Section not found' }, 
          { status: 404 }
        );
      }
      const deletedContent = await ContentStore.deleteBySection(slug);
      if (!deletedContent) {
        return NextResponse.json(
          { error: 'Failed to delete section' }, 
          { status: 500 }
        );
      }
      return NextResponse.json({ message: 'Section deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Content identifier is required' }, { status: 400 });
    }
    if (!isNaN(Number(slug))) {
      // Get by ID
      const content = await ContentStore.findById(Number(slug));
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      return NextResponse.json(content);
    } else {
      // Get by section
      const content = await ContentStore.findBySection(slug);
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      return NextResponse.json(content);
    }
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
} 