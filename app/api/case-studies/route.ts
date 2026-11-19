import { NextRequest, NextResponse } from "next/server";
import { getDbCaseStudies, getDbCaseStudyBySlug } from "@/lib/db-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;

    if (slug) {
      const caseStudy = await getDbCaseStudyBySlug(slug);
      if (!caseStudy) {
        return NextResponse.json({ success: false, error: "Case study not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, caseStudy });
    }

    const caseStudies = await getDbCaseStudies(limit);
    return NextResponse.json({
      success: true,
      caseStudies,
      total: caseStudies.length,
    });
  } catch (error) {
    console.error("Failed to fetch public case studies:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

