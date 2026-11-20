"use client";

import { useState } from "react";
import { Lock, Mail, KeyRound, ArrowRight, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        // Full page reload so browser loads the authenticated session
        window.location.href = "/admin";
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("An error occurred connecting to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout min-h-screen bg-bg dark:bg-dark text-text-primary dark:text-white flex items-center justify-center p-6 text-left relative overflow-hidden transition-colors duration-300">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-accent-blue flex items-center justify-center mx-auto mb-3 shadow-sm text-white">
            <Lock size={20} />
          </div>
          <h1 className="font-clash text-xl font-bold text-text-primary dark:text-white">
            Admin CMS Login
          </h1>
          <p className="text-text-muted dark:text-white/50 text-xs font-satoshi mt-1">
            Access website controls, project showcase & case studies.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 rounded-lg border border-border dark:border-dark-border bg-white dark:bg-dark-card shadow-xl transition-colors duration-300">
          {error && (
            <div className="p-3 mb-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs font-satoshi flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/60 mb-1.5">
                Admin Email or Username
              </label>
              <div className="relative flex items-center">
                <Mail size={15} className="absolute left-3 text-text-muted dark:text-white/40 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 pl-9 pr-3 rounded-md bg-black/5 dark:bg-white/[0.04] border border-border dark:border-dark-border text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/30 font-satoshi text-xs focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                  placeholder="Enter your admin email or username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-satoshi uppercase font-semibold text-text-muted dark:text-white/60 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <KeyRound size={15} className="absolute left-3 text-text-muted dark:text-white/40 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 pl-9 pr-10 rounded-md bg-black/5 dark:bg-white/[0.04] border border-border dark:border-dark-border text-text-primary dark:text-white placeholder:text-text-muted dark:placeholder:text-white/30 font-satoshi text-xs focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-text-muted dark:text-white/40 hover:text-text-primary dark:hover:text-white transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md bg-accent-blue text-white font-satoshi font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to Admin CMS"}
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-border dark:border-dark-border text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-satoshi text-text-muted dark:text-white/50 hover:text-text-primary dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Live Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
