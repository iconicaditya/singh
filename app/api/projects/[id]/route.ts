import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const normalizeProject = (item: any) => ({
  ...item,
  teamMembers: Array.isArray(item?.teamMembers) ? item.teamMembers : [],
  projectObjectives: Array.isArray(item?.projectObjectives) ? item.projectObjectives : [],
  contentSections: Array.isArray(item?.contentSections) ? item.contentSections : [],
  attachedResearchIds: Array.isArray(item?.attachedResearchIds) ? item.attachedResearchIds : [],
});

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const [item] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!item) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeProject(item));
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch project",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
