import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { NextResponse } from "next/server";

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

    const newMessage = await db.insert(messages).values({
      name,
      email,
      subject: subject || "No Subject",
      message,
    }).returning();

    return NextResponse.json(newMessage[0]);
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
    const data = await db.select().from(messages).orderBy(messages.createdAt);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
