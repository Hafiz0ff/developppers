"use client";

import React, { useState } from "react";
import { Eye, Compass, Mountain, Trees, Waves, Info } from "lucide-react";

interface ViewAngle {
  id: string;
  title: string;
  direction: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export function ShowcaseWindowView({ projectName }: { projectName: string }) {
  const angles: ViewAngle[] = [
    {
      id: "river",
      title: "Панорама на Сырдарью",
      direction: "Северо-запад • 12-й этаж",
      imageUrl:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&h=1000&fit=crop",
      icon: Waves,
      description:
        "Прямой панорамный вид на гладь реки Сырдарья и благоустроенную прогулочную набережную. Закатное вечернее солнце.",
    },
    {
      id: "courtyard",
      title: "Внутренний зелёный двор",
      direction: "Юг • Закрытая территория",
      imageUrl:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&h=1000&fit=crop",
      icon: Trees,
      description:
        "Спокойный вид на охраняемый ландшафтный двор без машин, детские городки европейского стандарта и фонтан.",
    },
    {
      id: "mountains",
      title: "Горы Моголтау и город",
      direction: "Восток • Утренний рассвет",
      imageUrl:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=1000&fit=crop",
      icon: Mountain,
      description:
        "Широкая перспектива на хребет Моголтау и историческую часть Худжанда с первыми лучами утреннего солнца.",
    },
  ];

  const [activeAngle, setActiveAngle] = useState<ViewAngle>(angles[0]);

  return (
    <div className="relative w-full h-[360px] sm:h-[480px] bg-slate-950 overflow-hidden select-none">
      {/* 1. HIGH-RES WINDOW VIEW PHOTO */}
      <img
        src={activeAngle.imageUrl}
        alt={activeAngle.title}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Elegant Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/40 pointer-events-none" />

      {/* 2. TOP ANGLE SWITCHER TABS */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
        {angles.map((ang) => {
          const Icon = ang.icon;
          const isActive = activeAngle.id === ang.id;

          return (
            <button
              key={ang.id}
              type="button"
              onClick={() => setActiveAngle(ang)}
              className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shadow-md ${
                isActive
                  ? "bg-white text-slate-900 border border-white"
                  : "bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-emerald-400"}`} />
              <span>{ang.title}</span>
            </button>
          );
        })}
      </div>

      {/* 3. BOTTOM INFO CARD */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto max-w-lg p-3.5 sm:p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/15 text-white shadow-xl space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <Compass className="h-4 w-4" />
          <span>{activeAngle.direction}</span>
        </div>
        <h4 className="text-sm font-bold text-white">{activeAngle.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
          {activeAngle.description}
        </p>
      </div>
    </div>
  );
}
