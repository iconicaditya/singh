import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(gallery).orderBy(desc(gallery.createdAt));
    return NextResponse.json(data);
  } catch (error) {
    console.error("GALLERY GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await db.insert(gallery).values({
      title: body.title,
      category: body.category,
      imageUrl: body.imageUrl,
      description: body.description,
    }).returning();
    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error("GALLERY POST ERROR:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await db.delete(gallery).where(eq(gallery.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("GALLERY DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const body = await req.json();
    const updated = await db.update(gallery).set({
      title: body.title,
      category: body.category,
      imageUrl: body.imageUrl,
      description: body.description,
      updatedAt: new Date(),
    }).where(eq(gallery.id, parseInt(id))).returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("GALLERY PUT ERROR:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
