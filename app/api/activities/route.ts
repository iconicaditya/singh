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
