import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { research } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(research).orderBy(desc(research.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch research' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.title || !body.category || !body.year || !body.authors) {
      return NextResponse.json({ error: 'Missing required fields: title, category, year, and authors are required' }, { status: 400 });
    }

    const [savedItem] = await db.insert(research).values({
      title: body.title,
      category: body.category,
      year: body.year,
      tags: body.tags || "",
      titleImage: body.titleImage || "",
      authors: body.authors,
      contentSections: body.contentSections || [],
      relatedPublications: body.relatedPublications || [],
    }).returning();
    
    // Securely serialize dates
    const serializeDate = (d: any) => {
      if (!d) return new Date().toISOString();
      try {
        const date = new Date(d);
        if (isNaN(date.getTime())) return new Date().toISOString();
        return date.toISOString();
      } catch (e) {
        return new Date().toISOString();
      }
    };

    if (!savedItem) {
      // Fallback: If returning() doesn't work as expected, fetch the latest inserted item
      const latestItems = await db.select().from(research).orderBy(desc(research.id)).limit(1);
      if (latestItems.length > 0) {
        const item = latestItems[0];
        return NextResponse.json({
          ...item,
          createdAt: serializeDate(item.createdAt),
          updatedAt: serializeDate(item.updatedAt)
        });
      }
      throw new Error("Database insertion failed - no record found after insert");
    }

    // Ensure we return a clean serializable object
    return NextResponse.json({
      ...savedItem,
      createdAt: serializeDate(savedItem.createdAt),
      updatedAt: serializeDate(savedItem.updatedAt)
    });
  } catch (error: any) {
    console.error('DB Error Detail:', error);
    // Log the actual error object to see why it might fail
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ 
      error: 'Failed to create research', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await db.delete(research).where(eq(research.id, parseInt(id)));
    return NextResponse.json({ message: 'Research deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete research' }, { status: 500 });
  }
}
