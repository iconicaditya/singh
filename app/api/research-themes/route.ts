import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { researchThemes } from "@/lib/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(researchThemes).orderBy(desc(researchThemes.createdAt));
    return NextResponse.json(data ?? []);
  } catch (error: any) {
    console.error("RESEARCH THEMES GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch research themes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const points = Array.isArray(body.points)
      ? body.points.map((point: any) => String(point || "").trim()).filter(Boolean)
      : [];

    if (points.length === 0) {
      return NextResponse.json({ error: "At least one point is required" }, { status: 400 });
    }

    const [savedItem] = await db
      .insert(researchThemes)
      .values({
        title: String(body.title).trim(),
        iconImage: String(body.iconImage || "").trim(),
        points
      })
      .returning();

    return NextResponse.json(savedItem);
  } catch (error: any) {
    console.error("RESEARCH THEMES POST ERROR:", error);
    return NextResponse.json({ error: "Failed to create research theme" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const points = Array.isArray(body.points)
      ? body.points.map((point: any) => String(point || "").trim()).filter(Boolean)
      : [];

    if (points.length === 0) {
      return NextResponse.json({ error: "At least one point is required" }, { status: 400 });
    }

    const [updatedItem] = await db
      .update(researchThemes)
      .set({
        title: String(body.title).trim(),
        iconImage: String(body.iconImage || "").trim(),
        points,
        updatedAt: new Date()
      })
      .where(eq(researchThemes.id, parseInt(body.id, 10)))
      .returning();

    if (!updatedItem) {
      return NextResponse.json({ error: "Research theme not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error("RESEARCH THEMES PUT ERROR:", error);
    return NextResponse.json({ error: "Failed to update research theme" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(researchThemes).where(eq(researchThemes.id, parseInt(id, 10)));
    return NextResponse.json({ message: "Research theme deleted" });
  } catch (error: any) {
    console.error("RESEARCH THEMES DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete research theme" }, { status: 500 });
  }
}
