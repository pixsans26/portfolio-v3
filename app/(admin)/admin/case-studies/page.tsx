"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Search,
  Eye,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Link as LinkIcon,
  Images,
  Image as ImageIcon,
  Zap,
  ArrowUp,
  ArrowDown,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

interface CaseStudyItem {
  id: string;
  projectId: string;
  problem: string;
  lessons?: string;
  research?: string;
  wireframes?: string | string[];
  hiFidelity?: string | string[];
  prototype?: string | null;
  testing?: string;
  figmaEmbed?: string | null;
  createdAt?: string;
  project: {
    id: string;
    title: string;
    slug: string;
    company: string;
    coverImage: string;
    year?: string;
    role?: string;
    description?: string;
    overview?: string;
    tags?: string;
    prototypeUrl?: string | null;
    liveUrl?: string | null;
  };
}

interface ProjectOption {
  id: string;
  title: string;
  company: string;
  slug: string;
  coverImage?: string;
  description?: string;
  overview?: string;
  tags?: string;
  hasCaseStudy: boolean;
}

export default function AdminCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "title" | "company">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modal State
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeItem, setActiveItem] = useState<CaseStudyItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Photo sequence upload state
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState("");

  // Clean Form State: create directly from scratch or optionally link existing project
  const initialForm = {
    title: "",
    company: "",
    role: "Lead Product Designer",
    year: new Date().getFullYear().toString(),
    coverImage: "",
    tags: "Mobile Apps, Fintech, Design System",
    overviewNote: "",
    photos: [] as string[],
    prototype: "",
    figmaEmbed: "",
    liveUrl: "",
    projectId: "", // empty means create new project for this case study
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [csRes, projRes] = await Promise.all([
        fetch("/api/admin/case-studies"),
        fetch("/api/admin/projects"),
      ]);

      const csData = await csRes.json();
      const projData = await projRes.json();

      if (csData.success) {
        setCaseStudies(csData.caseStudies);
      }

      if (projData.success) {
        setProjectsList(
          projData.projects.map((p: any) => ({
            id: p.id,
            title: p.title,
            company: p.company,
            slug: p.slug,
            coverImage: p.coverImage,
            description: p.description || p.subtitle,
            overview: p.overview,
            tags: p.tags,
            hasCaseStudy: Boolean(p.caseStudy),
          }))
        );
      }
    } catch {
      toast.error("Failed to load case studies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered & Sorted
  const filteredCaseStudies = useMemo(() => {
    return caseStudies
      .filter((cs) => {
        const q = searchQuery.toLowerCase();
        return (
          !q ||
          cs.project.title.toLowerCase().includes(q) ||
          cs.project.company.toLowerCase().includes(q) ||
          (cs.project.description || "").toLowerCase().includes(q) ||
          (cs.project.overview || "").toLowerCase().includes(q) ||
          cs.problem.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === "title") return a.project.title.localeCompare(b.project.title);
        if (sortBy === "company") return a.project.company.localeCompare(b.project.company);
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [caseStudies, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredCaseStudies.length / pageSize) || 1;
  const paginatedCaseStudies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCaseStudies.slice(start, start + pageSize);
  }, [filteredCaseStudies, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Selected project info for the modal
  const selectedProject = useMemo(() => {
    return projectsList.find((p) => p.id === formData.projectId);
  }, [projectsList, formData.projectId]);

  const handleOpenCreate = () => {
    setActiveItem(null);
    setFormData(initialForm);
    setPhotoUrlInput("");
    setModalMode("create");
  };

  const handleOpenEdit = (item: CaseStudyItem) => {
    setActiveItem(item);

    let parsedPhotos: string[] = [];
    try {
      if (Array.isArray(item.hiFidelity)) {
        parsedPhotos = item.hiFidelity;
      } else if (typeof item.hiFidelity === "string") {
        if (item.hiFidelity.startsWith("[")) {
          parsedPhotos = JSON.parse(item.hiFidelity);
        } else if (item.hiFidelity.trim()) {
          parsedPhotos = [item.hiFidelity.trim()];
        }
      }
    } catch {}

    // Fallback to wireframes if hiFidelity is empty
    if (parsedPhotos.length === 0) {
      try {
        if (Array.isArray(item.wireframes)) {
          parsedPhotos = item.wireframes;
        } else if (typeof item.wireframes === "string") {
          if (item.wireframes.startsWith("[")) {
            parsedPhotos = JSON.parse(item.wireframes);
          } else if (item.wireframes.trim()) {
            parsedPhotos = [item.wireframes.trim()];
          }
        }
      } catch {}
    }

    let parsedTags = "Mobile Apps, UI/UX";
    if (item.project.tags) {
      try {
        if (item.project.tags.startsWith("[")) {
          parsedTags = JSON.parse(item.project.tags).join(", ");
        } else {
          parsedTags = item.project.tags;
        }
      } catch {
        parsedTags = item.project.tags;
      }
    }

    setFormData({
      title: item.project.title || "",
      company: item.project.company || "",
      role: item.project.role || "Lead Product Designer",
      year: item.project.year || new Date().getFullYear().toString(),
      coverImage: item.project.coverImage || "",
      tags: parsedTags,
      overviewNote: item.problem || item.project.overview || item.project.description || "",
      photos: parsedPhotos,
      prototype: item.prototype || item.project.prototypeUrl || "",
      figmaEmbed: item.figmaEmbed || "",
      liveUrl: item.project.liveUrl || "",
      projectId: item.projectId,
    });
    setPhotoUrlInput("");
    setModalMode("edit");
  };

  // Upload single Cover Image
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (data.success && data.url) {
        setFormData((prev) => ({ ...prev, coverImage: data.url }));
        toast.success("Cover image uploaded!");
      } else {
        toast.error(data.error || "Failed to upload cover image");
      }
    } catch {
      toast.error("Failed to upload cover image");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  // Upload sequence of photos (Auto WebP conversion)
  const handleMultiPhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const body = new FormData();
        body.append("file", files[i]);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, ...uploadedUrls],
          coverImage: prev.coverImage || uploadedUrls[0],
        }));
        toast.success(`Added ${uploadedUrls.length} photo(s) to sequence (optimized to WebP)!`);
      }
    } catch {
      toast.error("Failed to upload photos");
    } finally {
      setUploadingPhotos(false);
      e.target.value = "";
    }
  };

  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    const url = photoUrlInput.trim();
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, url],
      coverImage: prev.coverImage || url,
    }));
    setPhotoUrlInput("");
    toast.success("Photo added to sequence");
  };

  const handleRemovePhoto = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const handleMovePhoto = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= formData.photos.length) return;

    const newPhotos = [...formData.photos];
    const temp = newPhotos[idx];
    newPhotos[idx] = newPhotos[targetIdx];
    newPhotos[targetIdx] = temp;

    setFormData((prev) => ({
      ...prev,
      photos: newPhotos,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a Case Study Title");
      return;
    }

    setSaving(true);
    const payload = {
      id: activeItem?.id,
      projectId: formData.projectId || undefined,
      title: formData.title.trim(),
      company: formData.company.trim() || "Independent Case Study",
      role: formData.role.trim() || "Lead Product Designer",
      year: formData.year.trim() || new Date().getFullYear().toString(),
      coverImage: formData.coverImage.trim() || (formData.photos.length > 0 ? formData.photos[0] : ""),
      tags: formData.tags.trim() || "Case Study",
      problem: formData.overviewNote || "",
      overviewNote: formData.overviewNote || "",
      hiFidelity: formData.photos,
      photos: formData.photos,
      wireframes: [],
      prototype: formData.prototype.trim() || null,
      figmaEmbed: formData.figmaEmbed.trim() || null,
      liveUrl: formData.liveUrl.trim() || null,
    };

    try {
      const res = await fetch("/api/admin/case-studies", {
        method: modalMode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(modalMode === "create" ? "Case study created from scratch!" : "Case study updated!");
        setModalMode(null);
        fetchData();
      } else {
        toast.error(data.error || "Failed to save case study");
      }
    } catch {
      toast.error("Network error while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/case-studies?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Case study deleted successfully");
        setDeleteConfirmId(null);
        fetchData();
      } else {
        toast.error(data.error || "Failed to delete case study");
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
            Case Studies CMS
          </h1>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Upload multiple presentation photos in sequence, review project details, and manage interactive prototype links.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add Case Study</span>
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
            placeholder="Search case studies by title, company, tags..."
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
            <option value="newest">Newest First</option>
            <option value="title">Project Title (A - Z)</option>
            <option value="company">Company Name</option>
          </select>
        </div>
      </div>

      {/* CARD GRID VIEW WITH BIG PHOTOS */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading case studies...</p>
        </div>
      ) : filteredCaseStudies.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border dark:border-dark-border rounded-lg p-8">
          <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-3">
            No case studies found matching your criteria.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold"
          >
            Create Your First Case Study
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedCaseStudies.map((cs) => {
            let photosCount = 0;
            try {
              if (Array.isArray(cs.hiFidelity)) photosCount += cs.hiFidelity.length;
              else if (typeof cs.hiFidelity === "string") {
                if (cs.hiFidelity.startsWith("[")) photosCount += JSON.parse(cs.hiFidelity).length;
                else if (cs.hiFidelity.trim()) photosCount += 1;
              }
            } catch {}

            try {
              if (Array.isArray(cs.wireframes)) photosCount += cs.wireframes.length;
              else if (typeof cs.wireframes === "string") {
                if (cs.wireframes.startsWith("[")) photosCount += JSON.parse(cs.wireframes).length;
              }
            } catch {}

            let tagsList: string[] = [];
            try {
              if (cs.project.tags) {
                if (cs.project.tags.startsWith("[")) tagsList = JSON.parse(cs.project.tags);
                else tagsList = cs.project.tags.split(",").map((s) => s.trim()).filter(Boolean);
              }
            } catch {}

            return (
              <div
                key={cs.id}
                className="group rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm hover:border-accent-purple/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* BIG PHOTO AREA */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-black/5 dark:bg-white/5 border-b border-border dark:border-dark-border">
                    <Image
                      src={cs.project.coverImage}
                      alt={cs.project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                    {/* Badges on top */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10">
                        {cs.project.company}
                      </span>
                      {photosCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-blue text-white flex items-center gap-1 shadow-sm">
                          <Images size={11} /> {photosCount} {photosCount === 1 ? "Photo in Sequence" : "Photos in Sequence"}
                        </span>
                      )}
                      {(cs.figmaEmbed || cs.prototype || cs.project.prototypeUrl) && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-600 text-white flex items-center gap-1 shadow-sm">
                          <Zap size={11} /> Prototype
                        </span>
                      )}
                    </div>

                    {/* Title on bottom */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <h3 className="font-clash font-bold text-base leading-snug drop-shadow-sm truncate">
                        {cs.project.title}
                      </h3>
                      <p className="text-[11px] font-satoshi text-white/80 truncate">
                        {cs.project.role || "Product Designer"} · {cs.project.year || "2024"}
                      </p>
                    </div>
                  </div>

                  {/* Content snippet: Description, Overview, and Tags */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-satoshi text-text-muted dark:text-white/60 line-clamp-2 leading-relaxed">
                      {cs.project.description || cs.project.overview || cs.problem || "No description provided."}
                    </p>

                    {/* Tags List */}
                    {tagsList.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tagsList.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] font-satoshi bg-black/5 dark:bg-white/5 border border-border/50 dark:border-dark-border text-text-secondary dark:text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                        {tagsList.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-text-muted dark:text-white/40">
                            +{tagsList.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 border-t border-border dark:border-dark-border bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-satoshi text-text-muted dark:text-white/50">
                    <ImageIcon size={12} className="text-accent-blue" />
                    <span>{photosCount} Photos</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {(cs.prototype || cs.project.prototypeUrl) && (
                      <a
                        href={cs.prototype || cs.project.prototypeUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
                        title="View Interactive Prototype"
                      >
                        <Zap size={14} />
                      </a>
                    )}
                    <Link
                      href={`/case-studies/${cs.project.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                      title="View public case study"
                    >
                      <Eye size={14} />
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(cs)}
                      className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                      title="Edit photo sequence & links"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(cs.id)}
                      className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete case study"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {filteredCaseStudies.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border dark:border-dark-border text-xs font-satoshi text-text-muted dark:text-white/50">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredCaseStudies.length)} of {filteredCaseStudies.length} case studies
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

      {/* STREAMLINED CASE STUDY MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border mb-5">
              <div>
                <h2 className="font-clash text-lg font-bold text-text-primary dark:text-white">
                  {modalMode === "create" ? "Create Case Study" : `Edit Case Study: ${activeItem?.project.title}`}
                </h2>
                <p className="text-xs text-text-muted dark:text-white/50 font-satoshi mt-0.5">
                  Upload multiple presentation photos in sequence and link prototypes.
                </p>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Creation Source Switcher (New from Scratch vs Link to Existing Project) */}
              {modalMode === "create" && (
                <div className="p-3 bg-black/[0.02] dark:bg-white/[0.02] border border-border dark:border-dark-border rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-satoshi font-semibold text-text-primary dark:text-white">
                      Case Study Source
                    </label>
                    <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi mt-0.5">
                      Create independently from scratch, or optionally connect an existing Design Project.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-md">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, projectId: "" }))}
                      className={`px-3 py-1 text-xs font-satoshi rounded font-medium transition-colors ${
                        !formData.projectId
                          ? "bg-accent-blue text-white shadow-sm"
                          : "text-text-muted dark:text-white/60 hover:text-text-primary dark:hover:text-white"
                      }`}
                    >
                      Create from New
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const first = projectsList.find((p) => !p.hasCaseStudy) || projectsList[0];
                        if (first) {
                          setFormData((prev) => ({
                            ...prev,
                            projectId: first.id,
                            title: first.title,
                            company: first.company,
                            coverImage: first.coverImage || prev.coverImage,
                            overviewNote: first.overview || first.description || prev.overviewNote,
                          }));
                        }
                      }}
                      className={`px-3 py-1 text-xs font-satoshi rounded font-medium transition-colors ${
                        formData.projectId
                          ? "bg-accent-blue text-white shadow-sm"
                          : "text-text-muted dark:text-white/60 hover:text-text-primary dark:hover:text-white"
                      }`}
                    >
                      Link to Existing Project
                    </button>
                  </div>
                </div>
              )}

              {/* Optional Existing Project Selector if user chose to link */}
              {formData.projectId && modalMode === "create" && (
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1.5">
                    Select Existing Project to Attach
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => {
                      const proj = projectsList.find((p) => p.id === e.target.value);
                      setFormData({
                        ...formData,
                        projectId: e.target.value,
                        title: proj?.title || formData.title,
                        company: proj?.company || formData.company,
                        coverImage: proj?.coverImage || formData.coverImage,
                        overviewNote: proj?.overview || proj?.description || formData.overviewNote,
                      });
                    }}
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  >
                    {projectsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.company}) {p.hasCaseStudy ? "— Already has case study" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Core Case Study Fields: Title, Company, Role, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Case Study Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. NextGen Mobile Banking Experience"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Company / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Stripe, Airbnb, or Personal Project"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    My Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead Product Designer, UX Researcher"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 2024"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              {/* Cover Image Upload & Preview */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1.5">
                  Cover Image (File Upload)
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary dark:text-white text-xs font-satoshi font-semibold transition-colors shrink-0 border border-border dark:border-dark-border">
                    <Upload size={14} />
                    <span>Upload Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                      disabled={uploadingCover}
                    />
                  </label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="Or paste image URL (or upload will populate automatically)"
                    className="flex-1 px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                {uploadingCover && (
                  <div className="mt-2 text-xs text-accent-blue font-satoshi flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                    <span>Uploading and converting cover image to WebP...</span>
                  </div>
                )}

                {formData.coverImage && (
                  <div className="mt-3 relative w-36 h-24 rounded-lg overflow-hidden border border-border dark:border-dark-border bg-black/5">
                    <Image src={formData.coverImage} alt="Cover Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Tags & Categories */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Mobile Apps, Fintech, Design System, UX Research"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              {/* Overview / Problem Statement */}
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Overview & Problem Statement
                </label>
                <textarea
                  rows={3}
                  value={formData.overviewNote}
                  onChange={(e) => setFormData({ ...formData, overviewNote: e.target.value })}
                  placeholder="Outline the core challenge, context, and user problem solved in this case study..."
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue resize-y"
                />
              </div>

              {/* UPLOAD MULTIPLE PHOTOS IN SEQUENCE */}
              <div className="p-4 rounded-xl border border-border dark:border-dark-border bg-white dark:bg-dark-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border dark:border-dark-border">
                  <div>
                    <h3 className="text-xs font-satoshi uppercase tracking-wider font-bold text-text-primary dark:text-white flex items-center gap-1.5">
                      <Images size={14} className="text-accent-blue" />
                      <span>Upload Photos in Sequence</span>
                    </h3>
                    <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi mt-0.5">
                      Upload multiple presentation slides, sketches, or screens. Auto-converts to WebP.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-accent-blue text-white shadow-sm self-start sm:self-auto">
                    {formData.photos.length} {formData.photos.length === 1 ? "Photo in Sequence" : "Photos in Sequence"}
                  </span>
                </div>

                {/* Upload Buttons & URL Input */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-sm">
                    <Upload size={14} />
                    <span>Choose Multiple Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultiPhotosUpload}
                      className="hidden"
                      disabled={uploadingPhotos}
                    />
                  </label>

                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPhotoUrl();
                        }
                      }}
                      placeholder="Or paste photo image URL and click Add"
                      className="w-full px-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-lg text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoUrl}
                      className="px-3.5 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-text-primary dark:text-white text-xs font-satoshi font-semibold rounded-lg shrink-0 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {uploadingPhotos && (
                  <div className="p-3 rounded-lg bg-accent-blue/10 text-accent-blue text-xs font-satoshi flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                    <span>Optimizing and uploading photos to WebP sequence...</span>
                  </div>
                )}

                {/* Sequential Photos List */}
                {formData.photos.length > 0 ? (
                  <div className="space-y-2 pt-2 max-h-72 overflow-y-auto pr-1">
                    {formData.photos.map((url, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-border dark:border-dark-border bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-3 hover:border-accent-blue/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Sequence Badge */}
                          <span className="w-7 h-7 rounded-md bg-accent-blue/10 text-accent-blue font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </span>

                          {/* Image thumbnail */}
                          <div className="relative w-16 h-10 rounded-md overflow-hidden shrink-0 border border-border dark:border-dark-border bg-black/5">
                            <Image src={url} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                          </div>

                          <span className="text-xs font-mono text-text-secondary dark:text-white/70 truncate">
                            {url}
                          </span>
                        </div>

                        {/* Order & Remove Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(idx, "up")}
                            disabled={idx === 0}
                            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-text-muted dark:text-white/60 disabled:opacity-30 transition-colors"
                            title="Move earlier in sequence"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(idx, "down")}
                            disabled={idx === formData.photos.length - 1}
                            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-text-muted dark:text-white/60 disabled:opacity-30 transition-colors"
                            title="Move later in sequence"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Remove photo from sequence"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center border border-dashed border-border dark:border-dark-border rounded-lg">
                    <p className="text-xs font-satoshi text-text-muted dark:text-white/40">
                      No photos added to the sequence yet. Click &quot;Choose Multiple Photos&quot; above to upload.
                    </p>
                  </div>
                )}
              </div>

              {/* Interactive Prototype / Figma URL Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Interactive Prototype URL (Figma / Live)
                  </label>
                  <input
                    type="url"
                    value={formData.prototype}
                    onChange={(e) => setFormData({ ...formData, prototype: e.target.value })}
                    placeholder="https://figma.com/proto/..."
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Figma Embed URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.figmaEmbed}
                    onChange={(e) => setFormData({ ...formData, figmaEmbed: e.target.value })}
                    placeholder="https://www.figma.com/embed?embed_host=share&..."
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-border dark:border-dark-border">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-lg border border-border dark:border-dark-border text-xs font-satoshi text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
                >
                  {saving ? "Saving..." : modalMode === "create" ? "Create Case Study" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-xl p-5 shadow-2xl text-left">
            <div className="flex items-center gap-2.5 text-red-500 mb-3">
              <AlertTriangle size={18} />
              <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white">Delete Case Study</h3>
            </div>
            <p className="text-xs font-satoshi text-text-muted dark:text-white/60 mb-5 leading-relaxed">
              Are you sure you want to remove this case study? The associated project will remain intact.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-md border border-border dark:border-dark-border text-xs font-satoshi text-text-secondary dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-md bg-red-500 text-white text-xs font-satoshi font-semibold hover:bg-red-600 transition-colors"
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
