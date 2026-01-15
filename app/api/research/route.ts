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
      // Ensure we have at least one author and they are non-empty
      const sanitizedAuthors = Array.isArray(body.authors) ? body.authors.filter((a: any) => typeof a === 'string' && a.trim() !== "") : [];
      
      // Ensure JSON fields are properly formatted for Drizzle
      const insertData: any = {
        title: body.title || "Untitled Research",
        category: body.category || "RESEARCH",
        year: body.year?.toString().slice(0, 4) || new Date().getFullYear().toString(),
        tags: body.tags || "",
        titleImage: body.titleImage || "",
        authors: Array.isArray(body.authors) ? body.authors : [],
        contentSections: Array.isArray(body.contentSections) ? body.contentSections : [],
        relatedPublications: Array.isArray(body.relatedPublications) ? body.relatedPublications : [],
      };

      console.log('Attempting DB Insert with sanitized data');

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
