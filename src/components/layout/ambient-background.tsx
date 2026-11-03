"use client";

import React from "react";

/**
 * AmbientAuroraBackground
 * Inspired by Uiverse "slimy-newt-42" by ariba_9087, customized to Maskani brand identity:
 * - Emerald-teal (#10b981, #0d9488, #14b8a6)
 * - Fresh mint (#6ee7b7, #a7f3d0)
 * - Cyan & turquoise (#22d3ee)
 * - Azure sky (#38bdf8, #93c5fd)
 * - Warm golden sand (#fde68a, #fed7aa)
 *
 * Implements a full-screen fixed ambient rotating mesh gradient:
 * - Base pastel gradient (#f0fdf9 -> #f4fbfb -> #fefcf3 -> #f0f9ff)
 * - Dual-layer conic gradients with soft brand stops rotating in opposite directions
 * - Hardware-accelerated GPU transforms with heavy blurs (65px - 80px)
 * - Radial overlay and frosted glass pass-through for Apple Tahoe / VisionOS aesthetics
 */
export function AmbientAuroraBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-50 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Base Pastel Linear Gradient */}
      <div className="slimy-base-gradient absolute inset-0 w-full h-full" />

      {/* 2. Rotating Dual-Layer Conic Gradient Aurora Mesh */}
      <div className="slimy-mesh-container absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Layer 1: Clockwise 10s Linear Infinite Rotation */}
        <div className="slimy-aurora-layer-1" />

        {/* Layer 2: Counter-Clockwise 14s Linear Infinite Rotation */}
        <div className="slimy-aurora-layer-2" />

        {/* 3. Radial Depth Light Overlay */}
        <div className="slimy-radial-overlay absolute inset-0" />

        {/* 4. Subtle Frosted Glass Veil to ensure ultra-clean text contrast */}
        <div className="absolute inset-0 backdrop-blur-[12px] bg-white/[0.04] dark:bg-black/30" />
      </div>
    </div>
  );
}
