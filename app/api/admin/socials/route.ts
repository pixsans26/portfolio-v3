import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const socials = await prisma.social.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, socials });
  } catch (error) {
    console.error("Failed to fetch admin socials:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, platform, url, icon, active, order } = body;

    if (!platform || !url) {
      return NextResponse.json({ success: false, error: "Platform and URL are required" }, { status: 400 });
    }

    if (id) {
      const updated = await prisma.social.update({
        where: { id },
        data: {
          platform,
          url,
          icon: icon || "Link",
          active: active !== undefined ? active : true,
          order: order !== undefined ? Number(order) : 0,
        },
      });
      return NextResponse.json({ success: true, social: updated });
    }

    const count = await prisma.social.count();
    const created = await prisma.social.create({
      data: {
        platform,
        url,
        icon: icon || "Link",
        active: active !== undefined ? active : true,
        order: order !== undefined ? Number(order) : count + 1,
      },
    });

    return NextResponse.json({ success: true, social: created });
  } catch (error) {
    console.error("Failed to save social link:", error);
    return NextResponse.json({ success: false, error: "Failed to save social link" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, platform, url, icon, active, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Social ID required for update" }, { status: 400 });
    }

    const updated = await prisma.social.update({
      where: { id },
      data: {
        platform,
        url,
        icon: icon || "Link",
        active: active !== undefined ? active : true,
        order: order !== undefined ? Number(order) : 0,
      },
    });

    return NextResponse.json({ success: true, social: updated });
  } catch (error) {
    console.error("Failed to update social link:", error);
    return NextResponse.json({ success: false, error: "Failed to update social link" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Social ID required" }, { status: 400 });
    }

    await prisma.social.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete social link:", error);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
