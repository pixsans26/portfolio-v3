"use client";

import { LenisProvider } from "@/components/providers/LenisProvider";
import AnimatedCursor from "@/components/ui/AnimatedCursor";
import PageLoader from "@/components/layout/PageLoader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CommandPalette from "@/components/ui/CommandPalette";
import { Toaster } from "sonner";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <PageLoader />
      <AnimatedCursor />
      <Navbar />
      <CommandPalette />
      <main>{children}</main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </LenisProvider>
  );
}
