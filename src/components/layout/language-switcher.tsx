"use client";

import React from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const getFlag = (lang: string) => {
    switch (lang) {
      case "ru":
        return "🇷🇺";
      case "tg":
        return "🇹🇯";
      case "en":
        return "🇬🇧";
      default:
        return "🇷🇺";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/25 bg-white/12 hover:bg-white/20 active:bg-white/25 backdrop-blur-xl text-white text-xs font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] transition-all outline-hidden cursor-pointer ${className}`}
        aria-label={
          language === "ru"
            ? "Русский язык"
            : language === "tg"
            ? "Забони тоҷикӣ"
            : "English language"
        }
      >
        <span className="text-base leading-none select-none">{getFlag(language)}</span>
        <ChevronDown className="h-3 w-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border border-slate-200/80 dark:border-white/15 z-50">
        <DropdownMenuItem
          onClick={() => setLanguage("ru")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors ${
            language === "ru"
              ? "text-emerald-700 bg-emerald-50/80 border border-emerald-200/60"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇷🇺</span>
            <span>Русский</span>
          </div>
          {language === "ru" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage("tg")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors mt-1 ${
            language === "tg"
              ? "text-emerald-700 bg-emerald-50/80 border border-emerald-200/60"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇹🇯</span>
            <span>Тоҷикӣ</span>
          </div>
          {language === "tg" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-semibold transition-colors mt-1 ${
            language === "en"
              ? "text-emerald-700 bg-emerald-50/80 border border-emerald-200/60"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇬🇧</span>
            <span>English</span>
          </div>
          {language === "en" && <Check className="h-3.5 w-3.5 text-emerald-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
