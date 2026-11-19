import { notFound } from "next/navigation";
import { getDbProjectBySlug, getDbProjects } from "@/lib/db-data";
import ProjectDetailsLayout from "@/sections/project/ProjectDetailsLayout";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getDbProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Project Details`,
    description: project.subtitle || project.description,
    openGraph: {
      title: `${project.title} — Project Details`,
      description: project.subtitle || project.description,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getDbProjectBySlug(slug),
    getDbProjects(),
  ]);

  if (!project) notFound();

  // Filter related projects dynamically from SQLite
  const related = allProjects
    .filter(
      (p) =>
        p.id !== project.id &&
        p.category.some((c) => project.category.includes(c))
    )
    .slice(0, 2);

  return <ProjectDetailsLayout project={project} relatedProjects={related} />;
}
