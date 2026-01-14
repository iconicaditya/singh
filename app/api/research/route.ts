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
    const result = await db.insert(research).values({
      title: body.title,
      category: body.category,
      year: body.year,
      tags: body.tags,
      titleImage: body.titleImage,
      authors: body.authors,
      contentSections: body.contentSections,
      relatedPublications: body.relatedPublications,
    }).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to create research' }, { status: 500 });
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
