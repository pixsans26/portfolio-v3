"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Layers } from "lucide-react";
import type { Project } from "@/lib/types";

function CaseStudiesContent() {
  const [studies, setStudies] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/case-studies")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.caseStudies) {
          setStudies(data.caseStudies);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg dark:bg-dark pt-32">
      {/* Header */}
      <div className="container-custom mb-14 text-left">
        <motion.span
          className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          In-Depth Breakdowns
        </motion.span>
        <motion.h1
          className="font-clash text-display font-bold text-text-primary dark:text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Case Studies.
        </motion.h1>
        <motion.p
          className="text-text-muted dark:text-white/50 font-satoshi text-body-lg max-w-xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          Detailed architectural breakdowns of complex product challenges — covering problem statements, research methodologies, design system iterations, and measurable outcomes.
        </motion.p>
      </div>

      {/* Case Studies List */}
      <div className="container-custom pb-24">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          </div>
        ) : studies.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border dark:border-dark-border rounded-3xl p-8">
            <BookOpen size={36} className="mx-auto text-text-muted dark:text-white/30 mb-3" />
            <h3 className="font-clash text-xl font-bold text-text-primary dark:text-white mb-2">
              No Case Studies Published Yet
            </h3>
            <p className="text-sm font-satoshi text-text-muted dark:text-white/50 max-w-md mx-auto mb-6">
              In-depth architectural breakdowns are currently being finalized. In the meantime, you can explore all completed project work in My Design.
            </p>
            <Link
              href="/my-design"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-blue text-white font-satoshi font-bold text-xs"
            >
              Browse Projects in My Design
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {studies.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href={`/case-studies/${project.slug}`} data-cursor="project">
                  <div className="group rounded-4xl border border-border dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden hover:border-accent-blue/40 transition-all duration-400 cursor-none hover:shadow-card-hover">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Left: Metadata & Overview */}
                      <div className="p-8 md:p-12 flex flex-col justify-between text-left">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full text-xs font-satoshi font-semibold bg-accent-blue/10 text-accent-blue flex items-center gap-1.5">
                              <BookOpen size={12} /> Detailed Case Study
                            </span>
                            <span className="text-text-muted dark:text-white/40 text-xs font-satoshi">
                              {project.company} · {project.year}
                            </span>
                          </div>

                          <h2 className="font-clash text-headline font-bold text-text-primary dark:text-white mb-4 group-hover:text-accent-blue transition-colors duration-300">
                            {project.title}
                          </h2>

                          <p className="text-text-muted dark:text-white/60 font-satoshi text-body leading-relaxed mb-8">
                            {project.overview || project.subtitle}
                          </p>

                          {/* Impact Metrics Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            {project.metrics.slice(0, 4).map((m) => (
                              <div key={m.label} className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] text-left">
                                <p className="font-clash text-2xl font-bold" style={{ color: project.accentColor }}>
                                  {m.value}
                                </p>
                                <p className="text-text-muted text-xs font-satoshi mt-1">{m.label}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action CTA bar */}
                        <div className="flex items-center justify-between pt-6 border-t border-border dark:border-dark-border">
                          <span className="text-text-primary dark:text-white text-sm font-satoshi font-semibold inline-flex items-center gap-2 group-hover:text-accent-blue transition-colors">
                            Read Full Breakdown <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </span>
                          <div className="flex items-center gap-2 text-xs font-satoshi text-text-muted">
                            <Layers size={14} /> {project.tools.slice(0, 3).join(", ")}
                          </div>
                        </div>
                      </div>

                      {/* Right: Cover Preview */}
                      <div className="relative h-72 lg:h-auto min-h-[380px] overflow-hidden">
                        <Image
                          src={project.coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent lg:hidden" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CaseStudiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg dark:bg-dark pt-32 flex justify-center items-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
        </div>
      }
    >
      <CaseStudiesContent />
    </Suspense>
  );
}
