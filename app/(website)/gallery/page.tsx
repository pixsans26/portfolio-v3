"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { X, ChevronLeft, ChevronRight, ExternalLink, Images } from "lucide-react";

const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", alt: "Dashboard Design", category: "Dashboard" },
  { id: 2, src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80", alt: "Design System", category: "Systems" },
  { id: 3, src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80", alt: "Healthcare App", category: "Mobile" },
  { id: 4, src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80", alt: "EdTech Platform", category: "Mobile" },
  { id: 5, src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80", alt: "Mobile App", category: "Mobile" },
  { id: 6, src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", alt: "Food App", category: "Mobile" },
  { id: 7, src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", alt: "Analytics", category: "Dashboard" },
];

function GalleryContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category");

  const [active, setActive] = useState<number | string | null>(null);
  const [filter, setFilter] = useState("All");
  const [galleryList, setGalleryList] = useState(galleryImages);

  useEffect(() => {
    // Only fetch gallery photos (excluding Hero Slides which are dedicated to the Home page slider)
    fetch("/api/gallery?excludeCategory=Hero%20Slide")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items && data.items.length > 0) {
          setGalleryList(data.items);
        }
      })
      .catch(() => {});
  }, []);

  // Sync category from URL param if given
  useEffect(() => {
    if (initialCategoryParam) {
      setFilter(initialCategoryParam);
    }
  }, [initialCategoryParam]);

  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    galleryList.forEach((g) => {
      if (g.category && g.category !== "Hero Slide") {
        set.add(g.category.trim());
      }
    });
    const list = Array.from(set);
    return list.length > 0 ? ["All", ...list] : ["All", "Mobile", "Dashboard", "Systems"];
  }, [galleryList]);

  const filters = dynamicCategories;

  const filtered = useMemo(() => {
    if (filter === "All") return galleryList;

    const target = filter.toLowerCase();
    return galleryList.filter((g) => {
      const cat = (g.category || "").toLowerCase();
      const alt = (g.alt || "").toLowerCase();
      return cat === target || cat.includes(target) || target.includes(cat) || alt.includes(target);
    });
  }, [galleryList, filter]);

  const handleNav = (dir: 1 | -1) => {
    if (active === null || filtered.length === 0) return;
    const idx = filtered.findIndex((g) => g.id === active);
    const next = (idx + dir + filtered.length) % filtered.length;
    setActive(filtered[next].id);
  };

  useEffect(() => {
    if (active === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowLeft") handleNav(-1);
      if (e.key === "ArrowRight") handleNav(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, filtered]);

  return (
    <div className="min-h-screen bg-bg dark:bg-dark pt-32 pb-24">
      <div className="container-custom">
        {/* Header */}
        <motion.span
          className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Visual Archive
        </motion.span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.h1
            className="font-clash text-display font-bold text-text-primary dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Gallery.
          </motion.h1>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = filter.toLowerCase() === f.toLowerCase();
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-satoshi font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-accent-blue text-white shadow-glow-blue scale-[1.02]"
                      : "bg-black/5 dark:bg-white/10 text-text-muted dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/20 hover:text-text-primary dark:hover:text-white"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry grid: 100% full width, height is auto to preserve natural image dimensions without cropping */}
        {filtered.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            <AnimatePresence>
              {filtered.map((img, i) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="break-inside-avoid mb-6"
                >
                  <div
                    className="group relative overflow-hidden rounded-2xl cursor-pointer bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border shadow-sm hover:shadow-card-hover transition-all duration-300"
                    onClick={() => setActive(img.id)}
                    data-cursor="view"
                    data-cursor-label="Open"
                  >
                    <img
                      src={img.src}
                      alt={img.alt || "Gallery image"}
                      className="w-full h-auto block align-top transition-transform duration-700 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
                      <p className="text-white font-satoshi font-semibold text-base leading-snug drop-shadow-sm">
                        {img.alt}
                      </p>
                      {img.category && (
                        <span className="chip chip-blue mt-2 self-start text-xs font-medium">
                          {img.category}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border dark:border-dark-border rounded-3xl p-8">
            <Images size={36} className="mx-auto text-text-muted dark:text-white/30 mb-3" />
            <h3 className="font-clash text-lg font-bold text-text-primary dark:text-white mb-2">
              No photos found for &ldquo;{filter}&rdquo;
            </h3>
            <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-6">
              Try selecting another category or view all gallery photos.
            </p>
            <button
              onClick={() => setFilter("All")}
              className="px-5 py-2 rounded-xl bg-accent-blue text-white text-xs font-satoshi font-bold"
            >
              Reset to All Photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox: Full resolution, any width & height, native visible mouse pointer and hover controls */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            {/* Top Bar Controls */}
            <div
              className="absolute top-5 right-5 sm:top-6 sm:right-6 flex items-center gap-3 z-30"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const img = filtered.find((g) => g.id === active);
                if (!img) return null;
                return (
                  <a
                    href={img.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
                    title="Open original image in new tab"
                    aria-label="Open original image"
                  >
                    <ExternalLink size={18} />
                  </a>
                );
              })()}

              <button
                className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md cursor-pointer"
                onClick={() => setActive(null)}
                title="Close Preview (Esc)"
                aria-label="Close Preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Prev Button */}
            <button
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer shadow-lg backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation();
                handleNav(-1);
              }}
              title="Previous Image (←)"
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>

            {/* Next Button */}
            <button
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer shadow-lg backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation();
                handleNav(1);
              }}
              title="Next Image (→)"
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>

            {/* Full preview image of any width and height */}
            <motion.div
              className="relative max-w-[94vw] max-h-[90vh] flex flex-col items-center justify-center p-2 select-none z-10 cursor-default"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const img = filtered.find((g) => g.id === active);
                if (!img) return null;
                const activeIndex = filtered.findIndex((g) => g.id === active);

                return (
                  <div className="flex flex-col items-center justify-center max-w-full max-h-full">
                    <img
                      src={img.src}
                      alt={img.alt || "Gallery preview"}
                      className="max-w-[92vw] max-h-[82vh] w-auto h-auto object-contain rounded-2xl shadow-2xl block transition-all duration-300"
                    />
                    <div className="mt-3.5 px-4 py-1.5 rounded-full bg-black/60 sm:bg-white/15 border border-white/10 backdrop-blur-md text-white text-xs font-satoshi font-medium tracking-wide shadow-md flex items-center gap-2.5">
                      <span className="font-semibold text-white/90">{img.alt}</span>
                      {img.category && (
                        <>
                          <span className="opacity-40">•</span>
                          <span className="text-accent-blue font-bold">{img.category}</span>
                        </>
                      )}
                      <span className="opacity-40">•</span>
                      <span className="text-white/60 font-mono text-[11px]">
                        {activeIndex + 1} / {filtered.length}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg dark:bg-dark pt-32 flex justify-center items-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
