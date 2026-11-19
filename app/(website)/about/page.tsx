"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, MapPin } from "lucide-react";

export default function AboutPage() {
  const [settings, setSettings] = useState({
    heroName: "Nitish Tao",
    heroTitle: "Senior Product Designer",
    heroBio: "I'm a Senior Product Designer with 6 years of experience building products that people actually use — and love. My work lives at the intersection of user research, interaction design, and business outcomes.",
    yearsExperience: "6+",
    productsShipped: "40+",
    usersImpacted: "100M+",
  });

  const [educationList, setEducationList] = useState<any[]>([
    {
      institution: "National Institute of Design (NID)",
      degree: "B.Des in Interaction Design",
      period: "2016 – 2020",
      highlight: "Dean's List · Best Thesis Project",
    },
    {
      institution: "Interaction Design Foundation",
      degree: "Certificates in UX Management & Human-Centered Design",
      period: "2021",
      highlight: "Top 1% distinction",
    },
  ]);

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
        if (data.success && data.education && data.education.length > 0) {
          setEducationList(data.education);
        }
      })
      .catch(() => {});
  }, []);

  const initials = settings.heroName
    ? settings.heroName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "NT";

  return (
    <div className="min-h-screen bg-bg dark:bg-dark text-text-primary dark:text-white transition-colors duration-300">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-bg dark:bg-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span
                className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                About me
              </motion.span>
              <motion.h1
                className="font-clash text-display font-bold text-text-primary dark:text-white mb-8 leading-none"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                Designer who thinks in systems.
              </motion.h1>
              <motion.p
                className="text-text-secondary dark:text-white/60 font-satoshi text-body-lg leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                {settings.heroBio}
              </motion.p>
              <motion.p
                className="text-text-muted dark:text-white/40 font-satoshi text-body leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                Currently {settings.heroTitle}. I care about shipping things that move metrics — not just making them look good.
              </motion.p>

              {/* Dynamic stats */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border dark:border-white/10">
                <div>
                  <p className="font-clash text-2xl md:text-3xl font-bold text-accent-blue">{settings.yearsExperience}</p>
                  <p className="text-text-muted dark:text-white/40 text-xs font-satoshi mt-1">Experience</p>
                </div>
                <div>
                  <p className="font-clash text-2xl md:text-3xl font-bold text-accent-purple">{settings.productsShipped}</p>
                  <p className="text-text-muted dark:text-white/40 text-xs font-satoshi mt-1">Products Shipped</p>
                </div>
                <div>
                  <p className="font-clash text-2xl md:text-3xl font-bold text-accent-orange">{settings.usersImpacted}</p>
                  <p className="text-text-muted dark:text-white/40 text-xs font-satoshi mt-1">Users Impacted</p>
                </div>
              </div>
            </div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Avatar frame */}
              <div className="relative h-[480px] rounded-4xl overflow-hidden border border-border dark:border-white/10 bg-white dark:bg-dark-card shadow-card">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 via-accent-purple/10 to-accent-orange/10 rounded-4xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-40 h-40 rounded-full bg-gradient-accent mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <span className="font-clash text-6xl font-bold text-white">{initials}</span>
                    </div>
                    <p className="text-text-muted dark:text-white/40 font-satoshi text-sm">{settings.heroName} — {settings.heroTitle}</p>
                  </div>
                </div>
                {/* Floating badges */}
                <div className="absolute top-6 right-6 bg-white/80 dark:bg-dark-card/80 border border-border dark:border-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm">
                  <p className="text-text-primary dark:text-white text-xs font-satoshi font-semibold flex items-center gap-1.5">
                    <Trophy size={13} className="text-amber-500" />
                    <span>{settings.productsShipped} Shipped</span>
                  </p>
                </div>
                <div className="absolute bottom-6 left-6 bg-white/80 dark:bg-dark-card/80 border border-border dark:border-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm">
                  <p className="text-text-primary dark:text-white text-xs font-satoshi font-semibold flex items-center gap-1.5">
                    <MapPin size={13} className="text-accent-blue" />
                    <span>Remote / Global</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="section-padding bg-bg dark:bg-dark">
        <div className="container-custom">
          <span className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4">Principles</span>
          <h2 className="font-clash text-headline font-bold text-text-primary dark:text-white mb-14">What I believe.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { n: "01", title: "Design is a team sport.", desc: "The best products come from radically collaborative teams. I work with PMs, engineers, and data to ship." },
              { n: "02", title: "Research is non-negotiable.", desc: "I've never shipped a feature I couldn't defend with user data. Opinions are hypotheses until tested." },
              { n: "03", title: "Clarity over cleverness.", desc: "A clever design that confuses people is a failed design. Clarity wins, every time." },
              { n: "04", title: "Systems scale, screens don't.", desc: "I design components and tokens, not just screens. Everything I make should be able to grow." },
            ].map((p, i) => (
              <motion.div
                key={p.n}
                className="p-8 rounded-3xl border border-border dark:border-white/10 bg-white dark:bg-dark-card hover:border-accent-blue/40 transition-colors shadow-sm"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <span className="font-clash text-5xl font-bold text-black/10 dark:text-white/10 block mb-4">{p.n}</span>
                <h3 className="font-clash text-xl font-bold text-text-primary dark:text-white mb-3">{p.title}</h3>
                <p className="text-text-secondary dark:text-white/50 font-satoshi text-body leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="section-padding">
        <div className="container-custom">
          <span className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4">Education</span>
          <h2 className="font-clash text-headline font-bold text-text-primary dark:text-white mb-10">Where I learned.</h2>
          <div className="space-y-4">
            {educationList.map((edu, i) => (
              <motion.div
                key={edu.institution || i}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-border dark:border-white/10 bg-white dark:bg-dark-card shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div>
                  <h3 className="font-satoshi font-bold text-text-primary dark:text-white">{edu.institution}</h3>
                  <p className="text-text-muted dark:text-white/50 text-sm font-satoshi">{edu.degree}</p>
                </div>
                <div className="mt-2 md:mt-0 text-right">
                  <p className="text-accent-blue text-sm font-satoshi font-semibold">{edu.period}</p>
                  {edu.highlight && <p className="text-text-muted text-xs font-satoshi">{edu.highlight}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
