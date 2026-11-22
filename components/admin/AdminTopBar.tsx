"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Search,
  Moon,
  Sun,
  KeyRound,
  Sliders,
  LogOut,
  ExternalLink,
  ChevronDown,
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  BookOpen,
  Wrench,
  Images,
  MessageSquare
} from "lucide-react";

interface SearchResult {
  title: string;
  category: string;
  href: string;
  icon: any;
}

export default function AdminTopBar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [adminName, setAdminName] = useState<string>("Nitish Tao");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.heroImage) setProfilePhoto(data.settings.heroImage);
          if (data.settings.heroName) setAdminName(data.settings.heroName);
        }
      })
      .catch(() => {});

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("admin-global-search");
        if (input) input.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (newPassword.length < 4) {
      setPasswordMsg({ type: "error", text: "Password must be at least 4 characters" });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPasswordMsg({ type: "success", text: "Password updated successfully!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setPasswordModalOpen(false);
          setPasswordMsg(null);
        }, 1500);
      } else {
        setPasswordMsg({ type: "error", text: data.error || "Failed to update password" });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Network error occurred" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const quickLinks: SearchResult[] = [
    { title: "My Design Projects", category: "CMS", href: "/admin/projects", icon: FolderKanban },
    { title: "Case Studies Breakdown", category: "CMS", href: "/admin/case-studies", icon: BookOpen },
    { title: "Page Slider & Gallery", category: "CMS", href: "/admin/sliders", icon: Images },
    { title: "Skills & Tools", category: "CMS", href: "/admin/skills", icon: Wrench },
    { title: "Messages Inbox", category: "System", href: "/admin/messages", icon: MessageSquare },
    { title: "Site Controls & Hero Settings", category: "Settings", href: "/admin/settings", icon: Sliders },
  ];

  const searchResults = searchQuery.trim()
    ? quickLinks.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="h-16 border-b border-border dark:border-dark-border bg-white/95 dark:bg-dark-card/95 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between transition-colors duration-300">
        {/* Left: Search input */}
        <div ref={searchRef} className="relative w-72 md:w-96">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-text-muted dark:text-white/40 pointer-events-none" />
            <input
              id="admin-global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Quick search admin sections..."
              className="w-full pl-9 pr-12 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-lg text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-accent-blue transition-all"
            />
            <kbd className="absolute right-2.5 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-text-muted dark:text-white/40 bg-white dark:bg-dark border border-border dark:border-dark-border rounded">
              ⌘K
            </kbd>
          </div>

          {/* Search Dropdown Results */}
          {searchFocused && (searchQuery.trim().length > 0 || searchResults.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-xl p-2 z-50">
              <div className="text-[10px] uppercase font-satoshi font-semibold tracking-wider text-text-muted dark:text-white/40 px-2 py-1">
                {searchResults.length > 0 ? "Jump To" : "No matches found"}
              </div>
              <div className="space-y-1 mt-1">
                {searchResults.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setSearchFocused(false);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-satoshi text-text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon size={14} className="text-accent-blue" />
                      <span>{item.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-text-muted dark:text-white/40">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* View Website Button */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-satoshi font-medium text-text-secondary dark:text-white/70 hover:text-text-primary dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors border border-border dark:border-dark-border"
          >
            <span>Live Site</span>
            <ExternalLink size={12} />
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-text-secondary dark:text-white/70 hover:text-text-primary dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
              title="Toggle Light / Dark mode"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          )}

          {/* Profile Dropdown Toolbar */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg border border-border dark:border-dark-border bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <div className="w-6 h-6 rounded-md overflow-hidden bg-accent-blue text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                {profilePhoto && profilePhoto !== "/hero-portrait.png" ? (
                  <img src={profilePhoto} alt={adminName} className="w-full h-full object-cover" />
                ) : (
                  adminName.slice(0, 2).toUpperCase()
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-satoshi font-semibold text-text-primary dark:text-white leading-none">Admin</p>
              </div>
              <ChevronDown size={12} className="text-text-muted dark:text-white/50" />
            </button>

            {/* Profile Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-xl py-1.5 z-50 text-left">
                {/* Header User info */}
                <div className="px-3.5 py-2.5 border-b border-border dark:border-dark-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-accent-blue text-white flex items-center justify-center font-bold text-sm shrink-0 border border-border dark:border-dark-border">
                    {profilePhoto && profilePhoto !== "/hero-portrait.png" ? (
                      <img src={profilePhoto} alt={adminName} className="w-full h-full object-cover" />
                    ) : (
                      adminName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary dark:text-white font-satoshi truncate">{adminName}</p>
                    <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi truncate">admin@portfolio.com</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                      <span className="text-[10px] font-mono text-accent-green font-medium">Super Admin</span>
                    </div>
                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="py-1">
                  <Link
                    href="/admin/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-satoshi text-text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <Sliders size={14} className="text-text-muted dark:text-white/60" />
                    <span>Admin Settings</span>
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setPasswordMsg(null);
                      setPasswordModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-satoshi text-text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"
                  >
                    <KeyRound size={14} className="text-text-muted dark:text-white/60" />
                    <span>Change Password</span>
                  </button>

                  <div className="flex items-center justify-between px-3.5 py-2 text-xs font-satoshi text-text-muted dark:text-white/50">
                    <div className="flex items-center gap-2.5">
                      <Database size={14} />
                      <span>SQLite Engine</span>
                    </div>
                    <span className="text-[10px] font-mono text-accent-green">Connected</span>
                  </div>
                </div>

                {/* Footer Sign out */}
                <div className="pt-1 border-t border-border dark:border-dark-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-satoshi text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut size={14} />
                    <span>Sign Out Admin</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg p-6 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-accent-blue/10 text-accent-blue flex items-center justify-center">
                  <KeyRound size={15} />
                </div>
                <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white">Change Admin Password</h3>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {passwordMsg && (
              <div
                className={`mb-4 p-2.5 rounded-md text-xs font-satoshi flex items-center gap-2 ${
                  passwordMsg.type === "success"
                    ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                {passwordMsg.type === "success" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-satoshi uppercase text-text-muted dark:text-white/50 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase text-text-muted dark:text-white/50 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase text-text-muted dark:text-white/50 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-border dark:border-dark-border text-xs font-satoshi text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

