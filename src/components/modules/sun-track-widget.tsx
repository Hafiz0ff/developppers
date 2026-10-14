"use client";

import React, { useState, useMemo } from "react";
import { Sun, Compass as CompassIcon, Sparkles } from "lucide-react";

interface SunTrackProps {
  onTimeChange?: (hours: number) => void;
  className?: string;
}

export function SunTrackCompass({ timeHours }: { timeHours: number }) {
  // Normalize time (9:00 = 0%, 12:00 = 50%, 18:00 = 100%)
  const progress = Math.max(0, Math.min(1, (timeHours - 9) / 9));

  // Sun angle along lower arc from East (right, 0 rad) through South (bottom, PI/2) to West (left, PI)
  // In screen coords: East is at angle 0 (right), South is angle 90 deg (bottom), West is angle 180 deg (left).
  const angleRad = Math.PI * (1 - progress); // Starts at East (PI rad offset) to West
  const radius = 26; // px radius
  const cx = 38;
  const cy = 38;

  // Compute position of sun marker on the golden arc
  // When progress = 0 (9:00, East): sun is on right (cx + radius, cy)
  // When progress = 0.5 (12:00, South): sun is at bottom (cx, cy + radius)
  // When progress = 1 (18:00, West): sun is on left (cx - radius, cy)
  const sunX = cx + radius * Math.cos(angleRad);
  const sunY = cy + radius * Math.sin(angleRad);

  return (
    <div
      className="relative w-[76px] h-[76px] rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center select-none"
      title="Компас сторон света и траектория движения солнца (В ➔ Ю ➔ З)"
    >
      {/* SVG Arc for Golden Sun Path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Golden arc from East to West via South */}
        <path
          d={`M ${cx + radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx - radius} ${cy}`}
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeDasharray="2 2"
          className="opacity-80"
        />

        {/* Glow behind moving sun marker */}
        <circle
          cx={sunX}
          cy={sunY}
          r="6"
          fill="#F59E0B"
          className="opacity-40 animate-pulse"
        />

        {/* Moving Sun marker on the arc */}
        <circle
          cx={sunX}
          cy={sunY}
          r="4"
          fill="#FBBF24"
          stroke="#FFF"
          strokeWidth="1.5"
          className="shadow-sm transition-all duration-150"
        />
      </svg>

      {/* Compass Directions */}
      {/* North at Top */}
      <span className="absolute top-1 text-[10px] font-black text-rose-500 leading-none">
        С
      </span>

      {/* East on Right */}
      <span className="absolute right-1.5 text-[9px] font-bold text-slate-300 leading-none">
        В
      </span>

      {/* West on Left */}
      <span className="absolute left-1.5 text-[9px] font-bold text-slate-300 leading-none">
        З
      </span>

      {/* South at Bottom: Sun Icon instead of "Ю" as required by Section 11.2 */}
      <span className="absolute bottom-1 text-amber-400" title="Юг (траектория солнца)">
        <Sun className="h-3 w-3 fill-amber-400" />
      </span>

      {/* Center crosshair dot */}
      <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
    </div>
  );
}

export function SunTrackBar({
  timeHours,
  onChange,
}: {
  timeHours: number;
  onChange: (hours: number) => void;
}) {
  const formatTime = (h: number) => {
    const whole = Math.floor(h);
    const mins = h % 1 === 0 ? "00" : "30";
    return `${whole.toString().padStart(2, "0")}:${mins}`;
  };

  const getLightingLabel = (h: number) => {
    if (h <= 10.5) return "Утреннее солнце (Восток)";
    if (h >= 11 && h <= 14) return "Зенит (Максимум инсоляции)";
    if (h >= 14.5 && h <= 16.5) return "Дневной свет (Юго-Запад)";
    return "Вечерний закат (Запад)";
  };

  return (
    <div className="bg-slate-950/85 backdrop-blur-md border border-white/20 p-2.5 sm:p-3 rounded-xl text-white shadow-xl flex items-center gap-3 select-none">
      <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
        <Sun className="h-4 w-4 fill-amber-400 animate-spin-slow" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs gap-3">
          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
            <span>{formatTime(timeHours)}</span>
            <span className="text-[10px] text-slate-300 font-normal hidden sm:inline">
              • {getLightingLabel(timeHours)}
            </span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">09:00 — 18:00</span>
        </div>

        {/* Interactive Slider Track (Section 11.1) */}
        <input
          type="range"
          min={9}
          max={18}
          step={0.5}
          value={timeHours}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-36 sm:w-48 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          title="Перемещайте для оценки естественного освещения в разное время суток"
        />
      </div>
    </div>
  );
}

/**
 * Returns dynamic lighting overlay CSS style according to sun position (09:00 - 18:00)
 */
export function getSunLightingStyle(timeHours: number): React.CSSProperties {
  // Normalize 9..18 -> 0..1
  const t = Math.max(0, Math.min(1, (timeHours - 9) / 9));

  // Light angle: 45deg (morning East) -> 90deg (noon South) -> 135deg (sunset West)
  const angle = 45 + t * 90;

  // Warmth and opacity
  let intensity = 0.25;
  let tintColor = "rgba(251, 191, 36, 0.15)"; // amber default

  if (timeHours <= 10.5) {
    // Warm morning golden
    tintColor = "rgba(251, 191, 36, 0.22)";
    intensity = 0.3;
  } else if (timeHours >= 11 && timeHours <= 14) {
    // Bright direct white-golden
    tintColor = "rgba(254, 240, 138, 0.25)";
    intensity = 0.35;
  } else if (timeHours >= 16.5) {
    // Warm reddish sunset
    tintColor = "rgba(249, 115, 22, 0.28)";
    intensity = 0.35;
  }

  return {
    background: `linear-gradient(${angle}deg, ${tintColor} 0%, transparent 60%)`,
    opacity: intensity * 2,
    transition: "background 0.3s ease, opacity 0.3s ease",
  };
}
