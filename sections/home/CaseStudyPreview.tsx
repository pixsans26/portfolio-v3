"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";

export default function CaseStudyPreview() {
  const [caseStudies, setCaseStudies] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/case-studies?limit=4")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.caseStudies) {
          setCaseStudies(data.caseStudies);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || caseStudies.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-bg dark:bg-dark transition-colors duration-300">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-16">
          <motion.span
            className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Case Studies
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h2
              className="font-clash text-headline font-bold text-text-primary dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              In-Depth Case Studies.
            </motion.h2>
            <motion.p
              className="text-text-secondary dark:text-white/50 font-satoshi text-body max-w-xs"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Deep architectural breakdowns of real product challenges — from research to measurable impact.
            </motion.p>
          </div>
        </div>

        {/* Case study cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/case-studies/${project.slug}`} data-cursor="project">
                <div className="group rounded-3xl border border-border dark:border-white/10 bg-white dark:bg-dark-card overflow-hidden hover:border-accent-blue/40 transition-all duration-400 cursor-none flex flex-col justify-between h-full shadow-card hover:shadow-card-hover">
                  {/* Cover Image */}
                  <div className="relative h-48 md:h-56 w-full overflow-hidden">
                    <Image
                      src={project.coverImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-dark-card via-white/20 dark:via-dark-card/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-satoshi font-semibold bg-accent-blue text-white backdrop-blur-md border border-white/20 shadow-sm">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-7 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-clash text-title font-bold text-text-primary dark:text-white mb-2 group-hover:text-accent-blue transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-text-muted dark:text-white/50 font-satoshi text-sm leading-relaxed mb-6">
                        {project.subtitle}
                      </p>
                    </div>

                    {/* Metrics preview */}
                    <div className="border-t border-border dark:border-white/10 pt-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {project.metrics.slice(0, 2).map((metric) => (
                          <div key={metric.label}>
                            <p className="font-clash text-xl font-bold" style={{ color: project.accentColor }}>
                              {metric.value}
                            </p>
                            <p className="text-text-muted dark:text-white/40 font-satoshi text-xs">{metric.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-satoshi text-text-muted dark:text-white/40">
                          {project.company} · {project.year}
                        </span>
                        <span className="text-xs font-satoshi font-semibold text-accent-blue group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                          <span>Read Case Study</span>
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
