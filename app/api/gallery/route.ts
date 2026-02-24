import { db } from "@/lib/db";
import { gallery, projects, research } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

type GalleryLikeItem = {
  id: number | string;
  title: string;
  category: string;
  imageUrl: string;
  description: string | null;
  createdAt: Date | null;
};

const asString = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const asArray = (value: unknown): any[] => (Array.isArray(value) ? value : []);

export async function GET() {
  try {
    const galleryItems = await db.query.gallery.findMany({
      orderBy: [desc(gallery.createdAt)],
    });

    const projectItems = await db
      .select({
        id: projects.id,
        title: projects.title,
        imageUrl: projects.imageUrl,
        contentSections: projects.contentSections,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt));

    const researchItems = await db
      .select({
        id: research.id,
        title: research.title,
        titleImage: research.titleImage,
        contentSections: research.contentSections,
        createdAt: research.createdAt,
      })
      .from(research)
      .orderBy(desc(research.createdAt));

    const projectGalleryItems: GalleryLikeItem[] = projectItems.flatMap((item) => {
      const results: GalleryLikeItem[] = [];
      const mainImage = asString(item.imageUrl);
      if (mainImage) {
        results.push({
          id: `project-${item.id}-main`,
          title: item.title,
          category: "PROJECTS",
          imageUrl: mainImage,
          description: null,
          createdAt: item.createdAt,
        });
      }

      asArray(item.contentSections).forEach((section: any, index: number) => {
        const sectionImage = asString(section?.image);
        if (sectionImage) {
          results.push({
            id: `project-${item.id}-section-${index}`,
            title: section?.title ? `${item.title} - ${section.title}` : item.title,
            category: "PROJECTS",
            imageUrl: sectionImage,
            description: null,
            createdAt: item.createdAt,
          });
        }
      });

      return results;
    });

    const researchGalleryItems: GalleryLikeItem[] = researchItems.flatMap((item) => {
      const results: GalleryLikeItem[] = [];
      const mainImage = asString(item.titleImage);
      if (mainImage) {
        results.push({
          id: `research-${item.id}-main`,
          title: item.title,
          category: "RESEARCH",
          imageUrl: mainImage,
          description: null,
          createdAt: item.createdAt,
        });
      }

      asArray(item.contentSections).forEach((section: any, index: number) => {
        const sectionImage = asString(section?.image);
        if (sectionImage) {
          results.push({
            id: `research-${item.id}-section-${index}`,
            title: section?.title ? `${item.title} - ${section.title}` : item.title,
            category: "RESEARCH",
            imageUrl: sectionImage,
            description: null,
            createdAt: item.createdAt,
          });
        }
      });

      return results;
    });

    const merged = [
      ...(galleryItems || []),
      ...projectGalleryItems,
      ...researchGalleryItems,
    ]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        createdAt: item.createdAt,
      }));

    return NextResponse.json(merged);
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
