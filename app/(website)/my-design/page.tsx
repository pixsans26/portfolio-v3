"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Filter, Layers } from "lucide-react";
import type { Project } from "@/lib/types";

function MyDesignContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState("All");
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.projects) {
          setProjectList(data.projects);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  // Sync category from URL param if provided (e.g. /my-design?category=apps)
  useEffect(() => {
    if (initialCategoryParam) {
      const paramLower = initialCategoryParam.toLowerCase();
      if (paramLower.includes("app") || paramLower.includes("mobile")) {
        setActiveCategory("Mobile Apps");
      } else if (paramLower.includes("dash")) {
        setActiveCategory("Dashboards");
      } else if (paramLower.includes("system")) {
        setActiveCategory("Design Systems");
      } else if (paramLower.includes("fintech")) {
        setActiveCategory("Fintech");
      } else {
        // Find matching category or tag if available
        setActiveCategory(initialCategoryParam);
      }
    }
  }, [initialCategoryParam]);

  // Extract all distinct categories & major tags
  const categories = useMemo(() => {
    const set = new Set<string>();

    projectList.forEach((p: any) => {
      const cats = Array.isArray(p.category) ? p.category : [p.category];
      const tags = Array.isArray(p.tags) ? p.tags : [];
      [...cats, ...tags].forEach((t) => {
        if (t && typeof t === "string" && t.trim()) {
          set.add(t.trim());
        }
      });
    });

    const list = Array.from(set);
    // Prefer prominent product categories first if they match
    const curated = ["All"];
    if (list.some((c) => c.toLowerCase().includes("mobile") || c.toLowerCase().includes("app"))) {
      curated.push("Mobile Apps");
    }
    if (list.some((c) => c.toLowerCase().includes("dash") || c.toLowerCase().includes("saas") || c.toLowerCase().includes("analytics"))) {
      curated.push("Dashboards");
    }
    if (list.some((c) => c.toLowerCase().includes("system"))) {
      curated.push("Design Systems");
    }
    if (list.some((c) => c.toLowerCase().includes("fintech") || c.toLowerCase().includes("bank"))) {
      curated.push("Fintech");
    }

    // Add any remaining categories from data that aren't already represented
    list.forEach((item) => {
      const lower = item.toLowerCase();
      if (
        !curated.some(
          (c) => c.toLowerCase() === lower || c.toLowerCase().includes(lower) || lower.includes(c.toLowerCase())
        )
      ) {
        curated.push(item);
      }
    });

    return curated.length > 1 ? curated : ["All", "Mobile Apps", "Dashboards", "Design Systems", "Fintech"];
  }, [projectList]);

  // Filter project list based on active category
  const filtered = useMemo(() => {
    if (activeCategory === "All") return projectList;

    const target = activeCategory.toLowerCase();

    return projectList.filter((p: any) => {
      const catArr = (Array.isArray(p.category) ? p.category : [p.category || ""]).map((c: string) => String(c).toLowerCase());
      const tagArr = (Array.isArray(p.tags) ? p.tags : [p.tags || ""]).map((t: string) => String(t).toLowerCase());
      const allTerms = [
        String(p.title || "").toLowerCase(),
        String(p.company || "").toLowerCase(),
        String(p.overview || "").toLowerCase(),
        ...catArr,
        ...tagArr,
      ];

      // Smart category grouping
      if (target === "mobile apps" || target === "mobile" || target === "apps") {
        return allTerms.some((t) => t.includes("mobile") || t.includes("app") || t.includes("ios") || t.includes("android"));
      }

      if (target === "dashboards" || target === "dashboard") {
        return allTerms.some((t) => t.includes("dash") || t.includes("analytics") || t.includes("saas") || t.includes("web app") || t.includes("portal"));
      }

      if (target === "design systems" || target === "design system") {
        return allTerms.some((t) => t.includes("design system") || t.includes("system") || t.includes("ui kit") || t.includes("tokens"));
      }

      if (target === "fintech") {
        return allTerms.some((t) => t.includes("fintech") || t.includes("bank") || t.includes("payment") || t.includes("pay") || t.includes("cred"));
      }

      // Generic matching
      return allTerms.some((term) => term === target || term.includes(target) || target.includes(term));
    });
  }, [projectList, activeCategory]);

  return (
    <div className="min-h-screen bg-bg dark:bg-dark pt-32">
      {/* Header */}
      <div className="container-custom mb-16 md:mb-20 text-left">
        <motion.span
          className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Portfolio & Showcase
        </motion.span>
        <motion.h1
          className="font-clash text-display font-bold text-text-primary dark:text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          My Design.
        </motion.h1>
        <motion.p
          className="text-text-muted dark:text-white/50 font-satoshi text-body-lg max-w-xl mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          A curated collection of mobile apps, dashboards, design systems, and product experiences shipped for over 100M+ users.
        </motion.p>

        {/* Filter pills */}
        <motion.div
          className="flex flex-wrap items-center gap-2.5 mb-10"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-satoshi font-semibold transition-all duration-300 flex items-center gap-2 ${isActive
                    ? "bg-accent-blue text-white shadow-glow-blue scale-[1.02]"
                    : "bg-black/5 dark:bg-white/10 text-text-muted dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/20 hover:text-text-primary dark:hover:text-white"
                  }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Grid */}
      <div className="container-custom pb-24">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCategory}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link href={`/work/${project.slug}`} data-cursor="project">
                    <div className="group rounded-2xl overflow-hidden border border-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-accent-blue/50 transition-all duration-300 hover:shadow-lg">
                      {/* Cover Container */}
                      <div className="relative aspect-[1920/1126] w-full overflow-hidden bg-black/5 dark:bg-white/5">
                        <Image
                          src={project.coverImage}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 text-left">
                        <div className="min-w-0">
                          <h3 className="font-clash text-lg sm:text-xl font-bold text-text-primary dark:text-white group-hover:text-accent-blue transition-colors truncate">
                            {project.title}
                          </h3>
                          <p className="text-text-muted dark:text-white/50 text-xs font-satoshi truncate mt-0.5">
                            {project.company}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-satoshi font-semibold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-text-muted dark:text-white/60">
                          {project.year}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border dark:border-dark-border rounded-3xl p-8">
            <Layers size={36} className="mx-auto text-text-muted dark:text-white/30 mb-3" />
            <h3 className="font-clash text-lg font-bold text-text-primary dark:text-white mb-2">
              No projects found for &ldquo;{activeCategory}&rdquo;
            </h3>
            <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-6">
              Try selecting another category or view all design work.
            </p>
            <button
              onClick={() => setActiveCategory("All")}
              className="px-5 py-2 rounded-xl bg-accent-blue text-white text-xs font-satoshi font-bold"
            >
              Reset to All Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyDesignPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg dark:bg-dark pt-32 flex justify-center items-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
        </div>
      }
    >
      <MyDesignContent />
    </Suspense>
  );
}
