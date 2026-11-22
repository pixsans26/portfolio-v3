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
  Images,
  BookOpen,
  ArrowRight,
  Layers,
  Calendar,
  Building2,
  User,
  Clock,
} from "lucide-react";
import type { Project } from "@/lib/types";

export default function ProjectDetailsLayout({
  project,
  relatedProjects,
}: {
  project: Project;
  relatedProjects?: Project[];
}) {
  const [liveRelated, setLiveRelated] = useState<Project[]>(relatedProjects || []);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; caption?: string } | null>(null);

  useEffect(() => {
    if (!relatedProjects || relatedProjects.length === 0) {
      fetch("/api/projects")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.projects) {
            const rel = data.projects
              .filter(
                (p: Project) =>
                  p.id !== project.id &&
                  p.category &&
                  p.category.some((c: string) => project.category?.includes(c))
              )
              .slice(0, 2);
            setLiveRelated(rel);
          }
        })
        .catch(() => {});
    }
  }, [project.id, project.category, relatedProjects]);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const related = relatedProjects && relatedProjects.length > 0 ? relatedProjects : liveRelated;

  // Strictly use Project's own uploaded gallery photos
  const projectGalleryPhotos: string[] = useMemo(() => {
    if (!project.gallery) return [];
    if (Array.isArray(project.gallery)) return project.gallery.filter(Boolean);
    if (typeof project.gallery === "string") {
      try {
        if ((project.gallery as string).startsWith("[")) {
          const parsed = JSON.parse(project.gallery);
          return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
        } else if ((project.gallery as string).trim()) {
          return [(project.gallery as string).trim()];
        }
      } catch {}
    }
    return [];
  }, [project.gallery]);

  return (
    <article className="min-h-screen bg-bg dark:bg-dark text-left transition-colors duration-300 pt-16 sm:pt-20">
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

      {/* TOP COVER HERO */}
      <section className="relative h-[65vh] min-h-[460px] max-h-[620px] flex items-end overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

        <div className="container-custom relative z-10 pb-12 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            {/* Category / Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              {project.category.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full text-xs font-satoshi font-semibold bg-accent-blue text-white backdrop-blur-md shadow-sm"
                >
                  {cat}
                </span>
              ))}
              {projectGalleryPhotos.length > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-satoshi font-semibold bg-white/15 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                  <Images size={12} /> {projectGalleryPhotos.length} Visuals
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-clash text-display font-bold text-white mb-6 max-w-3xl leading-tight text-center">
              {project.title}
            </h1>

            {/* Action Buttons: View Live & Interactive Prototype */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-xs sm:text-sm font-satoshi font-semibold shadow-glow-blue hover:opacity-90 transition-all hover:scale-105"
                >
                  <ExternalLink size={15} />
                  <span>View Live Site</span>
                </a>
              )}
              {project.prototypeUrl && (
                <a
                  href={project.prototypeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-satoshi font-semibold hover:bg-white/25 transition-all hover:scale-105"
                >
                  <Zap size={15} />
                  <span>Interactive Prototype</span>
                </a>
              )}
              {project.caseStudy && (
                <Link
                  href={`/case-studies/${project.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-dark text-xs sm:text-sm font-satoshi font-bold hover:bg-white/90 transition-all hover:scale-105"
                >
                  <BookOpen size={15} className="text-accent-blue" />
                  <span>Read Full Case Study</span>
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-custom py-14">
        <div className="max-w-5xl md:max-w-6xl mx-auto space-y-12">
          {/* Key Specs Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/40 flex items-center gap-1.5">
                <Building2 size={12} /> Company
              </span>
              <p className="font-satoshi font-bold text-sm text-text-primary dark:text-white">
                {project.company}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/40 flex items-center gap-1.5">
                <User size={12} /> Role
              </span>
              <p className="font-satoshi font-bold text-sm text-text-primary dark:text-white">
                {project.role}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/40 flex items-center gap-1.5">
                <Calendar size={12} /> Year
              </span>
              <p className="font-satoshi font-bold text-sm text-text-primary dark:text-white">
                {project.year}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/40 flex items-center gap-1.5">
                <Clock size={12} /> Duration
              </span>
              <p className="font-satoshi font-bold text-sm text-text-primary dark:text-white">
                {project.duration || "4 Months"}
              </p>
            </div>
          </div>

          {/* Project Overview */}
          {(project.overview || project.description) && (
            <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm">
              <span className="text-[11px] font-satoshi uppercase tracking-wider font-bold text-accent-blue block mb-2">
                Project Overview & Summary
              </span>
              <p className="text-text-primary dark:text-white/90 font-satoshi text-base md:text-lg leading-relaxed whitespace-pre-line">
                {project.overview || project.description}
              </p>
            </div>
          )}

          {/* Impact Metrics (if present) */}
          {Array.isArray(project.metrics) && project.metrics.length > 0 && (
            <div>
              <h3 className="text-xs font-satoshi uppercase tracking-wider font-bold text-text-muted dark:text-white/40 mb-4">
                Key Impact & Outcomes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border shadow-sm text-left"
                  >
                    <p className="font-clash text-2xl md:text-3xl font-bold" style={{ color: project.accentColor || "#4F8EF7" }}>
                      {m.value}
                    </p>
                    <p className="text-text-muted text-xs font-satoshi mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Technologies */}
          {Array.isArray(project.tools) && project.tools.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-satoshi text-text-muted dark:text-white/40 mr-2 flex items-center gap-1.5">
                <Layers size={13} /> Tools Used:
              </span>
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-md text-xs font-satoshi font-semibold bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-text-primary dark:text-white"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}

          {/* Dedicated Project Gallery */}
          {projectGalleryPhotos.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-clash text-xl font-bold text-text-primary dark:text-white">
                    Project Gallery
                  </h3>
                  <p className="text-xs font-satoshi text-text-muted dark:text-white/50">
                    Uploaded screenshots and visuals for this project.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-black/5 dark:bg-white/5 text-text-muted border border-border dark:border-dark-border">
                  {projectGalleryPhotos.length} {projectGalleryPhotos.length === 1 ? "Image" : "Images"}
                </span>
              </div>

              <div className="w-full rounded-2xl overflow-hidden border border-border dark:border-dark-border shadow-md bg-black/5 dark:bg-white/5">
                <div className="w-full flex flex-col space-y-0 p-0 m-0 leading-none">
                  {projectGalleryPhotos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImage({ src: photoUrl, caption: `${project.title} — Visual #${idx + 1}` })}
                      className="group relative w-full cursor-zoom-in overflow-hidden block m-0 p-0 leading-none select-none"
                    >
                      <img
                        src={photoUrl}
                        alt={`${project.title} visual #${idx + 1}`}
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
            </div>
          )}

          {/* Deep-Dive Case Study Spotlight Card (When Case Study is Available) */}
          {project.caseStudy && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-accent-blue/10 via-accent-purple/5 to-transparent border border-accent-blue/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-satoshi font-semibold bg-accent-blue text-white inline-flex items-center gap-1.5 shadow-sm">
                  <BookOpen size={12} /> Deep-Dive Case Study Available
                </span>
                <h3 className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                  Want the full architectural breakdown?
                </h3>
                <p className="text-text-secondary dark:text-white/60 font-satoshi text-sm max-w-xl leading-relaxed">
                  Explore the in-depth case study covering problem framing, user research insights, structural wireframes, usability testing results, and interactive Figma prototypes.
                </p>
              </div>
              <Link
                href={`/case-studies/${project.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-blue text-white font-satoshi font-bold text-sm hover:opacity-90 transition-all hover:scale-105 shrink-0 shadow-glow-blue"
              >
                <span>Read Full Case Study</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Related Projects */}
      {related.length > 0 && (
        <div className="container-custom pb-24 border-t border-border dark:border-dark-border pt-16">
          <div className="max-w-5xl md:max-w-6xl mx-auto">
            <h3 className="font-clash text-2xl font-bold text-text-primary dark:text-white mb-6">
              More Projects
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/work/${p.slug}`}>
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

