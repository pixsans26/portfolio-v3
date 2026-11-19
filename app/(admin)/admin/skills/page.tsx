"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Wrench,
  Plus,
  Upload,
  Link as LinkIcon,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Palette,
  Zap,
  Smartphone,
  Globe,
  Film,
  Mic,
  FlaskConical,
  GitCompare,
  Map,
  BarChart3,
  ClipboardList,
  Coins,
  Boxes,
  FileText,
  BookOpen,
  Layers,
  Ruler,
  Code,
  FileCode,
  Component,
  GitBranch,
  Star,
} from "lucide-react";
import { toast } from "sonner";

interface SkillItem {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  order: number;
  showInHero?: boolean;
}

const lucideIconMap: Record<string, any> = {
  Palette,
  Zap,
  Smartphone,
  Globe,
  Film,
  Mic,
  FlaskConical,
  GitCompare,
  Map,
  BarChart3,
  ClipboardList,
  Coins,
  Boxes,
  FileText,
  BookOpen,
  Layers,
  Ruler,
  Code,
  FileCode,
  Component,
  GitBranch,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"order" | "level" | "name">("order");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Modals state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const initialForm = {
    name: "",
    level: 85,
    category: "design",
    icon: "Palette",
    order: 1,
    showInHero: false,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (data.success) {
        setSkills(data.skills);
      }
    } catch {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Filtered & Sorted
  const filteredSkills = useMemo(() => {
    return skills
      .filter((s) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
        if (!matchesSearch) return false;
        if (categoryFilter !== "all" && s.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "order") return (a.order || 0) - (b.order || 0);
        if (sortBy === "level") return b.level - a.level;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [skills, searchQuery, categoryFilter, sortBy]);

  const totalPages = Math.ceil(filteredSkills.length / pageSize) || 1;
  const paginatedSkills = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSkills.slice(start, start + pageSize);
  }, [filteredSkills, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, sortBy]);

  const handleOpenCreate = () => {
    setActiveSkill(null);
    setFormData({
      ...initialForm,
      order: skills.length + 1,
      showInHero: false,
    });
    setModalMode("create");
  };

  const handleOpenEdit = (skill: SkillItem) => {
    setActiveSkill(skill);
    setFormData({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      icon: skill.icon,
      order: skill.order,
      showInHero: Boolean(skill.showInHero),
    });
    setModalMode("edit");
  };

  const handleToggleHero = async (skill: SkillItem) => {
    const nextVal = !skill.showInHero;
    try {
      const res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: skill.id, showInHero: nextVal }),
      });
      const data = await res.json();
      if (data.success) {
        setSkills((prev) =>
          prev.map((s) => (s.id === skill.id ? { ...s, showInHero: nextVal } : s))
        );
        toast.success(nextVal ? `Added "${skill.name}" to Hero Tools` : `Removed "${skill.name}" from Hero Tools`);
      } else {
        toast.error("Failed to update skill");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, icon: data.url }));
        toast.success("Skill logo uploaded successfully!");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      id: activeSkill?.id,
    };

    try {
      const res = await fetch("/api/admin/skills", {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === "create" ? "Skill added!" : "Skill updated!");
        setModalMode(null);
        fetchSkills();
      } else {
        toast.error(data.error || "Failed to save skill");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/skills?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Skill removed successfully");
        setDeleteConfirmId(null);
        fetchSkills();
      } else {
        toast.error(data.error || "Failed to delete skill");
      }
    } catch {
      toast.error("Network error while deleting");
    }
  };

  const renderIconPreview = (iconString: string, size = 28) => {
    if (iconString && (iconString.startsWith("/") || iconString.startsWith("http"))) {
      return (
        <div className="relative w-8 h-8 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <Image src={iconString} alt="Icon" fill className="object-contain p-1" />
        </div>
      );
    }
    const IconComp = lucideIconMap[iconString] || Wrench;
    return <IconComp size={size} className="text-accent-blue" />;
  };

  const categories = ["all", "design", "research", "systems", "code"];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border dark:border-dark-border">
        <div>
          <h1 className="font-clash text-xl md:text-2xl font-bold text-text-primary dark:text-white">
            Skills & Tools CMS
          </h1>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Card Grid view with uploaded logos, full CRUD (create, update, delete), category grouping & proficiency levels.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Skill / Tool</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="p-3 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <div className="flex items-center gap-1 text-xs font-satoshi">
            <span className="text-text-muted dark:text-white/40 text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs text-text-primary dark:text-white font-satoshi focus:outline-none focus:ring-1 focus:ring-accent-blue capitalize"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
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
              <option value="order">Custom Order</option>
              <option value="level">Proficiency % (High to Low)</option>
              <option value="name">Name (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CARD GRID VIEW WITH BIG LOGOS */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading skills from SQLite...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border dark:border-dark-border rounded-lg p-8">
          <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-3">
            No skills found matching your filter.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedSkills.map((s) => (
            <div
              key={s.id}
              className="group p-4 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm hover:border-accent-blue/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top row: Logo and category badge & Hero Toggle */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-md bg-black/5 dark:bg-white/5 flex items-center justify-center p-1.5 border border-border/50 dark:border-dark-border group-hover:scale-105 transition-transform">
                    {renderIconPreview(s.icon)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleHero(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-satoshi font-semibold flex items-center gap-1 transition-colors ${
                        s.showInHero
                          ? "bg-accent-blue text-white shadow-sm"
                          : "bg-black/5 dark:bg-white/5 text-text-muted hover:text-text-primary dark:text-white/40 border border-border/50"
                      }`}
                      title={s.showInHero ? "Hero Tool (Click to remove from Hero)" : "Click to show in Hero section"}
                    >
                      <Star size={10} />
                      {s.showInHero ? "In Hero" : "+ Hero"}
                    </button>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono capitalize bg-black/5 dark:bg-white/5 text-text-muted dark:text-white/50 border border-border/50 dark:border-dark-border">
                      {s.category}
                    </span>
                  </div>
                </div>

                {/* Skill Name */}
                <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white mb-2">
                  {s.name}
                </h3>

                {/* Proficiency progress bar */}
                <div className="space-y-1 mb-2">
                  <div className="flex items-center justify-between text-[11px] font-satoshi text-text-muted dark:text-white/50">
                    <span>Proficiency</span>
                    <span className="font-mono font-semibold text-accent-blue">{s.level}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-accent-blue rounded-full transition-all duration-500"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-border dark:border-dark-border flex items-center justify-between mt-2">
                <span className="text-[10px] font-mono text-text-muted dark:text-white/40">
                  Order: #{s.order}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                    title="Edit skill"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(s.id)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete skill"
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
      {filteredSkills.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border dark:border-dark-border text-xs font-satoshi text-text-muted dark:text-white/50">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredSkills.length)} of {filteredSkills.length} skills
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

      {/* CREATE & EDIT MODAL (Upload Skill with Logo) */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border mb-4">
              <div>
                <h2 className="font-clash text-lg font-bold text-text-primary dark:text-white">
                  {modalMode === "create" ? "Add New Skill / Tool" : "Edit Skill / Tool"}
                </h2>
                <p className="text-xs text-text-muted dark:text-white/50 font-satoshi">
                  Upload brand logo or enter icon name to render on the live website.
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
              {/* Skill Name */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Skill / Tool Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Figma, Framer, User Testing, React"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              {/* Logo / Icon Upload Section */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Skill Logo / Icon *
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border flex items-center justify-center shrink-0">
                    {renderIconPreview(formData.icon, 24)}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/5 dark:bg-white/10 text-text-primary dark:text-white text-xs font-satoshi font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                      <Upload size={13} /> Upload Logo File (PNG/SVG)
                      <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </label>
                    {uploading && <span className="text-xs font-satoshi text-accent-blue ml-2">Uploading logo...</span>}
                    <div className="flex items-center gap-1.5">
                      <LinkIcon size={12} className="text-text-muted dark:text-white/40 shrink-0" />
                      <input
                        type="text"
                        required
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="Image URL or Lucide Icon (Palette, Zap, Code...)"
                        className="w-full px-2 py-1 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category & Proficiency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  >
                    <option value="design">Design</option>
                    <option value="research">Research</option>
                    <option value="systems">Systems</option>
                    <option value="code">Code</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Proficiency % ({formData.level}%)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full accent-accent-blue mt-2"
                  />
                </div>
              </div>

              {/* Display Order */}
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

              {/* Show in Hero Top Tools */}
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-border dark:border-dark-border bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.showInHero}
                  onChange={(e) => setFormData({ ...formData, showInHero: e.target.checked })}
                  className="rounded text-accent-blue focus:ring-accent-blue w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-satoshi font-semibold text-text-primary dark:text-white block">
                    Show in Hero Section (Top Tools)
                  </span>
                  <span className="text-[11px] font-satoshi text-text-muted dark:text-white/50 block">
                    Mark to feature this tool in the hero stats/tools section.
                  </span>
                </div>
              </label>

              {/* Actions */}
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
                  {saving ? "Saving..." : modalMode === "create" ? "Add Skill" : "Save Changes"}
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
              <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white">Delete Skill</h3>
            </div>
            <p className="text-xs font-satoshi text-text-muted dark:text-white/60 mb-5 leading-relaxed">
              Are you sure you want to remove this skill from your tech stack and frontend display?
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
