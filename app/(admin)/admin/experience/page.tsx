"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface ExpItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements?: string;
  color?: string;
  order?: number;
  current?: boolean;
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<ExpItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Sort, Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"order" | "company" | "role">("order");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeItem, setActiveItem] = useState<ExpItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Section Header State (Dynamic Headline & Subtitle)
  const [sectionHeadline, setSectionHeadline] = useState("Where I've worked.");
  const [sectionSubtitle, setSectionSubtitle] = useState(
    "6 years across product design, design systems, and UX research — from seed-stage startups to 100M-user platforms."
  );
  const [savingHeader, setSavingHeader] = useState(false);

  // Form State
  const initialForm = {
    company: "",
    role: "Senior Product Designer",
    period: "2023 – Present",
    location: "Remote / Sydney",
    description: "",
    color: "#4F8EF7",
    order: 1,
    current: false,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchExp = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      if (data.success) {
        setExperiences(data.experiences);
      }
    } catch {
      toast.error("Failed to load experiences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExp();
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          if (data.settings.experienceHeadline || data.settings.experience_headline) {
            setSectionHeadline(data.settings.experienceHeadline || data.settings.experience_headline);
          }
          if (data.settings.experienceSubtitle || data.settings.experience_subtitle) {
            setSectionSubtitle(data.settings.experienceSubtitle || data.settings.experience_subtitle);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHeader(true);
    try {
      await Promise.all([
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "experienceHeadline", value: sectionHeadline }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "experienceSubtitle", value: sectionSubtitle }),
        }),
      ]);
      toast.success("Experience section headline & subtitle updated!");
    } catch {
      toast.error("Failed to update section header");
    } finally {
      setSavingHeader(false);
    }
  };

  const filteredExperiences = useMemo(() => {
    return experiences
      .filter((e) => {
        const q = searchQuery.toLowerCase();
        return (
          !q ||
          e.company.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "order") return (a.order || 0) - (b.order || 0);
        if (sortBy === "company") return a.company.localeCompare(b.company);
        if (sortBy === "role") return a.role.localeCompare(b.role);
        return 0;
      });
  }, [experiences, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredExperiences.length / pageSize) || 1;
  const paginatedExperiences = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredExperiences.slice(start, start + pageSize);
  }, [filteredExperiences, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const handleOpenCreate = () => {
    setActiveItem(null);
    setFormData({
      ...initialForm,
      order: experiences.length + 1,
    });
    setModalMode("create");
  };

  const handleOpenEdit = (item: ExpItem) => {
    setActiveItem(item);
    setFormData({
      company: item.company,
      role: item.role,
      period: item.period,
      location: item.location,
      description: item.description,
      color: item.color || "#4F8EF7",
      order: item.order || 1,
      current: Boolean(item.current),
    });
    setModalMode("edit");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      achievements: [],
      id: activeItem?.id,
    };

    try {
      const res = await fetch("/api/admin/experience", {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === "create" ? "Experience added!" : "Experience updated!");
        setModalMode(null);
        fetchExp();
      } else {
        toast.error(data.error || "Failed to save experience");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/experience?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Experience record deleted");
        setDeleteConfirmId(null);
        fetchExp();
      } else {
        toast.error(data.error || "Failed to delete experience");
      }
    } catch {
      toast.error("Network error while deleting");
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border dark:border-dark-border">
        <div>
          <h1 className="font-clash text-xl md:text-2xl font-bold text-text-primary dark:text-white">
            Work Experience CMS
          </h1>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Card Grid view with company timelines, roles, responsibilities, metrics & full CRUD.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Experience</span>
        </button>
      </header>

      {/* Experience Section Header Settings (Dynamic Headline & Subtitle) */}
      <form
        onSubmit={handleSaveHeader}
        className="p-4 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border dark:border-dark-border">
          <div>
            <h3 className="font-clash font-bold text-xs uppercase tracking-wider text-text-primary dark:text-white flex items-center gap-2">
              <Building2 size={14} className="text-accent-blue" />
              <span>Public Website Section Header</span>
            </h3>
            <p className="text-[11px] font-satoshi text-text-muted dark:text-white/50">
              Customize the section title and descriptive subtitle displayed on the public portfolio homepage.
            </p>
          </div>
          <button
            type="submit"
            disabled={savingHeader}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 self-start sm:self-auto"
          >
            {savingHeader ? "Saving..." : "Save Header Settings"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
              Section Title / Heading
            </label>
            <input
              type="text"
              required
              value={sectionHeadline}
              onChange={(e) => setSectionHeadline(e.target.value)}
              placeholder="Where I've worked."
              className="w-full px-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
              Section Subtitle / Description
            </label>
            <input
              type="text"
              required
              value={sectionSubtitle}
              onChange={(e) => setSectionSubtitle(e.target.value)}
              placeholder="6 years across product design, design systems, and UX research — from seed-stage startups to 100M-user platforms."
              className="w-full px-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
            />
          </div>
        </div>
      </form>

      {/* Toolbar */}
      <div className="p-3 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, companies, locations..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted dark:text-white/40 text-xs font-satoshi">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs text-text-primary dark:text-white font-satoshi focus:outline-none focus:ring-1 focus:ring-accent-blue"
          >
            <option value="order">Display Order</option>
            <option value="company">Company (A - Z)</option>
            <option value="role">Role Title</option>
          </select>
        </div>
      </div>

      {/* CARD GRID VIEW */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading work experiences...</p>
        </div>
      ) : filteredExperiences.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border dark:border-dark-border rounded-lg p-8">
          <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-3">
            No work experiences found.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold"
          >
            Add First Experience Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedExperiences.map((e) => (
            <div
              key={e.id}
              className="group p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm hover:border-accent-blue/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center text-white font-clash font-bold text-xs shadow-sm"
                      style={{ backgroundColor: e.color || "#4F8EF7" }}
                    >
                      {e.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white leading-tight">
                        {e.company}
                      </h3>
                      <p className="text-[11px] font-satoshi text-text-muted dark:text-white/50">
                        {e.role}
                      </p>
                    </div>
                  </div>

                  {e.current && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-satoshi bg-accent-green/10 text-accent-green border border-accent-green/20">
                      Current
                    </span>
                  )}
                </div>

                {/* Period & Location info */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-satoshi text-text-muted dark:text-white/50 mb-3 pb-3 border-b border-border/50 dark:border-dark-border">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{e.period}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{e.location}</span>
                  </div>
                </div>

                {/* Description Preview (Stripped of HTML) */}
                <p className="text-xs font-satoshi text-text-secondary dark:text-white/70 leading-relaxed line-clamp-3 mb-2">
                  {e.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "No description provided."}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-border dark:border-dark-border flex items-center justify-between mt-3">
                <span className="text-[10px] font-mono text-text-muted dark:text-white/40">
                  Order: #{e.order || 0}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(e)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                    title="Edit experience"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(e.id)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete experience"
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
      {filteredExperiences.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border dark:border-dark-border text-xs font-satoshi text-text-muted dark:text-white/50">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredExperiences.length)} of {filteredExperiences.length} records
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
          <div className="w-full max-w-md bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-2xl p-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border mb-4">
              <div>
                <h2 className="font-clash text-lg font-bold text-text-primary dark:text-white">
                  {modalMode === "create" ? "Add Experience" : "Edit Experience"}
                </h2>
                <p className="text-xs text-text-muted dark:text-white/50 font-satoshi">
                  Company, job role, dates, location and responsibilities.
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. CRED, Atlassian"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Product Designer"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    placeholder="2022 – Present"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bangalore, India"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Brand Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-8 h-8 rounded border-0 p-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Role Description (WYSIWYG Rich Text) *
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(val) => setFormData({ ...formData, description: val })}
                  placeholder="Format with bullet points, bold highlights, subheadings, numbered lists..."
                  minHeight="180px"
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
                      checked={formData.current}
                      onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                      className="rounded border-border dark:border-dark-border text-accent-blue focus:ring-accent-blue w-4 h-4"
                    />
                    <span>Current Position</span>
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
                  {saving ? "Saving..." : modalMode === "create" ? "Add Experience" : "Save Changes"}
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
              <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white">Delete Experience</h3>
            </div>
            <p className="text-xs font-satoshi text-text-muted dark:text-white/60 mb-5 leading-relaxed">
              Are you sure you want to remove this experience record?
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
