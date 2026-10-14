"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Compass,
  Building,
  Layers,
  Sparkles,
  Maximize2,
  FileText,
  Eye,
  Info,
} from "lucide-react";
import { ShaderBackground } from "@/components/ui/shader-background";
import { Badge } from "@/components/ui/badge";
import { UnitData } from "@/lib/data/mock-db";
import { BuildingCrossSection } from "./building-cross-section";
import { ShowcaseGeneralView } from "./showcase-general-view";
import { ShowcaseWindowView } from "./showcase-window-view";
import { ShowcaseLayoutView } from "./showcase-layout-view";
import { useLanguage } from "@/context/language-context";

export type ShowcaseMode =
  | "photos"
  | "general_view"
  | "section_plan"
  | "cross_section"
  | "window_view"
  | "layout";

interface ProjectVisualShowcaseProps {
  projectName: string;
  coverImageUrl: string;
  images: string[];
  installmentMonths?: number;
  installmentDownPaymentPercent?: number;
  units?: UnitData[];
  developerContact?: {
    phone: string;
    whatsapp: string;
  };
  onSelectUnitMode?: () => void;
}

export function ProjectVisualShowcase({
  projectName,
  coverImageUrl,
  images,
  installmentMonths = 24,
  installmentDownPaymentPercent = 30,
  units = [],
  developerContact,
  onSelectUnitMode,
}: ProjectVisualShowcaseProps) {
  const { tDual } = useLanguage();

  // Ordered gallery photos with cover first
  const allImages = React.useMemo(() => {
    const list = [coverImageUrl, ...images.filter((img) => img !== coverImageUrl)];
    return list.length > 0 ? list : [coverImageUrl];
  }, [coverImageUrl, images]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeMode, setActiveMode] = useState<ShowcaseMode>("photos");

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMode !== "photos") return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMode, handlePrev, handleNext]);

  const navModes: Array<{
    id: ShowcaseMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isAvailable: boolean;
    badgeText?: string;
  }> = [
    { id: "photos", label: tDual("Фото", "Аксҳо"), icon: Camera, isAvailable: true },
    { id: "general_view", label: tDual("Общий вид", "Намуди умумӣ"), icon: Compass, isAvailable: true },
    { id: "section_plan", label: tDual("План секции", "Нақшаи бахш"), icon: Building, isAvailable: true },
    { id: "cross_section", label: tDual("Вид в срезе", "Буриши бино"), icon: Layers, isAvailable: true },
    { id: "window_view", label: tDual("Вид из окон", "Манзара аз тирезаҳо"), icon: Eye, isAvailable: true },
    { id: "layout", label: tDual("Планировка", "Тарҳи хонаҳо"), icon: FileText, isAvailable: true },
  ];

  const handleModeChange = (mode: ShowcaseMode) => {
    setActiveMode(mode);

    if (mode === "cross_section" && onSelectUnitMode) {
      onSelectUnitMode();
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. MAIN APPLE-STYLE SHOWCASE CONTAINER */}
      <div className="relative group rounded-2xl overflow-hidden border bg-slate-950 shadow-md">
        {/* Ambient Light Leak Glow behind hero visual */}
        <ShaderBackground
          variant="light-leak"
          speed={0.3}
          intensity={0.4}
          className="absolute -inset-3 sm:-inset-6 rounded-3xl blur-2xl opacity-60 dark:opacity-30 -z-10 pointer-events-none"
        />

        {activeMode === "photos" && (
          <div className="relative h-[340px] sm:h-[480px] w-full select-none overflow-hidden bg-slate-900 flex items-center justify-center">
            <img
              src={allImages[currentIndex]}
              alt={`${projectName} - ${tDual("фото", "акси")} ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Soft Ambient Overlay for contrast and elegance */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

            {/* Apple-style Floating Minimalist Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label={tDual("Предыдущее фото", "Акси қаблӣ")}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                >
                  <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={tDual("Следующее фото", "Акси навбатӣ")}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
                >
                  <ChevronRight className="h-6 w-6 stroke-[2.5]" />
                </button>
              </>
            )}

            {/* Slide Counter in Apple minimalist pill */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white/95 text-xs font-medium px-3 py-1 rounded-full border border-white/10 shadow-xs pointer-events-none">
                {currentIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Installment Badge in bottom left */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs z-10 border border-border/40">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                {tDual(
                  `Рассрочка до ${installmentMonths} мес. (Взнос от ${installmentDownPaymentPercent}%)`,
                  `Пардохти қисм-қисм то ${installmentMonths} моҳ (Пешпардохт аз ${installmentDownPaymentPercent}%)`
                )}
              </span>
            </div>
          </div>
        )}

        {/* 2. GENERAL VIEW (AERIAL MAP & INFRASTRUCTURE POI) (Section 6 of Spec) */}
        {activeMode === "general_view" && (
          <ShowcaseGeneralView
            projectName={projectName}
            onSelectBuilding={() => setActiveMode("cross_section")}
          />
        )}

        {/* 3. CROSS SECTION & SECTION PLAN MODE (Sections 7 & 8 of Spec) */}
        {(activeMode === "cross_section" || activeMode === "section_plan") && units && units.length > 0 && (
          <div className="p-4 sm:p-5 bg-card text-foreground">
            <BuildingCrossSection
              units={units}
              projectName={projectName}
              developerContact={developerContact}
            />
          </div>
        )}

        {/* 4. WINDOW VIEW MODE (Section 9 of Spec) */}
        {activeMode === "window_view" && (
          <ShowcaseWindowView projectName={projectName} />
        )}

        {/* 5. LAYOUT MODE (Section 10 of Spec) */}
        {activeMode === "layout" && (
          <ShowcaseLayoutView
            projectName={projectName}
            developerPhone={developerContact?.phone}
            developerWhatsapp={developerContact?.whatsapp}
          />
        )}
      </div>

      {/* 2. HORIZONTAL 6D MODE NAVIGATION STRIP (Section 5 of Specification) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {navModes.map((item) => {
          const Icon = item.icon;
          const isActive = activeMode === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleModeChange(item.id)}
              className={`h-10 px-3.5 sm:px-4 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-border/80"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-emerald-600"}`} />
              <span>{item.label}</span>
              {item.badgeText && !isActive && (
                <span className="text-[10px] py-0.5 px-1.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-normal">
                  {item.badgeText}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. THUMBNAILS ROW (When in photo mode) */}
      {activeMode === "photos" && allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3 pt-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                currentIndex === idx
                  ? "border-emerald-600 shadow-sm scale-[1.02]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Миниатюра ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
