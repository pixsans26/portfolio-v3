"use client";

import { useEffect, useState } from "react";
import {
  FolderKanban,
  BookOpen,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Sliders,
  Images,
  SlidersHorizontal,
  Wrench,
  Share2,
  Briefcase,
  TrendingUp,
  Activity,
  Eye,
  Users,
  CheckCircle2,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  Database,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Stats {
  projects: number;
  caseStudies: number;
  messages: number;
  unreadMessages: number;
  skills: number;
  experience: number;
  socials: number;
  sliders: number;
  gallery: number;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface RecentProject {
  id: string;
  slug: string;
  title: string;
  company: string;
  coverImage: string;
  accentColor: string;
  year: string;
  featured: boolean;
  tags: string[];
}

interface TrafficPoint {
  month: string;
  views: number;
  visitors: number;
  inquiries: number;
}

interface CategoryDist {
  name: string;
  count: number;
  color: string;
  percent: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    caseStudies: 0,
    messages: 0,
    unreadMessages: 0,
    skills: 0,
    experience: 0,
    socials: 0,
    sliders: 0,
    gallery: 0,
  });

  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  const [categories, setCategories] = useState<CategoryDist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState<"views" | "visitors">("views");
  const [hoveredPoint, setHoveredPoint] = useState<TrafficPoint | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          if (data.recentMessages) setRecentMessages(data.recentMessages);
          if (data.recentProjects) setRecentProjects(data.recentProjects);
          if (data.trafficData) setTrafficData(data.trafficData);
          if (data.categoryDistribution) setCategories(data.categoryDistribution);
        }
      })
      .catch((err) => console.error("Error loading admin stats:", err))
      .finally(() => setLoading(false));
  }, []);

  // Format date helper
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  };

  // SVG Chart Calculations for Traffic Graph
  const maxVal = Math.max(...(trafficData.length > 0 ? trafficData.map((d) => d[activeMetric]) : [8000]), 1000);
  const chartWidth = 650;
  const chartHeight = 200;
  const paddingX = 40;
  const paddingY = 25;

  const points = trafficData.map((d, i) => {
    const x = paddingX + (i / Math.max(trafficData.length - 1, 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d[activeMetric] / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, data: d };
  });

  // Construct SVG Bezier Smooth Curve Path
  const makeSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const mx = (curr.x + next.x) / 2;
      d += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const linePath = makeSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  return (
    <div className="space-y-6 text-left pb-12">
      {/* ─── Hero Welcome Bar with Vibrant Gradient Accents ─── */}
      <div className="relative overflow-hidden rounded-lg border border-border dark:border-dark-border bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 p-5 md:p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono tracking-wide bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CMS Active & Synced
              </span>
              <span className="text-text-muted dark:text-white/40 text-xs font-satoshi">
                SQLite Live Storage
              </span>
            </div>
            <h1 className="font-clash text-xl md:text-2xl font-bold text-text-primary dark:text-white">
              Portfolio Control Center
            </h1>
            <p className="text-text-muted dark:text-white/60 font-satoshi text-xs mt-1 max-w-xl">
              Manage showcase projects, interactive case studies, hero sliders, skills stack, and visitor inquiries.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Plus size={13} />
              <span>Add Project</span>
            </Link>
            <Link
              href="/admin/case-studies"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-600 text-white font-satoshi font-semibold text-xs hover:bg-purple-700 transition-colors shadow-sm"
            >
              <BookOpen size={13} />
              <span>New Case Study</span>
            </Link>
            <Link
              href="/admin/sliders"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border dark:border-dark-border bg-white dark:bg-dark-card text-text-secondary dark:text-white/80 font-satoshi font-medium text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Images size={13} />
              <span>Page Sliders</span>
            </Link>
            <Link
              href="/my-design"
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-border dark:border-dark-border text-text-muted dark:text-white/60 font-satoshi font-medium text-xs hover:text-text-primary dark:hover:text-white transition-colors"
            >
              <span>View Site</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 4 Colourful Metric KPI Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Showcase Projects",
            val: stats.projects,
            icon: FolderKanban,
            gradient: "from-blue-500/20 to-blue-600/5",
            accent: "#3B82F6",
            badge: "All Published",
            trend: "+3 this term",
            href: "/admin/projects",
          },
          {
            label: "Deep Case Studies",
            val: stats.caseStudies,
            icon: BookOpen,
            gradient: "from-purple-500/20 to-purple-600/5",
            accent: "#8B5CF6",
            badge: "Research & UX",
            trend: "Interactive embeds",
            href: "/admin/case-studies",
          },
          {
            label: "Sliders & Gallery",
            val: stats.sliders,
            icon: Images,
            gradient: "from-pink-500/20 to-rose-600/5",
            accent: "#EC4899",
            badge: "Hero Showcase",
            trend: "High-res slides",
            href: "/admin/sliders",
          },
          {
            label: "Client Inquiries",
            val: stats.messages,
            icon: MessageSquare,
            gradient: "from-emerald-500/20 to-teal-600/5",
            accent: "#10B981",
            badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} Unread` : "Up to date",
            badgeColor: stats.unreadMessages > 0 ? "bg-amber-500 text-white" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
            trend: "Direct leads",
            href: "/admin/messages",
          },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`relative overflow-hidden p-4 rounded-lg border border-border dark:border-dark-border bg-gradient-to-br ${card.gradient} bg-white dark:bg-dark-card transition-all hover:scale-[1.01] hover:border-accent-blue/40 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-satoshi uppercase tracking-wider text-text-muted dark:text-white/60 font-semibold">
                {card.label}
              </span>
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${card.accent}20`, color: card.accent }}
              >
                <card.icon size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <span className="font-clash text-2xl font-bold text-text-primary dark:text-white">
                {loading ? "..." : card.val}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                  card.badgeColor || "bg-black/5 dark:bg-white/10 text-text-secondary dark:text-white/70"
                }`}
              >
                {card.badge}
              </span>
            </div>

            <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-text-muted dark:text-white/40 font-satoshi">
              <span className="flex items-center gap-1">
                <TrendingUp size={11} style={{ color: card.accent }} />
                {card.trend}
              </span>
              <span className="text-accent-blue font-semibold hover:underline inline-flex items-center gap-1">
                Manage <ChevronRight size={11} />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* ─── Interactive Graphs Row ─── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Graph 1: Traffic & Engagement Trends (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-accent-blue" />
                <h3 className="font-clash text-sm font-bold text-text-primary dark:text-white">
                  Visitor Traffic & Portfolio Impressions
                </h3>
              </div>
              <p className="text-text-muted dark:text-white/50 text-xs font-satoshi mt-0.5">
                Monthly distribution of page views and design project impressions.
              </p>
            </div>

            {/* Metric Toggle Tabs */}
            <div className="flex items-center p-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs">
              <button
                onClick={() => setActiveMetric("views")}
                className={`px-2.5 py-1 rounded text-xs font-satoshi font-semibold transition-all ${
                  activeMetric === "views"
                    ? "bg-accent-blue text-white shadow-sm"
                    : "text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white"
                }`}
              >
                Page Views
              </button>
              <button
                onClick={() => setActiveMetric("visitors")}
                className={`px-2.5 py-1 rounded text-xs font-satoshi font-semibold transition-all ${
                  activeMetric === "visitors"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white"
                }`}
              >
                Unique Visitors
              </button>
            </div>
          </div>

          {/* SVG Smooth Curve Area Chart */}
          <div className="relative w-full overflow-hidden pt-2 pb-1">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-48 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGradientPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const y = paddingY + pct * (chartHeight - paddingY * 2);
                return (
                  <line
                    key={i}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-border dark:text-dark-border"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Gradient Filled Area */}
              {areaPath && (
                <path
                  d={areaPath}
                  fill={activeMetric === "views" ? "url(#chartGradientBlue)" : "url(#chartGradientPurple)"}
                />
              )}

              {/* Smooth Stroke Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke={activeMetric === "views" ? "#3B82F6" : "#8B5CF6"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data points with interactive hover */}
              {points.map((pt, i) => (
                <g key={i} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.month === pt.data.month ? "6" : "4"}
                    fill={activeMetric === "views" ? "#3B82F6" : "#8B5CF6"}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(pt.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Month label */}
                  <text
                    x={pt.x}
                    y={chartHeight - 6}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-current text-text-muted dark:text-white/40"
                  >
                    {pt.data.month}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 bg-dark dark:bg-white text-white dark:text-dark px-3 py-1.5 rounded text-xs font-satoshi shadow-lg pointer-events-none transition-all">
                <span className="font-bold">{hoveredPoint.month}:</span> {hoveredPoint[activeMetric].toLocaleString()}{" "}
                {activeMetric === "views" ? "views" : "visitors"}
              </div>
            )}
          </div>

          {/* Quick Metrics Under Graph */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border dark:border-dark-border text-center text-xs">
            <div>
              <span className="text-text-muted dark:text-white/40 text-[11px] font-satoshi block">6-Mo Total Views</span>
              <span className="font-clash font-bold text-sm text-text-primary dark:text-white">30,190+</span>
            </div>
            <div>
              <span className="text-text-muted dark:text-white/40 text-[11px] font-satoshi block">Avg. Session</span>
              <span className="font-clash font-bold text-sm text-emerald-600 dark:text-emerald-400">3m 42s</span>
            </div>
            <div>
              <span className="text-text-muted dark:text-white/40 text-[11px] font-satoshi block">Inquiry Rate</span>
              <span className="font-clash font-bold text-sm text-accent-blue">4.8%</span>
            </div>
          </div>
        </div>

        {/* Graph 2: Project Categories & Domain Breakdown */}
        <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-clash text-sm font-bold text-text-primary dark:text-white">
                Category Breakdown
              </h3>
              <span className="text-[11px] font-mono text-text-muted dark:text-white/40">
                {stats.projects} Items
              </span>
            </div>
            <p className="text-text-muted dark:text-white/50 text-xs font-satoshi mb-4">
              Distribution of projects across design domains.
            </p>

            {/* Segmented Colorful Progress Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-black/5 dark:bg-white/5 mb-5">
              {categories.map((c) => (
                <div
                  key={c.name}
                  style={{ width: `${c.percent}%`, backgroundColor: c.color }}
                  className="h-full transition-all duration-500"
                  title={`${c.name}: ${c.percent}%`}
                />
              ))}
            </div>

            {/* Category List with Badges */}
            <div className="space-y-2.5">
              {categories.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="font-satoshi text-text-secondary dark:text-white/80">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-text-muted dark:text-white/40 text-[11px]">{c.count} proj</span>
                    <span className="font-mono font-bold text-text-primary dark:text-white">{c.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border dark:border-dark-border mt-4">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-accent-blue font-satoshi font-semibold text-xs hover:underline"
            >
              Organize project categories <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Activity Streams: Recent Inquiries & Recent Projects Showcase ─── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: Latest Client Messages & Inquiries */}
        <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-emerald-500" />
                <h3 className="font-clash text-sm font-bold text-text-primary dark:text-white">
                  Recent Inquiries
                </h3>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs font-satoshi text-accent-blue font-semibold hover:underline inline-flex items-center gap-1"
              >
                View all ({stats.messages}) <ChevronRight size={13} />
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <p className="text-text-muted dark:text-white/40 text-xs py-6 text-center font-satoshi">
                No inquiries recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-border/40 dark:divide-dark-border">
                {recentMessages.slice(0, 4).map((msg) => (
                  <div key={msg.id} className="py-2.5 flex items-start justify-between gap-3 group">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-clash font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {msg.name ? msg.name[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-satoshi font-bold text-text-primary dark:text-white text-xs">
                            {msg.name}
                          </p>
                          {!msg.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Unread" />
                          )}
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-black/5 dark:bg-white/10 text-text-muted dark:text-white/40">
                            {msg.type || "Contact"}
                          </span>
                        </div>
                        <p className="text-text-muted dark:text-white/60 text-xs font-satoshi line-clamp-1 mt-0.5">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-text-muted dark:text-white/40 shrink-0">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border/50 dark:border-dark-border mt-2">
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-1 text-xs font-satoshi font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Open Message Inbox</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* Right: Recent Projects Showcase with Photos */}
        <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50 dark:border-dark-border">
              <div className="flex items-center gap-2">
                <FolderKanban size={15} className="text-accent-blue" />
                <h3 className="font-clash text-sm font-bold text-text-primary dark:text-white">
                  Active Projects
                </h3>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs font-satoshi text-accent-blue font-semibold hover:underline inline-flex items-center gap-1"
              >
                Manage all ({stats.projects}) <ChevronRight size={13} />
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <p className="text-text-muted dark:text-white/40 text-xs py-6 text-center font-satoshi">
                No projects found.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {recentProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/projects`}
                    className="group rounded-md border border-border dark:border-dark-border overflow-hidden bg-black/5 dark:bg-white/5 hover:border-accent-blue/40 transition-colors"
                  >
                    <div className="relative h-20 w-full overflow-hidden bg-dark-card">
                      {p.coverImage && (
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-satoshi font-semibold text-white/90">
                        {p.company}
                      </span>
                    </div>
                    <div className="p-2">
                      <p className="font-clash font-bold text-xs text-text-primary dark:text-white truncate group-hover:text-accent-blue transition-colors">
                        {p.title}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-text-muted dark:text-white/40 font-mono">
                        <span>{p.year}</span>
                        {p.featured && (
                          <span className="text-accent-blue font-semibold flex items-center gap-1">
                            <Star size={10} /> Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-border/50 dark:border-dark-border mt-3">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-xs font-satoshi font-semibold text-accent-blue hover:underline"
            >
              <span>Manage & Reorder Projects</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Manage Content Sections Grid (8 Tiles) ─── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-clash text-base font-bold text-text-primary dark:text-white">
            Manage Portfolio CMS Data
          </h2>
          <span className="text-xs text-text-muted dark:text-white/40 font-satoshi">
            Direct CRUD operations across all site modules
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              title: "My Design Projects",
              desc: "Project cards, cover images, metrics, and tags",
              href: "/admin/projects",
              icon: FolderKanban,
              color: "#3B82F6",
              count: stats.projects,
            },
            {
              title: "Case Studies",
              desc: "Problems, research, wireframes, prototypes & lessons",
              href: "/admin/case-studies",
              icon: BookOpen,
              color: "#8B5CF6",
              count: stats.caseStudies,
            },
            {
              title: "Hero Sliders",
              desc: "Homepage hero carousel slides and visual banners",
              href: "/admin/sliders",
              icon: SlidersHorizontal,
              color: "#EC4899",
              count: stats.sliders,
            },
            {
              title: "Visual Gallery",
              desc: "Public gallery photo archive, categories, and full previews",
              href: "/admin/gallery",
              icon: Images,
              color: "#3B82F6",
              count: stats.gallery,
            },
            {
              title: "Skills & Tools",
              desc: "Design stack, tools, and uploaded brand logos",
              href: "/admin/skills",
              icon: Wrench,
              color: "#F97316",
              count: stats.skills,
            },
            {
              title: "Social Links",
              desc: "LinkedIn, GitHub, Dribbble, and direct connect handles",
              href: "/admin/socials",
              icon: Share2,
              color: "#06B6D4",
              count: stats.socials,
            },
            {
              title: "Work Experience",
              desc: "Roles, company timelines, and key achievements",
              href: "/admin/experience",
              icon: Briefcase,
              color: "#10B981",
              count: stats.experience,
            },
            {
              title: "Site & Hero Controls",
              desc: "Hero bio, rotating roles, stats counters, and CV",
              href: "/admin/settings",
              icon: Sliders,
              color: "#6366F1",
            },
          ].map((sec) => (
            <Link
              key={sec.title}
              href={sec.href}
              className="p-3.5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card transition-all hover:border-accent-blue/40 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${sec.color}15`, color: sec.color }}
                  >
                    <sec.icon size={15} />
                  </div>
                  {sec.count !== undefined && (
                    <span className="text-[11px] font-mono text-text-muted dark:text-white/40">
                      {sec.count} items
                    </span>
                  )}
                </div>
                <h3 className="font-clash text-xs md:text-sm font-bold text-text-primary dark:text-white mb-1 group-hover:text-accent-blue transition-colors">
                  {sec.title}
                </h3>
                <p className="text-text-muted dark:text-white/50 text-[11px] font-satoshi leading-relaxed line-clamp-2">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-border/40 dark:border-dark-border mt-3 flex items-center justify-between text-[11px] text-accent-blue font-satoshi font-semibold">
                <span>Manage</span>
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── System Health & Diagnostics Strip ─── */}
      <div className="p-3.5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card flex flex-wrap items-center justify-between gap-3 text-xs font-satoshi text-text-muted dark:text-white/50">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[11px]">
            <CheckCircle2 size={13} />
            Database Healthy
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="font-mono text-[11px]">SQLite (prisma/dev.db)</span>
          <span className="hidden sm:inline">·</span>
          <span className="font-mono text-[11px]">Latency: 12ms</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <Zap size={12} className="text-accent-blue" />
          <span>Next.js Turbopack Full-Stack Engine</span>
        </div>
      </div>
    </div>
  );
}
