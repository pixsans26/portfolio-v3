"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Mail, Globe } from "lucide-react";

function SocialIcon({ platform, size = 15, className = "" }: { platform: string; size?: number; className?: string }) {
  const p = platform.toLowerCase();
  if (p.includes("linkedin")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    );
  }
  if (p.includes("twitter") || p.includes(" x") || p === "x") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (p.includes("github")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  if (p.includes("dribbble")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.26-.05-.98-.17-1.96-.17-1.12 0-2.39.18-3.69.51-.12-.27-.25-.54-.38-.81a17.22 17.22 0 0 0-.41-.83c2.47-1.39 4.09-3.32 4.51-4.014zM12 3.52c1.82 0 3.5.58 4.88 1.57-.36.63-1.84 2.45-4.22 3.81-1.36-2.52-2.73-4.63-3.03-5.08A8.448 8.448 0 0 1 12 3.52zM7.55 4.41c.29.43 1.63 2.5 3 4.98-2.67.79-5.26.8-6.12.8-.24 0-.45-.01-.63-.02A8.497 8.497 0 0 1 7.55 4.41zM3.52 12v-.3c.27.01.55.02.83.02 1.07 0 3.99-.04 6.84-.94.13.26.25.53.37.8-.37 1.04-.84 2.22-1.38 3.42-3.13-1.02-5.59-1.06-6.66-1.06v-1.94zm1.48 4.23c.99 0 3.19.04 6.13.98-.67 1.58-1.36 3.01-1.78 3.83A8.47 8.47 0 0 1 5 16.23zm6.31 4.19c.4-.78 1.06-2.15 1.71-3.67 1.25-.32 2.51-.49 3.65-.49.88 0 1.55.1 1.83.15a8.492 8.492 0 0 1-7.19 4.01zm8.21-1.98c-.2-.05-.79-.17-1.63-.17-1.04 0-2.21.16-3.39.46.5-1.12.95-2.23 1.3-3.23 1.15-.3 2.27-.45 3.27-.45.89 0 1.55.12 1.83.17a8.49 8.49 0 0 1-1.38 3.22z" />
      </svg>
    );
  }
  if (p.includes("behance")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M7.8 2c-3.1 0-5.3 2.1-5.3 5.4 0 1.8.7 3.2 2 4-1.6.8-2.5 2.4-2.5 4.4C2 19.3 4.5 22 8 22c2.4 0 4.3-1.2 5.1-3.2h-2.5c-.5.9-1.5 1.4-2.6 1.4-1.8 0-3.1-1.2-3.3-2.9h8.7c.1-.4.1-.9.1-1.4 0-3.9-2.5-6.9-5.7-6.9zm-3.4 5.3c0-2 1.4-3.4 3.4-3.4s3.4 1.4 3.4 3.4c0 2-1.4 3.4-3.4 3.4s-3.4-1.4-3.4-3.4zm.1 8.7c.3-1.7 1.6-2.8 3.3-2.8s3 1.1 3.3 2.8H4.5zM15 6h7v2h-7V6zm3.5 5.5c-3 0-5.3 2.4-5.3 5.5s2.3 5.5 5.3 5.5c2.3 0 4.1-1.4 4.9-3.4h-2.4c-.4.9-1.3 1.5-2.5 1.5-1.7 0-3-1.2-3.2-2.8h8.3c.1-.3.1-.7.1-1.1 0-3.1-2.2-5.2-5.2-5.2zm-3.1 4.4c.2-1.5 1.4-2.5 3.1-2.5s2.9 1 3.1 2.5h-6.2z" />
      </svg>
    );
  }
  if (p.includes("instagram")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    );
  }
  if (p.includes("youtube")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (p.includes("figma")) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M8 2h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4H8V2zm0 8h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4v-4zm-4-4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm0 8a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zm4 4a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4 4 4 0 0 1-4-4v0a4 4 0 0 1 4-4z" />
      </svg>
    );
  }
  if (p.includes("mail") || p.includes("email")) {
    return <Mail size={size} className={className} />;
  }
  return <Globe size={size} className={className} />;
}

const footerLinks = {
  "My Design": [
    { label: "All Projects", href: "/my-design" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Mobile Apps", href: "/my-design?category=apps" },
    { label: "Dashboards", href: "/my-design?category=dashboards" },
  ],
  About: [
    { label: "Story", href: "/about" },
    { label: "CV", href: "/cv" },
    { label: "Gallery", href: "/gallery" },
  ],
  Connect: [
    { label: "LinkedIn", href: "https://linkedin.com", external: true },
    { label: "Dribbble", href: "https://dribbble.com", external: true },
    { label: "Twitter", href: "https://twitter.com", external: true },
    { label: "Behance", href: "https://behance.net", external: true },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [socials, setSocials] = useState<Array<{ platform: string; url: string }>>([
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "Twitter / X", url: "https://twitter.com" },
    { platform: "GitHub", url: "https://github.com" },
    { platform: "Dribbble", url: "https://dribbble.com" },
  ]);
  const [adminEmail, setAdminEmail] = useState("nitishtao@gmail.com");
  const [heroTitle, setHeroTitle] = useState("Senior Product Designer");

  useEffect(() => {
    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.socials && data.socials.length > 0) {
          setSocials(data.socials);
        }
      })
      .catch(() => { });

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.heroTitle) setHeroTitle(data.settings.heroTitle);
          if (data.settings.email) setAdminEmail(data.settings.email);
        }
      })
      .catch(() => { });
  }, []);

  const dynamicFooterLinks = {
    ...footerLinks,
    Connect: socials.map((s) => ({
      label: s.platform,
      href: s.url,
      external: true,
    })),
  };

  return (
    <footer className="bg-bg dark:bg-dark text-text-primary dark:text-white border-t border-border dark:border-white/10 overflow-hidden transition-colors duration-300">
      {/* Big CTA */}
      <div className="container-custom pt-24 pb-16 border-b border-border dark:border-white/10">
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <p className="text-text-muted dark:text-white/40 text-sm font-satoshi uppercase tracking-[0.15em] mb-6">
              Available for new opportunities
            </p>
            <motion.h2
              className="font-clash text-display font-bold leading-none text-text-primary dark:text-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s build something{" "}
              <span className="gradient-text">amazing.</span>
            </motion.h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-text-secondary dark:text-white/60 text-sm font-satoshi">
                Open to roles — DM or email
              </span>
            </div>
            <motion.a
              href={`mailto:${adminEmail}`}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-dark dark:bg-white text-white dark:text-dark font-satoshi font-bold text-lg hover:bg-accent-blue dark:hover:bg-accent-blue hover:text-white dark:hover:text-white transition-all duration-300 shadow-card"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {adminEmail}
              <ArrowUpRight
                size={20}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200"
              />
            </motion.a>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-custom py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="inline-block group mb-4">
            <div className="relative">
              {/* Dynamic ambient theme glow effect on hover */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-blue/40 via-accent-purple/40 to-accent-blue/40 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
              {/* Theme-adaptive badge with maximum contrast & crisp readability */}
              <div className="relative w-11 h-11 rounded-2xl bg-dark text-white dark:bg-white dark:text-dark border border-black/10 dark:border-white/20 flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-accent-blue group-hover:text-white group-hover:border-accent-blue">
                <span className="font-clash font-bold text-base tracking-wide">NT</span>
              </div>
            </div>
          </Link>
          <p className="text-text-secondary dark:text-white/50 text-sm font-satoshi leading-relaxed max-w-[200px]">
            {heroTitle} crafting experiences that move metrics.
          </p>
          <p className="text-text-muted dark:text-white/30 text-xs font-satoshi mt-4 flex items-center gap-1.5">
            <MapPin size={12} className="text-accent-blue" />
            Based in India
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(dynamicFooterLinks).map(([category, links]) => {
          const isConnect = category.toLowerCase() === "connect";
          return (
            <div key={category}>
              <h3 className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.15em] mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={(link as { external?: boolean }).external ? "_blank" : undefined}
                      rel={(link as { external?: boolean }).external ? "noopener noreferrer" : undefined}
                      className="text-text-secondary dark:text-white/60 text-sm font-satoshi hover:text-text-primary dark:hover:text-white transition-colors flex items-center gap-2 group py-0.5"
                    >
                      {isConnect && (
                        <span className="w-5 h-5 rounded-md bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center text-text-muted dark:text-white/50 group-hover:text-accent-blue group-hover:bg-accent-blue/10 dark:group-hover:bg-accent-blue/15 transition-all flex-shrink-0">
                          <SocialIcon platform={link.label} size={12} />
                        </span>
                      )}
                      <span>{link.label}</span>
                      {(link as { external?: boolean }).external && (
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div className="container-custom py-6 border-t border-border dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-text-muted dark:text-white/30 text-xs font-satoshi">
          © {year} Nitish Tao. Designed & built with care.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/sitemap.xml" className="text-text-muted dark:text-white/30 text-xs font-satoshi hover:text-text-primary dark:hover:text-white/60 transition-colors">
            Sitemap
          </Link>
          <Link href="/privacy" className="text-text-muted dark:text-white/30 text-xs font-satoshi hover:text-text-primary dark:hover:text-white/60 transition-colors">
            Privacy
          </Link>
          <span className="text-text-muted dark:text-white/40 text-xs font-satoshi">
            Built with Next.js 16
          </span>
        </div>
      </div>
    </footer>
  );
}
