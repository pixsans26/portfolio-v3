import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, company, quote, avatar, featured, order } = body;

    const count = await prisma.testimonial.count();
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || "",
        company: company || "",
        quote: quote || "",
        avatar: avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(name),
        featured: Boolean(featured ?? true),
        order: order !== undefined ? Number(order) : count + 1,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, role, company, quote, avatar, featured, order } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Testimonial ID is required" }, { status: 400 });
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        name: name ?? undefined,
        role: role ?? undefined,
        company: company ?? undefined,
        quote: quote ?? undefined,
        avatar: avatar ?? undefined,
        featured: featured !== undefined ? Boolean(featured) : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Testimonial ID is required" }, { status: 400 });
    }

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
