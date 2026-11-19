import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("Failed to fetch public testimonials:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
