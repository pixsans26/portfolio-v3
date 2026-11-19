"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Share2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Search,
  Filter,
  Mail,
  Link as LinkIcon,
  Globe,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface SocialItem {
  id: string;
  platform: string;
  url: string;
  icon: string;
  active: boolean;
  order: number;
}

const BrandIcon = ({ platform }: { platform: string }) => {
  const p = platform.toLowerCase();
  if (p.includes("linkedin")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#0A66C2]">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
      </svg>
    );
  }
  if (p.includes("twitter") || p.includes(" x")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-text-primary dark:text-white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (p.includes("github")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-text-primary dark:text-white">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    );
  }
  if (p.includes("dribbble")) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#EA4C89]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.26-.05-.98-.17-1.96-.17-1.12 0-2.39.18-3.69.51-.12-.27-.25-.54-.38-.81a17.22 17.22 0 0 0-.41-.83c2.47-1.39 4.09-3.32 4.51-4.014zM12 3.52c1.82 0 3.5.58 4.88 1.57-.36.63-1.84 2.45-4.22 3.81-1.36-2.52-2.73-4.63-3.03-5.08A8.448 8.448 0 0 1 12 3.52zM7.55 4.41c.29.43 1.63 2.5 3 4.98-2.67.79-5.26.8-6.12.8-.24 0-.45-.01-.63-.02A8.497 8.497 0 0 1 7.55 4.41zM3.52 12v-.3c.27.01.55.02.83.02 1.07 0 3.99-.04 6.84-.94.13.26.25.53.37.8-.37 1.04-.84 2.22-1.38 3.42-3.13-1.02-5.59-1.06-6.66-1.06v-1.94zm1.48 4.23c.99 0 3.19.04 6.13.98-.67 1.58-1.36 3.01-1.78 3.83A8.47 8.47 0 0 1 5 16.23zm6.31 4.19c.4-.78 1.06-2.15 1.71-3.67 1.25-.32 2.51-.49 3.65-.49.88 0 1.55.1 1.83.15a8.492 8.492 0 0 1-7.19 4.01zm8.21-1.98c-.2-.05-.79-.17-1.63-.17-1.04 0-2.21.16-3.39.46.5-1.12.95-2.23 1.3-3.23 1.15-.3 2.27-.45 3.27-.45.89 0 1.55.12 1.83.17a8.49 8.49 0 0 1-1.38 3.22z"/>
      </svg>
    );
  }
  if (p.includes("mail") || p.includes("email")) {
    return <Mail size={18} className="text-accent-blue" />;
  }
  return <Globe size={18} className="text-accent-blue" />;
};

export default function AdminSocialsPage() {
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters, Search, Sort & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"order" | "platform">("order");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeItem, setActiveItem] = useState<SocialItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const initialForm = {
    platform: "",
    url: "",
    icon: "Linkedin",
    active: true,
    order: 1,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchSocials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/socials");
      const data = await res.json();
      if (data.success) {
        setSocials(data.socials);
      }
    } catch {
      toast.error("Failed to load social links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  // Filtered & Sorted
  const filteredSocials = useMemo(() => {
    return socials
      .filter((s) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || s.platform.toLowerCase().includes(q) || s.url.toLowerCase().includes(q);
        if (!matchesSearch) return false;
        if (statusFilter === "active") return s.active;
        if (statusFilter === "inactive") return !s.active;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "order") return (a.order || 0) - (b.order || 0);
        if (sortBy === "platform") return a.platform.localeCompare(b.platform);
        return 0;
      });
  }, [socials, searchQuery, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredSocials.length / pageSize) || 1;
  const paginatedSocials = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSocials.slice(start, start + pageSize);
  }, [filteredSocials, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  const handleOpenCreate = () => {
    setActiveItem(null);
    setFormData({
      ...initialForm,
      order: socials.length + 1,
    });
    setModalMode("create");
  };

  const handleOpenEdit = (item: SocialItem) => {
    setActiveItem(item);
    setFormData({
      platform: item.platform,
      url: item.url,
      icon: item.icon,
      active: item.active,
      order: item.order,
    });
    setModalMode("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      id: activeItem?.id,
    };

    try {
      const res = await fetch("/api/admin/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === "create" ? "Social link added!" : "Social link updated!");
        setModalMode(null);
        fetchSocials();
      } else {
        toast.error(data.error || "Failed to save link");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/socials?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Social link deleted");
        setDeleteConfirmId(null);
        fetchSocials();
      } else {
        toast.error(data.error || "Failed to delete link");
      }
    } catch {
      toast.error("Network error while deleting");
    }
  };

  const handleToggleActive = async (item: SocialItem) => {
    try {
      const res = await fetch("/api/admin/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          active: !item.active,
          platform: item.platform,
          url: item.url,
          icon: item.icon,
          order: item.order,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSocials((prev) =>
          prev.map((s) => (s.id === item.id ? { ...s, active: !s.active } : s))
        );
        toast.success(item.active ? "Link hidden from site" : "Link activated live!");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border dark:border-dark-border">
        <div>
          <h1 className="font-clash text-xl md:text-2xl font-bold text-text-primary dark:text-white">
            Social Links CMS
          </h1>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Manage links and external profiles rendered live across Navbar, Footer & Contact page.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Social Link</span>
        </button>
      </header>

      {/* Toolbar: Search & Sort */}
      <div className="p-3 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search platform or link URL..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs font-satoshi">
            <span className="text-text-muted dark:text-white/40 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs text-text-primary dark:text-white font-satoshi focus:outline-none focus:ring-1 focus:ring-accent-blue"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive / Hidden</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 text-xs font-satoshi">
            <span className="text-text-muted dark:text-white/40 text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs text-text-primary dark:text-white font-satoshi focus:outline-none focus:ring-1 focus:ring-accent-blue"
            >
              <option value="order">Display Order</option>
              <option value="platform">Platform (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CARD GRID VIEW */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading social links...</p>
        </div>
      ) : filteredSocials.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border dark:border-dark-border rounded-lg p-8">
          <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-3">
            No social links found.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold"
          >
            Add First Social Link
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedSocials.map((s) => (
            <div
              key={s.id}
              className="group p-4 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm hover:border-accent-blue/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-md bg-black/5 dark:bg-white/5 border border-border/50 dark:border-dark-border flex items-center justify-center">
                    <BrandIcon platform={s.platform} />
                  </div>

                  <button
                    onClick={() => handleToggleActive(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-satoshi flex items-center gap-1 transition-colors ${
                      s.active
                        ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
                        : "bg-black/5 dark:bg-white/5 text-text-muted dark:text-white/40 border border-border dark:border-dark-border"
                    }`}
                    title="Click to toggle active"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.active ? "bg-accent-green" : "bg-gray-400"}`} />
                    {s.active ? "Active" : "Hidden"}
                  </button>
                </div>

                {/* Title & URL */}
                <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white mb-1">
                  {s.platform}
                </h3>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-satoshi text-text-muted dark:text-white/50 hover:text-accent-blue hover:underline truncate block"
                >
                  {s.url}
                </a>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-border dark:border-dark-border flex items-center justify-between mt-4">
                <span className="text-[10px] font-mono text-text-muted dark:text-white/40">
                  Order: #{s.order}
                </span>

                <div className="flex items-center gap-1">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    title="Open URL"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                    title="Edit link"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(s.id)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete link"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {filteredSocials.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border dark:border-dark-border text-xs font-satoshi text-text-muted dark:text-white/50">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredSocials.length)} of {filteredSocials.length} links
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-border dark:border-dark-border hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-md text-xs font-mono font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-accent-blue text-white"
                    : "border border-border dark:border-dark-border hover:bg-black/5 dark:hover:bg-white/5 text-text-primary dark:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-border dark:border-dark-border hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* CREATE & EDIT MODAL (Full CRUD) */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border mb-4">
              <div>
                <h2 className="font-clash text-lg font-bold text-text-primary dark:text-white">
                  {modalMode === "create" ? "Add Social Link" : "Edit Social Link"}
                </h2>
                <p className="text-xs text-text-muted dark:text-white/50 font-satoshi">
                  Platform name, profile URL, and display order.
                </p>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="e.g. LinkedIn, Twitter / X, GitHub, Dribbble"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Profile or Action URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://linkedin.com/in/... or mailto:..."
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-satoshi text-text-primary dark:text-white">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-border dark:border-dark-border text-accent-blue focus:ring-accent-blue w-4 h-4"
                    />
                    <span>Active Live</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-md border border-border dark:border-dark-border text-xs font-satoshi text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : modalMode === "create" ? "Add Link" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg p-5 shadow-2xl text-left">
            <div className="flex items-center gap-2.5 text-red-500 mb-3">
              <AlertTriangle size={18} />
              <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white">Delete Social Link</h3>
            </div>
            <p className="text-xs font-satoshi text-text-muted dark:text-white/60 mb-5 leading-relaxed">
              Are you sure you want to remove this social link from the live website?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-md border border-border dark:border-dark-border text-xs font-satoshi text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-md bg-red-500 text-white text-xs font-satoshi font-semibold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
