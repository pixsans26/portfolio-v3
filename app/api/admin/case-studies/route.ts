import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            company: true,
            coverImage: true,
            year: true,
            role: true,
            description: true,
            overview: true,
            tags: true,
            prototypeUrl: true,
            liveUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, caseStudies });
  } catch (error) {
    console.error("Failed to fetch case studies:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      projectId,
      problem,
      research,
      wireframes,
      hiFidelity,
      prototype,
      testing,
      lessons,
      figmaEmbed,
    } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const caseStudy = await prisma.caseStudy.upsert({
      where: { projectId },
      update: {
        problem: problem || "",
        research: typeof research === "string" ? research : JSON.stringify(research || []),
        wireframes: typeof wireframes === "string" ? wireframes : JSON.stringify(wireframes || []),
        hiFidelity: typeof hiFidelity === "string" ? hiFidelity : JSON.stringify(hiFidelity || []),
        prototype: prototype || null,
        testing: typeof testing === "string" ? testing : JSON.stringify(testing || {}),
        lessons: lessons || "",
        figmaEmbed: figmaEmbed || null,
      },
      create: {
        projectId,
        problem: problem || "",
        research: typeof research === "string" ? research : JSON.stringify(research || []),
        wireframes: typeof wireframes === "string" ? wireframes : JSON.stringify(wireframes || []),
        hiFidelity: typeof hiFidelity === "string" ? hiFidelity : JSON.stringify(hiFidelity || []),
        prototype: prototype || null,
        testing: typeof testing === "string" ? testing : JSON.stringify(testing || {}),
        lessons: lessons || "",
        figmaEmbed: figmaEmbed || null,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            company: true,
            coverImage: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, caseStudy });
  } catch (error) {
    console.error("Failed to save case study:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      problem,
      research,
      wireframes,
      hiFidelity,
      prototype,
      testing,
      lessons,
      figmaEmbed,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Case study ID is required" }, { status: 400 });
    }

    const updated = await prisma.caseStudy.update({
      where: { id },
      data: {
        problem: problem !== undefined ? problem : undefined,
        research: research !== undefined ? (typeof research === "string" ? research : JSON.stringify(research)) : undefined,
        wireframes: wireframes !== undefined ? (typeof wireframes === "string" ? wireframes : JSON.stringify(wireframes)) : undefined,
        hiFidelity: hiFidelity !== undefined ? (typeof hiFidelity === "string" ? hiFidelity : JSON.stringify(hiFidelity)) : undefined,
        prototype: prototype !== undefined ? prototype : undefined,
        testing: testing !== undefined ? (typeof testing === "string" ? testing : JSON.stringify(testing)) : undefined,
        lessons: lessons !== undefined ? lessons : undefined,
        figmaEmbed: figmaEmbed !== undefined ? figmaEmbed : undefined,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            company: true,
            coverImage: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, caseStudy: updated });
  } catch (error) {
    console.error("Failed to update case study:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Case study ID is required" }, { status: 400 });
    }

    await prisma.caseStudy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete case study:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

