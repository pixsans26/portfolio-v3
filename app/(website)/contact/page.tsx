"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Briefcase, Palette, Code, Globe, ArrowRight } from "lucide-react";

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p.includes("mail") || p.includes("email")) return <Mail size={18} />;
  if (p.includes("link") || p.includes("job") || p.includes("work")) return <Briefcase size={18} />;
  if (p.includes("drib") || p.includes("design") || p.includes("behance") || p.includes("figma")) return <Palette size={18} />;
  if (p.includes("git") || p.includes("code") || p.includes("dev")) return <Code size={18} />;
  return <Globe size={18} />;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", type: "Full-time role", message: "" });
  const [sending, setSending] = useState(false);
  const [socials, setSocials] = useState<Array<{ platform: string; url: string }>>([
    { platform: "Email", url: "mailto:admin@portfolio.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "Dribbble", url: "https://dribbble.com" },
  ]);

  useEffect(() => {
    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.socials && data.socials.length > 0) {
          setSocials(data.socials);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent! I'll get back to you within 24 hours.");
        setForm({ name: "", email: "", company: "", type: "Full-time role", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      toast.error("Something went wrong. Please email me directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-dark text-text-primary dark:text-white pt-32 pb-24 transition-colors duration-300">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div className="text-left">
            <motion.span
              className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-[0.2em] block mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Get in touch
            </motion.span>
            <motion.h1
              className="font-clash text-display font-bold text-text-primary dark:text-white mb-8 leading-none"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s talk.
            </motion.h1>
            <motion.p
              className="text-text-secondary dark:text-white/60 font-satoshi text-body-lg leading-relaxed mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Whether you&apos;re hiring, collaborating on a project, or just want to
              talk design — I&apos;d love to hear from you.
            </motion.p>

            {/* Dynamic Contact details from CMS */}
            <div className="space-y-6">
              {socials.map((c) => (
                <motion.a
                  key={c.platform}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-text-primary dark:text-white group-hover:bg-accent-blue group-hover:text-white transition-colors border border-border dark:border-white/10">
                    {getPlatformIcon(c.platform)}
                  </span>
                  <div>
                    <p className="text-text-muted dark:text-white/40 text-xs font-satoshi uppercase tracking-wider">{c.platform}</p>
                    <p className="text-text-primary dark:text-white font-satoshi font-medium text-sm group-hover:text-accent-blue transition-colors truncate max-w-xs">{c.url}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Availability */}
            <div className="mt-12 p-6 rounded-3xl border border-border dark:border-white/10 bg-white/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                <span className="text-accent-green text-sm font-satoshi font-semibold">Available</span>
              </div>
              <p className="text-text-secondary dark:text-white/60 font-satoshi text-sm leading-relaxed">
                Open to Senior Product Designer and Design Systems Lead roles. Currently based in India, 
                open to remote and hybrid opportunities globally.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-left"
          >
            <form
              onSubmit={handleSubmit}
              className="p-8 md:p-10 rounded-4xl bg-white dark:bg-[#12131A] border border-border dark:border-white/10 shadow-card space-y-6"
            >
              <div>
                <h2 className="font-clash text-2xl font-bold text-text-primary dark:text-white mb-2">Send a message</h2>
                <p className="text-text-muted dark:text-white/40 text-sm font-satoshi">I respond within 24 hours.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-text-primary dark:text-white/80 text-xs font-satoshi font-semibold uppercase tracking-wider block mb-2">
                    Name *
                  </label>
                  <input
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-satoshi bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="text-text-primary dark:text-white/80 text-xs font-satoshi font-semibold uppercase tracking-wider block mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-satoshi bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-text-primary dark:text-white/80 text-xs font-satoshi font-semibold uppercase tracking-wider block mb-2">
                  Company
                </label>
                <input
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-satoshi bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Your company"
                />
              </div>

              <div>
                <label className="text-text-primary dark:text-white/80 text-xs font-satoshi font-semibold uppercase tracking-wider block mb-2">
                  Type of enquiry
                </label>
                <select
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-satoshi bg-slate-50 dark:bg-[#1A1C24] border border-slate-200 dark:border-white/15 text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all cursor-pointer"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {["Full-time role", "Freelance project", "Collaboration", "Speaking opportunity", "Other"].map((t) => (
                    <option key={t} value={t} className="bg-white dark:bg-dark text-text-primary dark:text-white">{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-text-primary dark:text-white/80 text-xs font-satoshi font-semibold uppercase tracking-wider block mb-2">
                  Message *
                </label>
                <textarea
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-satoshi bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue transition-all resize-none"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about the opportunity or project..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={sending}
                className="w-full py-4 rounded-xl bg-accent-blue text-white font-satoshi font-bold text-base hover:opacity-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-accent-blue/20 cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span>{sending ? "Sending..." : "Send message"}</span>
                {!sending && <ArrowRight size={16} />}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
