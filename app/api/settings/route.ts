import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.settings.findMany();
    const settingsMap: Record<string, any> = {};
    settings.forEach((s) => {
      try {
        settingsMap[s.key] = JSON.parse(s.value);
      } catch {
        settingsMap[s.key] = s.value;
      }
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (error) {
    console.error("Failed to fetch public settings:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
