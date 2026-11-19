"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Image as ImageIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_TOTAL_FRAMES = 60;

const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
  }
};

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgress = useRef(0);

  const [totalFrames, setTotalFrames] = useState(DEFAULT_TOTAL_FRAMES);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  // Fetch sequence settings from SQLite
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.sequence_total_frames) {
          const count = Number(data.settings.sequence_total_frames);
          if (count > 0) setTotalFrames(count);
        }
      })
      .catch(() => { });
  }, []);

  // Preload sequence frames
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let loaded = 0;
    let failed = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const padNum = String(i).padStart(3, "0");

      img.onload = () => {
        if (!isMounted) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded + failed === totalFrames && failed > totalFrames * 0.5) {
          setIsFallbackMode(true);
        }
      };

      // Try WebP first for optimal performance, then fallback to PNG and JPG
      img.onerror = () => {
        const pngFallback = new Image();
        pngFallback.onload = () => {
          if (!isMounted) return;
          loaded++;
          setLoadedCount(loaded);
          img.src = pngFallback.src;
        };
        pngFallback.onerror = () => {
          const jpgFallback = new Image();
          jpgFallback.onload = () => {
            if (!isMounted) return;
            loaded++;
            setLoadedCount(loaded);
            img.src = jpgFallback.src;
          };
          jpgFallback.onerror = () => {
            if (!isMounted) return;
            failed++;
            if (loaded + failed === totalFrames && failed > totalFrames * 0.5) {
              setIsFallbackMode(true);
            }
          };
          jpgFallback.src = `/sequence/frame_${padNum}.jpg`;
        };
        pngFallback.src = `/sequence/frame_${padNum}.png`;
      };

      img.src = `/sequence/frame_${padNum}.webp`;
      loadedImages.push(img);
    }

    setImages(loadedImages);

    return () => {
      isMounted = false;
    };
  }, [totalFrames]);

  // Canvas Render Function
  const renderFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const img = images[index];

      if (img && img.complete && img.naturalWidth > 0 && !isFallbackMode) {
        // Draw real image sequence frame
        const hRatio = width / img.width;
        const vRatio = height / img.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShiftX = (width - img.width * ratio) / 2;
        const centerShiftY = (height - img.height * ratio) / 2;

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShiftX,
          centerShiftY,
          img.width * ratio,
          img.height * ratio
        );
      } else {
        // Generative 3D Exploded Wireframe Fallback if ZIP not uploaded yet
        const t = (index / totalFrames) * Math.PI * 2;
        const centerX = width / 2;
        const centerY = height / 2;

        // Draw Ambient Radial Background Glow
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          20,
          centerX,
          centerY,
          width * 0.4
        );
        gradient.addColorStop(0, "rgba(79, 142, 247, 0.25)");
        gradient.addColorStop(0.5, "rgba(124, 58, 237, 0.15)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw 3D Phone Chassis Box
        const phoneW = Math.min(width * 0.35, 320);
        const phoneH = phoneW * 2.1;
        const explodeOffset = (index / totalFrames) * 140;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(Math.sin(t * 0.5) * 0.15);

        // Base Phone Body
        ctx.strokeStyle = "#4F8EF7";
        ctx.lineWidth = 3;
        ctx.fillStyle = "#111827";
        ctx.beginPath();
        drawRoundRect(ctx, -phoneW / 2, -phoneH / 2, phoneW, phoneH, 24);
        ctx.fill();
        ctx.stroke();

        // Exploded UI Layer 1 (Header System)
        ctx.fillStyle = "rgba(79, 142, 247, 0.2)";
        ctx.strokeStyle = "#4F8EF7";
        ctx.lineWidth = 2;
        ctx.beginPath();
        drawRoundRect(
          ctx,
          -phoneW / 2 + 15 - explodeOffset * 0.6,
          -phoneH / 2 + 20 - explodeOffset,
          phoneW - 30,
          80,
          16
        );
        ctx.fill();
        ctx.stroke();

        // Exploded UI Layer 2 (Analytics Card)
        ctx.fillStyle = "rgba(124, 58, 237, 0.25)";
        ctx.strokeStyle = "#7C3AED";
        ctx.beginPath();
        drawRoundRect(
          ctx,
          -phoneW / 2 + 15 + explodeOffset * 0.8,
          -phoneH / 2 + 120,
          phoneW - 30,
          160,
          16
        );
        ctx.fill();
        ctx.stroke();

        // Exploded UI Layer 3 (System Data Grid)
        ctx.fillStyle = "rgba(249, 115, 22, 0.2)";
        ctx.strokeStyle = "#F97316";
        ctx.beginPath();
        drawRoundRect(
          ctx,
          -phoneW / 2 + 15 - explodeOffset * 0.5,
          -phoneH / 2 + 300 + explodeOffset * 0.7,
          phoneW - 30,
          100,
          16
        );
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    },
    [images, totalFrames, isFallbackMode]
  );

  // Resize canvas to window DPI
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      renderFrame(currentFrameIndex);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame, currentFrameIndex]);

  // GSAP ScrollTrigger Sequence Driver
  useEffect(() => {
    const gsapCtx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
        onUpdate: (self) => {
          const progress = self.progress;
          scrollProgress.current = progress;
          const frameIdx = Math.min(
            totalFrames - 1,
            Math.max(0, Math.floor(progress * totalFrames))
          );
          setCurrentFrameIndex(frameIdx);
          renderFrame(frameIdx);
        },
      });
    }, containerRef);

    return () => {
      gsapCtx.revert();
    };
  }, [totalFrames, renderFrame]);

  return (
    <div ref={containerRef} className="relative min-h-[300vh] bg-bg dark:bg-dark text-left transition-colors duration-300">
      {/* Sticky Sequence Canvas */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10">
        {/* Frame Counter HUD */}
        <div className="absolute top-6 right-6 md:top-10 md:right-10 pointer-events-none z-20">
          <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-md border border-border dark:border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
            <ImageIcon size={14} className="text-accent-blue" />
            <span className="text-text-primary dark:text-white/80 font-mono text-xs">
              Frame {String(currentFrameIndex + 1).padStart(3, "0")} / {totalFrames}
            </span>
          </div>
        </div>

        {/* High-Performance Canvas Renderer */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
