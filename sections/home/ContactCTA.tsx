"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactCTA() {
  const letters = "Let's build something amazing.".split("");
  const [heroTitle, setHeroTitle] = useState("Senior Product Designer");
  const [contactEmail, setContactEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@portfolio.com");
  const [socials, setSocials] = useState<Array<{ platform: string; url: string }>>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.heroTitle) setHeroTitle(data.settings.heroTitle);
          if (data.settings.email || data.settings.adminEmail) {
            setContactEmail(data.settings.email || data.settings.adminEmail);
          }
        }
      })
      .catch(() => {});

    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.socials && data.socials.length > 0) {
          setSocials(data.socials);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section-padding bg-bg dark:bg-dark overflow-hidden">
      <div className="container-custom text-center">
        {/* Top tag */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border dark:border-dark-border mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-text-muted dark:text-white/60 text-sm font-satoshi">
            Available for new roles & freelance projects
          </span>
        </motion.div>

        {/* Big headline */}
        <div className="overflow-hidden mb-12">
          <motion.h2
            className="font-clash text-hero font-bold text-text-primary dark:text-white leading-none"
            initial={{ y: 120 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Let&apos;s build something{" "}
            <span className="gradient-text">amazing.</span>
          </motion.h2>
        </div>

        <motion.p
          className="text-text-muted dark:text-white/50 font-satoshi text-body-lg max-w-xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Whether you&apos;re looking for a {heroTitle}, a design
          systems lead, or a research-driven collaborator — I&apos;d love to hear
          about your team&apos;s challenges.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          <Link
            href="/contact"
            className="magnetic-btn group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-dark dark:bg-white text-white dark:text-dark font-satoshi font-bold text-lg hover:bg-accent-blue hover:text-white transition-all duration-300"
          >
            Start a conversation
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:translate-x-1 transition-transform">
              <path d="M1 19L19 1M19 1H1M19 1V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl border border-neutral-400 dark:border-white/20 text-text-primary dark:text-white font-satoshi font-medium text-lg hover:border-accent-blue transition-colors"
          >
            {contactEmail}
          </a>
        </motion.div>

        {/* Social links */}
        {socials.length > 0 && (
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-border dark:border-dark-border"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted dark:text-white/40 text-sm font-satoshi hover:text-accent-blue transition-colors"
              >
                {s.platform}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
