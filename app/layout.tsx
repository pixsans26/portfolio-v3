import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nitish Tao — Senior Product Designer",
    template: "%s | Nitish Tao — Senior Product Designer",
  },
  description:
    "Senior Product Designer crafting thoughtful, data-driven digital experiences for mobile apps, dashboards, and SaaS products. 6+ years shaping products at scale.",
  keywords: [
    "Product Designer",
    "UX Designer",
    "UI Designer",
    "Senior Designer",
    "Portfolio",
    "Case Studies",
    "Design Systems",
    "Mobile Apps",
    "Figma",
  ],
  authors: [{ name: "Nitish Tao" }],
  creator: "Nitish Tao",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500,400&f[]=satoshi@700,500,400"
        />
      </head>
      <body className="noise antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
