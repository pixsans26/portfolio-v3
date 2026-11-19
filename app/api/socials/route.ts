import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const socials = await prisma.social.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, socials });
  } catch (error) {
    console.error("Failed to fetch public socials:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
