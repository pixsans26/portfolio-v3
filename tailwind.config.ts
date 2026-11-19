import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAFA",
        dark: "#0A0A0A",
        "dark-card": "#111111",
        "dark-border": "#1A1A1A",
        "accent-blue": "#4F8EF7",
        "accent-blue-light": "#7AAEF9",
        "accent-purple": "#7C3AED",
        "accent-orange": "#F97316",
        "accent-green": "#22C55E",
        "text-primary": "#111111",
        "text-secondary": "#444444",
        "text-muted": "#6B7280",
        "text-light": "#9CA3AF",
        border: "#E5E7EB",
        "border-dark": "#1F1F1F",
        glass: "rgba(255,255,255,0.05)",
        "glass-dark": "rgba(0,0,0,0.3)",
      },
      fontFamily: {
        geist: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        satoshi: ["Satoshi", "sans-serif"],
        clash: ["Clash Display", "sans-serif"],
      },
      fontSize: {
        "hero": ["clamp(64px, 10vw, 120px)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "display": ["clamp(48px, 7vw, 96px)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "headline": ["clamp(36px, 5vw, 64px)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "title": ["clamp(24px, 3vw, 40px)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "body-lg": ["18px", { lineHeight: "1.75" }],
        "body": ["16px", { lineHeight: "1.7" }],
        "small": ["14px", { lineHeight: "1.6" }],
        "xs": ["12px", { lineHeight: "1.5", letterSpacing: "0.08em" }],
      },
      minWidth: {
        screen: "100vw",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "container": "1400px",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "glow-blue": "0 0 40px rgba(79, 142, 247, 0.3)",
        "glow-purple": "0 0 40px rgba(124, 58, 237, 0.3)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 12px 48px rgba(0, 0, 0, 0.15)",
        "glass": "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-hero": "linear-gradient(135deg, #0A0A0A 0%, #1a0a2e 50%, #0a0a1a 100%)",
        "gradient-accent": "linear-gradient(135deg, #4F8EF7 0%, #7C3AED 100%)",
        "gradient-warm": "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
        "noise": "url('/noise.svg')",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        "fade-in": "fade-in 0.6s ease forwards",
        "slide-up": "slide-up 0.6s ease forwards",
        "blink": "blink 1.2s step-end infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1200": "1200ms",
      },
    },
  },
  plugins: [],
};
export default config;
