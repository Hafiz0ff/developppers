"use client";

import React, { useState } from "react";
import { Maximize2, MessageCircle, Phone, CheckCircle2, FileText, Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface LayoutOption {
  id: string;
  rooms: string;
  area: number;
  livingArea: number;
  kitchenArea: number;
  planUrl: string;
  features: string[];
}

export function ShowcaseLayoutView({
  projectName,
  developerPhone = "+992 92 700 5555",
  developerWhatsapp = "+992927005555",
}: {
  projectName: string;
  developerPhone?: string;
  developerWhatsapp?: string;
}) {
  const isQayroqum = projectName.toLowerCase().includes("qayroqum");

  const layouts: LayoutOption[] = isQayroqum
    ? [
        {
          id: "layout_1k",
          rooms: "1-комнатная",
          area: 48.0,
          livingArea: 21.0,
          kitchenArea: 13.5,
          planUrl: "/images/qayroqum/qayroqum-7.jpg",
          features: ["Изолированная кухня 13.5 м²", "Балкон с видом на парк", "Просторный санузел"],
        },
        {
          id: "layout_2k",
          rooms: "2-комнатная",
          area: 74.5,
          livingArea: 39.0,
          kitchenArea: 16.0,
          planUrl: "/images/qayroqum/qayroqum-8.jpg",
          features: ["Панорамный вид на «Баҳри Тоҷик»", "Мастер-спальня", "Два санузла", "Гардероб"],
        },
        {
          id: "layout_3k",
          rooms: "3-комнатная",
          area: 108.0,
          livingArea: 59.0,
          kitchenArea: 19.5,
          planUrl: "/images/qayroqum/qayroqum-5.jpg",
          features: ["Окна на море и парк", "3 изолированные спальни", "2 санузла", "Лоджия"],
        },
        {
          id: "layout_4k",
          rooms: "4-комнатная",
          area: 142.0,
          livingArea: 84.0,
          kitchenArea: 24.0,
          planUrl: "/images/qayroqum/qayroqum-6.jpg",
          features: ["Пентхаус на 14 этаже", "Большая терраса", "Панорама 360° на море и горы"],
        },
      ]
    : [
        {
          id: "layout_1k",
          rooms: "1-комнатная",
          area: 53.0,
          livingArea: 22.5,
          kitchenArea: 14.0,
          planUrl:
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=900&fit=crop",
          features: ["Изолированная кухня 14 м²", "Панорамная лоджия", "Просторный санузел"],
        },
        {
          id: "layout_2k",
          rooms: "2-комнатная",
          area: 78.5,
          livingArea: 42.0,
          kitchenArea: 16.5,
          planUrl:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=900&fit=crop",
          features: ["Окна на две стороны", "Мастер-спальня", "Два санузла", "Гардеробная"],
        },
        {
          id: "layout_3k",
          rooms: "3-комнатная",
          area: 115.0,
          livingArea: 64.0,
          kitchenArea: 20.0,
          planUrl:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=900&fit=crop",
          features: ["Панорамный вид на Сырдарью", "Кухня-гостиная 35 м²", "3 санузла", "Хауз / терраса"],
        },
      ];

  const [activeLayout, setActiveLayout] = useState<LayoutOption>(layouts[1]);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <div className="relative w-full h-[360px] sm:h-[480px] bg-slate-950 p-4 sm:p-6 overflow-hidden flex flex-col justify-between">
      {/* 1. TOP LAYOUT SWITCHER */}
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] z-10">
        {layouts.map((lay) => {
          const isActive = activeLayout.id === lay.id;
          return (
            <button
              key={lay.id}
              type="button"
              onClick={() => setActiveLayout(lay)}
              className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-white/10"
              }`}
            >
              <span>{lay.rooms}</span>
              <span className="opacity-80 text-[11px] font-normal">({lay.area} м²)</span>
            </button>
          );
        })}
      </div>

      {/* 2. CENTER PLAN PREVIEW WITH ZOOM BUTTON */}
      <div className="relative flex-1 my-3 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center group">
        <img
          src={activeLayout.planUrl}
          alt={`План ${activeLayout.rooms} в ${projectName}`}
          className="max-h-full max-w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Zoom trigger button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-3 right-3 h-9 px-3 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Увеличить</span>
        </button>
      </div>

      {/* 3. BOTTOM EXPLICATION & CTA BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 sm:p-3.5 rounded-xl z-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-white">
          <div>
            <span className="text-slate-400 text-[11px] block">Общая площадь:</span>
            <strong className="text-emerald-400 font-bold">{activeLayout.area} м²</strong>
          </div>
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          <div>
            <span className="text-slate-400 text-[11px] block">Жилая:</span>
            <strong className="text-white font-semibold">{activeLayout.livingArea} м²</strong>
          </div>
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          <div>
            <span className="text-slate-400 text-[11px] block">Кухня:</span>
            <strong className="text-white font-semibold">{activeLayout.kitchenArea} м²</strong>
          </div>
        </div>

        <a
          href={`https://wa.me/${developerWhatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
            `Здравствуйте! Интересует планировка «${activeLayout.rooms} (${activeLayout.area} м²)» в ЖК «${projectName}». Отправьте подробные чертежи и цены.`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Узнать цены планировки в WhatsApp
        </a>
      </div>

      {/* 4. ZOOM MODAL DIALOG */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-3xl p-6 bg-slate-950 text-white border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center justify-between">
              <span>План {activeLayout.rooms} ({activeLayout.area} м²) — {projectName}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[480px] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            <img
              src={activeLayout.planUrl}
              alt="План в высоком разрешении"
              className="max-h-full max-w-full object-contain p-4"
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {activeLayout.features.map((feat) => (
              <span
                key={feat}
                className="text-xs font-medium px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
