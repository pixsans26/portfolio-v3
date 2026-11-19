import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function safeJson(val: any, fallback: any) {
  if (!val) return fallback;
  if (typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");

    if (slug) {
      const project = await prisma.project.findUnique({
        where: { slug },
        include: { caseStudy: true },
      });

      if (!project || !project.published) {
        return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
      }

      const tags = safeJson(project.tags, []);
      const tools = safeJson(project.tools, []);
      const metrics = safeJson(project.metrics, []);
      const gallery = safeJson(project.gallery, []);

      const formatted = {
        ...project,
        tags,
        tools,
        metrics,
        gallery,
        category: tags.length > 0 ? tags.slice(0, 2) : ["Product Design"],
        caseStudy: project.caseStudy
          ? {
              ...project.caseStudy,
              research: safeJson(project.caseStudy.research, []),
              wireframes: safeJson(project.caseStudy.wireframes, []),
              hiFidelity: safeJson(project.caseStudy.hiFidelity, []),
              testing: safeJson(project.caseStudy.testing, {}),
            }
          : null,
      };

      return NextResponse.json({ success: true, project: formatted });
    }

    const where: any = { published: true };
    if (featured === "true") {
      where.featured = true;
    }

    const dbProjects = await prisma.project.findMany({
      where,
      include: { caseStudy: true },
      orderBy: { order: "asc" },
    });

    const parsedProjects = dbProjects.map((p) => {
      const tags = safeJson(p.tags, []);
      const tools = safeJson(p.tools, []);
      const metrics = safeJson(p.metrics, []);
      const gallery = safeJson(p.gallery, []);

      return {
        ...p,
        tags,
        tools,
        metrics,
        gallery,
        category: tags.length > 0 ? tags.slice(0, 2) : ["Product Design"],
        caseStudy: p.caseStudy
          ? {
              ...p.caseStudy,
              research: safeJson(p.caseStudy.research, []),
              wireframes: safeJson(p.caseStudy.wireframes, []),
              hiFidelity: safeJson(p.caseStudy.hiFidelity, []),
              testing: safeJson(p.caseStudy.testing, {}),
            }
          : null,
      };
    });

    let filtered = parsedProjects;
    if (category && category !== "All") {
      filtered = filtered.filter(
        (p) =>
          p.category.some((c: string) => c.toLowerCase().includes(category.toLowerCase())) ||
          p.tags.some((t: string) => t.toLowerCase().includes(category.toLowerCase())) ||
          p.title.toLowerCase().includes(category.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      projects: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Failed to fetch projects API:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
