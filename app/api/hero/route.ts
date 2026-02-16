import { db } from "@/lib/db";
import { hero } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.query.hero.findMany({
      orderBy: [desc(hero.createdAt)],
    });
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("HERO GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await db.insert(hero).values({
      mainHeading: body.mainHeading,
      subheading: body.subheading,
      backgroundImage: body.backgroundImage,
    }).returning();
    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error("HERO POST ERROR:", error);
    return NextResponse.json({ error: "Failed to create hero item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await db.delete(hero).where(eq(hero.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("HERO DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const body = await req.json();
    const updated = await db.update(hero).set({
      mainHeading: body.mainHeading,
      subheading: body.subheading,
      backgroundImage: body.backgroundImage,
      updatedAt: new Date(),
    }).where(eq(hero.id, parseInt(id))).returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("HERO PUT ERROR:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
