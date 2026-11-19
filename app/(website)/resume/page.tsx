"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Download, ArrowUpRight } from "lucide-react";
import type { ExperienceItem, EducationItem } from "@/lib/types";

export default function ResumePage() {
  const [settings, setSettings] = useState({
    heroName: "Nitish Tao",
    heroTitle: "Senior Product Designer",
    heroBio: "6 years designing digital products for 100M+ users across fintech, e-commerce, healthcare, and enterprise SaaS. Deep expertise in UX research, design systems, and data-driven iteration.",
    resumeUrl: "/resume.pdf",
  });

  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [educationList, setEducationList] = useState<EducationItem[]>([]);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});

    fetch("/api/experience")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.experiences && data.experiences.length > 0) {
            setExperienceList(data.experiences);
          }
          if (data.education && data.education.length > 0) {
            setEducationList(data.education);
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg dark:bg-dark pt-32 pb-24">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16">
          <div>
            <motion.span
              className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Career
            </motion.span>
            <motion.h1
              className="font-clash text-display font-bold text-text-primary dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              CV.
            </motion.h1>
          </div>
          <motion.a
            href={settings.resumeUrl || "/resume.pdf"}
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-dark dark:bg-white text-white dark:text-dark font-satoshi font-semibold text-sm hover:opacity-90 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={16} />
            Download CV
          </motion.a>
        </div>

        {/* Summary */}
        <motion.div
          className="p-8 rounded-3xl border border-border dark:border-dark-border mb-16 bg-white dark:bg-dark-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <h2 className="font-satoshi font-bold text-text-primary dark:text-white text-lg mb-1">{settings.heroName}</h2>
          <p className="text-accent-blue font-satoshi text-sm font-semibold mb-4">{settings.heroTitle}</p>
          <p className="text-text-secondary dark:text-white/60 font-satoshi text-body leading-relaxed">
            {settings.heroBio}
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {["Figma", "Design Systems", "UX Research", "Prototyping", "A/B Testing", "Interaction Design"].map((tag) => (
              <span key={tag} className="chip chip-blue">{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="font-clash text-title font-bold text-text-primary dark:text-white mb-8 pb-4 border-b border-border dark:border-dark-border">
            Work Experience
          </h2>
          <div className="space-y-8">
            {experienceList.map((exp, i) => (
              <motion.div
                key={exp.id || i}
                className="grid md:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="md:col-span-1">
                  <p className="text-text-muted dark:text-white/40 text-xs font-satoshi leading-relaxed">{exp.period}</p>
                  <p className="text-text-muted dark:text-white/40 text-xs font-satoshi mt-1">{exp.location}</p>
                </div>
                <div className="md:col-span-3">
                  <h3 className="font-satoshi font-bold text-text-primary dark:text-white mb-0.5">
                    {exp.role}
                  </h3>
                  <p className="font-satoshi font-semibold text-sm mb-3" style={{ color: exp.color || "#4F8EF7" }}>
                    {exp.company}
                  </p>
                  {/* WYSIWYG Role Description */}
                  {exp.description && (
                    <div
                      className="text-text-secondary dark:text-white/70 font-satoshi text-sm leading-relaxed mb-3 max-w-none 
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-1.5
                        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:my-1.5
                        [&_li]:text-text-secondary [&_li]:dark:text-white/70
                        [&_p]:my-1
                        [&_strong]:font-bold [&_strong]:text-text-primary [&_strong]:dark:text-white
                        [&_h3]:font-bold [&_h3]:text-base [&_h3]:text-text-primary [&_h3]:dark:text-white [&_h3]:my-1.5"
                      dangerouslySetInnerHTML={{
                        __html: /<[a-z][\s\S]*>/i.test(exp.description)
                          ? exp.description
                          : `<ul>${exp.description
                              .split(/\r?\n/)
                              .map((l: string) => l.trim().replace(/^[\s•\-\*]+/, ""))
                              .filter(Boolean)
                              .map((l: string) => `<li>${l}</li>`)
                              .join("")}</ul>`,
                      }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education */}
        {educationList.length > 0 && (
          <section className="mb-16">
            <h2 className="font-clash text-title font-bold text-text-primary dark:text-white mb-8 pb-4 border-b border-border dark:border-dark-border">
              Education
            </h2>
            <div className="space-y-6">
              {educationList.map((edu, i) => (
                <motion.div
                  key={edu.institution || i}
                  className="grid md:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div>
                    <p className="text-text-muted dark:text-white/40 text-xs font-satoshi">{edu.period}</p>
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="font-satoshi font-bold text-text-primary dark:text-white">{edu.institution}</h3>
                    <p className="text-text-secondary dark:text-white/60 font-satoshi text-sm">{edu.degree}</p>
                    {edu.highlight && <span className="chip chip-green mt-2 inline-flex">{edu.highlight}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="text-center pt-10 border-t border-border dark:border-dark-border">
          <p className="text-text-muted dark:text-white/50 font-satoshi text-sm mb-4">Ready to connect?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent-blue text-white font-satoshi font-bold hover:bg-accent-purple transition-colors">
            Get in touch <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
