"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Mic, FlaskConical, GitCompare, Map, ClipboardList,
  Coins, Boxes, FileText, Layers, Ruler, Code
} from "lucide-react";

// Original SVG Brand Logos & Crisp Icons or Uploaded Logo
const ToolLogo = ({ name, icon }: { name: string; icon?: string }) => {
  // If uploaded logo file or image URL
  if (icon && (icon.startsWith("/") || icon.startsWith("http"))) {
    return (
      <img
        src={icon}
        alt={name}
        className="w-8 h-8 object-contain"
      />
    );
  }

  const normalized = name.toLowerCase();

  if (normalized.includes("figma")) {
    return (
      <svg width="32" height="32" viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
      </svg>
    );
  }

  if (normalized.includes("framer")) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M4 0H20V8H12L20 16H4V8L12 8L4 0Z" fill="#0055FF" />
        <path d="M4 16H12V24L4 16Z" fill="#0055FF" />
      </svg>
    );
  }

  if (normalized.includes("protopie")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#FF5800] flex items-center justify-center text-white font-bold text-xs tracking-tighter">
        PIE
      </div>
    );
  }

  if (normalized.includes("principle")) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 flex items-center justify-center text-white font-bold text-sm">
        P
      </div>
    );
  }

  if (normalized.includes("webflow")) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#146EF5">
        <path d="M15.426 6.804c-1.127 0-2.09.68-2.52 1.65l-1.92 4.38-1.93-4.38c-.43-.97-1.39-1.65-2.52-1.65H2v10.392h3.42V11.23l2.42 5.48c.36.81 1.15 1.34 2.04 1.34s1.68-.53 2.04-1.34l2.42-5.48v5.966H22V6.804h-6.574z" />
      </svg>
    );
  }

  if (normalized.includes("after effects")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#00005B] border border-[#9999FF]/40 flex items-center justify-center text-[#9999FF] font-bold text-xs">
        Ae
      </div>
    );
  }

  if (normalized.includes("storybook")) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF4785">
        <path d="M16.71 4.29L14.46 2H5v20h14V6.54l-2.29-2.25zM12 18H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V8h10v2z" />
      </svg>
    );
  }

  if (normalized.includes("html") || normalized.includes("css")) {
    return (
      <div className="flex items-center gap-0.5">
        <svg width="20" height="24" viewBox="0 0 24 24" fill="#E34F26">
          <path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm17.65 5H6.26l.28 3.33h12.3l-.84 9.42-5.03 1.36-5.01-1.36-.34-3.83h3.29l.17 1.88 1.89.5 1.9-.5.2-2.22H6.96l-.82-9.29h13.31l-.3 2.21z" />
        </svg>
        <svg width="20" height="24" viewBox="0 0 24 24" fill="#1572B6">
          <path d="M1.5 0h21l-1.91 21.563L11.97 24l-8.564-2.438L1.5 0zm17.65 5H6.26l.28 3.33h12.3l-.84 9.42-5.03 1.36-5.01-1.36-.34-3.83h3.29l.17 1.88 1.89.5 1.9-.5.2-2.22H6.96l-.82-9.29h13.31l-.3 2.21z" />
        </svg>
      </div>
    );
  }

  if (normalized.includes("typescript")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#3178C6] flex items-center justify-center text-white font-bold text-xs">
        TS
      </div>
    );
  }

  if (normalized.includes("react")) {
    return (
      <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="10" fill="#61DAFB" />
        <ellipse cx="50" cy="50" rx="4.5" ry="11" transform="rotate(30 50 50)" stroke="#61DAFB" strokeWidth="1" />
        <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(30 50 50)" stroke="#61DAFB" strokeWidth="3" />
        <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(90 50 50)" stroke="#61DAFB" strokeWidth="3" />
        <ellipse cx="50" cy="50" rx="35" ry="14" transform="rotate(150 50 50)" stroke="#61DAFB" strokeWidth="3" />
      </svg>
    );
  }

  if (normalized.includes("git")) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#F05032">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.44.516.515.655 1.258.428 1.9h.001l3.224 3.225c.642-.228 1.385-.088 1.9.427.72.72.72 1.887 0 2.607-.719.72-1.886.72-2.606 0-.538-.538-.673-1.312-.403-1.972l-3.003-3.003v5.69c.215.116.415.275.586.446.72.72.72 1.887 0 2.607-.72.72-1.887.72-2.607 0-.72-.72-.72-1.887 0-2.607.215-.215.462-.365.733-.456V9.123c-.271-.09-.518-.24-.733-.455-.542-.542-.676-1.325-.396-1.99l-2.735-2.735L.452 10.93c-.603.604-.603 1.582 0 2.188l10.48 10.478c.604.604 1.582.604 2.186 0l10.428-10.478c.604-.604.604-1.584 0-2.188z" />
      </svg>
    );
  }

  if (normalized.includes("amplitude") || normalized.includes("analytics")) {
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#1E0A3C">
        <path d="M12 2L2 19h20L12 2zm0 4.5l6.5 11h-13L12 6.5z" fill="#2377FF" />
      </svg>
    );
  }

  if (normalized.includes("zeroheight")) {
    return (
      <div className="w-8 h-8 rounded-lg bg-[#FF6584] flex items-center justify-center text-white font-bold text-xs">
        zh
      </div>
    );
  }

  // Fallback lucide icons
  const iconProps = { className: "w-7 h-7 text-accent-blue" };
  if (normalized.includes("interview")) return <Mic {...iconProps} />;
  if (normalized.includes("usability")) return <FlaskConical {...iconProps} />;
  if (normalized.includes("a/b")) return <GitCompare {...iconProps} />;
  if (normalized.includes("journey")) return <Map {...iconProps} />;
  if (normalized.includes("survey")) return <ClipboardList {...iconProps} />;
  if (normalized.includes("tokens")) return <Coins {...iconProps} />;
  if (normalized.includes("component")) return <Boxes {...iconProps} />;
  if (normalized.includes("doc")) return <FileText {...iconProps} />;
  if (normalized.includes("style")) return <Layers {...iconProps} />;
  if (normalized.includes("ruler")) return <Ruler {...iconProps} />;

  return <Code {...iconProps} />;
};

const categories = ["Design Tools", "Research", "Systems", "Code"] as const;

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("design");
  const [dynamicSkills, setDynamicSkills] = useState<Record<string, any[]>>({
    design: [],
    research: [],
    systems: [],
    code: [],
  });

  const categoryMap = {
    "Design Tools": "design",
    Research: "research",
    Systems: "systems",
    Code: "code",
  } as const;

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.skills && Object.keys(data.skills).length > 0) {
          // Strictly render dynamic skills configured in the CMS
          setDynamicSkills(data.skills);
        }
      })
      .catch(() => {});
  }, []);

  const currentSkills = (dynamicSkills as any)[activeCategory] || [];

  return (
    <section className="section-padding bg-bg dark:bg-dark transition-colors duration-300">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.span
              className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Expertise & Stack
            </motion.span>
            <motion.h2
              className="font-clash text-headline font-bold text-text-primary dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Tools of my trade.
            </motion.h2>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(categoryMap[cat])}
                className={`px-5 py-2.5 rounded-xl text-sm font-satoshi font-medium transition-all duration-300 ${
                  activeCategory === categoryMap[cat]
                    ? "bg-accent-blue text-white shadow-glow-blue"
                    : "bg-black/5 dark:bg-white/10 text-text-muted dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/20 hover:text-text-primary dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid View for Tools */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5"
        >
          {currentSkills.map((skill: any, i: number) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-border dark:border-white/10 flex flex-col items-center justify-center text-center gap-4 hover:border-accent-blue/50 hover:shadow-card transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ToolLogo name={skill.name} icon={(skill as any).icon} />
              </div>
              <span className="font-clash font-bold text-text-primary dark:text-white text-base md:text-lg group-hover:text-accent-blue transition-colors">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Design principles banner */}
        <div className="mt-16 pt-12 border-t border-border dark:border-white/10 grid md:grid-cols-3 gap-8">
          {[
            { label: "Research-first", desc: "Always start with the problem, not the solution." },
            { label: "Metric-driven", desc: "Every decision traced back to a measurable outcome." },
            { label: "Systems thinking", desc: "Design for scale from day one." },
          ].map((p) => (
            <div key={p.label} className="flex gap-4 items-start">
              <div className="w-1 h-12 bg-gradient-accent rounded-full flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-text-primary dark:text-white font-clash font-bold text-lg">{p.label}</p>
                <p className="text-text-muted dark:text-white/50 font-satoshi text-sm mt-1">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

