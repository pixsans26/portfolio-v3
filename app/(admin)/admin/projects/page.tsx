"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Upload,
  Link as LinkIcon,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Check,
  X,
  LayoutGrid,
  List,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Images,
  Star,
  Image as ImageIcon,
  Zap,
  ArrowUp,
  ArrowDown,
  GripVertical
} from "lucide-react";
import { toast } from "sonner";

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  company: string;
  role: string;
  year: string;
  duration?: string;
  accentColor?: string;
  published: boolean;
  featured: boolean;
  coverImage: string;
  description?: string;
  overview?: string;
  order: number;
  tags?: string;
  tools?: string;
  gallery?: string | string[];
  prototypeUrl?: string | null;
  liveUrl?: string | null;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter, Search, Sort & Pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "featured">("all");
  const [sortBy, setSortBy] = useState<"order" | "newest" | "oldest" | "title-asc" | "title-desc">("order");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  // Form Data
  const initialForm = {
    title: "",
    slug: "",
    subtitle: "",
    company: "",
    role: "Senior Product Designer",
    year: "2024",
    duration: "4 months",
    accentColor: "#4F8EF7",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    description: "",
    overview: "",
    tags: "Fintech, Design System, UX Research",
    tools: "Figma, Protopie",
    featured: true,
    published: true,
    order: 0,
    gallery: [] as string[],
    prototypeUrl: "",
    liveUrl: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        // Search filter
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.company?.toLowerCase().includes(q) ||
          p.role?.toLowerCase().includes(q) ||
          p.tags?.toLowerCase().includes(q);

        if (!matchesSearch) return false;

        // Status filter
        if (statusFilter === "published") return p.published;
        if (statusFilter === "draft") return !p.published;
        if (statusFilter === "featured") return p.featured;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "order") return (a.order || 0) - (b.order || 0);
        if (sortBy === "newest") return b.year.localeCompare(a.year);
        if (sortBy === "oldest") return a.year.localeCompare(b.year);
        if (sortBy === "title-asc") return a.title.localeCompare(b.title);
        if (sortBy === "title-desc") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [projects, searchQuery, statusFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sortBy]);

  const handleOpenCreate = () => {
    setActiveProject(null);
    setFormData({
      ...initialForm,
      order: projects.length + 1,
      gallery: [],
      prototypeUrl: "",
      liveUrl: "",
    });
    setGalleryUrlInput("");
    setModalMode("create");
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setActiveProject(project);
    let parsedTags = project.tags || "";
    try {
      if (parsedTags.startsWith("[")) {
        parsedTags = JSON.parse(parsedTags).join(", ");
      }
    } catch {}

    let parsedTools = project.tools || "";
    try {
      if (parsedTools.startsWith("[")) {
        parsedTools = JSON.parse(parsedTools).join(", ");
      }
    } catch {}

    let parsedGallery: string[] = [];
    try {
      if (Array.isArray(project.gallery)) {
        parsedGallery = project.gallery;
      } else if (typeof project.gallery === "string") {
        parsedGallery = JSON.parse(project.gallery);
      }
    } catch {}

    setFormData({
      title: project.title,
      slug: project.slug,
      subtitle: project.subtitle || "",
      company: project.company,
      role: project.role,
      year: project.year,
      duration: project.duration || "4 months",
      accentColor: project.accentColor || "#4F8EF7",
      coverImage: project.coverImage,
      description: project.description || "",
      overview: project.overview || "",
      tags: parsedTags,
      tools: parsedTools,
      featured: project.featured,
      published: project.published,
      order: project.order || 0,
      gallery: parsedGallery,
      prototypeUrl: project.prototypeUrl || "",
      liveUrl: project.liveUrl || "",
    });
    setGalleryUrlInput("");
    setModalMode("edit");
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
        setFormData((prev) => ({ ...prev, coverImage: data.url }));
        toast.success("Cover image uploaded successfully!");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleMultiGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, ...uploadedUrls],
        }));
        toast.success(`Successfully uploaded ${uploadedUrls.length} gallery image(s)!`);
      } else {
        toast.error("Could not upload selected files");
      }
    } catch {
      toast.error("Error uploading gallery images");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    const trimmed = galleryUrlInput.trim();
    if (formData.gallery.includes(trimmed)) {
      toast.error("This image is already in the gallery");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, trimmed],
    }));
    setGalleryUrlInput("");
    toast.success("Image URL added to gallery");
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleMoveGalleryImage = (idx: number, direction: "left" | "right") => {
    const targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= formData.gallery.length) return;

    const newGallery = [...formData.gallery];
    const temp = newGallery[idx];
    newGallery[idx] = newGallery[targetIdx];
    newGallery[targetIdx] = temp;

    setFormData((prev) => ({
      ...prev,
      gallery: newGallery,
    }));
  };

  const handleSetAsCover = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: url,
    }));
    toast.success("Cover image updated!");
  };

  const handleMoveProjectOrder = async (project: ProjectItem, direction: "up" | "down") => {
    // Sort projects strictly by current order
    const sorted = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sorted.findIndex((p) => p.id === project.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetProject = sorted[targetIndex];

    // Swap order values or assign sequential order (1, 2, 3...)
    const reorderedList = [...sorted];
    reorderedList[currentIndex] = targetProject;
    reorderedList[targetIndex] = project;

    const items = reorderedList.map((p, idx) => ({
      id: p.id,
      order: idx + 1,
    }));

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) => {
        const found = items.find((item) => item.id === p.id);
        return found ? { ...p, order: found.order } : p;
      })
    );

    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: true, items }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Moved "${project.title}" ${direction === "up" ? "higher" : "lower"}`);
      } else {
        toast.error("Failed to persist reorder");
        fetchProjects();
      }
    } catch {
      toast.error("Error updating project order");
      fetchProjects();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formattedTags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const formattedTools = formData.tools
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: formattedTags,
      tools: formattedTools,
      id: activeProject?.id,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === "create" ? "Project created!" : "Project updated!");
        setModalMode(null);
        fetchProjects();
      } else {
        toast.error(data.error || "Failed to save project");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted successfully");
        setDeleteConfirmId(null);
        fetchProjects();
      } else {
        toast.error(data.error || "Failed to delete project");
      }
    } catch {
      toast.error("Network error deleting project");
    }
  };

  const handleTogglePublished = async (project: ProjectItem) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: project.id,
          published: !project.published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
        );
        toast.success(project.published ? "Project set to draft" : "Project published live!");
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
            My Design Projects CMS
          </h1>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Card Grid view with big photo cards, full CRUD (create, update, delete), filters, sorting & pagination.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add New Project</span>
        </button>
      </header>

      {/* Toolbar: Search, Filters, Sorting & View Toggle */}
      <div className="p-3 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects by title, company, tags..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>

        {/* Right: Filters & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1 text-xs font-satoshi">
            <span className="text-text-muted dark:text-white/40 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs text-text-primary dark:text-white font-satoshi focus:outline-none focus:ring-1 focus:ring-accent-blue"
            >
              <option value="all">All Projects</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="featured">Featured Only</option>
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
              <option value="newest">Year (Newest)</option>
              <option value="oldest">Year (Oldest)</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="title-desc">Title (Z - A)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border dark:border-dark-border rounded-md overflow-hidden ml-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-accent-blue text-white"
                  : "bg-black/5 dark:bg-white/5 text-text-secondary dark:text-white/60 hover:text-text-primary dark:hover:text-white"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 text-xs transition-colors ${
                viewMode === "table"
                  ? "bg-accent-blue text-white"
                  : "bg-black/5 dark:bg-white/5 text-text-secondary dark:text-white/60 hover:text-text-primary dark:hover:text-white"
              }`}
              title="Table List View"
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display: Card Grid View or Table View */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading projects from SQLite...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border dark:border-dark-border rounded-lg p-8">
          <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-3">
            No projects found matching your criteria.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold"
          >
            Create Your First Project
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* CARD GRID VIEW WITH BIG PHOTOS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProjects.map((p) => {
            let tagsList: string[] = [];
            try {
              tagsList = JSON.parse(p.tags || "[]");
            } catch {
              tagsList = (p.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
            }

            let galleryCount = 0;
            try {
              if (Array.isArray(p.gallery)) galleryCount = p.gallery.length;
              else if (typeof p.gallery === "string") galleryCount = JSON.parse(p.gallery || "[]").length;
            } catch {}

            return (
              <div
                key={p.id}
                className="group rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm hover:border-accent-blue/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* BIG PHOTO AREA */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/5 dark:bg-white/5 border-b border-border dark:border-dark-border">
                    <Image
                      src={p.coverImage}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Badges on top of photo */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10">
                        {p.company}
                      </span>
                      {p.featured && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-blue text-white flex items-center gap-1 shadow-sm">
                          <Star size={10} /> Featured
                        </span>
                      )}
                      {galleryCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center gap-1 shadow-sm">
                          <ImageIcon size={10} /> {galleryCount} {galleryCount === 1 ? "photo" : "photos"}
                        </span>
                      )}
                    </div>

                    {/* Published status badge top-right */}
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => handleTogglePublished(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-satoshi flex items-center gap-1 transition-colors ${
                          p.published
                            ? "bg-accent-green text-white"
                            : "bg-black/70 text-white/70 border border-white/20"
                        }`}
                        title="Click to toggle publish status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.published ? "bg-white" : "bg-amber-400"}`} />
                        {p.published ? "Live" : "Draft"}
                      </button>
                    </div>

                    {/* Title overlay on photo bottom */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <h3 className="font-clash font-bold text-base leading-snug drop-shadow-sm truncate">
                        {p.title}
                      </h3>
                      <p className="text-[11px] font-satoshi text-white/80 truncate">
                        {p.role} · {p.year}
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-satoshi text-text-muted dark:text-white/60 line-clamp-2 leading-relaxed">
                      {p.subtitle || p.description || "No description provided."}
                    </p>

                    {/* Tags */}
                    {tagsList.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tagsList.slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] font-satoshi bg-black/5 dark:bg-white/5 text-text-secondary dark:text-white/60 border border-border/50 dark:border-dark-border"
                          >
                            {t}
                          </span>
                        ))}
                        {tagsList.length > 3 && (
                          <span className="px-1 py-0.5 rounded text-[10px] font-mono text-text-muted dark:text-white/40">
                            +{tagsList.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 border-t border-border dark:border-dark-border bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-text-muted dark:text-white/40 mr-1">
                      #{p.order}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMoveProjectOrder(p, "up")}
                      className="p-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary dark:text-white transition-colors"
                      title="Move higher (Display earlier)"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveProjectOrder(p, "down")}
                      className="p-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary dark:text-white transition-colors"
                      title="Move lower (Display later)"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {p.liveUrl && (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title={`View Live Site: ${p.liveUrl}`}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {p.prototypeUrl && (
                      <a
                        href={p.prototypeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
                        title={`View Prototype: ${p.prototypeUrl}`}
                      >
                        <Zap size={14} />
                      </a>
                    )}
                    <Link
                      href={`/work/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title="View public page"
                    >
                      <Eye size={14} />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                      title="Edit project"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="border border-border dark:border-dark-border rounded-lg overflow-hidden bg-white dark:bg-dark-card shadow-sm">
          <table className="w-full text-left text-xs font-satoshi">
            <thead className="bg-black/5 dark:bg-white/5 text-text-muted dark:text-white/50 uppercase text-[10px] tracking-wider border-b border-border dark:border-dark-border">
              <tr>
                <th className="px-3 py-3 w-16 text-center">Order</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Role & Year</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-dark-border">
              {paginatedProjects.map((p) => {
                let galleryCount = 0;
                try {
                  if (Array.isArray(p.gallery)) galleryCount = p.gallery.length;
                  else if (typeof p.gallery === "string") galleryCount = JSON.parse(p.gallery || "[]").length;
                } catch {}

                return (
                  <tr key={p.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-mono text-[11px] text-text-muted dark:text-white/40">#{p.order}</span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleMoveProjectOrder(p, "up")}
                            className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/20 text-text-muted dark:text-white/50"
                            title="Move up"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveProjectOrder(p, "down")}
                            className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/20 text-text-muted dark:text-white/50"
                            title="Move down"
                          >
                            <ArrowDown size={11} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-black/5 dark:bg-white/5 shrink-0">
                          <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-clash font-bold text-text-primary dark:text-white text-sm">{p.title}</p>
                          <p className="text-[11px] text-text-muted dark:text-white/50 truncate max-w-xs">{p.subtitle}</p>
                          {galleryCount > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-accent-blue font-medium mt-0.5">
                              <ImageIcon size={10} /> {galleryCount} {galleryCount === 1 ? "gallery photo" : "gallery photos"}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  <td className="px-4 py-3 font-medium text-text-primary dark:text-white">{p.company}</td>
                  <td className="px-4 py-3 text-text-muted dark:text-white/60">{p.role} ({p.year})</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.published ? "bg-accent-green/10 text-accent-green" : "bg-black/10 dark:bg-white/10 text-text-muted dark:text-white/50"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                          title={`View Live Site: ${p.liveUrl}`}
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                      {p.prototypeUrl && (
                        <a
                          href={p.prototypeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded text-purple-600 dark:text-purple-400 hover:bg-purple-500/10"
                          title={`View Prototype: ${p.prototypeUrl}`}
                        >
                          <Zap size={13} />
                        </a>
                      )}
                      <Link
                        href={`/work/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                        title="View public page"
                      >
                        <Eye size={13} />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded text-text-muted dark:text-white/50 hover:text-accent-blue hover:bg-accent-blue/10"
                        title="Edit project"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="p-1.5 rounded text-text-muted dark:text-white/50 hover:text-red-500 hover:bg-red-500/10"
                        title="Delete project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {filteredProjects.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border dark:border-dark-border text-xs font-satoshi text-text-muted dark:text-white/50">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredProjects.length)} of {filteredProjects.length} projects
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
          <div className="w-full max-w-2xl bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border mb-4">
              <div>
                <h2 className="font-clash text-lg font-bold text-text-primary dark:text-white">
                  {modalMode === "create" ? "Add New Project" : `Edit Project: ${activeProject?.title}`}
                </h2>
                <p className="text-xs text-text-muted dark:text-white/50 font-satoshi">
                  Configure showcase metadata, big cover photo, tags, and display options.
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
              {/* Title & Subtitle */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Swiggy Checkout Overhaul"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Subtitle / Impact Summary
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. 2.4% conversion lift on a 50M+ platform"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              {/* Photo Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50">
                    Cover Photo (Fixed Resolution Preview) *
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue font-bold">
                    Upload Size: 1920 × 1126 px
                  </span>
                </div>
                <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi mb-2">
                  Standard cover resolution: <strong className="text-text-primary dark:text-white">1920 × 1126 px</strong> (or any image in this ratio). Matches your current uploaded project covers.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                  <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border shrink-0 aspect-[1920/1126] shadow-sm">
                    {formData.coverImage ? (
                      <Image src={formData.coverImage} alt="Cover preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted">No Image</div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[8px] font-mono bg-black/75 text-white/90">
                      1920×1126
                    </span>
                  </div>
                  <div className="space-y-1.5 flex-1 w-full">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 transition-opacity shadow-sm">
                      <Upload size={13} /> {formData.coverImage ? "Replace Cover Photo (1920×1126)" : "Upload Cover Photo (1920×1126)"}
                      <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" disabled={uploading} />
                    </label>
                    {uploading && <span className="text-xs font-satoshi text-accent-blue ml-2">Uploading image...</span>}
                    {formData.coverImage && (
                      <div className="font-mono text-[11px] truncate text-text-muted dark:text-white/60 pt-1">
                        {formData.coverImage}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Multi-Image Gallery Area */}
              <div className="p-3.5 bg-black/[0.02] dark:bg-white/[0.02] border border-border dark:border-dark-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-primary dark:text-white">
                      Project Image Gallery (Multiple Images)
                    </label>
                    <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi">
                      Upload multiple screenshots, UI mockups, and assets to render in website galleries.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue font-bold">
                    {formData.gallery.length} {formData.gallery.length === 1 ? "Image" : "Images"}
                  </span>
                </div>

                {/* Upload & Add URL Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 transition-opacity shrink-0">
                    <Images size={13} /> Upload Multiple Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultiGalleryUpload}
                      className="hidden"
                      disabled={uploadingGallery}
                    />
                  </label>

                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={galleryUrlInput}
                      onChange={(e) => setGalleryUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddGalleryUrl();
                        }
                      }}
                      placeholder="Paste image URL and press Add"
                      className="w-full px-2.5 py-1 text-xs font-satoshi bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3 py-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary dark:text-white text-xs font-satoshi font-medium rounded-md shrink-0"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {uploadingGallery && (
                  <div className="text-xs font-satoshi text-accent-blue flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                    Uploading gallery images, please wait...
                  </div>
                )}

                {/* Gallery Thumbnails / Sequence Reorder List */}
                {formData.gallery.length > 0 ? (
                  <div className="space-y-2 pt-1 max-h-64 overflow-y-auto pr-1">
                    <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi mb-1">
                      Display sequence on website (order from top to bottom):
                    </p>
                    {formData.gallery.map((imgUrl, idx) => {
                      const isCover = formData.coverImage === imgUrl;
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg border flex items-center justify-between gap-3 bg-white dark:bg-dark-card transition-colors ${
                            isCover
                              ? "border-accent-blue ring-1 ring-accent-blue/30"
                              : "border-border dark:border-dark-border"
                          }`}
                        >
                          {/* Left: Sequence index + thumbnail + URL */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-md bg-accent-blue/10 text-accent-blue font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <div className="relative w-16 h-10 rounded overflow-hidden border border-border dark:border-dark-border bg-black/5 shrink-0">
                              <Image src={imgUrl} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-mono text-text-primary dark:text-white truncate max-w-xs">
                                {imgUrl.split("/").pop() || imgUrl}
                              </p>
                              {isCover && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-blue">
                                  <Star size={10} className="fill-current" /> Cover Image
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Order controls (Up/Down) & Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, "left")}
                              disabled={idx === 0}
                              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-text-muted dark:text-white/70 disabled:opacity-25 transition-colors"
                              title="Move up (Display earlier on website)"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveGalleryImage(idx, "right")}
                              disabled={idx === formData.gallery.length - 1}
                              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-text-muted dark:text-white/70 disabled:opacity-25 transition-colors"
                              title="Move down (Display later on website)"
                            >
                              <ArrowDown size={13} />
                            </button>
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetAsCover(imgUrl)}
                                className="px-2 py-1 rounded text-[10px] font-satoshi font-semibold bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-white transition-colors"
                                title="Set as project cover"
                              >
                                Set Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10 transition-colors ml-1"
                              title="Remove image"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] font-satoshi text-text-muted dark:text-white/40 italic">
                    No additional gallery images added yet. Click &apos;Upload Multiple Images&apos; or paste URLs above.
                  </p>
                )}
              </div>

              {/* Company & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Company / Client
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Swiggy, Razorpay"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Your Role
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead Product Designer"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              {/* Year, Duration & Custom Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="2024"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="4 months"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
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
              </div>

              {/* Tags & Tools */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Fintech, UX Research, Mobile App, Design System"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              {/* Prototype & Live Link URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-black/[0.02] dark:bg-white/[0.02] border border-border dark:border-dark-border rounded-lg">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1 flex items-center gap-1.5">
                    <ExternalLink size={12} className="text-accent-blue" />
                    Live Project / Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl || ""}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://mysite.com or App Store link"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1 flex items-center gap-1.5">
                    <Zap size={12} className="text-accent-purple" />
                    Interactive Prototype URL
                  </label>
                  <input
                    type="url"
                    value={formData.prototypeUrl || ""}
                    onChange={(e) => setFormData({ ...formData, prototypeUrl: e.target.value })}
                    placeholder="https://figma.com/proto/... or Protopie link"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              {/* Description & Overview */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Full Project Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of context and scope..."
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              {/* Switches: Featured & Published */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-satoshi text-text-primary dark:text-white">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-border dark:border-dark-border text-accent-blue focus:ring-accent-blue w-4 h-4"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-satoshi text-text-primary dark:text-white">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-border dark:border-dark-border text-accent-blue focus:ring-accent-blue w-4 h-4"
                  />
                  <span>Published Live</span>
                </label>
              </div>

              {/* Modal Actions */}
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
                  {saving ? "Saving..." : modalMode === "create" ? "Create Project" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg p-5 shadow-2xl text-left">
            <div className="flex items-center gap-2.5 text-red-500 mb-3">
              <AlertTriangle size={18} />
              <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white">Confirm Delete Project</h3>
            </div>
            <p className="text-xs font-satoshi text-text-muted dark:text-white/60 mb-5 leading-relaxed">
              Are you sure you want to permanently delete this project? This will also remove any attached case studies and cannot be undone.
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
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
