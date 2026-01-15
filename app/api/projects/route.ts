import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (!body.title || !body.description || !body.status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [savedItem] = await db.insert(projects).values({
      title: body.title,
      description: body.description,
      status: body.status,
      imageUrl: body.imageUrl || "",
      link: body.link || "",
      tags: body.tags || "",
    }).returning();
    
    const serializeDate = (d: any) => {
      if (!d) return new Date().toISOString();
      const date = new Date(d);
      return !isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
    };

    return NextResponse.json({
      ...savedItem,
      createdAt: serializeDate(savedItem.createdAt),
      updatedAt: serializeDate(savedItem.updatedAt)
    });
  } catch (error: any) {
    console.error('Project DB Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create project', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await db.delete(projects).where(eq(projects.id, parseInt(id)));
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
