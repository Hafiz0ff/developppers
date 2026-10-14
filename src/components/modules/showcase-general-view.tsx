"use client";

import React, { useState } from "react";
import {
  MapPin,
  GraduationCap,
  Baby,
  Trees,
  ShoppingBag,
  HeartPulse,
  Bus,
  ExternalLink,
  Building,
  Navigation,
} from "lucide-react";

interface POI {
  id: string;
  name: string;
  category: "school" | "kindergarten" | "park" | "shop" | "medical" | "transport";
  distance: string;
  xPercent: number; // Position X in % (0 - 100)
  yPercent: number; // Position Y in % (0 - 100)
  description?: string;
}

interface ShowcaseGeneralViewProps {
  projectName: string;
  onSelectBuilding?: (sectionName: string) => void;
}

export function ShowcaseGeneralView({
  projectName,
  onSelectBuilding,
}: ShowcaseGeneralViewProps) {
  const [activePoi, setActivePoi] = useState<POI | null>(null);

  // High-fidelity POI markers for Khujand (19th & 18th mkr waterfront district)
  const poiList: POI[] = [
    {
      id: "poi_waterfront",
      name: "Набережная Сырдарьи и пляжная зона",
      category: "park",
      distance: "2 мин пешком (150 м)",
      xPercent: 48,
      yPercent: 78,
      description: "Благоустроенный променад для прогулок, беговые и велосипедные дорожки.",
    },
    {
      id: "poi_park",
      name: "Парк Камоли Худжанди",
      category: "park",
      distance: "4 мин пешком (350 м)",
      xPercent: 22,
      yPercent: 32,
      description: "Исторический парк с тенистыми аллеями, фонтанами и амфитеатром.",
    },
    {
      id: "poi_school",
      name: "Средняя школа №28",
      category: "school",
      distance: "5 мин пешком (420 м)",
      xPercent: 78,
      yPercent: 28,
      description: "Современная школа с углубленным изучением языков и спортивным комплексом.",
    },
    {
      id: "poi_kindergarten",
      name: "Детский сад «Парасту»",
      category: "kindergarten",
      distance: "3 мин пешком (260 м)",
      xPercent: 82,
      yPercent: 62,
      description: "Ясли и группы дошкольной подготовки с закрытой охраняемой территорией.",
    },
    {
      id: "poi_shop",
      name: "Супермаркет «Амид» & Торговый центр",
      category: "shop",
      distance: "4 мин пешком (380 м)",
      xPercent: 18,
      yPercent: 72,
      description: "Крупный продуктовый супермаркет, аптека, кафе и банкоматы 24/7.",
    },
    {
      id: "poi_clinic",
      name: "Медицинский центр и поликлиника",
      category: "medical",
      distance: "7 мин пешком (600 м)",
      xPercent: 88,
      yPercent: 42,
      description: "Многопрофильная клиника, диагностика и скорая помощь.",
    },
  ];

  const getPoiIcon = (category: POI["category"]) => {
    switch (category) {
      case "school":
        return <GraduationCap className="h-3.5 w-3.5 text-blue-500" />;
      case "kindergarten":
        return <Baby className="h-3.5 w-3.5 text-pink-500" />;
      case "park":
        return <Trees className="h-3.5 w-3.5 text-emerald-500" />;
      case "shop":
        return <ShoppingBag className="h-3.5 w-3.5 text-amber-500" />;
      case "medical":
        return <HeartPulse className="h-3.5 w-3.5 text-rose-500" />;
      case "transport":
        return <Bus className="h-3.5 w-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="relative w-full h-[360px] sm:h-[480px] bg-slate-950 overflow-hidden select-none">
      {/* 1. PHOTOREALISTIC AERIAL PANORAMA BACKGROUND */}
      <img
        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&h=1000&fit=crop"
        alt={`Генплан и территория ${projectName}`}
        className="w-full h-full object-cover opacity-85"
      />

      {/* Soft gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

      {/* 2. INTERACTIVE HIGHLIGHT OVERLAY FOR COMPLEX BUILDINGS (Section 6.1) */}
      <div
        onClick={() => onSelectBuilding && onSelectBuilding("Секция 1")}
        className="absolute top-[38%] left-[34%] w-[32%] h-[38%] rounded-2xl border-2 border-emerald-400 bg-emerald-500/25 backdrop-blur-[1px] hover:bg-emerald-500/40 hover:border-emerald-300 transition-all cursor-pointer group shadow-xl flex flex-col items-center justify-center p-3 text-center"
        title="Нажмите, чтобы перейти к выбору секции и этажа"
      >
        <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Building className="h-5 w-5" />
        </div>
        <div className="text-xs sm:text-sm font-extrabold text-white drop-shadow-md mt-1">
          {projectName}
        </div>
        <div className="text-[10px] text-emerald-200 font-medium hidden sm:block">
          Нажмите для перехода к срезу здания →
        </div>
      </div>

      {/* 3. INTERACTIVE POI MARKERS */}
      {poiList.map((poi) => {
        const isSelected = activePoi?.id === poi.id;

        return (
          <div
            key={poi.id}
            style={{ top: `${poi.yPercent}%`, left: `${poi.xPercent}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <button
              type="button"
              onClick={() => setActivePoi(isSelected ? null : poi)}
              className={`p-1.5 sm:p-2 rounded-full border shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isSelected
                  ? "bg-white text-slate-900 border-emerald-500 scale-125 ring-4 ring-emerald-500/30"
                  : "bg-slate-900/90 text-white border-white/30 hover:scale-110 hover:bg-white hover:text-slate-900"
              }`}
              title={poi.name}
            >
              {getPoiIcon(poi.category)}
            </button>

            {/* Tooltip Card on Marker Click/Hover */}
            {isSelected && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 sm:w-64 p-3 rounded-xl bg-slate-900/95 text-white border border-white/20 shadow-2xl backdrop-blur-md z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                  <span>{poi.distance}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePoi(null);
                    }}
                    className="text-slate-400 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-xs font-bold leading-tight text-white">{poi.name}</div>
                {poi.description && (
                  <p className="text-[10px] text-slate-300 leading-relaxed pt-0.5">
                    {poi.description}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* 4. COMPACT BOTTOM INFRASTRUCTURE STRIP */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto bg-slate-900/90 backdrop-blur-md border border-white/10 p-2.5 rounded-xl text-white text-xs shadow-lg flex items-center gap-3">
        <Navigation className="h-4 w-4 text-emerald-400 shrink-0" />
        <span className="text-[11px] text-slate-200">
          Нажмите на <strong className="text-emerald-400 font-semibold">здание ЖК</strong> для выбора секции или на цветные точки для просмотра инфраструктуры.
        </span>
      </div>
    </div>
  );
}
