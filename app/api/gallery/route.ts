import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

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
