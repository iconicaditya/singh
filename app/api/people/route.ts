import { db } from "@/lib/db";
import { people } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    try {
      const data = await db.select().from(people).orderBy(asc(people.position));
      return NextResponse.json(data ?? []);
    } catch (err) {
      console.warn('Position column unavailable or query failed, falling back to createdAt ordering.', err);
      const fallback = await db.select().from(people).orderBy(desc(people.createdAt));
      return NextResponse.json(fallback ?? []);
    }
  } catch (error) {
    console.error("PEOPLE GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newItem = await db.insert(people).values({
      fullName: body.fullName,
      roleDesignation: body.roleDesignation,
      profileImage: body.profileImage,
      nationality: body.nationality || null,
      labId: body.labId || null,
      educationBackground: body.educationBackground || null,
      pastTeachingBackground: body.pastTeachingBackground || null,
      publications: body.publications || null,
      cvUrl: body.cvUrl || null,
      cvLinks: body.cvLinks || null,
      graduationYears: body.graduationYears || null,
      researchTopic: body.researchTopic || null,
      conferencePresentation: body.conferencePresentation || null,
      linkedinUrl: body.linkedinUrl || null,
      twitterUrl: body.twitterUrl || null,
      facebookUrl: body.facebookUrl || null,
      instagramUrl: body.instagramUrl || null,
    }).returning();
    // Set initial position to the inserted id so new items append
    if (newItem && typeof newItem[0]?.id === 'number') {
      await db.update(people).set({ position: newItem[0].id }).where(eq(people.id, newItem[0].id));
      const refreshed = await db.select().from(people).where(eq(people.id, newItem[0].id));
      if (Array.isArray(refreshed) && refreshed[0]) return NextResponse.json(refreshed[0]);
    }
    return NextResponse.json(newItem[0]);
  } catch (error) {
    console.error("PEOPLE POST ERROR:", error);
    return NextResponse.json({ error: "Failed to create person" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await db.delete(people).where(eq(people.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PEOPLE DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete person" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    // Debug: log incoming payload to help diagnose reorder failures
    console.log('PUT /api/people payload:', JSON.stringify(body));
    // Support reordering: client can send { order: [id1, id2, ...] }
    if (Array.isArray(body.order)) {
      const orderArr: number[] = body.order.map((v: any) => parseInt(v, 10)).filter(Boolean);
      for (let i = 0; i < orderArr.length; i++) {
        const id = orderArr[i];
        await db.update(people).set({ position: i + 1 }).where(eq(people.id, id));
      }
      return NextResponse.json({ success: true });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const updated = await db.update(people).set({
      fullName: body.fullName,
      roleDesignation: body.roleDesignation,
      profileImage: body.profileImage,
      nationality: body.nationality || null,
      labId: body.labId || null,
      educationBackground: body.educationBackground || null,
      pastTeachingBackground: body.pastTeachingBackground || null,
      publications: body.publications || null,
      cvUrl: body.cvUrl || null,
      cvLinks: body.cvLinks || null,
      graduationYears: body.graduationYears || null,
      researchTopic: body.researchTopic || null,
      conferencePresentation: body.conferencePresentation || null,
      linkedinUrl: body.linkedinUrl || null,
      twitterUrl: body.twitterUrl || null,
      facebookUrl: body.facebookUrl || null,
      instagramUrl: body.instagramUrl || null,
      updatedAt: new Date(),
    }).where(eq(people.id, parseInt(id))).returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PEOPLE PUT ERROR:", error);
    if (error instanceof Error) console.error(error.stack);
    return NextResponse.json({ error: "Failed to update person" }, { status: 500 });
  }
}
