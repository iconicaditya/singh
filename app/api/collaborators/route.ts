import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { collaborators } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(collaborators).orderBy(desc(collaborators.createdAt));
    
    if (!data) {
      console.warn('Collaborators query returned null');
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('COLLABORATORS GET ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch collaborators', details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('API POST Received:', body);

    const [savedItem] = await db.insert(collaborators).values({
      companyName: body.companyName || "",
      logoUrl: body.logoUrl || "",
      imageUrl: body.imageUrl || "",
      website: body.website || "",
    }).returning();
    
    console.log('Collaborator saved successfully:', savedItem);

    return NextResponse.json(savedItem);
  } catch (error: any) {
    console.error('CRITICAL COLLABORATOR POST ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to create collaborator', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log('API PUT Received:', body);
    if (!body.id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const [updatedItem] = await db.update(collaborators)
      .set({
        companyName: body.companyName,
        logoUrl: body.logoUrl || "",
        imageUrl: body.imageUrl || "",
        website: body.website || "",
        updatedAt: new Date()
      })
      .where(eq(collaborators.id, body.id))
      .returning();

    console.log('Collaborator updated successfully:', updatedItem);
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('CRITICAL COLLABORATOR PUT ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to update collaborator',
      details: error.message || String(error)
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await db.delete(collaborators).where(eq(collaborators.id, parseInt(id)));
    return NextResponse.json({ message: 'Collaborator deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete collaborator' }, { status: 500 });
  }
}
