import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { publications } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(publications).orderBy(desc(publications.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch publications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [savedItem] = await db.insert(publications).values(body).returning();
    return NextResponse.json(savedItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create publication' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    const [updatedItem] = await db.update(publications)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(publications.id, parseInt(id)))
      .returning();
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update publication' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    await db.delete(publications).where(eq(publications.id, parseInt(id)));
    return NextResponse.json({ message: 'Publication deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete publication' }, { status: 500 });
  }
}