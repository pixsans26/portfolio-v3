"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Images,
  Plus,
  Upload,
  Link as LinkIcon,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Layers
} from "lucide-react";
import { toast } from "sonner";

interface GallerySlide {
  id: string;
  src: string;
  alt: string;
  category: string;
  order: number;
  published: boolean;
  createdAt?: string;
}

export default function AdminSlidersPage() {
  const [slides, setSlides] = useState<GallerySlide[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters, Search, Sort & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"order" | "newest" | "title">("order");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeSlide, setActiveSlide] = useState<GallerySlide | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewSlide, setPreviewSlide] = useState<GallerySlide | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const initialForm = {
    src: "",
    alt: "",
    category: "Hero Slide",
    order: 1,
    published: true,
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/gallery?category=Hero%20Slide");
      const data = await res.json();
      if (data.success) {
        setSlides(data.items);
      }
    } catch {
      toast.error("Failed to load hero slider items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Filtered & Sorted
  const filteredSlides = useMemo(() => {
    return slides
      .filter((s) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q || s.alt.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);

        if (!matchesSearch) return false;
        if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
        if (statusFilter === "published") return s.published;
        if (statusFilter === "draft") return !s.published;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "order") return (a.order || 0) - (b.order || 0);
        if (sortBy === "title") return a.alt.localeCompare(b.alt);
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [slides, searchQuery, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredSlides.length / pageSize) || 1;
  const paginatedSlides = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSlides.slice(start, start + pageSize);
  }, [filteredSlides, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleOpenCreate = () => {
    setActiveSlide(null);
    setFormData({
      ...initialForm,
      category: "Hero Slide",
      order: slides.length + 1,
    });
    setModalMode("create");
  };

  const handleOpenEdit = (slide: GallerySlide) => {
    setActiveSlide(slide);
    setFormData({
      src: slide.src,
      alt: slide.alt,
      category: "Hero Slide",
      order: slide.order,
      published: slide.published,
    });
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
        setFormData((prev) => ({ ...prev, src: data.url }));
        toast.success("Image uploaded successfully!");
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

    if (!formData.src.trim()) {
      toast.error("Please upload a slide photo first");
      return;
    }

    if (!formData.alt.trim()) {
      toast.error("Please enter a caption / title");
      return;
    }

    setSaving(true);

    const payload = {
      ...formData,
      category: "Hero Slide",
      id: activeSlide?.id,
    };

    try {
      const res = await fetch("/api/admin/gallery", {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === "create" ? "Slide added!" : "Slide updated!");
        setModalMode(null);
        fetchSlides();
      } else {
        toast.error(data.error || "Failed to save slide");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Slide deleted successfully");
        setDeleteConfirmId(null);
        fetchSlides();
      } else {
        toast.error(data.error || "Failed to delete slide");
      }
    } catch {
      toast.error("Network error while deleting");
    }
  };

  const handleTogglePublished = async (slide: GallerySlide) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: slide.id,
          published: !slide.published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? { ...s, published: !s.published } : s))
        );
        toast.success(slide.published ? "Slide hidden" : "Slide published!");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleMoveSlideOrder = async (slide: GallerySlide, direction: "up" | "down") => {
    const sorted = [...slides].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sorted.findIndex((s) => s.id === slide.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetSlide = sorted[targetIndex];
    const reorderedList = [...sorted];
    reorderedList[currentIndex] = targetSlide;
    reorderedList[targetIndex] = slide;

    const items = reorderedList.map((s, idx) => ({
      id: s.id,
      order: idx + 1,
    }));

    setSlides((prev) =>
      prev.map((s) => {
        const found = items.find((item) => item.id === s.id);
        return found ? { ...s, order: found.order } : s;
      })
    );

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: true, items }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Moved "${slide.alt || "Slide"}" ${direction === "up" ? "higher" : "lower"}`);
      } else {
        toast.error("Failed to persist reorder");
        fetchSlides();
      }
    } catch {
      toast.error("Error updating slide order");
      fetchSlides();
    }
  };

  const categories = ["all", "Hero Slide", "Dashboard", "Mobile", "Systems"];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border dark:border-dark-border">
        <div>
          <h1 className="font-clash text-xl md:text-2xl font-bold text-text-primary dark:text-white">
            Hero Sliders CMS
          </h1>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Manage showcase slides and imagery featured on the homepage hero carousel.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border dark:border-dark-border text-xs font-satoshi font-medium text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <ExternalLink size={13} />
            <span>View Home Slider</span>
          </a>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus size={14} />
            <span>Add Hero Slide</span>
          </button>
        </div>
      </header>

      {/* Toolbar: Search, Status, Sort */}
      <div className="p-3 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search slides by title or caption..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status */}
          <div className="flex items-center gap-1 text-xs font-satoshi">
            <span className="text-text-muted dark:text-white/40 text-[11px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs text-text-primary dark:text-white font-satoshi focus:outline-none focus:ring-1 focus:ring-accent-blue"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Hidden</option>
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
              <option value="newest">Newest First</option>
              <option value="title">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* CARD GRID VIEW WITH BIG PHOTOS */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading gallery slides...</p>
        </div>
      ) : filteredSlides.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border dark:border-dark-border rounded-lg p-8">
          <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-3">
            No slides found matching your filter.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold"
          >
            Add First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedSlides.map((s) => (
            <div
              key={s.id}
              className="group rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm hover:border-accent-blue/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* BIG PHOTO AREA */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-black/5 dark:bg-white/5 border-b border-border dark:border-dark-border">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                  {/* Badges on top */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {s.category}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-accent-blue/80 text-white">
                      #{s.order}
                    </span>
                  </div>

                  {/* Publish Toggle Button */}
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => handleTogglePublished(s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-satoshi flex items-center gap-1 transition-colors ${
                        s.published
                          ? "bg-accent-green text-white"
                          : "bg-black/70 text-white/70 border border-white/20"
                      }`}
                      title="Toggle publish"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.published ? "bg-white" : "bg-amber-400"}`} />
                      {s.published ? "Visible" : "Hidden"}
                    </button>
                  </div>

                  {/* Title / Alt on bottom */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <h3 className="font-clash font-bold text-sm leading-snug drop-shadow-sm truncate">
                      {s.alt || "Untitled Slide"}
                    </h3>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 text-xs font-satoshi flex items-center justify-between text-text-muted dark:text-white/50">
                  <span className="truncate max-w-[200px] text-[11px] font-mono">{s.src}</span>
                  <span className="text-[10px] font-mono uppercase">{s.category}</span>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="p-3 border-t border-border dark:border-dark-border bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-text-muted dark:text-white/40 mr-1">
                    #{s.order}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleMoveSlideOrder(s, "up")}
                    className="p-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary dark:text-white transition-colors"
                    title="Move higher (Display earlier)"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSlideOrder(s, "down")}
                    className="p-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary dark:text-white transition-colors"
                    title="Move lower (Display later)"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewSlide(s)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    title="Preview image"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(s)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                    title="Edit slide"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(s.id)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {filteredSlides.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border dark:border-dark-border text-xs font-satoshi text-text-muted dark:text-white/50">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredSlides.length)} of {filteredSlides.length} slides
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
          <div className="w-full max-w-lg bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border mb-4">
              <div>
                <h2 className="font-clash text-lg font-bold text-text-primary dark:text-white">
                  {modalMode === "create" ? "Add Slide / Photo" : "Edit Slide / Photo"}
                </h2>
                <p className="text-xs text-text-muted dark:text-white/50 font-satoshi">
                  Upload high-res photo, set caption, category, and display order.
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
              {/* Photo Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50">
                    Photo / Image Asset *
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue font-bold">
                    Upload Size: 1200 × 750 px (16:10 Ratio)
                  </span>
                </div>
                <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi mb-2">
                  Fixed slider resolution: <strong className="text-text-primary dark:text-white">1200 × 750 px</strong> (or 16:10 ratio like 680×425). Perfectly matches your uploaded showcase website screens without any cropping.
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
                  <div className="relative w-36 h-22 rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border shrink-0 aspect-[16/10] shadow-sm">
                    {formData.src ? (
                      <Image src={formData.src} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted">No Image</div>
                    )}
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[8px] font-mono bg-black/75 text-white/90">
                      16:10
                    </span>
                  </div>
                  <div className="space-y-1.5 flex-1 w-full">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 transition-opacity shadow-sm">
                      <Upload size={13} /> {formData.src ? "Replace Slider Photo" : "Upload Slider Photo (1200×750)"}
                      <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" disabled={uploading} />
                    </label>
                    {uploading && <span className="text-xs font-satoshi text-accent-blue ml-2">Uploading...</span>}
                    {formData.src && (
                      <div className="font-mono text-[11px] truncate text-text-muted dark:text-white/60 pt-1">
                        {formData.src}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title / Alt */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Caption / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  placeholder="e.g. Swiggy Food Checkout Mobile Experience"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              {/* Category & Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Slide Placement
                  </label>
                  <input
                    type="text"
                    readOnly
                    value="Hero Carousel (Home Page)"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-muted dark:text-white/60 cursor-not-allowed font-medium select-none"
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

              {/* Published checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-satoshi text-text-primary dark:text-white">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-border dark:border-dark-border text-accent-blue focus:ring-accent-blue w-4 h-4"
                  />
                  <span>Published (Visible in Home Hero Carousel)</span>
                </label>
              </div>

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
                  {saving ? "Saving..." : modalMode === "create" ? "Add Slide" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX PREVIEW */}
      {previewSlide && (
        <div
          onClick={() => setPreviewSlide(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-[600px]">
            <Image src={previewSlide.src} alt={previewSlide.alt} fill className="object-contain" />
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg p-5 shadow-2xl text-left">
            <div className="flex items-center gap-2.5 text-red-500 mb-3">
              <AlertTriangle size={18} />
              <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white">Delete Slide</h3>
            </div>
            <p className="text-xs font-satoshi text-text-muted dark:text-white/60 mb-5 leading-relaxed">
              Are you sure you want to delete this slide from the gallery & page slider?
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

