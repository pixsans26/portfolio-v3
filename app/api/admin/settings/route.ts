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
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { key, value } = body;

    const stringified = typeof value === "object" ? JSON.stringify(value) : String(value);

    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value: stringified },
      create: { key, value: stringified },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
