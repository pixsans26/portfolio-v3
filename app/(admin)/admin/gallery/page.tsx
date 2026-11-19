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
  Tag,
} from "lucide-react";
import { toast } from "sonner";

interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  category: string;
  order: number;
  published: boolean;
  createdAt?: string;
}

const PRESET_CATEGORIES = ["Mobile", "Dashboard", "Systems", "Branding", "UI/UX"];

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters, Search, Sort & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [sortBy, setSortBy] = useState<"order" | "newest" | "title">("order");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Modals state
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const initialForm = {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    alt: "",
    category: "Mobile",
    customCategory: "",
    order: 1,
    published: true,
  };
  const [formData, setFormData] = useState(initialForm);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/gallery?excludeCategory=Hero%20Slide");
      const data = await res.json();
      if (data.success) {
        setPhotos(data.items);
      }
    } catch {
      toast.error("Failed to load visual gallery photos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Compute dynamic category list from existing items + presets
  const dynamicCategories = useMemo(() => {
    const set = new Set<string>(PRESET_CATEGORIES);
    photos.forEach((p) => {
      if (p.category && p.category !== "Hero Slide") set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [photos]);

  // Filtered & Sorted
  const filteredPhotos = useMemo(() => {
    return photos
      .filter((p) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          (p.alt && p.alt.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q));

        if (!matchesSearch) return false;
        if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
        if (statusFilter === "published") return p.published;
        if (statusFilter === "draft") return !p.published;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "order") return (a.order || 0) - (b.order || 0);
        if (sortBy === "title") return (a.alt || "").localeCompare(b.alt || "");
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [photos, searchQuery, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredPhotos.length / pageSize) || 1;
  const paginatedPhotos = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPhotos.slice(start, start + pageSize);
  }, [filteredPhotos, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, sortBy]);

  const handleOpenCreate = () => {
    setActivePhoto(null);
    setIsCustomCategory(false);
    setFormData({
      ...initialForm,
      order: photos.length + 1,
    });
    setModalMode("create");
  };

  const handleOpenEdit = (photo: GalleryPhoto) => {
    setActivePhoto(photo);
    const isPreset = PRESET_CATEGORIES.includes(photo.category);
    setIsCustomCategory(!isPreset);
    setFormData({
      src: photo.src,
      alt: photo.alt,
      category: isPreset ? photo.category : "custom",
      customCategory: isPreset ? "" : photo.category,
      order: photo.order,
      published: photo.published,
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
        toast.success("Photo uploaded successfully!");
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

    const finalCategory =
      formData.category === "custom" || isCustomCategory
        ? formData.customCategory.trim() || "Showcase"
        : formData.category;

    const payload = {
      src: formData.src,
      alt: formData.alt,
      category: finalCategory,
      order: Number(formData.order),
      published: Boolean(formData.published),
      id: activePhoto?.id,
    };

    try {
      const res = await fetch("/api/admin/gallery", {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === "create" ? "Photo added to gallery!" : "Photo updated!");
        setModalMode(null);
        fetchPhotos();
      } else {
        toast.error(data.error || "Failed to save photo");
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
        toast.success("Photo deleted successfully");
        setDeleteConfirmId(null);
        fetchPhotos();
      } else {
        toast.error(data.error || "Failed to delete photo");
      }
    } catch {
      toast.error("Network error while deleting");
    }
  };

  const handleTogglePublished = async (photo: GalleryPhoto) => {
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: photo.id,
          published: !photo.published,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPhotos((prev) =>
          prev.map((p) => (p.id === photo.id ? { ...p, published: !p.published } : p))
        );
        toast.success(photo.published ? "Photo hidden from gallery" : "Photo published to gallery!");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleMovePhotoOrder = async (photo: GalleryPhoto, direction: "up" | "down") => {
    const sorted = [...photos].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sorted.findIndex((p) => p.id === photo.id);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const targetPhoto = sorted[targetIndex];
    const reorderedList = [...sorted];
    reorderedList[currentIndex] = targetPhoto;
    reorderedList[targetIndex] = photo;

    const items = reorderedList.map((p, idx) => ({
      id: p.id,
      order: idx + 1,
    }));

    setPhotos((prev) =>
      prev.map((p) => {
        const found = items.find((item) => item.id === p.id);
        return found ? { ...p, order: found.order } : p;
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
        toast.success(`Moved "${photo.alt || "Photo"}" ${direction === "up" ? "higher" : "lower"}`);
      } else {
        toast.error("Failed to persist reorder");
        fetchPhotos();
      }
    } catch {
      toast.error("Error updating photo order");
      fetchPhotos();
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-clash text-xl md:text-2xl font-bold text-text-primary dark:text-white">
              Visual Gallery CMS
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-accent-blue/15 text-accent-blue">
              {photos.length} Photos
            </span>
          </div>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Manage photographs, design screenshots, and visual archive items displayed on the public Gallery page (<code className="font-mono text-accent-blue">/gallery</code>).
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border dark:border-dark-border text-xs font-satoshi font-medium text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-sm"
          >
            <ExternalLink size={13} />
            <span>View Live Gallery</span>
          </a>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus size={14} />
            <span>Add Gallery Photo</span>
          </button>
        </div>
      </header>

      {/* Toolbar: Search, Category Filter, Status, Sort */}
      <div className="p-3 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption or category..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category */}
          <div className="flex items-center gap-1 text-xs font-satoshi">
            <span className="text-text-muted dark:text-white/40 text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs text-text-primary dark:text-white font-satoshi focus:outline-none focus:ring-1 focus:ring-accent-blue font-medium"
            >
              {dynamicCategories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

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

      {/* PHOTO CARD GRID */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading gallery photos...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border dark:border-dark-border rounded-lg p-8">
          <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-3">
            No gallery photos found matching your criteria.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold"
          >
            Add First Gallery Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group rounded-xl border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm hover:border-accent-blue/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* PHOTO CONTAINER */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-black/5 dark:bg-white/5 border-b border-border dark:border-dark-border">
                  <img
                    src={photo.src}
                    alt={photo.alt || "Gallery image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-75" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-semibold border border-white/10 shadow-sm">
                      #{photo.order}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePublished(photo);
                      }}
                      className={`pointer-events-auto px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 backdrop-blur-md border transition-all ${
                        photo.published
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30"
                      }`}
                      title={photo.published ? "Click to hide" : "Click to publish"}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${photo.published ? "bg-emerald-400" : "bg-amber-400"}`} />
                      <span>{photo.published ? "Published" : "Draft"}</span>
                    </button>
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-accent-blue/80 backdrop-blur-md text-white border border-white/20">
                        {photo.category || "Showcase"}
                      </span>
                    </div>
                    <p className="text-white font-satoshi font-semibold text-sm drop-shadow truncate">
                      {photo.alt || "Untitled Photo"}
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-1 border-t border-border/50 dark:border-dark-border/50 text-xs">
                {/* Reorder Arrows */}
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleMovePhotoOrder(photo, "up")}
                    className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-muted dark:text-white/60 transition-colors"
                    title="Move higher in gallery order"
                    aria-label="Move higher"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    onClick={() => handleMovePhotoOrder(photo, "down")}
                    className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-muted dark:text-white/60 transition-colors"
                    title="Move lower in gallery order"
                    aria-label="Move lower"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewPhoto(photo)}
                    className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-text-muted dark:text-white/60 hover:text-text-primary dark:hover:text-white transition-colors"
                    title="Preview full image"
                    aria-label="Preview full image"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(photo)}
                    className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-accent-blue transition-colors"
                    title="Edit photo details"
                    aria-label="Edit photo"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(photo.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                    title="Delete photo"
                    aria-label="Delete photo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border dark:border-dark-border text-xs font-satoshi text-text-muted dark:text-white/60">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filteredPhotos.length)} of {filteredPhotos.length} photos
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-border dark:border-dark-border disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-border dark:border-dark-border disabled:opacity-40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-border dark:border-dark-border flex items-center justify-between">
              <div>
                <h3 className="font-clash font-bold text-base text-text-primary dark:text-white">
                  {modalMode === "create" ? "Add New Gallery Photo" : "Edit Gallery Photo"}
                </h3>
                <p className="text-[11px] font-satoshi text-text-muted dark:text-white/50">
                  Visible on the public Gallery page (<code className="text-accent-blue font-mono">/gallery</code>)
                </p>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-text-muted dark:text-white/60 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Photo Preview & Upload */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1.5">
                  Gallery Photo Image
                </label>
                <div className="relative h-44 w-full rounded-lg overflow-hidden border border-border dark:border-dark-border bg-black/5 dark:bg-white/5 mb-2.5">
                  <img
                    src={formData.src}
                    alt="Preview"
                    className="w-full h-full object-contain bg-black/20"
                  />
                </div>

                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-border dark:border-dark-border text-xs font-satoshi font-medium text-text-primary dark:text-white transition-colors">
                    <Upload size={13} />
                    <span>{uploading ? "Uploading..." : "Upload New File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Direct URL */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Or Image Source URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              {/* Title / Alt */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Photo Title / Caption
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
                    Category Tag
                  </label>
                  <select
                    value={isCustomCategory ? "custom" : formData.category}
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue font-medium"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">+ Custom Category...</option>
                  </select>
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

              {/* Custom Category Input if selected */}
              {isCustomCategory && (
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Custom Category Name
                  </label>
                  <input
                    type="text"
                    required={isCustomCategory}
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    placeholder="e.g. Design Systems, Wearables, Branding..."
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              )}

              {/* Published checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-satoshi text-text-primary dark:text-white">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-border dark:border-dark-border text-accent-blue focus:ring-accent-blue w-4 h-4"
                  />
                  <span>Published (Visible on public Gallery page)</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-3.5 py-1.5 rounded-md border border-border dark:border-dark-border text-xs font-satoshi text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-4 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : modalMode === "create" ? "Add Photo" : "Update Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL LIGHTBOX PREVIEW MODAL */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
            <img
              src={previewPhoto.src}
              alt={previewPhoto.alt}
              className="max-w-full max-h-[75vh] w-auto h-auto object-contain rounded-lg shadow-2xl block"
            />
            <div className="mt-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-satoshi flex items-center gap-2">
              <span className="font-semibold">{previewPhoto.alt || "Gallery Photo"}</span>
              <span className="opacity-40">•</span>
              <span className="text-accent-blue font-bold">{previewPhoto.category}</span>
              <span className="opacity-40">•</span>
              <span className="text-white/60 font-mono">Order #{previewPhoto.order}</span>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-5 shadow-2xl text-left space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-clash font-bold text-base text-text-primary dark:text-white">
                Delete Gallery Photo?
              </h3>
              <p className="text-xs font-satoshi text-text-muted dark:text-white/60 mt-1">
                This will permanently remove this photo from your public Gallery. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-md border border-border dark:border-dark-border text-xs font-satoshi text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs font-satoshi font-semibold transition-colors"
              >
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

