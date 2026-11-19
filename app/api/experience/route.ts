import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rawExperience = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });

    const parsed = rawExperience.map((exp) => ({
      ...exp,
      achievements: typeof exp.achievements === "string" ? JSON.parse(exp.achievements) : exp.achievements,
    }));

    return NextResponse.json({ success: true, experiences: parsed });
  } catch (error) {
    console.error("Failed to fetch public experience:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
