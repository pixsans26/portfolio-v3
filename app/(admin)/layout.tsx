"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "sonner";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname?.startsWith("/admin/login");
  const [checking, setChecking] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    let isMounted = true;
    setChecking(true);

    fetch("/api/admin/auth-check", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (!data.authenticated) {
          router.replace("/admin/login");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        router.replace("/admin/login");
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="admin-layout min-h-screen bg-bg dark:bg-dark text-text-primary dark:text-white">
        {children}
        <Toaster position="bottom-right" richColors />
      </div>
    );
  }

  if (checking) {
    return (
      <div className="admin-layout min-h-screen bg-bg dark:bg-dark flex items-center justify-center text-text-primary dark:text-white transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
          <p className="text-xs font-satoshi text-text-muted dark:text-white/50">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  // Authenticated Admin Shell: Fixed Height Sidebar + Top Bar + Scrollable Content
  return (
    <div className="admin-layout min-h-screen flex bg-bg dark:bg-dark text-text-primary dark:text-white transition-colors duration-300">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <AdminTopBar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
