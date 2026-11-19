import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${baseUrl}/my-design`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/cv`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/resume`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.6 },
  ];

  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, caseStudy: { select: { id: true, updatedAt: true } } },
    });

    const projectRoutes = projects.map((p) => ({
      url: `${baseUrl}/work/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const caseStudyRoutes = projects
      .filter((p) => Boolean(p.caseStudy))
      .map((p) => ({
        url: `${baseUrl}/case-studies/${p.slug}`,
        lastModified: p.caseStudy?.updatedAt || p.updatedAt || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.85,
      }));

    return [...staticRoutes, ...projectRoutes, ...caseStudyRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}
