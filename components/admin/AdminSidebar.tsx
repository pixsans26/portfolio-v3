"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Briefcase,
  Wrench,
  MessageSquare,
  Share2,
  Sliders,
  Database,
  ArrowLeft,
  LogOut,
  Images,
  SlidersHorizontal,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminPhoto, setAdminPhoto] = useState<string>("/hero-portrait.png");
  const [adminName, setAdminName] = useState<string>("Nitish Tao");

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.unreadCount === "number") {
          setUnreadCount(data.unreadCount);
        }
      })
      .catch(() => {});

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.heroImage) setAdminPhoto(data.settings.heroImage);
          if (data.settings.heroName) setAdminName(data.settings.heroName);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const links = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "My Design Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Case Studies", href: "/admin/case-studies", icon: BookOpen },
    { label: "Hero Sliders", href: "/admin/sliders", icon: SlidersHorizontal },
    { label: "Visual Gallery", href: "/admin/gallery", icon: Images },
    { label: "Work Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Skills & Tools", href: "/admin/skills", icon: Wrench },
    { label: "Social Links", href: "/admin/socials", icon: Share2 },
    { label: "Messages Inbox", href: "/admin/messages", icon: MessageSquare, badge: unreadCount },
    { label: "Site & Hero Controls", href: "/admin/settings", icon: Sliders },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 shrink-0 bg-white dark:bg-dark-card border-r border-border dark:border-dark-border flex flex-col justify-between text-left transition-colors duration-300 select-none z-30">
      {/* Top Header & Navigation (Scrollable internally if screen is tiny) */}
      <div className="p-4 overflow-y-auto flex-1">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 mb-6 pt-2">
          <div className="w-8 h-8 rounded-md overflow-hidden bg-accent-blue text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 border border-border dark:border-dark-border">
            {adminPhoto ? (
              <img src={adminPhoto} alt={adminName} className="w-full h-full object-cover" />
            ) : (
              <Database size={16} />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-text-primary dark:text-white text-xs leading-tight truncate">{adminName}</h2>
            <p className="text-[10px] text-text-muted dark:text-white/40 truncate">Portfolio Admin v2.0</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-wider font-satoshi font-semibold text-text-muted dark:text-white/40 px-3 block mb-2">
            Management
          </span>
          <nav className="space-y-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-satoshi font-medium transition-colors ${
                    active
                      ? "bg-accent-blue text-white shadow-sm"
                      : "text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-primary dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <link.icon size={15} className={active ? "text-white" : "text-text-muted dark:text-white/50"} />
                    <span>{link.label}</span>
                  </div>
                  {Boolean(link.badge) && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-orange text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer controls: Back to live website + Sign out */}
      <div className="p-4 border-t border-border dark:border-dark-border bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-satoshi text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Live Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-satoshi text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
        >
          <LogOut size={13} />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
}
