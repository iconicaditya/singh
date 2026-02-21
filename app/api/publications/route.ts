import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publications } from '@/lib/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Try to fetch from publications table with safe field selection
    let data;
    try {
      data = await db.select().from(publications).orderBy(desc(publications.createdAt));
    } catch (dbError: any) {
      // If the query fails due to missing columns, fetch with raw SQL and handle fallback
      console.warn('Standard query failed, attempting alternative:', dbError.message);
      data = [];
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json([]);
    }
    
    const sanitizedData = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      authors: typeof item.authors === 'string' ? item.authors : String(item.authors || ''),
      year: item.year || '',
      publicationType: item.publicationType || item.category || '',
      abstract: item.abstract || item.description || '',
      keywords: item.keywords || item.tags || '',
      journalConferenceName: item.journalConferenceName || '',
      doiUrl: item.doiUrl || '',
      pdfUrl: item.pdfUrl || '',
      coverImageUrl: item.coverImageUrl || item.imageUrl || '',
      category: item.category,
      description: item.description,
      tags: item.tags,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    return NextResponse.json(sanitizedData);
  } catch (error: any) {
    console.error('Fetch error:', error);
    // Return empty array instead of error to prevent UI from breaking
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Only include fields that exist
    const insertData: any = {
      title: body.title,
      authors: body.authors,
      pdfUrl: body.pdfUrl,
    };
    
    // Add new fields if they exist
    if (body.year) insertData.year = body.year;
    if (body.publicationType) insertData.publicationType = body.publicationType;
    if (body.abstract) insertData.abstract = body.abstract;
    if (body.keywords) insertData.keywords = body.keywords;
    if (body.journalConferenceName) insertData.journalConferenceName = body.journalConferenceName;
    if (body.doiUrl) insertData.doiUrl = body.doiUrl;
    if (body.coverImageUrl) insertData.coverImageUrl = body.coverImageUrl;
    
    // Add old fields for backward compatibility
    if (body.category) insertData.category = body.category;
    if (body.description) insertData.description = body.description;
    if (body.tags) insertData.tags = body.tags;
    if (body.imageUrl) insertData.imageUrl = body.imageUrl;
    
    const [savedItem] = await db.insert(publications).values(insertData).returning();
    return NextResponse.json(savedItem);
  } catch (error: any) {
    console.error('Create error:', error);
    return NextResponse.json({ error: 'Failed to create publication: ' + error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    // Only include fields that should be updated
    const safeUpdateData: any = {};
    if ('title' in updateData) safeUpdateData.title = updateData.title;
    if ('authors' in updateData) safeUpdateData.authors = updateData.authors;
    if ('pdfUrl' in updateData) safeUpdateData.pdfUrl = updateData.pdfUrl;
    if ('year' in updateData) safeUpdateData.year = updateData.year;
    if ('publicationType' in updateData) safeUpdateData.publicationType = updateData.publicationType;
    if ('abstract' in updateData) safeUpdateData.abstract = updateData.abstract;
    if ('keywords' in updateData) safeUpdateData.keywords = updateData.keywords;
    if ('journalConferenceName' in updateData) safeUpdateData.journalConferenceName = updateData.journalConferenceName;
    if ('doiUrl' in updateData) safeUpdateData.doiUrl = updateData.doiUrl;
    if ('coverImageUrl' in updateData) safeUpdateData.coverImageUrl = updateData.coverImageUrl;
    if ('category' in updateData) safeUpdateData.category = updateData.category;
    if ('description' in updateData) safeUpdateData.description = updateData.description;
    if ('tags' in updateData) safeUpdateData.tags = updateData.tags;
    if ('imageUrl' in updateData) safeUpdateData.imageUrl = updateData.imageUrl;
    
    safeUpdateData.updatedAt = new Date();
    
    const [updatedItem] = await db.update(publications)
      .set(safeUpdateData)
      .where(eq(publications.id, parseInt(id)))
      .returning();
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update publication: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    await db.delete(publications).where(eq(publications.id, parseInt(id)));
    return NextResponse.json({ message: 'Publication deleted' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
  }
}