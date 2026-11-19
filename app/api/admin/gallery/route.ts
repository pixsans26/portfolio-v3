import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const excludeCategory = searchParams.get("excludeCategory");

    const where: any = {};
    if (category) {
      where.category = category;
    } else if (excludeCategory) {
      where.category = { not: excludeCategory };
    }

    const items = await prisma.gallery.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Failed to fetch admin gallery:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { src, alt, category, order, published } = body;

    if (!src) {
      return NextResponse.json({ success: false, error: "Image source URL is required" }, { status: 400 });
    }

    const count = await prisma.gallery.count();

    const item = await prisma.gallery.create({
      data: {
        src,
        alt: alt || "Showcase slide image",
        category: category || "Hero Slide",
        order: order !== undefined ? Number(order) : count + 1,
        published: published !== undefined ? Boolean(published) : true,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Failed to create gallery slide:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Check if this is a bulk reorder request
    if (body.reorder && Array.isArray(body.items)) {
      await prisma.$transaction(
        body.items.map((item: { id: string; order: number }) =>
          prisma.gallery.update({
            where: { id: item.id },
            data: { order: Number(item.order) },
          })
        )
      );
      return NextResponse.json({ success: true, message: "Order updated successfully" });
    }

    const { id, src, alt, category, order, published } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Slide ID is required" }, { status: 400 });
    }

    const updated = await prisma.gallery.update({
      where: { id },
      data: {
        src: src ?? undefined,
        alt: alt ?? undefined,
        category: category ?? undefined,
        order: order !== undefined ? Number(order) : undefined,
        published: published !== undefined ? Boolean(published) : undefined,
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("Failed to update slide:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Slide ID is required" }, { status: 400 });
    }

    await prisma.gallery.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete slide:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

