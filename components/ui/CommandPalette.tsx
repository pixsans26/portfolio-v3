"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, ArrowRight, User, FolderOpen, BookOpen, Mail, Zap } from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <>
      {/* Floating Keyboard Trigger Guide on the bottom-right */}
      <div className="fixed bottom-6 left-6 z-[90] hidden md:block">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 text-xs font-satoshi font-semibold text-text-muted hover:text-text-primary dark:text-white/40 dark:hover:text-white bg-white/70 dark:bg-dark-card/75 border border-border dark:border-dark-border rounded-xl shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md cursor-none"
        >
          <Search size={12} />
          <span>Search</span>
          <kbd className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">⌘</kbd>
          <kbd className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-[10px]">K</kbd>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <div className="command-wrapper" onClick={() => setOpen(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-2xl p-4 mx-4 cursor-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Command label="Global Command Menu">
                <div className="flex items-center border-b border-border dark:border-dark-border pb-3 mb-4 px-2">
                  <Search size={18} className="text-text-muted dark:text-white/30 mr-3" />
                  <Command.Input
                    placeholder="Search designs, case studies, pages..."
                    className="w-full text-sm font-satoshi bg-transparent border-0 outline-none text-text-primary dark:text-white placeholder-text-muted dark:placeholder-white/30"
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="text-xs font-satoshi text-text-muted dark:text-white/40 px-2 py-1 rounded bg-black/5 dark:bg-white/10"
                  >
                    ESC
                  </button>
                </div>

                <Command.List className="max-h-[350px] overflow-y-auto space-y-4 px-2">
                  <Command.Empty className="text-center py-6 text-sm text-text-muted dark:text-white/40">
                    No results found.
                  </Command.Empty>

                  {/* Quick actions */}
                  <Command.Group heading="Quick Access" className="text-xs font-satoshi text-text-muted dark:text-white/30 tracking-wider uppercase mb-2 block">
                    <div className="space-y-1 mt-1">
                      <Command.Item
                        value="cv resume download pdf curriculum vitae"
                        onSelect={() => runCommand(() => router.push("/cv"))}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Zap size={15} className="text-accent-green" />
                          <span className="text-sm font-satoshi font-medium text-text-primary dark:text-white">View & Download CV (PDF)</span>
                        </div>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Command.Item>

                      <Command.Item
                        value="contact send email hire request"
                        onSelect={() => runCommand(() => router.push("/contact"))}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Mail size={15} className="text-accent-blue" />
                          <span className="text-sm font-satoshi font-medium text-text-primary dark:text-white">Start a Conversation</span>
                        </div>
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Command.Item>
                    </div>
                  </Command.Group>

                  {/* Pages */}
                  <Command.Group heading="Navigation" className="text-xs font-satoshi text-text-muted dark:text-white/30 tracking-wider uppercase mb-2 block">
                    <div className="space-y-1 mt-1">
                      {[
                        { label: "My Design Projects", href: "/my-design", icon: FolderOpen },
                        { label: "Case Studies", href: "/case-studies", icon: BookOpen },
                        { label: "About Story & Principles", href: "/about", icon: User },
                        { label: "Visual Gallery Archive", href: "/gallery", icon: BookOpen },
                      ].map((item) => (
                        <Command.Item
                          key={item.href}
                          value={item.label.toLowerCase()}
                          onSelect={() => runCommand(() => router.push(item.href))}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={15} className="text-text-muted dark:text-white/50" />
                            <span className="text-sm font-satoshi font-medium text-text-primary dark:text-white">{item.label}</span>
                          </div>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Command.Item>
                      ))}
                    </div>
                  </Command.Group>

                  {/* Case studies */}
                  <Command.Group heading="Featured Case Studies" className="text-xs font-satoshi text-text-muted dark:text-white/30 tracking-wider uppercase mb-2 block">
                    <div className="space-y-1 mt-1">
                      {[
                        { label: "Razorpay Dashboard Redesign", href: "/work/fintech-redesign", desc: "Reducing cognitive load for merchants" },
                        { label: "Swiggy Checkout Overhaul", href: "/work/swiggy-checkout", desc: "2.4% conversion lift on a 50M+ platform" },
                        { label: "CRED Design System 2.0", href: "/work/cred-design-system", desc: "Scaling component token structures" },
                        { label: "Jira Mobile for Managers", href: "/work/atlassian-jira-mobile", desc: "On-the-go project tracking" },
                      ].map((item) => (
                        <Command.Item
                          key={item.href}
                          value={item.label.toLowerCase() + " " + item.desc.toLowerCase()}
                          onSelect={() => runCommand(() => router.push(item.href))}
                          className="flex items-start justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-none group"
                        >
                          <div>
                            <span className="text-sm font-satoshi font-semibold text-text-primary dark:text-white block mb-0.5 group-hover:text-accent-blue transition-colors">
                              {item.label}
                            </span>
                            <span className="text-xs font-satoshi text-text-muted dark:text-white/40">
                              {item.desc}
                            </span>
                          </div>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                        </Command.Item>
                      ))}
                    </div>
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
