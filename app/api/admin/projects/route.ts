import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: { caseStudy: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      subtitle,
      description,
      overview,
      role,
      company,
      year,
      duration,
      accentColor,
      coverImage,
      featured,
      published,
      order,
      tools,
      tags,
      gallery,
      prototypeUrl,
      liveUrl,
    } = body;

    const baseSlug = (slug || title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const project = await prisma.project.create({
      data: {
        title: title || "Untitled Project",
        slug: finalSlug,
        subtitle: subtitle || "",
        description: description || "",
        overview: overview || "",
        role: role || "Designer",
        company: company || "Independent",
        year: year || new Date().getFullYear().toString(),
        duration: duration || "3 months",
        accentColor: accentColor || "#4F8EF7",
        coverImage: coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
        featured: Boolean(featured ?? true),
        published: Boolean(published ?? true),
        order: Number(order) || 0,
        tools: typeof tools === "string" ? tools : JSON.stringify(tools || []),
        tags: typeof tags === "string" ? tags : JSON.stringify(tags || []),
        gallery: typeof gallery === "string" ? gallery : JSON.stringify(gallery || []),
        prototypeUrl: prototypeUrl || null,
        liveUrl: liveUrl || null,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Check if this is a bulk reorder request
    if (body.reorder && Array.isArray(body.items)) {
      await prisma.$transaction(
        body.items.map((item: { id: string; order: number }) =>
          prisma.project.update({
            where: { id: item.id },
            data: { order: Number(item.order) },
          })
        )
      );
      return NextResponse.json({ success: true, message: "Order updated successfully" });
    }

    const {
      id,
      title,
      slug,
      subtitle,
      description,
      overview,
      role,
      company,
      year,
      duration,
      accentColor,
      coverImage,
      featured,
      published,
      order,
      tools,
      tags,
      gallery,
      prototypeUrl,
      liveUrl,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug: slug || undefined,
        subtitle: subtitle ?? undefined,
        description: description ?? undefined,
        overview: overview ?? undefined,
        role: role ?? undefined,
        company: company ?? undefined,
        year: year ?? undefined,
        duration: duration ?? undefined,
        accentColor: accentColor ?? undefined,
        coverImage: coverImage ?? undefined,
        featured: featured !== undefined ? Boolean(featured) : undefined,
        published: published !== undefined ? Boolean(published) : undefined,
        order: order !== undefined ? Number(order) : undefined,
        tools: tools !== undefined ? (typeof tools === "string" ? tools : JSON.stringify(tools)) : undefined,
        tags: tags !== undefined ? (typeof tags === "string" ? tags : JSON.stringify(tags)) : undefined,
        gallery: gallery !== undefined ? (typeof gallery === "string" ? gallery : JSON.stringify(gallery)) : undefined,
        prototypeUrl: prototypeUrl !== undefined ? (prototypeUrl || null) : undefined,
        liveUrl: liveUrl !== undefined ? (liveUrl || null) : undefined,
      },
      include: { caseStudy: true },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Project ID is required" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
