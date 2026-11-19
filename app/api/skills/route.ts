import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rawSkills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });

    const grouped: Record<string, typeof rawSkills> = {
      design: [],
      research: [],
      systems: [],
      code: [],
    };

    for (const skill of rawSkills) {
      const cat = skill.category.toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill);
    }

    return NextResponse.json({ success: true, skills: grouped, all: rawSkills });
  } catch (error) {
    console.error("Failed to fetch public skills:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
