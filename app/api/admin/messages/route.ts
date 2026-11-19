import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    const unreadCount = await prisma.message.count({ where: { read: false } });

    return NextResponse.json({ success: true, messages, unreadCount });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, read } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Message ID required" }, { status: 400 });
    }

    const updated = await prisma.message.update({
      where: { id },
      data: { read: Boolean(read) },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error("Failed to update message:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Message ID required" }, { status: 400 });
    }

    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete message:", error);
    return NextResponse.json({ success: false, error: "Failed to delete message" }, { status: 500 });
  }
}
