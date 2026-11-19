"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MessageSquare,
  Mail,
  Trash2,
  CheckCircle2,
  Building,
  Calendar,
  Filter,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
  X
} from "lucide-react";
import { toast } from "sonner";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, filter, pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // View modal & delete confirm
  const [activeMessage, setActiveMessage] = useState<MessageItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.success) setMessages(data.messages);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (msg: MessageItem) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, read: !msg.read }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
        );
        toast.success(msg.read ? "Marked as unread" : "Marked as read");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Message deleted");
        setDeleteConfirmId(null);
        if (activeMessage?.id === id) setActiveMessage(null);
        fetchMessages();
      } else {
        toast.error("Failed to delete message");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.company || "").toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (statusFilter === "unread") return !m.read;
      if (statusFilter === "read") return m.read;
      return true;
    });
  }, [messages, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredMessages.length / pageSize) || 1;
  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMessages.slice(start, start + pageSize);
  }, [filteredMessages, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border dark:border-dark-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-clash text-xl md:text-2xl font-bold text-text-primary dark:text-white">
              Visitor Messages Inbox
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent-orange text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Review incoming inquiries, collaborations, and role requests from the contact page.
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="p-3 bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-white/40 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, company or keyword..."
            className="w-full pl-8 pr-3 py-1.5 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted dark:text-white/40 text-xs font-satoshi">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-md bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border text-xs text-text-primary dark:text-white font-satoshi focus:outline-none focus:ring-1 focus:ring-accent-blue"
          >
            <option value="all">All Messages ({messages.length})</option>
            <option value="unread">Unread Only ({unreadCount})</option>
            <option value="read">Read Archive ({messages.length - unreadCount})</option>
          </select>
        </div>
      </div>

      {/* CARD GRID VIEW */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading messages from SQLite...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border dark:border-dark-border rounded-lg p-8">
          <p className="text-sm font-satoshi text-text-muted dark:text-white/50 mb-1">
            No messages found.
          </p>
          <p className="text-xs font-satoshi text-text-muted dark:text-white/40">
            Messages sent via the Contact page form will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                msg.read
                  ? "bg-white dark:bg-dark-card border-border dark:border-dark-border shadow-sm"
                  : "bg-accent-blue/[0.03] dark:bg-accent-blue/[0.08] border-accent-blue/40 shadow-sm"
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />}
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/5 text-text-muted dark:text-white/50 border border-border/50 dark:border-dark-border">
                      {msg.type}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-text-muted dark:text-white/40">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Name & Email */}
                <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white leading-tight">
                  {msg.name}
                </h3>
                <p className="text-[11px] font-satoshi text-text-muted dark:text-white/50 mb-3 truncate">
                  {msg.email} {msg.company ? `· ${msg.company}` : ""}
                </p>

                {/* Message preview */}
                <p className="text-xs font-satoshi text-text-secondary dark:text-white/80 leading-relaxed line-clamp-3 mb-3">
                  {msg.message}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-border dark:border-dark-border flex items-center justify-between">
                <button
                  onClick={() => toggleReadStatus(msg)}
                  className={`text-[11px] font-satoshi font-medium hover:underline ${
                    msg.read ? "text-text-muted dark:text-white/40" : "text-accent-blue font-semibold"
                  }`}
                >
                  {msg.read ? "Mark as Unread" : "Mark as Read"}
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={`mailto:${msg.email}?subject=Reply to inquiry: ${encodeURIComponent(msg.type)}`}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-accent-blue hover:bg-accent-blue/10 transition-colors"
                    title="Send Email Reply"
                  >
                    <Mail size={13} />
                  </a>
                  <button
                    onClick={() => setActiveMessage(msg)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    title="View Full Message"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(msg.id)}
                    className="p-1.5 rounded-md text-text-muted dark:text-white/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Delete Message"
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
      {filteredMessages.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border dark:border-dark-border text-xs font-satoshi text-text-muted dark:text-white/50">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredMessages.length)} of {filteredMessages.length} messages
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

      {/* VIEW MESSAGE MODAL */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-dark-border mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-accent-blue/10 text-accent-blue px-2 py-0.5 rounded font-semibold">
                  {activeMessage.type}
                </span>
                <h2 className="font-clash text-lg font-bold text-text-primary dark:text-white mt-1">
                  From: {activeMessage.name}
                </h2>
                <p className="text-xs text-text-muted dark:text-white/50 font-satoshi">
                  {activeMessage.email} {activeMessage.company ? `· ${activeMessage.company}` : ""}
                </p>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-md bg-black/5 dark:bg-white/5 text-xs font-satoshi text-text-primary dark:text-white/90 leading-relaxed whitespace-pre-wrap mb-4">
              {activeMessage.message}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border dark:border-dark-border">
              <span className="text-[11px] font-mono text-text-muted dark:text-white/40">
                Received: {new Date(activeMessage.createdAt).toLocaleString()}
              </span>
              <div className="flex gap-2">
                <a
                  href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.type)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90"
                >
                  <Mail size={13} /> Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-dark-card border border-border dark:border-dark-border rounded-lg p-5 shadow-2xl text-left">
            <div className="flex items-center gap-2.5 text-red-500 mb-3">
              <AlertTriangle size={18} />
              <h3 className="font-clash font-bold text-sm text-text-primary dark:text-white">Delete Message</h3>
            </div>
            <p className="text-xs font-satoshi text-text-muted dark:text-white/60 mb-5 leading-relaxed">
              Are you sure you want to permanently delete this message inquiry?
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
