import { db, research } from "@/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = await db.insert(research).values({
      title: data.title,
      category: data.category,
      year: data.year,
      summary: data.summary,
      titleImage: data.titleImage,
      abstract: data.abstract,
      authors: data.authors,
      doi: data.doi,
      journal: data.journal,
      sections: data.sections,
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error adding research:", error);
    return NextResponse.json({ error: "Failed to add research" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const results = await db.select().from(research);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching research:", error);
    return NextResponse.json({ error: "Failed to fetch research" }, { status: 500 });
  }
}
