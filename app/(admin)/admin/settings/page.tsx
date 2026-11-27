"use client";

import { useEffect, useState } from "react";
import { Sliders, Save, Upload, Link as LinkIcon, CheckCircle2, Lock, FileArchive, Camera, Image as ImageIcon, User, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [settings, setSettings] = useState({
    heroName: "Nitish Tao",
    heroTitle: "Senior Product Designer",
    heroRoles: "Senior Product Designer, UX Designer, UI Designer, Problem Solver, System Thinker",
    heroBio: "I design products that ship, scale, and move metrics. 6 years crafting experiences for 100M+ users at Atlassian, CRED, Swiggy & Razorpay.",
    heroImage: "",
    yearsExperience: "2+",
    totalDesignsCreated: "50+",
    email: "nitishtao@gmail.com",
    phone: "+91 98765 43210",
    latestProject: "CRED Pay 2.0",
    resumeUrl: "",
    googleDriveFolderUrl: "https://drive.google.com/drive/folders/sample",
    experienceHeadline: "Where I've worked.",
    experienceSubtitle: "6 years across product design, design systems, and UX research — from seed-stage startups to 100M-user platforms.",
    heroSkills: "AI UX Research, Wireframing, Prototypes, Problem Solving",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Object.keys(data.settings).length > 0) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

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
        setSettings((prev) => ({ ...prev, resumeUrl: data.url }));
        toast.success("CV asset uploaded!");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success) {
        setSettings((prev) => ({ ...prev, heroImage: data.url }));
        await handleSave("heroImage", data.url);
        toast.success("Profile photo uploaded & saved!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (key: string, value: any) => {
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      for (const [k, v] of Object.entries(settings)) {
        await handleSave(k, v);
      }
      toast.success("All settings saved successfully!");
    } catch {
      toast.error("Failed to save some settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border dark:border-dark-border">
        <div>
          <h1 className="font-clash text-xl md:text-2xl font-bold text-text-primary dark:text-white">
            Site Controls & Hero Settings
          </h1>
          <p className="text-text-muted dark:text-white/50 font-satoshi text-xs mt-1">
            Configure hero copy, rotating designations, metric counters, asset links, and administration passwords.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Loading site controls...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleSaveAll} className="space-y-6">
            {/* Hero controls card */}
            <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border dark:border-dark-border">
                <Sliders size={16} className="text-accent-blue" />
                <h2 className="font-clash font-bold text-sm text-text-primary dark:text-white">
                  Hero Section Controls
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={settings.heroName}
                    onChange={(e) => setSettings({ ...settings, heroName: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Primary Title
                  </label>
                  <input
                    type="text"
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Rotating Hero Designations (Comma Separated)
                </label>
                <input
                  type="text"
                  value={settings.heroRoles}
                  onChange={(e) => setSettings({ ...settings, heroRoles: e.target.value })}
                  placeholder="e.g. Senior Product Designer, UX Designer, UI Designer, Problem Solver"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
                <p className="text-[10px] font-satoshi text-text-muted dark:text-white/40 mt-1">
                  These rotate continuously in the hero animated headline.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Hero Profile Skills Chips (Comma Separated)
                </label>
                <input
                  type="text"
                  value={settings.heroSkills}
                  onChange={(e) => setSettings({ ...settings, heroSkills: e.target.value })}
                  placeholder="AI UX Research, Wireframing, Prototypes, Problem Solving"
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
                <p className="text-[10px] font-satoshi text-text-muted dark:text-white/40 mt-1">
                  Replaces the old Title & Company chip on the hero portrait with your core skill badges.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Hero Bio Summary
                </label>
                <textarea
                  rows={3}
                  value={settings.heroBio}
                  onChange={(e) => setSettings({ ...settings, heroBio: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              {/* Hero Profile Photo & Admin Avatar Upload */}
              <div className="pt-3 border-t border-border dark:border-dark-border">
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-2 flex items-center gap-1.5">
                  <Camera size={13} className="text-accent-blue" />
                  Hero Profile Photo & Admin Avatar
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-lg border border-border/80 dark:border-dark-border bg-black/[0.02] dark:bg-white/[0.02]">
                  {/* Photo Preview */}
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-border dark:border-dark-border bg-black/5 dark:bg-dark-card shrink-0 flex items-center justify-center">
                    {settings.heroImage && settings.heroImage !== "/hero-portrait.png" ? (
                      <>
                        <img
                          src={settings.heroImage}
                          alt="Hero Profile"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-text-muted dark:text-white/40 text-[10px] text-center p-1">
                        <Camera size={18} className="mb-1 opacity-50 text-accent-blue" />
                        <span>No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:bg-blue-600 transition-colors cursor-pointer shadow-sm">
                        <Upload size={13} />
                        <span>{uploadingPhoto ? "Uploading..." : "Upload Profile Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploadingPhoto}
                          className="hidden"
                        />
                      </label>
                      {settings.heroImage && settings.heroImage !== "/hero-portrait.png" && (
                        <button
                          type="button"
                          onClick={async () => {
                            setSettings({ ...settings, heroImage: "" });
                            await handleSave("heroImage", "");
                            toast.success("Profile photo removed");
                          }}
                          className="px-2.5 py-1.5 rounded-md border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-satoshi transition-colors"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={settings.heroImage === "/hero-portrait.png" ? "" : (settings.heroImage || "")}
                        onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                        placeholder="Image URL or uploaded file path"
                        className="w-full px-3 py-1.5 text-xs font-mono bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                      />
                    </div>
                    <p className="text-[10px] font-satoshi text-text-muted dark:text-white/40">
                      Upload your transparent portrait PNG. It will appear on your homepage hero and admin profile.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Direct Contact Info (Email & Mobile Phone) */}
            <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border dark:border-dark-border">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-accent-blue" />
                  <h2 className="font-clash font-bold text-sm text-text-primary dark:text-white">
                    Home Hero Contact Info (Email & Mobile)
                  </h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue font-bold">
                  Displayed in Hero Section
                </span>
              </div>
              <p className="text-xs text-text-muted dark:text-white/50 font-satoshi">
                These contact details appear directly beneath the hero buttons on your homepage.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1 flex items-center gap-1.5">
                    <Mail size={12} className="text-accent-blue" /> Hero Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="e.g. nitishtao@gmail.com"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                  <p className="text-[10px] text-text-muted dark:text-white/40 font-satoshi mt-1">
                    Opens email app: <code className="font-mono text-accent-blue">mailto:{settings.email}</code>
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1 flex items-center gap-1.5">
                    <Phone size={12} className="text-accent-blue" /> Hero Mobile / WhatsApp Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                  <p className="text-[10px] text-text-muted dark:text-white/40 font-satoshi mt-1">
                    Triggers direct call: <code className="font-mono text-accent-blue">tel:{settings.phone}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Metric counters & Hero Stats card */}
            <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
              <h2 className="font-clash font-bold text-sm text-text-primary dark:text-white pb-2 border-b border-border dark:border-dark-border">
                Hero Section Stats & Counters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Years Experience
                  </label>
                  <input
                    type="text"
                    value={settings.yearsExperience}
                    onChange={(e) => setSettings({ ...settings, yearsExperience: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Total Designs Created Till Now
                  </label>
                  <input
                    type="text"
                    value={settings.totalDesignsCreated}
                    onChange={(e) => setSettings({ ...settings, totalDesignsCreated: e.target.value })}
                    placeholder="50+"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Latest Project Working On
                  </label>
                  <input
                    type="text"
                    value={settings.latestProject}
                    onChange={(e) => setSettings({ ...settings, latestProject: e.target.value })}
                    placeholder="e.g. CRED Pay 2.0"
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>
            </div>

            {/* Experience Section Headline & Subtitle Card */}
            <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border dark:border-dark-border">
                <h2 className="font-clash font-bold text-sm text-text-primary dark:text-white">
                  Experience Section Header (Homepage)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue font-bold">
                  Displayed above Experience Timeline
                </span>
              </div>
              <p className="text-xs text-text-muted dark:text-white/50 font-satoshi">
                Customize the headline and descriptive subtitle displayed on the public website homepage Experience section.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Experience Section Title / Headline
                  </label>
                  <input
                    type="text"
                    value={settings.experienceHeadline}
                    onChange={(e) => setSettings({ ...settings, experienceHeadline: e.target.value })}
                    placeholder="Where I've worked."
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                    Experience Section Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={settings.experienceSubtitle}
                    onChange={(e) => setSettings({ ...settings, experienceSubtitle: e.target.value })}
                    placeholder="6 years across product design, design systems, and UX research — from seed-stage startups to 100M-user platforms."
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* CV & Drive Links card */}
            <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
              <h2 className="font-clash font-bold text-sm text-text-primary dark:text-white pb-2 border-b border-border dark:border-dark-border">
                Asset Files & Google Drive Links
              </h2>
              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  CV File URL / Upload
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/5 dark:bg-white/10 text-text-primary dark:text-white text-xs font-satoshi font-semibold hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
                    <Upload size={13} /> Upload CV (PDF / Doc)
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {uploading && <span className="text-xs font-satoshi text-accent-blue">Uploading file...</span>}
                </div>
                <input
                  type="text"
                  value={settings.resumeUrl}
                  onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                />
              </div>

              <div>
                <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
                  Google Drive Folder Link
                </label>
                <div className="flex items-center gap-1.5">
                  <LinkIcon size={14} className="text-text-muted dark:text-white/40 shrink-0" />
                  <input
                    type="url"
                    value={settings.googleDriveFolderUrl}
                    onChange={(e) => setSettings({ ...settings, googleDriveFolderUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
              >
                <Save size={14} />
                <span>{saving ? "Saving All Settings..." : "Save Website Controls"}</span>
              </button>
            </div>
          </form>

          {/* Image Sequence ZIP Uploader Card */}
          <div className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border dark:border-dark-border">
              <FileArchive size={16} className="text-accent-blue" />
              <div>
                <h2 className="font-clash font-bold text-sm text-text-primary dark:text-white">
                  3D Image Sequence Frames ZIP Uploader
                </h2>
                <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi">
                  Upload a .zip file containing image frames (e.g. frame_001.png to frame_060.png) for live scroll rendering.
                </p>
              </div>
            </div>
            <SequenceZipUploader />
          </div>

          {/* Change Password Card */}
          <div id="password" className="p-5 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-border dark:border-dark-border">
              <Lock size={16} className="text-accent-blue" />
              <div>
                <h2 className="font-clash font-bold text-sm text-text-primary dark:text-white">
                  Change Admin Password
                </h2>
                <p className="text-[11px] text-text-muted dark:text-white/50 font-satoshi">
                  Update your authentication credentials stored securely in SQLite.
                </p>
              </div>
            </div>
            <ChangePasswordForm />
          </div>
        </div>
      )}
    </div>
  );
}

function ChangePasswordForm() {
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: string; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPass !== confPass) {
      setMsg({ type: "error", text: "New passwords do not match" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "Password successfully updated!" });
        setCurrPass("");
        setNewPass("");
        setConfPass("");
      } else {
        setMsg({ type: "error", text: data.error || "Failed to update password" });
      }
    } catch {
      setMsg({ type: "error", text: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      {msg && (
        <div
          className={`p-2.5 rounded-md text-xs font-satoshi ${
            msg.type === "success"
              ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div>
        <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
          Current Password
        </label>
        <input
          type="password"
          required
          value={currPass}
          onChange={(e) => setCurrPass(e.target.value)}
          placeholder="Enter current password"
          className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="At least 4 characters"
            className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>
        <div>
          <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/50 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confPass}
            onChange={(e) => setConfPass(e.target.value)}
            placeholder="Repeat new password"
            className="w-full px-3 py-2 text-xs font-satoshi bg-black/5 dark:bg-white/5 border border-border dark:border-dark-border rounded-md text-text-primary dark:text-white focus:outline-none focus:ring-1 focus:ring-accent-blue"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

function SequenceZipUploader() {
  const [zipUploading, setZipUploading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      setStatus({ type: "error", text: "Please select a valid .zip file containing image frames." });
      return;
    }

    setZipUploading(true);
    setStatus({ type: "info", text: "Extracting ZIP file frames into public/sequence..." });

    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-sequence", {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (data.success) {
        setStatus({ type: "success", text: data.message });
      } else {
        setStatus({ type: "error", text: data.error });
      }
    } catch {
      setStatus({ type: "error", text: "Failed to upload ZIP sequence." });
    } finally {
      setZipUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {status.text && (
        <div
          className={`p-2.5 rounded-md text-xs font-satoshi ${
            status.type === "success"
              ? "bg-accent-green/10 text-accent-green border border-accent-green/20"
              : status.type === "info"
              ? "bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent-blue text-white text-xs font-satoshi font-semibold hover:opacity-90 transition-opacity">
          <Upload size={14} /> Upload Image Sequence (.ZIP)
          <input type="file" onChange={handleZipUpload} className="hidden" accept=".zip" />
        </label>
        {zipUploading && <span className="text-xs font-satoshi text-accent-blue">Extracting frames...</span>}
      </div>
    </div>
  );
}
