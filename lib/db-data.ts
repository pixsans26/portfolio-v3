import { prisma } from "@/lib/prisma";
import type {
  Project,
  ExperienceItem,
  SkillItem,
  EducationItem,
  TestimonialItem,
  SocialItem,
  GalleryItem,
  SiteSettings,
} from "./types";

function safeJson<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val !== "string") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export async function getDbProjects(options?: {
  featured?: boolean;
  category?: string;
  limit?: number;
}): Promise<Project[]> {
  try {
    const where: any = { published: true };
    if (options?.featured) {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      include: { caseStudy: true },
      orderBy: { order: "asc" },
      take: options?.limit,
    });

    const parsed: Project[] = projects.map((p) => {
      const tags = safeJson<string[]>(p.tags, []);
      const tools = safeJson<string[]>(p.tools, []);
      const metrics = safeJson<any[]>(p.metrics, []);
      const gallery = safeJson<string[]>(p.gallery, []);

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        overview: p.overview,
        role: p.role,
        duration: p.duration,
        year: p.year,
        company: p.company,
        coverImage: p.coverImage,
        accentColor: p.accentColor,
        featured: p.featured,
        published: p.published,
        order: p.order,
        category: tags.length > 0 ? tags.slice(0, 2) : ["Product Design"],
        tags,
        tools,
        metrics,
        gallery,
        prototypeUrl: p.prototypeUrl,
        liveUrl: p.liveUrl,
        caseStudy: p.caseStudy
          ? {
              id: p.caseStudy.id,
              problem: p.caseStudy.problem,
              research: safeJson(p.caseStudy.research, []),
              wireframes: safeJson(p.caseStudy.wireframes, []),
              hiFidelity: safeJson(p.caseStudy.hiFidelity, []),
              photos: safeJson(p.caseStudy.hiFidelity, []),
              prototype: p.caseStudy.prototype,
              testing: safeJson(p.caseStudy.testing, {}),
              lessons: p.caseStudy.lessons,
              figmaEmbed: p.caseStudy.figmaEmbed,
            }
          : null,
      };
    });

    if (options?.category && options.category !== "All") {
      const catLower = options.category.toLowerCase();
      return parsed.filter(
        (p) =>
          p.category.some((c) => c.toLowerCase().includes(catLower)) ||
          p.tags.some((t) => t.toLowerCase().includes(catLower))
      );
    }

    return parsed;
  } catch (error) {
    console.error("getDbProjects error:", error);
    return [];
  }
}

export async function getDbProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const p = await prisma.project.findUnique({
      where: { slug },
      include: { caseStudy: true },
    });

    if (!p) return null;

    const tags = safeJson<string[]>(p.tags, []);
    const tools = safeJson<string[]>(p.tools, []);
    const metrics = safeJson<any[]>(p.metrics, []);
    const gallery = safeJson<string[]>(p.gallery, []);

    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      overview: p.overview,
      role: p.role,
      duration: p.duration,
      year: p.year,
      company: p.company,
      coverImage: p.coverImage,
      accentColor: p.accentColor,
      featured: p.featured,
      published: p.published,
      order: p.order,
      category: tags.length > 0 ? tags.slice(0, 2) : ["Product Design"],
      tags,
      tools,
      metrics,
      gallery,
      prototypeUrl: p.prototypeUrl,
      liveUrl: p.liveUrl,
      caseStudy: p.caseStudy
        ? {
            id: p.caseStudy.id,
            problem: p.caseStudy.problem,
            research: safeJson(p.caseStudy.research, []),
            wireframes: safeJson(p.caseStudy.wireframes, []),
            hiFidelity: safeJson(p.caseStudy.hiFidelity, []),
            photos: safeJson(p.caseStudy.hiFidelity, []),
            prototype: p.caseStudy.prototype,
            testing: safeJson(p.caseStudy.testing, {}),
            lessons: p.caseStudy.lessons,
            figmaEmbed: p.caseStudy.figmaEmbed,
          }
        : null,
    };
  } catch (error) {
    console.error(`getDbProjectBySlug error for ${slug}:`, error);
    return null;
  }
}

export async function getDbCaseStudies(limit?: number): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        published: true,
        caseStudy: { isNot: null },
      },
      include: { caseStudy: true },
      orderBy: { order: "asc" },
      take: limit,
    });

    return projects.map((p) => {
      const tags = safeJson<string[]>(p.tags, []);
      const tools = safeJson<string[]>(p.tools, []);
      const metrics = safeJson<any[]>(p.metrics, []);
      const gallery = safeJson<string[]>(p.gallery, []);

      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        overview: p.overview,
        role: p.role,
        duration: p.duration,
        year: p.year,
        company: p.company,
        coverImage: p.coverImage,
        accentColor: p.accentColor,
        featured: p.featured,
        published: p.published,
        order: p.order,
        category: tags.length > 0 ? tags.slice(0, 2) : ["Product Design"],
        tags,
        tools,
        metrics,
        gallery,
        prototypeUrl: p.prototypeUrl,
        liveUrl: p.liveUrl,
        caseStudy: p.caseStudy
          ? {
              id: p.caseStudy.id,
              problem: p.caseStudy.problem,
              research: safeJson(p.caseStudy.research, []),
              wireframes: safeJson(p.caseStudy.wireframes, []),
              hiFidelity: safeJson(p.caseStudy.hiFidelity, []),
              photos: safeJson(p.caseStudy.hiFidelity, []),
              prototype: p.caseStudy.prototype,
              testing: safeJson(p.caseStudy.testing, {}),
              lessons: p.caseStudy.lessons,
              figmaEmbed: p.caseStudy.figmaEmbed,
            }
          : null,
      };
    });
  } catch (error) {
    console.error("getDbCaseStudies error:", error);
    return [];
  }
}

export async function getDbCaseStudyBySlug(slug: string): Promise<Project | null> {
  const project = await getDbProjectBySlug(slug);
  if (!project || !project.caseStudy) {
    return null;
  }
  return project;
}

export async function getDbExperiences(): Promise<ExperienceItem[]> {
  try {
    const list = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });
    return list.map((exp) => ({
      id: exp.id,
      company: exp.company,
      role: exp.role,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: safeJson<string[]>(exp.achievements, []),
      logo: exp.logo,
      color: exp.color,
      order: exp.order,
      current: exp.current,
    }));
  } catch (error) {
    console.error("getDbExperiences error:", error);
    return [];
  }
}

export async function getDbSkills(): Promise<SkillItem[]> {
  try {
    return await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("getDbSkills error:", error);
    return [];
  }
}

export async function getDbEducation(): Promise<EducationItem[]> {
  try {
    return await prisma.education.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("getDbEducation error:", error);
    return [];
  }
}

export async function getDbTestimonials(): Promise<TestimonialItem[]> {
  try {
    return await prisma.testimonial.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("getDbTestimonials error:", error);
    return [];
  }
}

export async function getDbSocials(): Promise<SocialItem[]> {
  try {
    return await prisma.social.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("getDbSocials error:", error);
    return [];
  }
}

export async function getDbGallery(): Promise<GalleryItem[]> {
  try {
    return await prisma.gallery.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("getDbGallery error:", error);
    return [];
  }
}

export async function getDbSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    heroName: "Nitish Tao",
    heroTitle: "Senior Product Designer",
    heroRoles: "Senior Product Designer, UX Designer, UI Designer, Problem Solver, System Thinker",
    heroBio: "I design products that ship, scale, and move metrics. 6 years crafting experiences for 100M+ users at Atlassian, CRED, Swiggy & Razorpay.",
    yearsExperience: "6+",
    productsShipped: "40+",
    usersImpacted: "100M+",
    email: "admin@portfolio.com",
    resumeUrl: "/resume.pdf",
    heroImage: "/hero-portrait.png",
  };

  try {
    const list = await prisma.settings.findMany();
    const map: Record<string, string> = {};
    for (const item of list) {
      map[item.key] = item.value;
    }

    return {
      heroName: map.heroName || defaults.heroName,
      heroTitle: map.heroTitle || defaults.heroTitle,
      heroRoles: map.heroRoles || defaults.heroRoles,
      heroBio: map.heroBio || defaults.heroBio,
      yearsExperience: map.yearsExperience || defaults.yearsExperience,
      productsShipped: map.productsShipped || defaults.productsShipped,
      usersImpacted: map.usersImpacted || defaults.usersImpacted,
      email: map.adminEmail || defaults.email,
      resumeUrl: map.resumeUrl || defaults.resumeUrl,
      heroImage: map.heroImage || defaults.heroImage,
    };
  } catch (error) {
    console.error("getDbSettings error:", error);
    return defaults;
  }
}

