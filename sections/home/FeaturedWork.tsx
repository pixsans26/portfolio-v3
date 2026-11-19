"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderKanban, Image as ImageIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedWork() {
  const [projects, setProjects] = useState<Project[]>([]);
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/projects?featured=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        } else {
          // If no explicitly featured projects, fetch all published projects
          fetch("/api/projects")
            .then((r) => r.json())
            .then((allData) => {
              if (allData.success && allData.projects) {
                setProjects(allData.projects);
              }
            });
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const target = targetRef.current;
    const track = trackRef.current;
    if (!target || !track || projects.length === 0) return;

    const totalCards = projects.length;

    // GSAP ScrollTrigger Pinned Horizontal Track
    const ctx = gsap.context(() => {
      if (totalCards > 1) {
        gsap.to(track, {
          xPercent: (-100 * (totalCards - 1)) / totalCards,
          ease: "none",
          scrollTrigger: {
            trigger: target,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.2}`,
            pin: true,
            anticipatePin: 1,
            scrub: 0.5,
            snap: {
              snapTo: 1 / (totalCards - 1),
              duration: { min: 0.2, max: 0.4 },
              delay: 0.05,
              ease: "power1.inOut",
            },
          },
        });
      }
    }, targetRef);

    return () => {
      ctx.revert();
    };
  }, [projects]);

  if (projects.length === 0) {
    return null;
  }

  const totalCards = projects.length;

  return (
    <section className="relative bg-bg dark:bg-dark text-left overflow-hidden transition-colors duration-300">
      <div ref={targetRef} className="relative w-full">
        {/* Horizontal Full-Screen Track */}
        <div
          ref={trackRef}
          className="flex h-screen"
          style={{ width: `${totalCards * 100}vw` }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="w-screen h-screen min-w-screen min-h-screen shrink-0 relative"
            >
              <ProjectCard project={project} index={index} total={totalCards} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const categoryArr = Array.isArray(project.category) ? project.category : [project.category || "Design"];
  const tagsArr = Array.isArray(project.tags) ? project.tags : [];

  return (
    <Link
      href={`/work/${project.slug}`}
      data-cursor="project"
      className="block relative w-full h-full group overflow-hidden cursor-none"
    >
      {/* Full Screen Background Image (High Visibility) */}
      <div className="absolute inset-0 z-0 bg-dark-card overflow-hidden">
        <Image
          src={project.coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority={index === 0}
          sizes="100vw"
        />
        {/* Soft Dark Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/70 via-transparent to-transparent z-10" />
      </div>

      {/* Full Screen Foreground Overlay Content */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-6 md:p-12 lg:p-16 container-custom">
        {/* Top Bar: Company Badge, Title tag, and Slide Counter */}
        <div className="flex items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-accent-blue text-white font-satoshi font-semibold text-xs border border-white/20 shadow-sm">
              {project.company}
            </span>
            <span className="text-accent-blue text-xs font-satoshi uppercase tracking-[0.2em] font-semibold hidden md:flex items-center gap-2">
              <FolderKanban size={14} /> My Design
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white font-mono text-xs md:text-sm px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Bottom Content: Title, Description & Category / Skill Tags */}
        <div className="max-w-2xl pb-6">
          {/* Category & Tags with White Text */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryArr.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1 rounded-full text-xs font-satoshi font-semibold bg-accent-blue text-white backdrop-blur-md border border-white/20 shadow-sm"
              >
                {cat}
              </span>
            ))}
            {project.gallery && project.gallery.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-satoshi font-semibold bg-white/15 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-sm">
                <ImageIcon size={12} /> {project.gallery.length} photos
              </span>
            )}
            {tagsArr.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-satoshi font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-clash text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 group-hover:text-accent-blue transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-white/80 text-sm md:text-base font-satoshi leading-relaxed mb-6 max-w-xl">
            {project.subtitle}
          </p>

          {/* Explore CTA Button */}
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-dark font-satoshi font-bold text-xs md:text-sm group-hover:bg-accent-blue group-hover:text-white transition-all duration-300 shadow-xl">
            View Project
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
