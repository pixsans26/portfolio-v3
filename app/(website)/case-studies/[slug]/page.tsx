import { notFound } from "next/navigation";
import { getDbCaseStudyBySlug, getDbCaseStudies } from "@/lib/db-data";
import CaseStudyLayout from "@/sections/case-study/CaseStudyLayout";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getDbCaseStudyBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — In-Depth Case Study`,
    description: project.subtitle || project.description,
    openGraph: {
      title: `${project.title} — In-Depth Case Study`,
      description: project.subtitle || project.description,
      images: [project.coverImage],
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const [project, allCaseStudies] = await Promise.all([
    getDbCaseStudyBySlug(slug),
    getDbCaseStudies(),
  ]);

  if (!project || !project.caseStudy) notFound();

  // Filter related case studies
  const related = allCaseStudies
    .filter((p) => p.id !== project.id)
    .slice(0, 2);

  return <CaseStudyLayout project={project} relatedStudies={related} />;
}

