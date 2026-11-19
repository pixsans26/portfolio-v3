import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, skills });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, level, category, icon, order, showInHero } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Skill name is required" }, { status: 400 });
    }

    const count = await prisma.skill.count();

    const skill = await prisma.skill.create({
      data: {
        name,
        level: Number(level) || 80,
        category: (category || "design").toLowerCase(),
        icon: icon || "Palette",
        order: order !== undefined ? Number(order) : count + 1,
        showInHero: Boolean(showInHero),
      },
    });

    return NextResponse.json({ success: true, skill });
  } catch (error) {
    console.error("Failed to create skill:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, level, category, icon, order, showInHero } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Skill ID is required" }, { status: 400 });
    }

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        name: name ?? undefined,
        level: level !== undefined ? Number(level) : undefined,
        category: category !== undefined ? category.toLowerCase() : undefined,
        icon: icon ?? undefined,
        order: order !== undefined ? Number(order) : undefined,
        showInHero: showInHero !== undefined ? Boolean(showInHero) : undefined,
      },
    });

    return NextResponse.json({ success: true, skill: updated });
  } catch (error) {
    console.error("Failed to update skill:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Skill ID is required" }, { status: 400 });
    }

    await prisma.skill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
