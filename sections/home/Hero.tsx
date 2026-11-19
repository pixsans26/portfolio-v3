"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Mail,
  Phone,
  Palette,
  Zap,
  Smartphone,
  Globe,
  Film,
  Mic,
  FlaskConical,
  GitCompare,
  Map,
  BarChart3,
  ClipboardList,
  Coins,
  Boxes,
  FileText,
  BookOpen,
  Layers,
  Ruler,
  Code,
  FileCode,
  Component,
  GitBranch,
  Wrench,
  Lightbulb,
} from "lucide-react";

const roles = ["Product Designer", "UX Designer", "UI Designer", "Problem Solver", "System Thinker"];

const lucideIconMap: Record<string, any> = {
  Palette,
  Zap,
  Smartphone,
  Globe,
  Film,
  Mic,
  FlaskConical,
  GitCompare,
  Map,
  BarChart3,
  ClipboardList,
  Coins,
  Boxes,
  FileText,
  BookOpen,
  Layers,
  Ruler,
  Code,
  FileCode,
  Component,
  GitBranch,
  Wrench,
  Lightbulb,
};

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [siteSettings, setSiteSettings] = useState({
    heroName: "Nitish Tao",
    heroTitle: "Senior Product Designer",
    heroRoles: "Senior Product Designer, UX Designer, UI Designer, Problem Solver, System Thinker",
    heroBio: "I design products that ship, scale, and move metrics. 6 years crafting experiences for 100M+ users at Atlassian, CRED, Swiggy & Razorpay.",
    heroImage: "/hero-portrait.png",
    yearsExperience: "2+",
    totalDesignsCreated: "50+",
    email: "nitishtao@gmail.com",
    phone: "+91 98765 43210",
    latestProject: "CRED Pay 2.0",
  });
  const [heroTools, setHeroTools] = useState<any[]>([]);
  const [latestProjectName, setLatestProjectName] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  // Fetch live site settings from SQLite database
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSiteSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => { });

    // Fetch tools marked to show in Hero
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.all) {
          const marked = data.all.filter((s: any) => s.showInHero);
          if (marked.length > 0) {
            setHeroTools(marked.slice(0, 5));
          } else {
            const fallback = data.skills?.design || data.all.slice(0, 5);
            setHeroTools(fallback.slice(0, 5));
          }
        }
      })
      .catch(() => { });

    // Fetch latest project name
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.projects && data.projects.length > 0) {
          setLatestProjectName(data.projects[0].title);
        }
      })
      .catch(() => { });
  }, []);

  const dynamicRoles = siteSettings.heroRoles
    ? siteSettings.heroRoles.split(",").map((r) => r.trim()).filter(Boolean)
    : siteSettings.heroTitle
      ? [siteSettings.heroTitle, ...roles.filter((r) => r !== siteSettings.heroTitle)]
      : roles;

  // Role rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIdx((prev) => (prev + 1) % dynamicRoles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [dynamicRoles.length]);

  // Mouse parallax
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x, y });
    };
    const onLeave = () => {
      setMousePos({ x: 0, y: 0 });
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const renderToolIcon = (iconName: string, size = 20) => {
    if (iconName && (iconName.startsWith("/") || iconName.startsWith("http"))) {
      return (
        <span className="relative w-5 h-5 inline-block overflow-hidden shrink-0">
          <Image src={iconName} alt="" fill className="object-contain" />
        </span>
      );
    }
    const IconComp = lucideIconMap[iconName] || Palette;
    return <IconComp size={size} className="text-text-secondary dark:text-white/80 hover:text-accent-blue transition-colors shrink-0" />;
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-bg dark:bg-dark overflow-hidden pt-28 pb-20 transition-colors duration-300"
    >
      {/* Dynamic Animated Gradient Background starting from top */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* High-Vibrancy Animated Glowing Background Orbs starting from top */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-70 dark:opacity-100">
        {/* Primary Electric Blue Glow (Starts from Top Right) */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5],
            rotate: [0, 60, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 right-0 w-[750px] h-[750px] rounded-full bg-gradient-to-br from-[#4F8EF7] via-[#7C3AED] to-transparent blur-[120px]"
          style={{
            transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 30}px)`,
          }}
        />

        {/* Secondary Purple Glow (Starts from Top Left) */}
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, -60, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-20 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#7C3AED] via-[#F97316] to-transparent blur-[130px]"
          style={{
            transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -20}px)`,
          }}
        />
      </div>

      {/* ISOMETRIC WIREFRAME SCREENS BACKGROUND (Light subtle vector lines) */}
      <div className="absolute right-[-2%] lg:right-[6%] top-[12%] lg:top-[16%] w-[520px] lg:w-[620px] h-[520px] lg:h-[620px] pointer-events-none select-none z-[1] opacity-35 dark:opacity-20 [transform:perspective(1200px)_rotateX(52deg)_rotateZ(-40deg)]">
        {/* Base Screen Wireframe */}
        <div className="relative w-full h-full rounded-[44px] border-2 border-slate-400 dark:border-white/40 p-5 bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/[0.03] shadow-2xl">
          {/* Notch / Dynamic Island */}
          <div className="w-24 h-4 rounded-full border border-slate-400/80 dark:border-white/40 mx-auto mb-4" />

          {/* Wireframe Header Bar */}
          <div className="flex items-center justify-between mb-5 px-1">
            <div className="w-8 h-8 rounded-full border border-slate-400 dark:border-white/40" />
            <div className="w-32 h-2.5 rounded-full border border-slate-400 dark:border-white/40" />
            <div className="w-6 h-6 rounded-md border border-slate-400 dark:border-white/40" />
          </div>

          {/* Wireframe Hero Banner / Chart Box */}
          <div className="w-full h-36 rounded-2xl border border-slate-400 dark:border-white/40 p-4 mb-4 relative overflow-hidden">
            <div className="w-24 h-2 rounded border border-slate-400 dark:border-white/40 mb-2" />
            <div className="w-40 h-3 rounded border border-slate-400 dark:border-white/40 mb-4" />
            {/* Sparkline curve */}
            <svg className="w-full h-16 stroke-accent-blue/60 dark:stroke-accent-blue/40 fill-none" viewBox="0 0 200 60">
              <path d="M 0 45 Q 40 10, 80 35 T 140 15 T 200 25" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="80" cy="35" r="3" fill="currentColor" />
              <circle cx="140" cy="15" r="3" fill="currentColor" />
              <circle cx="200" cy="25" r="3" fill="currentColor" />
            </svg>
          </div>

          {/* Wireframe 2x2 Feature Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="h-20 rounded-xl border border-slate-400 dark:border-white/40 p-2.5 space-y-2">
              <div className="w-6 h-6 rounded-lg border border-slate-400/70 dark:border-white/30" />
              <div className="w-16 h-2 rounded border border-slate-400/70 dark:border-white/30" />
            </div>
            <div className="h-20 rounded-xl border border-slate-400 dark:border-white/40 p-2.5 space-y-2">
              <div className="w-6 h-6 rounded-lg border border-slate-400/70 dark:border-white/30" />
              <div className="w-20 h-2 rounded border border-slate-400/70 dark:border-white/30" />
            </div>
          </div>

          {/* Wireframe Skeleton Rows */}
          <div className="space-y-2.5">
            {[1, 2].map((i) => (
              <div key={i} className="h-10 rounded-xl border border-slate-400/60 dark:border-white/30 flex items-center gap-3 px-3">
                <div className="w-6 h-6 rounded-full border border-slate-400/70 dark:border-white/30 shrink-0" />
                <div className="w-36 h-2 rounded border border-slate-400/70 dark:border-white/30" />
              </div>
            ))}
          </div>

          {/* Bottom Dock / Tab Bar */}
          <div className="absolute bottom-4 left-6 right-6 h-12 rounded-2xl border border-slate-400 dark:border-white/40 flex items-center justify-around px-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-5 h-5 rounded-md border border-slate-400/70 dark:border-white/40" />
            ))}
          </div>
        </div>

        {/* Layer 2: Floating Offset Isometric Card / Screen Layer */}
        <div className="absolute -top-10 -right-8 w-64 h-72 rounded-3xl border-2 border-accent-blue/70 dark:border-accent-blue/50 p-4 bg-white/30 dark:bg-black/30 backdrop-blur-xs shadow-2xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-accent-blue/30">
            <div className="w-20 h-2.5 rounded border border-accent-blue/60" />
            <div className="w-4 h-4 rounded-full border border-accent-blue/60" />
          </div>
          <div className="space-y-3">
            <div className="h-24 rounded-xl border border-dashed border-accent-blue/50 p-2 flex flex-col justify-between">
              <div className="w-14 h-2 rounded border border-accent-blue/50" />
              <div className="w-full h-8 flex items-end gap-1.5 pt-2">
                {[40, 70, 30, 90, 60, 100].map((h, idx) => (
                  <div key={idx} className="flex-1 rounded-xs border border-accent-blue/60" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="h-10 rounded-xl border border-accent-blue/50 flex items-center justify-center">
              <div className="w-28 h-2 rounded border border-accent-blue/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Mask on Left Side */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[58%] bg-gradient-to-r from-bg via-bg/95 to-transparent dark:from-dark dark:via-dark/95 z-[2] pointer-events-none" />

      {/* Smooth Bottom Transition Fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-bg/60 to-bg dark:via-dark/60 dark:to-dark z-[4] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] z-[1]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container-custom relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center text-left"
        >
          {/* Left Column: Copy & CTAs (7 Cols) */}
          <motion.div className="lg:col-span-7">
            {/* Main Headline */}
            <motion.div variants={itemVariants} className="mb-6">
              <h1 className="font-clash text-hero font-bold text-text-primary dark:text-white leading-[0.95] tracking-tight">
                {siteSettings.heroName || "Nitish Tao"}
              </h1>
              <div className="h-auto overflow-hidden relative mt-2 flex items-center">
                <motion.span
                  key={roleIdx}
                  className="font-clash text-headline font-bold gradient-text block leading-tight py-1"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {dynamicRoles[roleIdx]}
                </motion.span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-text-secondary dark:text-white/80 text-body-lg font-satoshi leading-relaxed max-w-xl mb-8"
            >
              {siteSettings.heroBio}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 mb-5">
              <Link
                href="/my-design"
                className="magnetic-btn group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-dark dark:bg-white text-white dark:text-dark font-satoshi font-bold text-[15px] hover:bg-accent-blue dark:hover:bg-accent-blue hover:text-white dark:hover:text-white transition-all duration-300 shadow-card shrink-0"
              >
                Explore My Design
                <ArrowUpRight size={17} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              {/* Secondary button: clear gray outline in white theme */}
              <Link
                href="/cv"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-neutral-400 dark:border-white/20 text-text-primary dark:text-white font-satoshi font-medium text-[15px] hover:border-accent-blue hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 shadow-xs shrink-0"
              >
                Download CV
              </Link>
            </motion.div>

            {/* Email & Mobile: Below the buttons, simple text separated with vertical line (no button style) */}
            {(siteSettings.email || siteSettings.phone) && (
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 mb-11 text-xs sm:text-sm font-satoshi text-text-secondary dark:text-white/70">
                {siteSettings.email && (
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="inline-flex items-center gap-2 hover:text-accent-blue dark:hover:text-white transition-colors"
                    title="Send Email"
                  >
                    <Mail size={15} className="text-accent-blue shrink-0" />
                    <span className="font-medium">{siteSettings.email}</span>
                  </a>
                )}
                {siteSettings.email && siteSettings.phone && (
                  <span className="w-px h-3.5 bg-neutral-300 dark:bg-white/20" />
                )}
                {siteSettings.phone && (
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 hover:text-accent-blue dark:hover:text-white transition-colors"
                    title="Call Mobile"
                  >
                    <Phone size={15} className="text-accent-blue shrink-0" />
                    <span className="font-medium">{siteSettings.phone}</span>
                  </a>
                )}
              </motion.div>
            )}

            {/* Stats row: Years Experience | Total Designs Created | Latest Project Working On */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 sm:gap-8 pt-8 mb-6 border-t border-border dark:border-white/10 w-full"
            >
              {/* 1. Years Experience */}
              <div className="shrink-0">
                <p className="font-clash text-2xl sm:text-3xl font-bold text-text-primary dark:text-white">
                  {siteSettings.yearsExperience || "2+"}
                </p>
                <p className="text-text-muted dark:text-white/60 text-[11px] sm:text-xs font-satoshi mt-0.5 uppercase tracking-wider font-semibold">
                  Years Experience
                </p>
              </div>

              {/* Vertical line separator 1 */}
              <div className="w-px h-10 bg-neutral-300 dark:bg-white/15 hidden sm:block shrink-0" />

              {/* 2. Total Designs Created */}
              <div className="shrink-0">
                <p className="font-clash text-2xl sm:text-3xl font-bold text-text-primary dark:text-white">
                  {siteSettings.totalDesignsCreated || "50+"}
                </p>
                <p className="text-text-muted dark:text-white/60 text-[11px] sm:text-xs font-satoshi mt-0.5 uppercase tracking-wider font-semibold">
                  Total Designs Created
                </p>
              </div>

              {/* Vertical line separator 2 */}
              <div className="w-px h-10 bg-neutral-300 dark:bg-white/15 hidden sm:block shrink-0" />

              {/* 3. Latest Project Working On */}
              <div className="shrink-0 max-w-[210px]">
                <p className="font-clash text-base sm:text-lg font-bold text-text-primary dark:text-white truncate">
                  {siteSettings.latestProject || latestProjectName || "CRED Pay 2.0"}
                </p>
                <p className="text-text-muted dark:text-white/60 text-[11px] sm:text-xs font-satoshi mt-0.5 uppercase tracking-wider font-semibold truncate">
                  Latest Project
                </p>
              </div>
            </motion.div>

            {/* Tool Logos below stats: Just logos, no outline, nothing */}
            {heroTools.length > 0 && (
              <motion.div variants={itemVariants} className="pt-1 pb-2 flex items-center gap-4">
                <div className="flex items-center gap-4">
                  {heroTools.slice(0, 5).map((tool) => (
                    <div
                      key={tool.id}
                      title={tool.name}
                      className="transition-transform duration-300 hover:scale-115 flex items-center justify-center cursor-default opacity-85 hover:opacity-100"
                    >
                      {renderToolIcon(tool.icon, 22)}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column: Multiple Frames of Photos (Transparent PNGs) Reacting to Mouse Hover (NO CARD) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[440px] sm:min-h-[500px]"
          >
            {/* Ambient Backlight Glow (Subtle reactive counter-drift) */}
            <motion.div
              animate={{
                x: mousePos.x * -20,
                y: mousePos.y * -20,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
              className="absolute inset-0 bg-gradient-accent rounded-full opacity-25 dark:opacity-20 blur-3xl scale-95 pointer-events-none"
            />

            {/* MULTI-FRAME CONTAINER (No card wrapper, natural transparent layering with 3D perspective) */}
            <div className="relative w-full max-w-[440px] flex items-center justify-center [perspective:1200px]">
              {/* ─────────────────────────────────────────────────────────────
                  FRAME 1: Main Portrait / Transparent Cutout PNG Placeholder
                  Swappable with any transparent PNG cutout. Reacts to mouse tilt.
                 ───────────────────────────────────────────────────────────── */}
              <motion.div
                animate={{
                  x: mousePos.x * 24,
                  y: mousePos.y * 22,
                  rotateX: -mousePos.y * 10,
                  rotateY: mousePos.x * 12,
                }}
                transition={{ type: "spring", stiffness: 140, damping: 22 }}
                className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] flex items-center justify-center select-none"
              >
                <img
                  src={siteSettings.heroImage || "/hero-portrait.png"}
                  alt={siteSettings.heroName || "Hero transparent portrait cutout"}
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_20px_50px_rgba(79,142,247,0.22)] pointer-events-none transition-transform duration-300"
                />
              </motion.div>

              {/* ─────────────────────────────────────────────────────────────
                  FRAME 2: Top-Right Floating UI Frame / Device Mockup Placeholder
                  (Transparent PNG frame layer ready to be swapped with transparent PNG)
                 ───────────────────────────────────────────────────────────── */}
              <motion.div
                animate={{
                  x: mousePos.x * -42,
                  y: mousePos.y * -38,
                  rotate: -mousePos.x * 6,
                }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className="absolute -top-3 sm:-top-5 -right-3 sm:-right-8 z-20 p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-dark-card/85 border border-white/60 dark:border-white/15 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-2xl max-w-[190px] sm:max-w-[210px] select-none pointer-events-none"
              >
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-black/5 dark:border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-blue" />
                  <div className="w-14 h-2 rounded bg-black/10 dark:bg-white/20" />
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-11 rounded-lg bg-gradient-to-br from-accent-blue/15 to-purple-500/15 border border-accent-blue/20 flex items-center justify-center">
                    <Layers size={18} className="text-accent-blue" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-satoshi font-semibold text-text-muted dark:text-white/60">
                    <span>Design System</span>
                    <span className="text-accent-blue">v2.4</span>
                  </div>
                </div>
              </motion.div>

              {/* ─────────────────────────────────────────────────────────────
                  FRAME 3: Bottom Floating Badge / Experience Frame Placeholder
                  (Transparent PNG layer ready to be swapped with transparent PNG)
                 ───────────────────────────────────────────────────────────── */}
              <motion.div
                animate={{
                  x: mousePos.x * 38,
                  y: mousePos.y * 32,
                }}
                transition={{ type: "spring", stiffness: 130, damping: 20 }}
                className="absolute -bottom-3 sm:-bottom-5 left-0 sm:-left-6 z-30 p-3 sm:p-4 rounded-2xl bg-white/85 dark:bg-dark-card/90 border border-white/60 dark:border-white/15 backdrop-blur-xl shadow-2xl flex items-center gap-3 select-none pointer-events-none"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center text-accent-blue flex-shrink-0">
                  <Palette size={18} />
                </div>
                <div className="text-left">
                  <p className="text-text-primary dark:text-white font-satoshi font-bold text-sm leading-tight">
                    {siteSettings.heroTitle || "Senior Product Designer"}
                  </p>
                  <p className="text-text-muted dark:text-white/70 text-xs font-satoshi mt-0.5">
                    Atlassian · CRED · Swiggy
                  </p>
                </div>
              </motion.div>

              {/* ─────────────────────────────────────────────────────────────
                  FRAME 4: Top-Left Floating Accent Token / Chip Placeholder
                 ───────────────────────────────────────────────────────────── */}
              <motion.div
                animate={{
                  x: mousePos.x * -26,
                  y: mousePos.y * 24,
                }}
                transition={{ type: "spring", stiffness: 170, damping: 20 }}
                className="absolute top-10 -left-2 sm:-left-6 z-20 px-3 py-1.5 rounded-full bg-white/85 dark:bg-dark-card/90 border border-white/60 dark:border-white/15 backdrop-blur-xl shadow-lg flex items-center gap-2 text-xs font-satoshi font-semibold text-text-primary dark:text-white select-none pointer-events-none"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>100M+ Users</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      >
        <span className="text-text-muted dark:text-white/30 text-xs font-satoshi uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-text-muted dark:from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}
