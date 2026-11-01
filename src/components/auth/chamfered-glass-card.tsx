"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export type MorphPhase = "idle" | "converge" | "pulse" | "return";

interface ChamferedGlassCardProps {
  children: React.ReactNode;
  morphPhase?: MorphPhase;
  accentTheme?: "gold" | "emerald";
  className?: string;
}

/**
 * Generates an SVG path for a rectangle with:
 * - Top-left & bottom-right 45° chamfered corners (size `c`, vertex rounding `vc`)
 * - Top-right & bottom-left rounded corners (radius `r`)
 */
function buildChamferedPath(w: number, h: number, c = 44, r = 24, vc = 7): string {
  if (w <= 0 || h <= 0) return "";
  const d = vc * 0.7071; // 45-degree projection
  return [
    `M ${c + vc} 0`,
    `L ${w - r} 0`,
    `Q ${w} 0 ${w} ${r}`,
    `L ${w} ${h - c - vc}`,
    `Q ${w} ${h - c} ${w - d} ${h - c + d}`,
    `L ${w - c + d} ${h - d}`,
    `Q ${w - c} ${h} ${w - c - vc} ${h}`,
    `L ${r} ${h}`,
    `Q 0 ${h} 0 ${h - r}`,
    `L 0 ${c + vc}`,
    `Q 0 ${c} ${d} ${c - d}`,
    `L ${c - d} ${d}`,
    `Q ${c} 0 ${c + vc} 0`,
    "Z",
  ].join(" ");
}

export function ChamferedGlassCard({
  children,
  morphPhase = "idle",
  accentTheme = "gold",
  className = "",
}: ChamferedGlassCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 430, h: 490 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0 && h > 0) {
        setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
      }
    };
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, morphPhase]);

  const chamfer = 44;
  const cornerRadius = 24;
  const isCentered = morphPhase === "converge" || morphPhase === "pulse";
  const isPulsing = morphPhase === "pulse";

  // Bring both 38x38 corner shards into the exact center so their hypotenuses form a tight split-square [◤◢]
  const tlTargetX = Math.max(0, Math.round(size.w / 2 - 20));
  const tlTargetY = Math.max(0, Math.round(size.h / 2 - 20));
  const brTargetX = -Math.max(0, Math.round(size.w / 2 - 20));
  const brTargetY = -Math.max(0, Math.round(size.h / 2 - 20));

  const svgPath = buildChamferedPath(size.w, size.h, chamfer, cornerRadius, 8);

  const pulsePrimary = accentTheme === "gold" ? "#FACC15" : "#10B981";
  const pulseSecondary = accentTheme === "gold" ? "#F59E0B" : "#059669";

  return (
    <motion.div
      ref={containerRef}
      layout
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className={`relative w-full max-w-[440px] select-none ${className}`}
    >
      {/* 1. Ambient diagonal gold/emerald light ribbons behind the glass card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8 -z-10 overflow-hidden rounded-[36px] opacity-90"
      >
        <div
          className="absolute -top-16 -left-20 h-56 w-[140%] rotate-[22deg] rounded-full blur-2xl"
          style={{
            background:
              accentTheme === "gold"
                ? "linear-gradient(90deg, rgba(245,158,11,0.02) 0%, rgba(250,204,21,0.28) 48%, rgba(16,185,129,0.16) 85%, transparent 100%)"
                : "linear-gradient(90deg, rgba(16,185,129,0.04) 0%, rgba(16,185,129,0.30) 48%, rgba(250,204,21,0.18) 85%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-1/2 -left-24 h-20 w-[150%] rotate-[25deg] blur-md"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(251,191,36,0.22) 35%, rgba(255,255,255,0.12) 55%, rgba(16,185,129,0.18) 80%, transparent 98%)",
          }}
        />
        <div
          className="absolute -bottom-12 -right-20 h-48 w-[130%] rotate-[22deg] rounded-full blur-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(217,119,6,0.22) 50%, rgba(16,185,129,0.20) 90%)",
          }}
        />
      </div>

      {/* 2. Frosted Liquid Glass Layer clipped to the chamfered octagon */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: `${cornerRadius}px`,
          clipPath: `polygon(${chamfer}px 0, 100% 0, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, 0 100%, 0 ${chamfer}px)`,
          background:
            "linear-gradient(145deg, rgba(26, 26, 34, 0.78) 0%, rgba(13, 13, 19, 0.88) 55%, rgba(18, 18, 26, 0.84) 100%)",
          backdropFilter: "blur(28px) saturate(165%)",
          WebkitBackdropFilter: "blur(28px) saturate(165%)",
          boxShadow: "0 28px 70px -16px rgba(0, 0, 0, 0.82)",
        }}
      >
        {/* Subtle internal diagonal specular reflection */}
        <div
          className="absolute inset-0 opacity-35"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 32%, transparent 55%, rgba(250,204,21,0.06) 100%)",
          }}
        />
      </div>

      {/* 3. Crisp SVG Specular Border around all 6 chamfered + rounded vertices */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox={`0 0 ${size.w} ${size.h}`}
        fill="none"
      >
        <defs>
          <linearGradient id="maskaniChamferBorder" x1="0" y1="0" x2={size.w} y2={size.h} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.38)" />
            <stop offset="30%" stopColor="rgba(255, 255, 255, 0.12)" />
            <stop offset="70%" stopColor="rgba(250, 204, 21, 0.16)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.34)" />
          </linearGradient>
        </defs>
        {svgPath && (
          <path
            d={svgPath}
            stroke="url(#maskaniChamferBorder)"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* 4. Top-Left Detached Floating Triangular Shard (ShardTL) */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{
          x: isCentered ? tlTargetX : 0,
          y: isCentered ? tlTargetY : 0,
          scale: isPulsing ? 1.06 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 26,
          mass: 0.75,
        }}
        className="pointer-events-none absolute top-0 left-0 z-30 h-[38px] w-[38px]"
      >
        <svg viewBox="0 0 38 38" className="h-full w-full overflow-visible drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="shardTlFill" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.16)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.04)" />
            </linearGradient>
          </defs>
          <path
            d="M 8 1 L 31 1 Q 37 1 32.5 5.5 L 5.5 32.5 Q 1 37 1 31 L 1 8 Q 1 1 8 1 Z"
            fill="url(#shardTlFill)"
            stroke="rgba(255, 255, 255, 0.34)"
            strokeWidth="1.2"
          />
        </svg>
      </motion.div>

      {/* 5. Bottom-Right Detached Floating Triangular Shard (ShardBR) */}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{
          x: isCentered ? brTargetX : 0,
          y: isCentered ? brTargetY : 0,
          scale: isPulsing ? 1.06 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 26,
          mass: 0.75,
        }}
        className="pointer-events-none absolute right-0 bottom-0 z-30 h-[38px] w-[38px]"
      >
        <svg viewBox="0 0 38 38" className="h-full w-full overflow-visible drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="shardBrFill" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.18)" />
            </linearGradient>
          </defs>
          <path
            d="M 30 37 L 7 37 Q 1 37 5.5 32.5 L 32.5 5.5 Q 37 1 37 7 L 37 30 Q 37 37 30 37 Z"
            fill="url(#shardBrFill)"
            stroke="rgba(255, 255, 255, 0.34)"
            strokeWidth="1.2"
          />
        </svg>
      </motion.div>

      {/* 6. Center Energy Orb & Shockwave Ring during Sign In <-> Sign Up Morph (frames 1.76s - 1.96s) */}
      <AnimatePresence>
        {isPulsing && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
          >
            {/* Glowing Core Orb offset slightly to bottom-right of converged shards as in 1.84s */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.25, 1.35, 1.9], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.36, ease: "easeOut" }}
              className="h-14 w-14 translate-x-4 translate-y-4 rounded-full"
              style={{
                background: `radial-gradient(circle, #FFFBEB 0%, ${pulsePrimary} 38%, ${pulseSecondary} 65%, transparent 78%)`,
                boxShadow: `0 0 36px 8px ${pulsePrimary}`,
              }}
            />
            {/* Expanding Shockwave Halo Ring */}
            <motion.div
              initial={{ scale: 0.35, opacity: 0.9 }}
              animate={{ scale: 2.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: "easeOut" }}
              className="absolute h-16 w-16 translate-x-4 translate-y-4 rounded-full border-2"
              style={{
                borderColor: pulsePrimary,
                boxShadow: `0 0 24px ${pulseSecondary}`,
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* 7. Inner Content Container with blur/fade transition during morph */}
      <motion.div
        animate={{
          opacity: isCentered ? 0 : 1,
          scale: isCentered ? 0.96 : 1,
          filter: isCentered ? "blur(10px)" : "blur(0px)",
        }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
        className="relative z-20 px-7 py-7 sm:px-8 sm:py-8"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
