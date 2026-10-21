"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, X, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCompare } from "@/context/compare-context";
import { useLanguage } from "@/context/language-context";

export function FloatingCompareBar() {
  const pathname = usePathname();
  const { compareItems, compareCount, removeFromCompare, clearCompare } = useCompare();
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";

  // Hide bar on the comparison page itself or when empty
  if (compareCount === 0 || pathname === "/compare") {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-45 w-[92%] max-w-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white">
                {isTg ? "Муқоисаи амвол" : "Сравнение объектов"}
              </span>
              <Badge className="bg-blue-600 text-white font-bold text-[10px] px-1.5 py-0">
                {compareCount} / 4
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {isTg
                ? "Хонадонҳо ва ҳавлиҳои интихобшуда"
                : "Параметры, цены и коммуникации"}
            </p>
          </div>
        </div>

        {/* Center: Thumbnails list */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {compareItems.map((item) => (
            <div
              key={item.id}
              className="relative group shrink-0 h-10 w-10 rounded-lg overflow-hidden border border-slate-700 bg-slate-800"
              title={item.title}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFromCompare(item.id)}
                className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5 text-white hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearCompare}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors p-2"
            title={isTg ? "Тоза кардан" : "Очистить список"}
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <Link href="/compare">
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-1.5 shadow-sm cursor-pointer"
            >
              <span>{isTg ? "Ба муқоиса гузаштан" : "Сравнить"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
