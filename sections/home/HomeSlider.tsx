"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X } from "lucide-react";

interface SliderPhoto {
  id: string;
  src: string;
  alt: string;
  category: string;
  order: number;
}

export default function HomeSlider() {
  const [slides, setSlides] = useState<SliderPhoto[]>([]);
  const [lightboxSlide, setLightboxSlide] = useState<SliderPhoto | null>(null);

  useEffect(() => {
    // Fetch slider photos specifically categorized as "Hero Slide" (or fallback to all slides)
    fetch("/api/gallery?category=Hero%20Slide")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.items && data.items.length > 0) {
          setSlides(data.items);
        } else {
          fetch("/api/gallery")
            .then((r) => r.json())
            .then((allData) => {
              if (allData.success && allData.items && allData.items.length > 0) {
                setSlides(allData.items);
              }
            });
        }
      })
      .catch(() => {});
  }, []);

  if (slides.length === 0) return null;

  // Split slides into two distinct sets for row 1 and row 2
  const half = Math.ceil(slides.length / 2);
  const row1Source = slides.length >= 4 ? slides.slice(0, half) : slides;
  const row2Source = slides.length >= 4 ? slides.slice(half) : [...slides].reverse();

  // Duplicate for seamless infinite loop marquee
  const row1 = [...row1Source, ...row1Source, ...row1Source, ...row1Source];
  const row2 = [...row2Source, ...row2Source, ...row2Source, ...row2Source];

  return (
    <section className="relative py-20 md:py-28 bg-bg dark:bg-dark border-t border-b border-border dark:border-white/10 overflow-hidden">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxSlide(null)}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxSlide(null)}
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
                  src={lightboxSlide.src}
                  alt={lightboxSlide.alt || "Slider Image"}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
            {lightboxSlide.alt && (
              <p className="mt-4 text-xs font-satoshi text-white/80 max-w-lg text-center">
                {lightboxSlide.alt}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom mb-12 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
          <span className="text-text-muted dark:text-white/50 text-xs font-satoshi uppercase tracking-[0.2em] font-semibold">
            Visual Showcase Slider
          </span>
        </div>
        <h2 className="font-clash text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary dark:text-white">
          Selected Screens & Visuals.
        </h2>
      </div>

      {/* Marquee Container with Fade Edges */}
      <div className="relative w-full overflow-hidden space-y-6 select-none group">
        {/* Left & Right Edge Gradient Fades for Smooth Infinite Illusion */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-bg dark:from-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-bg dark:from-dark to-transparent z-10 pointer-events-none" />

        {/* Row 1: Marquee moving Left */}
        <div className="flex overflow-hidden w-full">
          <div className="marquee-inner flex gap-6 shrink-0 py-1">
            {row1.map((item, idx) => (
              <div
                key={`r1-${item.id}-${idx}`}
                onClick={() => setLightboxSlide(item)}
                className="relative w-[340px] sm:w-[460px] aspect-[16/10] rounded-2xl overflow-hidden border border-border dark:border-white/10 bg-white dark:bg-dark-card shadow-sm cursor-pointer shrink-0"
              >
                <Image
                  src={item.src}
                  alt={item.alt || "Showcase screen"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 340px, 460px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Marquee moving Right (Reverse) */}
        <div className="flex overflow-hidden w-full marquee-reverse">
          <div className="marquee-inner flex gap-6 shrink-0 py-1">
            {row2.map((item, idx) => (
              <div
                key={`r2-${item.id}-${idx}`}
                onClick={() => setLightboxSlide(item)}
                className="relative w-[340px] sm:w-[460px] aspect-[16/10] rounded-2xl overflow-hidden border border-border dark:border-white/10 bg-white dark:bg-dark-card shadow-sm cursor-pointer shrink-0"
              >
                <Image
                  src={item.src}
                  alt={item.alt || "Showcase screen"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 340px, 460px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
