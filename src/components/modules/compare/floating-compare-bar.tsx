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
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-45 w-[94%] max-w-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="glass-card text-slate-900 dark:text-white rounded-3xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Emerald Icon & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
            <ArrowLeftRight className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {isTg ? "Муқоисаи амвол" : "Сравнение объектов"}
              </span>
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40 font-black text-[11px] px-2 py-0.5 rounded-full">
                {compareCount} / 4
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {isTg
                ? "Хонадонҳо ва ҳавлиҳои интихобшуда"
                : "Параметры, цены и коммуникации"}
            </p>
          </div>
        </div>

        {/* Center: Thumbnails list with frosted borders */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {compareItems.map((item) => (
            <div
              key={item.id}
              className="relative group shrink-0 h-10 w-10 rounded-xl overflow-hidden border border-white/80 dark:border-white/20 shadow-xs bg-slate-100 dark:bg-slate-800"
              title={item.title}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
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
            className="text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-2 rounded-xl transition-all cursor-pointer"
            title={isTg ? "Тоза кардан" : "Очистить список"}
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <Link href="/compare">
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs gap-1.5 shadow-[0_8px_20px_rgba(16,185,129,0.30),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all cursor-pointer active:scale-95"
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
