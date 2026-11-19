import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, experiences });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company, role, period, location, description, color, logo, order, achievements, current } = body;

    const count = await prisma.experience.count();
    const experience = await prisma.experience.create({
      data: {
        company,
        role,
        period: period || "2024 – Present",
        location: location || "Remote",
        description: description || "",
        color: color || "#4F8EF7",
        logo: logo || "Briefcase",
        order: order !== undefined ? Number(order) : count + 1,
        current: Boolean(current),
        achievements: typeof achievements === "string" ? achievements : JSON.stringify(achievements || []),
      },
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, company, role, period, location, description, color, logo, order, achievements, current } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Experience ID is required" }, { status: 400 });
    }

    const updated = await prisma.experience.update({
      where: { id },
      data: {
        company: company ?? undefined,
        role: role ?? undefined,
        period: period ?? undefined,
        location: location ?? undefined,
        description: description ?? undefined,
        color: color ?? undefined,
        logo: logo ?? undefined,
        order: order !== undefined ? Number(order) : undefined,
        current: current !== undefined ? Boolean(current) : undefined,
        achievements: achievements !== undefined ? (typeof achievements === "string" ? achievements : JSON.stringify(achievements)) : undefined,
      },
    });

    return NextResponse.json({ success: true, experience: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Experience ID is required" }, { status: 400 });
    }

    await prisma.experience.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
