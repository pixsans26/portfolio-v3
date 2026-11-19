"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon, Menu, X, Check, Zap, FileText, Send } from "lucide-react";

const navLinks = [
  { label: "My Design", href: "/my-design" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const [socials, setSocials] = useState<Array<{ platform: string; url: string }>>([]);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isWorkPage = pathname?.startsWith("/work");

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.socials) {
          setSocials(data.socials);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled || isWorkPage
            ? "bg-white/85 dark:bg-dark/85 backdrop-blur-xl border-b border-border dark:border-white/10 py-3.5 shadow-card dark:shadow-2xl"
            : "bg-transparent py-5"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 group">
            <motion.div
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="relative">
                {/* Ambient glow effect that activates on hover */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-accent-blue/40 to-accent-purple/40 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                {/* Theme-adaptive high-contrast monogram badge */}
                <div className="relative w-9 h-9 rounded-xl bg-dark text-white dark:bg-white dark:text-dark border border-black/10 dark:border-white/20 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:bg-accent-blue group-hover:text-white group-hover:border-accent-blue">
                  <span className="font-clash font-bold text-sm tracking-wide">NT</span>
                </div>
              </div>
              <span
                className={`font-satoshi font-bold text-[15px] tracking-tight transition-colors duration-300 ${
                  scrolled || isWorkPage
                    ? "text-text-primary dark:text-white group-hover:text-accent-blue"
                    : "text-text-primary dark:text-white/90 group-hover:text-accent-blue"
                }`}
              >
                Nitish Tao
              </span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-satoshi font-semibold transition-colors duration-200 relative group ${
                  pathname === link.href
                    ? "text-accent-blue"
                    : "text-text-secondary dark:text-white/80 hover:text-text-primary dark:hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-accent-blue transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Recruiter Mode */}
            <motion.button
              onClick={() => setRecruiterMode(!recruiterMode)}
              className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-satoshi font-semibold transition-all duration-300 border ${
                recruiterMode
                  ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400/30"
                  : "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/50"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  recruiterMode ? "bg-white animate-pulse" : "bg-emerald-500"
                }`}
              />
              <span>Recruiter Mode</span>
              {recruiterMode && <Check size={12} className="stroke-[3]" />}
            </motion.button>

            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/10 text-text-secondary dark:text-white/60 hover:text-text-primary dark:hover:text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>
            )}

            {/* Contact CTA */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/contact"
                className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark dark:bg-white text-white dark:text-dark text-sm font-satoshi font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                Let&apos;s Talk
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </motion.div>

            {/* Mobile Menu */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center text-text-primary dark:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Recruiter Mode Floating Highlighted Bar */}
        <AnimatePresence>
          {recruiterMode && (
            <motion.div
              className="absolute top-full left-0 right-0 pt-3 pointer-events-none flex justify-center z-50"
              initial={{ y: -10, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pointer-events-auto mx-4 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/40 backdrop-blur-xl flex items-center gap-3 sm:gap-4 text-xs font-satoshi ring-1 ring-emerald-300/30">
                {/* Highlight Label */}
                <div className="flex items-center gap-1.5 font-bold tracking-wide text-white pr-2.5 border-r border-white/25">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span className="uppercase text-[11px] font-clash tracking-wider">Recruiter View</span>
                </div>

                {/* Quick Action Links */}
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Link
                    href="/cv"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-emerald-800 font-bold hover:bg-emerald-50 hover:scale-105 transition-all shadow-sm"
                  >
                    <FileText size={12} className="stroke-[2.5]" />
                    <span>CV</span>
                  </Link>

                  <Link
                    href="/my-design"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all font-medium"
                  >
                    <span>My Design</span>
                  </Link>

                  <Link
                    href="/case-studies"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all font-medium"
                  >
                    <span>Case Studies</span>
                  </Link>

                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold transition-all border border-white/20"
                  >
                    <Send size={11} />
                    <span>Direct DM</span>
                  </Link>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setRecruiterMode(false)}
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors ml-1"
                  aria-label="Close recruiter bar"
                  title="Close Recruiter View"
                >
                  <X size={14} className="stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] bg-white/95 dark:bg-dark/95 backdrop-blur-2xl text-text-primary dark:text-white flex flex-col justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="container-custom flex flex-col h-full pt-28 pb-10 justify-between">
              {/* Navigation links */}
              <nav className="flex flex-col gap-2">
                {[
                  ...navLinks,
                  { label: "Contact", href: "/contact" },
                  { label: "CV", href: "/cv" },
                ].map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center justify-between py-3.5 px-4 rounded-2xl text-2xl font-clash font-bold transition-all ${
                          isActive
                            ? "bg-accent-blue/10 text-accent-blue dark:bg-white/10 dark:text-white"
                            : "text-text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <span>{link.label}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-40"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom footer in popup drawer */}
              <div className="pt-6 border-t border-border dark:border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-text-muted dark:text-white/40 font-semibold font-satoshi">
                    Connect With Me
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-xs text-text-muted dark:text-white/60 font-satoshi">
                      Available for hire
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {socials.map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-full text-xs font-satoshi font-medium bg-black/5 dark:bg-white/5 border border-border dark:border-white/10 text-text-secondary dark:text-white/70 hover:text-text-primary dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    >
                      {s.platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
