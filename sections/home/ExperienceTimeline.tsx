"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Shield, ShoppingBag, CreditCard, LucideIcon } from "lucide-react";

const companyLogoMap: Record<string, LucideIcon> = {
  Briefcase,
  Shield,
  ShoppingBag,
  CreditCard,
};

export default function ExperienceTimeline() {
  const [expList, setExpList] = useState<any[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.experiences && data.experiences.length > 0) {
          setExpList(data.experiences);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-bg dark:bg-dark">
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-16 items-start">
          {/* Sticky heading */}
          <div className="lg:sticky lg:top-32">
            <motion.span
              className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Experience
            </motion.span>
            <motion.h2
              className="font-clash text-headline font-bold text-text-primary dark:text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Where I&apos;ve worked.
            </motion.h2>
            <motion.p
              className="text-text-muted dark:text-white/50 font-satoshi text-body leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              6 years across product design, design systems, and UX research — from seed-stage
              startups to 100M-user platforms.
            </motion.p>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="relative pl-8">
              {/* Animated line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border dark:bg-dark-border overflow-hidden">
                <motion.div
                  className="w-full bg-gradient-to-b from-accent-blue to-accent-purple"
                  style={{ height: lineHeight }}
                />
              </div>

              {/* Items */}
              <div className="space-y-14">
                {expList.map((exp, i) => (
                  <motion.div
                    key={exp.id}
                    className="relative"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {/* Dot */}
                    <div
                      className="absolute -left-8 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-bg dark:border-dark ring-2"
                      style={{
                        backgroundColor: exp.color,
                        boxShadow: `0 0 12px ${exp.color}40`,
                      }}
                    />

                    <div className="group p-6 rounded-3xl border border-border dark:border-dark-border bg-white dark:bg-dark-card hover:border-accent-blue/30 transition-all duration-300 hover:shadow-card-hover">
                      {/* Top row */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <div className="flex items-center gap-2.5 mb-1">
                            {(() => {
                              const LogoIcon = companyLogoMap[exp.logo] || Briefcase;
                              return (
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${exp.color}15`, color: exp.color }}
                                >
                                  <LogoIcon className="w-4 h-4" />
                                </div>
                              );
                            })()}
                            <span
                              className="text-sm font-satoshi font-bold"
                              style={{ color: exp.color }}
                            >
                              {exp.company}
                            </span>
                          </div>
                          <h3 className="font-satoshi font-bold text-lg text-text-primary dark:text-white">
                            {exp.role}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="chip chip-blue">{exp.period}</span>
                          <p className="text-text-muted text-xs font-satoshi mt-1">{exp.location}</p>
                        </div>
                      </div>

                      {/* WYSIWYG Role Description */}
                      {exp.description && (
                        <div
                          className="text-text-secondary dark:text-white/70 font-satoshi text-sm leading-relaxed mb-4 max-w-none 
                            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:my-2
                            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:my-2
                            [&_li]:text-text-secondary [&_li]:dark:text-white/70
                            [&_p]:my-2
                            [&_strong]:font-bold [&_strong]:text-text-primary [&_strong]:dark:text-white
                            [&_h3]:font-bold [&_h3]:text-base [&_h3]:text-text-primary [&_h3]:dark:text-white [&_h3]:my-2"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
