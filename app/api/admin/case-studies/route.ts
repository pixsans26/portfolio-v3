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
      title,
      company,
      role,
      year,
      coverImage,
      tags,
      problem,
      overviewNote,
      photos,
      research,
      wireframes,
      hiFidelity,
      prototype,
      testing,
      lessons,
      figmaEmbed,
      liveUrl,
    } = body;

    let targetProjectId = projectId;

    // If no existing project linked, create a new Project record directly for this Case Study
    if (!targetProjectId) {
      if (!title || !title.trim()) {
        return NextResponse.json(
          { success: false, error: "Case study title is required" },
          { status: 400 }
        );
      }

      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "case-study";

      let slug = baseSlug;
      let counter = 1;
      while (await prisma.project.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const formattedTags = Array.isArray(tags)
        ? JSON.stringify(tags)
        : typeof tags === "string"
        ? (tags.startsWith("[")
            ? tags
            : JSON.stringify(tags.split(",").map((t: string) => t.trim()).filter(Boolean)))
        : JSON.stringify(["Case Study"]);

      const photosArray = Array.isArray(photos) ? photos : (Array.isArray(hiFidelity) ? hiFidelity : []);
      const finalCover = coverImage?.trim() || (photosArray.length > 0 ? photosArray[0] : "");
      const finalOverview = problem?.trim() || overviewNote?.trim() || "";

      const newProject = await prisma.project.create({
        data: {
          title: title.trim(),
          slug,
          company: company?.trim() || "Case Study",
          role: role?.trim() || "Product Designer",
          year: year?.trim() || new Date().getFullYear().toString(),
          coverImage: finalCover,
          subtitle: finalOverview,
          description: finalOverview,
          overview: finalOverview,
          duration: "3 Months",
          tags: formattedTags,
          gallery: JSON.stringify(photosArray),
          prototypeUrl: prototype?.trim() || null,
          liveUrl: liveUrl?.trim() || null,
          published: true,
        },
      });

      targetProjectId = newProject.id;
    }

    const finalPhotos = Array.isArray(photos)
      ? JSON.stringify(photos)
      : typeof hiFidelity === "string"
      ? hiFidelity
      : JSON.stringify(hiFidelity || []);

    const caseStudy = await prisma.caseStudy.upsert({
      where: { projectId: targetProjectId },
      update: {
        problem: problem || overviewNote || "",
        research: typeof research === "string" ? research : JSON.stringify(research || []),
        wireframes: typeof wireframes === "string" ? wireframes : JSON.stringify(wireframes || []),
        hiFidelity: finalPhotos,
        prototype: prototype || null,
        testing: typeof testing === "string" ? testing : JSON.stringify(testing || {}),
        lessons: lessons || "",
        figmaEmbed: figmaEmbed || null,
      },
      create: {
        projectId: targetProjectId,
        problem: problem || overviewNote || "",
        research: typeof research === "string" ? research : JSON.stringify(research || []),
        wireframes: typeof wireframes === "string" ? wireframes : JSON.stringify(wireframes || []),
        hiFidelity: finalPhotos,
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
      title,
      company,
      role,
      year,
      coverImage,
      tags,
      problem,
      overviewNote,
      photos,
      research,
      wireframes,
      hiFidelity,
      prototype,
      testing,
      lessons,
      figmaEmbed,
      liveUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Case study ID is required" }, { status: 400 });
    }

    const existing = await prisma.caseStudy.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
    }

    // Update associated project details if provided
    if (existing.projectId) {
      const formattedTags = tags !== undefined
        ? (Array.isArray(tags)
            ? JSON.stringify(tags)
            : typeof tags === "string"
            ? (tags.startsWith("[")
                ? tags
                : JSON.stringify(tags.split(",").map((t: string) => t.trim()).filter(Boolean)))
            : undefined)
        : undefined;

      const photosArray = Array.isArray(photos) ? photos : undefined;
      const finalOverview = problem !== undefined ? problem : overviewNote;

      await prisma.project.update({
        where: { id: existing.projectId },
        data: {
          title: title ? title.trim() : undefined,
          company: company ? company.trim() : undefined,
          role: role ? role.trim() : undefined,
          year: year ? year.trim() : undefined,
          coverImage: coverImage ? coverImage.trim() : undefined,
          description: finalOverview !== undefined ? finalOverview : undefined,
          overview: finalOverview !== undefined ? finalOverview : undefined,
          subtitle: finalOverview !== undefined ? finalOverview : undefined,
          tags: formattedTags,
          liveUrl: liveUrl !== undefined ? liveUrl : undefined,
          prototypeUrl: prototype !== undefined ? prototype : undefined,
          gallery: photosArray ? JSON.stringify(photosArray) : undefined,
        },
      });
    }

    const finalPhotos = Array.isArray(photos)
      ? JSON.stringify(photos)
      : hiFidelity !== undefined
      ? (typeof hiFidelity === "string" ? hiFidelity : JSON.stringify(hiFidelity))
      : undefined;

    const updated = await prisma.caseStudy.update({
      where: { id },
      data: {
        problem: problem !== undefined ? problem : (overviewNote !== undefined ? overviewNote : undefined),
        research: research !== undefined ? (typeof research === "string" ? research : JSON.stringify(research)) : undefined,
        wireframes: wireframes !== undefined ? (typeof wireframes === "string" ? wireframes : JSON.stringify(wireframes)) : undefined,
        hiFidelity: finalPhotos,
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

    const existing = await prisma.caseStudy.findUnique({
      where: { id },
    });

    if (existing) {
      await prisma.caseStudy.delete({ where: { id } });
      if (existing.projectId) {
        try {
          await prisma.project.delete({ where: { id: existing.projectId } });
        } catch {
          // If project deletion fails (e.g. cascaded), ignore
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete case study:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
