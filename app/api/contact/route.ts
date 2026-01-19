import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const inserted = await db.insert(messages).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "No Subject").trim(),
      message: message.trim(),
    }).returning();
    
    if (!inserted || inserted.length === 0) {
      throw new Error("Failed to insert message: No data returned");
    }

    return NextResponse.json(inserted[0]);
  } catch (err: any) {
    console.error("CONTACT API ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    const updated = await db
      .update(messages)
      .set({ isRead })
      .where(eq(messages.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating message status:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await db.select().from(messages).orderBy(desc(messages.createdAt));
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
