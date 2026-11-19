"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function AnimatedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<
    "default" | "hover" | "click" | "project" | "hidden"
  >("default");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    let rafId: number;
    const animate = () => {
      dotX += (mouseX - dotX) * 0.08;
      dotY += (mouseY - dotY) * 0.08;
      cursor.style.transform = `translate(${dotX - 20}px, ${dotY - 20}px)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    const onMouseDown = () => setCursorState("click");
    const onMouseUp = () => setCursorState("default");

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    // Detect hover on interactive elements
    const handleEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;

      // In lightbox or dialogs, hide custom cursor so native cursor & hover effects work with 100% fidelity
      if (target.closest(".lightbox-overlay")) {
        setCursorState("hidden");
        setLabel("");
        return;
      }

      const card = target.closest("[data-cursor='project']");
      const link = target.closest("a, button, [role='button'], input, select, textarea, .cursor-pointer, [data-cursor-hover]");
      const view = target.closest("[data-cursor='view']");

      if (card) {
        setCursorState("project");
        setLabel("View");
      } else if (view) {
        setCursorState("project");
        setLabel(view.getAttribute("data-cursor-label") || "Open");
      } else if (link) {
        setCursorState("hover");
        setLabel("");
      } else {
        setCursorState("default");
        setLabel("");
      }
    };

    document.addEventListener("mouseover", handleEnter);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", handleEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const cursorSize =
    cursorState === "project" ? 80 : cursorState === "hover" ? 48 : 40;
  const cursorBg =
    cursorState === "project"
      ? "#4F8EF7"
      : cursorState === "hover"
      ? "rgba(79, 142, 247, 0.15)"
      : "transparent";
  const cursorBorder =
    cursorState === "default"
      ? "rgba(79, 142, 247, 0.5)"
      : "transparent";

  return (
    <div
      className="animated-cursor pointer-events-none fixed inset-0 z-[100000] hidden md:block transition-opacity duration-200"
      style={{ opacity: cursorState === "hidden" ? 0 : 1 }}
    >
      {/* Follower circle */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 flex items-center justify-center"
        style={{
          width: cursorSize,
          height: cursorSize,
          borderRadius: "50%",
          background: cursorBg,
          border: `1px solid ${cursorBorder}`,
          transition:
            "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s ease, border 0.3s ease",
          willChange: "transform",
        }}
      >
        {cursorState === "project" && label && (
          <span className="text-white text-xs font-satoshi font-semibold tracking-wide">
            {label}
          </span>
        )}
      </div>

      {/* Dot */}
      <div
        ref={dotRef}
        className="absolute top-0 left-0 rounded-full"
        style={{
          width: 8,
          height: 8,
          background: "#4F8EF7",
          willChange: "transform",
          transition: "opacity 0.2s ease",
          opacity: cursorState === "project" ? 0 : 1,
        }}
      />
    </div>
  );
}
