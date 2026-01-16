import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const data = await db.select().from(projects).orderBy(desc(projects.createdAt));
    
    // Ensure all rows are valid objects before mapping
    if (!data) return NextResponse.json([]);

    const sanitizedData = data.map(item => ({
      ...item,
      teamMembers: Array.isArray(item.teamMembers) ? item.teamMembers : [],
      projectObjectives: Array.isArray(item.projectObjectives) ? item.projectObjectives : [],
      attachedResearchIds: Array.isArray(item.attachedResearchIds) ? item.attachedResearchIds : []
    }));
    return NextResponse.json(sanitizedData);
  } catch (error: any) {
    console.error('PROJECT GET ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch projects', details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('API POST Received:', body);
    
    if (!body.title || !body.description || !body.status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [savedItem] = await db.insert(projects).values({
      title: body.title,
      category: body.category || "General",
      tags: body.tags || "",
      teamMembers: body.teamMembers || [],
      location: body.location || "",
      description: body.description || "",
      status: body.status || "ongoing",
      imageUrl: body.imageUrl || "",
      aboutProject: body.aboutProject || "",
      projectObjectives: Array.isArray(body.projectObjectives) ? body.projectObjectives : [],
      projectDate: body.projectDate || new Date().toISOString().split('T')[0],
      attachedResearchIds: Array.isArray(body.attachedResearchIds) ? body.attachedResearchIds : [],
      link: body.link || "",
    }).returning();
    
    console.log('Project saved successfully:', savedItem);

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
    console.error('CRITICAL PROJECT POST ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to create project', 
      details: error.message || String(error)
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log('API PUT Received:', body);
    if (!body.id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const [updatedItem] = await db.update(projects)
      .set({
        title: body.title,
        category: body.category || "",
        tags: body.tags || "",
        teamMembers: body.teamMembers || [],
        location: body.location || "",
        description: body.description,
        status: body.status,
        imageUrl: body.imageUrl || "",
        aboutProject: body.aboutProject || "",
        projectObjectives: body.projectObjectives || [],
        projectDate: body.projectDate || "",
        attachedResearchIds: body.attachedResearchIds || [],
        link: body.link || "",
        updatedAt: new Date()
      })
      .where(eq(projects.id, body.id))
      .returning();

    console.log('Project updated successfully:', updatedItem);
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error('CRITICAL PROJECT PUT ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to update project',
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
