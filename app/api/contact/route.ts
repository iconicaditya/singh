import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    try {
      const body = await req.json();
      console.log("Contact form submission body:", body);
      const { name, email, subject, message } = body;
      
      if (!name || !email || !message) {
        return NextResponse.json(
          { error: "Name, email, and message are required" },
          { status: 400 }
        );
      }

      // Ensure we are using the messages table from the schema
      const inserted = await db.insert(messages).values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: (subject || "No Subject").trim(),
        message: message.trim(),
      }).returning();
      
      if (!inserted || inserted.length === 0) {
        throw new Error("Failed to insert message: No data returned");
      }

      console.log("Message saved successfully:", inserted[0]);
      return NextResponse.json(inserted[0]);
    } catch (err: any) {
      console.error("CRITICAL API ERROR:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      return NextResponse.json(
        { error: err.message || "Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit message" },
      { status: 500 }
    );
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
