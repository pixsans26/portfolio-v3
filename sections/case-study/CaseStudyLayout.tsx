"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  X,
  Maximize2,
  Zap,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Layers,
  HelpCircle,
  Search,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import type { Project } from "@/lib/types";

export default function CaseStudyLayout({
  project,
  relatedStudies,
}: {
  project: Project;
  relatedStudies?: Project[];
}) {
  const [liveRelated, setLiveRelated] = useState<Project[]>(relatedStudies || []);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption?: string } | null>(null);

  useEffect(() => {
    if (!relatedStudies || relatedStudies.length === 0) {
      fetch("/api/case-studies")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.caseStudies) {
            const rel = data.caseStudies
              .filter((p: Project) => p.id !== project.id)
              .slice(0, 2);
            setLiveRelated(rel);
          }
        })
        .catch(() => {});
    }
  }, [project.id, relatedStudies]);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const related = relatedStudies && relatedStudies.length > 0 ? relatedStudies : liveRelated;

  // Case study visual sequence photos
  const caseStudyPhotos: string[] = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();

    const parseList = (items?: any): string[] => {
      if (!items) return [];
      if (Array.isArray(items)) return items.filter(Boolean);
      if (typeof items === "string") {
        try {
          if (items.startsWith("[")) {
            const parsed = JSON.parse(items);
            return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
          } else if (items.trim()) {
            return [items.trim()];
          }
        } catch {}
      }
      return [];
    };

    const csPhotos = parseList(project.caseStudy?.photos);
    const hiFiList = parseList(project.caseStudy?.hiFidelity);

    for (const item of [...csPhotos, ...hiFiList]) {
      if (item && typeof item === "string" && !seen.has(item)) {
        seen.add(item);
        list.push(item);
      }
    }

    return list;
  }, [project.caseStudy]);

  const cs = project.caseStudy;

  return (
    <article className="min-h-screen bg-bg dark:bg-dark text-left transition-colors duration-300 pt-28 sm:pt-32 pb-24">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div
              className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.caption || "Image preview"}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
            {lightboxImage.caption && (
              <p className="mt-4 text-xs font-satoshi text-white/70 max-w-lg text-center">
                {lightboxImage.caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom">
        <div className="max-w-5xl md:max-w-6xl mx-auto space-y-12">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between text-xs font-satoshi text-text-muted dark:text-white/40 pb-4 border-b border-border dark:border-dark-border">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 hover:text-accent-blue transition-colors"
            >
              <ArrowLeft size={14} /> Back to Case Studies
            </Link>
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-1 text-accent-blue font-semibold hover:underline"
            >
              <span>View Project Summary</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Header Title block */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-satoshi font-semibold bg-accent-blue/10 text-accent-blue border border-accent-blue/20 flex items-center gap-1.5">
                <BookOpen size={12} /> Architectural Case Study
              </span>
              <span className="text-xs font-satoshi text-text-muted dark:text-white/40">
                {project.company} · {project.year} · {project.role}
              </span>
            </div>

            <h1 className="font-clash text-display font-bold text-text-primary dark:text-white leading-tight">
              {project.title}
            </h1>

            <p className="font-satoshi text-body-lg text-text-secondary dark:text-white/70 leading-relaxed">
              {project.subtitle || project.description}
            </p>

            {/* Quick action bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {cs?.figmaEmbed && (
                <a
                  href="#prototype"
                  className="px-4 py-2 rounded-lg bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <Zap size={14} /> Jump to Interactive Prototype
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg border border-border dark:border-dark-border text-text-primary dark:text-white text-xs font-satoshi font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink size={14} /> View Live Product
                </a>
              )}
            </div>
          </div>

          {/* Hero Cover Image */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border dark:border-dark-border shadow-md">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1280px) 100vw, 1152px"
            />
          </div>

          {/* Section: The Problem Statement */}
          <section className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                <HelpCircle size={16} />
              </span>
              <h2 className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                The Problem & Core Challenge
              </h2>
            </div>
            <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm text-text-secondary dark:text-white/80 font-satoshi text-base leading-relaxed whitespace-pre-line">
              {cs?.problem || project.overview || "This case study focuses on solving core architectural bottlenecks, modernizing interface usability, and scaling product efficiency for end users."}
            </div>
          </section>

          {/* Section: Research & User Insights */}
          {Array.isArray(cs?.research) && cs.research.length > 0 && (
            <section className="space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                  <Search size={16} />
                </span>
                <h2 className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                  Research & User Insights
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {cs.research.map((r, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-satoshi font-bold text-accent-blue uppercase tracking-wider">
                        {r.method}
                      </span>
                      {r.count && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-text-muted">
                          {r.count}
                        </span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm font-satoshi text-text-primary dark:text-white/80 leading-relaxed">
                      {r.insight}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Wireframes & Information Architecture */}
          {Array.isArray(cs?.wireframes) && cs.wireframes.length > 0 && (
            <section className="space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-purple/10 text-accent-purple flex items-center justify-center">
                  <Layers size={16} />
                </span>
                <h2 className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                  Wireframes & Information Architecture
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {cs.wireframes.map((wf, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxImage({ src: wf, caption: `${project.title} Wireframe #${idx + 1}` })}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border dark:border-dark-border bg-black/5 dark:bg-white/5 cursor-zoom-in shadow-sm"
                  >
                    <Image src={wf} alt="Wireframe" fill className="object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 text-white text-xs font-satoshi">
                      <Maximize2 size={16} className="mr-1.5" /> Expand Wireframe
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: High-Fidelity UI Screens & Photo Sequence */}
          {caseStudyPhotos.length > 0 && (
            <section className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Layers size={16} />
                  </span>
                  <h2 className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                    High-Fidelity Interface Breakdown
                  </h2>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-black/5 dark:bg-white/5 text-text-muted">
                  {caseStudyPhotos.length} {caseStudyPhotos.length === 1 ? "Screen" : "Screens"}
                </span>
              </div>

              <div className="w-full rounded-2xl overflow-hidden border border-border dark:border-dark-border shadow-md bg-black/5 dark:bg-white/5">
                <div className="w-full flex flex-col space-y-0 p-0 m-0 leading-none">
                  {caseStudyPhotos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImage({ src: photoUrl, caption: `${project.title} — Screen #${idx + 1}` })}
                      className="group relative w-full cursor-zoom-in overflow-hidden block m-0 p-0 leading-none select-none"
                    >
                      <img
                        src={photoUrl}
                        alt={`${project.title} screen #${idx + 1}`}
                        className="w-full h-auto block m-0 p-0 align-top transition-transform duration-500 group-hover:scale-[1.01]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="px-4 py-2 rounded-full bg-black/75 backdrop-blur-md text-white flex items-center gap-2 text-xs font-satoshi font-semibold">
                          <Maximize2 size={14} /> Click to expand
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section: Interactive Prototype & Figma Embed */}
          {(cs?.figmaEmbed || cs?.prototype || project.prototypeUrl) && (
            <section id="prototype" className="space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                  <Zap size={16} />
                </span>
                <h2 className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                  Interactive Prototype & Figma Canvas
                </h2>
              </div>

              <div className="rounded-2xl border border-border dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden shadow-sm">
                {cs?.figmaEmbed && (
                  <div className="relative w-full aspect-[16/10] bg-black/5 dark:bg-white/5">
                    <iframe
                      src={cs.figmaEmbed}
                      allowFullScreen
                      className="w-full h-full border-0"
                      title={`${project.title} Figma prototype`}
                    />
                  </div>
                )}

                {(cs?.prototype || project.prototypeUrl) && (
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border dark:border-dark-border bg-black/[0.02] dark:bg-white/[0.02]">
                    <div>
                      <p className="font-clash font-bold text-sm text-text-primary dark:text-white">
                        Experience the live clickable prototype
                      </p>
                      <p className="text-xs font-satoshi text-text-muted dark:text-white/60">
                        Test interactions, flows, and responsive layouts directly.
                      </p>
                    </div>
                    <a
                      href={cs?.prototype || project.prototypeUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-sm"
                    >
                      <span>Open Prototype</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section: Usability Testing */}
          {cs?.testing && typeof cs.testing === "object" && Object.keys(cs.testing).length > 0 && (
            <section className="space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </span>
                <h2 className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                  Usability Testing & Metrics
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cs.testing.participants && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm text-left">
                    <p className="font-clash text-2xl md:text-3xl font-bold text-accent-blue">
                      {cs.testing.participants}
                    </p>
                    <p className="text-text-muted text-xs font-satoshi mt-1">Test Participants</p>
                  </div>
                )}
                {cs.testing.taskSuccess && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm text-left">
                    <p className="font-clash text-2xl md:text-3xl font-bold text-emerald-500">
                      {cs.testing.taskSuccess}
                    </p>
                    <p className="text-text-muted text-xs font-satoshi mt-1">Task Completion Rate</p>
                  </div>
                )}
                {cs.testing.usabilityScore && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm text-left">
                    <p className="font-clash text-2xl md:text-3xl font-bold text-accent-purple">
                      {cs.testing.usabilityScore}
                    </p>
                    <p className="text-text-muted text-xs font-satoshi mt-1">Usability Score (SUS)</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section: Lessons Learned & Key Takeaways */}
          {cs?.lessons && (
            <section className="space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Lightbulb size={16} />
                </span>
                <h2 className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                  Key Takeaways & Lessons
                </h2>
              </div>
              <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm text-text-secondary dark:text-white/80 font-satoshi text-base leading-relaxed whitespace-pre-line">
                {cs.lessons}
              </div>
            </section>
          )}

          {/* Footer Navigation */}
          <div className="pt-12 border-t border-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border dark:border-dark-border text-xs font-satoshi font-semibold text-text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <ArrowLeft size={14} /> Browse All Case Studies
            </Link>

            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 transition-opacity"
            >
              <span>View High-Level Project Overview</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* More Case Studies */}
      {related.length > 0 && (
        <div className="container-custom pt-16 mt-16 border-t border-border dark:border-dark-border">
          <div className="max-w-5xl md:max-w-6xl mx-auto">
            <h3 className="font-clash text-2xl font-bold text-text-primary dark:text-white mb-6">
              More Case Studies
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/case-studies/${p.slug}`}>
                  <div className="group relative h-64 rounded-2xl overflow-hidden border border-border dark:border-dark-border shadow-sm hover:border-accent-blue/50 transition-all">
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md mb-2 inline-block border border-white/10">
                        {p.company}
                      </span>
                      <h4 className="font-clash font-bold text-xl group-hover:text-accent-blue transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs font-satoshi text-white/70 line-clamp-1 mt-1">
                        {p.subtitle || p.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
