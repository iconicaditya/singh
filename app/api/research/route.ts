import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { research } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

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
    
    console.log('Incoming Research Data:', body);
    
    // Validate required fields
    if (!body.title || !body.category || !body.year || !body.authors || !Array.isArray(body.authors) || !body.contentSections || !Array.isArray(body.contentSections)) {
      return NextResponse.json({ 
        error: 'Missing or invalid required fields: title, category, year, authors, and contentSections are required' 
      }, { status: 400 });
    }

    try {
      // Ensure data is clean and valid
      const insertData: any = {
        title: String(body.title || "").trim(),
        category: String(body.category || "").trim(),
        year: String(body.year || "").slice(0, 4),
        tags: String(body.tags || "").trim(),
        titleImage: String(body.titleImage || "").trim(),
        authors: Array.isArray(body.authors) 
          ? body.authors.filter((a: any) => a.name && a.name.trim() !== "")
          : [],
        contentSections: Array.isArray(body.contentSections)
          ? body.contentSections.filter((s: any) => s.title && s.title.trim() !== "")
          : [],
        relatedPublications: Array.isArray(body.relatedPublications) ? body.relatedPublications : [],
      };

      if (!insertData.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      if (insertData.authors.length === 0) return NextResponse.json({ error: 'At least one author is required' }, { status: 400 });
      if (insertData.contentSections.length === 0) return NextResponse.json({ error: 'At least one content section is required' }, { status: 400 });

      console.log('Attempting DB Insert with Drizzle...');
      
      const result = await db.insert(research).values(insertData).returning();
      
      if (!result || result.length === 0) {
        console.error('Insert executed but no items returned');
        throw new Error("Database insertion failed - no record returned");
      }

      console.log('Research created successfully:', result[0].id);
      return NextResponse.json(result[0]);
    } catch (dbError: any) {
      console.error('CRITICAL DB ERROR:', dbError);
      return NextResponse.json({ 
        error: 'Database operation failed', 
        details: dbError.message,
        code: dbError.code 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('DB Error Detail:', error);
    return NextResponse.json({ 
      error: 'Failed to create research', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updateData: any = {
      title: body.title,
      category: body.category,
      year: body.year?.toString().slice(0, 4),
      tags: body.tags || "",
      titleImage: body.titleImage || "",
      authors: Array.isArray(body.authors) ? body.authors.filter((a: any) => a.name && a.name.trim() !== "") : [],
      contentSections: Array.isArray(body.contentSections) ? body.contentSections.filter((s: any) => s.title && s.title.trim() !== "") : [],
      relatedPublications: Array.isArray(body.relatedPublications) ? body.relatedPublications : [],
      updatedAt: new Date(),
    };

    if (updateData.authors.length === 0) {
      return NextResponse.json({ error: 'At least one author with a name is required' }, { status: 400 });
    }
    if (updateData.contentSections.length === 0) {
      return NextResponse.json({ error: 'At least one content section with a title is required' }, { status: 400 });
    }

    const [updatedItem] = await db.update(research)
      .set(updateData)
      .where(eq(research.id, parseInt(body.id)))
      .returning();

    if (!updatedItem) return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update research', details: error.message }, { status: 500 });
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
