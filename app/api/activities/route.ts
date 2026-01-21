import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { activities } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(activities).orderBy(desc(activities.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newActivity = await db.insert(activities).values({
      title: body.title,
      category: body.category,
      year: body.year,
      tags: body.tags,
      titleImage: body.titleImage,
      contentSections: body.contentSections,
    }).returning();
    return NextResponse.json(newActivity[0]);
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updatedActivity = await db.update(activities)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(activities.id, id))
      .returning();
      
    return NextResponse.json(updatedActivity[0]);
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(activities).where(eq(activities.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
