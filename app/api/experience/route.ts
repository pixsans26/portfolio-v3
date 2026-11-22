import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [rawExperience, headlineSetting, subtitleSetting] = await Promise.all([
      prisma.experience.findMany({
        orderBy: { order: "asc" },
      }),
      prisma.settings.findFirst({
        where: { key: { in: ["experienceHeadline", "experience_headline"] } },
      }),
      prisma.settings.findFirst({
        where: { key: { in: ["experienceSubtitle", "experience_subtitle"] } },
      }),
    ]);

    const parsed = rawExperience.map((exp) => ({
      ...exp,
      achievements: typeof exp.achievements === "string" ? JSON.parse(exp.achievements) : exp.achievements,
    }));

    const cleanValue = (raw: string | undefined | null, fallback: string) => {
      if (!raw) return fallback;
      try {
        const parsedVal = JSON.parse(raw);
        return typeof parsedVal === "string" ? parsedVal : raw;
      } catch {
        return raw;
      }
    };

    const headline = cleanValue(headlineSetting?.value, "Where I've worked.");
    const subtitle = cleanValue(
      subtitleSetting?.value,
      "6 years across product design, design systems, and UX research — from seed-stage startups to 100M-user platforms."
    );

    return NextResponse.json({
      success: true,
      experiences: parsed,
      headline,
      subtitle,
    });
  } catch (error) {
    console.error("Failed to fetch public experience:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
