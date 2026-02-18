import { db } from "@/lib/db";
import { people } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.query.people.findMany({
      orderBy: [desc(people.createdAt)],
    });
    return NextResponse.json(data || []);
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const body = await req.json();
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
    return NextResponse.json({ error: "Failed to update person" }, { status: 500 });
  }
}
