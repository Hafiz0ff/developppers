"use client";

import React from "react";
import { MapPin, Loader2 } from "lucide-react";

export function MapLoadingSkeleton() {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-slate-100 overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative Grid Lines */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Decorative Floating Pin Skeletons */}
      <div className="absolute top-1/4 left-1/3 animate-bounce duration-1000 opacity-60">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-lg">
          <MapPin className="w-3.5 h-3.5" />
          <span>ЖК Согд</span>
        </div>
      </div>

      <div className="absolute bottom-1/3 right-1/4 animate-bounce duration-700 opacity-50">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-full text-xs font-bold shadow-lg">
          <MapPin className="w-3.5 h-3.5" />
          <span>Квартира</span>
        </div>
      </div>

      {/* Center Spinner */}
      <div className="relative z-10 flex flex-col items-center gap-3 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 max-w-xs text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800">
            Загрузка интерактивной карты
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Боргирии харитаи интерактивии Суғд...
          </div>
        </div>
      </div>
    </div>
  );
}
