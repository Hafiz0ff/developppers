"use client";

import React from "react";
import { ChevronDown, Globe, Check } from "lucide-react";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold shadow-xs hover:border-emerald-500 transition-all outline-hidden cursor-pointer ${className}`}
        aria-label={language === "ru" ? "Русский язык" : "Забони тоҷикӣ"}
      >
        <span className="text-base leading-none select-none">{language === "ru" ? "🇷🇺" : "🇹🇯"}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl bg-white shadow-xl border border-slate-200/80 z-50">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

