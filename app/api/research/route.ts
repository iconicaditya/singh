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
    
    console.log('Incoming Research Data:', body);
    
    // Validate required fields
    if (!body.title || !body.category || !body.year || !body.authors || !Array.isArray(body.authors)) {
      console.log('Validation failed:', { 
        title: !!body.title, 
        category: !!body.category, 
        year: !!body.year, 
        authors: !!body.authors, 
        isAuthorsArray: Array.isArray(body.authors) 
      });
      return NextResponse.json({ 
        error: 'Missing or invalid required fields: title, category, year, and authors (must be an array) are required' 
      }, { status: 400 });
    }

    try {
      // Ensure JSON fields are properly formatted for Drizzle
      const insertData: any = {
        title: body.title,
        category: body.category,
        year: body.year?.toString().slice(0, 4),
        tags: body.tags || "",
        titleImage: body.titleImage || "",
        authors: body.authors.filter((a: any) => a.name && a.name.trim() !== ""),
        contentSections: body.contentSections.filter((s: any) => s.title && s.title.trim() !== ""),
        relatedPublications: Array.isArray(body.relatedPublications) ? body.relatedPublications : [],
      };

      if (insertData.authors.length === 0) {
        return NextResponse.json({ error: 'At least one author with a name is required' }, { status: 400 });
      }
      if (insertData.contentSections.length === 0) {
        return NextResponse.json({ error: 'At least one content section with a title is required' }, { status: 400 });
      }

      console.log('Attempting DB Insert');

      const [savedItem] = await db.insert(research).values(insertData).returning();
      
      if (!savedItem) {
        throw new Error("Database insertion failed - no record returned");
      }

      return NextResponse.json(savedItem);
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const [updatedItem] = await db.update(research)
      .set({
        title: body.title,
        category: body.category,
        year: body.year?.toString().slice(0, 4),
        tags: body.tags || "",
        titleImage: body.titleImage || "",
        authors: Array.isArray(body.authors) ? body.authors : [],
        contentSections: Array.isArray(body.contentSections) ? body.contentSections : [],
        relatedPublications: Array.isArray(body.relatedPublications) ? body.relatedPublications : [],
        updatedAt: new Date(),
      })
      .where(eq(research.id, parseInt(body.id)))
      .returning();

    if (!updatedItem) return NextResponse.json({ error: 'Research not found' }, { status: 404 });
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update research', details: error.message }, { status: 500 });
  }
}
