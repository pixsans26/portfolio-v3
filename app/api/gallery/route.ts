import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const excludeCategory = searchParams.get("excludeCategory");

    const where: any = { published: true };
    if (category) {
      where.category = category;
    } else if (excludeCategory) {
      where.category = { not: excludeCategory };
    }

    const items = await prisma.gallery.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Failed to fetch public gallery:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

