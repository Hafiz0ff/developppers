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
  const { language } = useLanguage();
  const isTg = language === "tg";

  // Hide bar on the comparison page itself or when empty
  if (compareCount === 0 || pathname === "/compare") {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-45 w-[94%] max-w-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border/80 bg-background/90 p-3 sm:p-4 shadow-xl backdrop-blur-xl text-foreground">
        {/* Left: Brand Icon & Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
            <ArrowLeftRight className="h-4.5 w-4.5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">
                {isTg ? "Муқоисаи амвол" : "Сравнение объектов"}
              </span>
              <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5 rounded-full">
                {compareCount} / 4
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {isTg
                ? "Хонадонҳо ва ҳавлиҳои интихобшуда"
                : "Параметры, цены и коммуникации"}
            </p>
          </div>
        </div>

        {/* Center: Thumbnails list with neutral borders */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {compareItems.map((item) => (
            <div
              key={item.id}
              className="relative group shrink-0 h-10 w-10 rounded-lg overflow-hidden border border-border/80 shadow-2xs bg-muted"
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
                <X className="h-3.5 w-3.5 text-white hover:text-destructive" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-all cursor-pointer"
            title={isTg ? "Тоза кардан" : "Очистить список"}
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <Link href="/compare">
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl font-semibold text-xs gap-1.5 shadow-xs"
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
