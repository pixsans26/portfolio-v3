"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Prevent scroll during load
    document.body.style.overflow = "hidden";

    const duration = 1800; // ms
    const interval = 20; // ms
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      // Ease out: fast at start, slow at end
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.min(Math.floor(easedProgress * 100), 100));

      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setDone(true);
          setTimeout(() => {
            setLoading(false);
            document.body.style.overflow = "";
          }, 600);
        }, 200);
      }
    }, interval);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-end bg-dark"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-hero" />
          
          {/* Floating blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-blue opacity-10 blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-purple opacity-10 blur-[100px] animate-float-slow" />

          {/* Content */}
          <div className="relative w-full p-10 md:p-16">
            <motion.div
              className="flex items-end justify-between"
              animate={{ y: done ? -20 : 0, opacity: done ? 0 : 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Brand mark */}
              <div>
                <p className="text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] mb-2">
                  Portfolio
                </p>
                <h1 className="text-white font-clash text-5xl md:text-7xl font-bold leading-none">
                  YN
                </h1>
              </div>

              {/* Counter */}
              <div className="text-right">
                <span className="font-geist text-white/30 text-xs uppercase tracking-widest block mb-2">
                  Loading
                </span>
                <motion.span
                  className="font-clash text-white text-6xl md:text-8xl font-bold tabular-nums leading-none"
                >
                  {count.toString().padStart(2, "0")}
                </motion.span>
                <span className="font-clash text-white/30 text-4xl md:text-6xl font-bold">
                  %
                </span>
              </div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="mt-8 h-px bg-white/10 relative overflow-hidden"
              initial={{ scaleX: 0, transformOrigin: "left" }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-accent"
                style={{ scaleX: count / 100, transformOrigin: "left" }}
                transition={{ ease: "linear" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
