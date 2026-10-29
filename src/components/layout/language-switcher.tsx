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
        className={`flex h-8 box-border items-center gap-1 px-2.5 rounded-xl border border-white/15 bg-white/[0.05] hover:bg-white/10 active:bg-white/15 backdrop-blur-xl text-white text-xs font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] transition-all outline-hidden cursor-pointer shrink-0 ${className}`}
        aria-label={
          language === "ru"
            ? "Русский язык"
            : language === "tg"
            ? "Забони тоҷикӣ"
            : "English language"
        }
      >
        <span className="text-base leading-none select-none">{getFlag(language)}</span>
        <ChevronDown className="h-3 w-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-3xl backdrop-saturate-150 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.4)] border border-white/20 z-50 text-white ring-0">
        <DropdownMenuItem
          onClick={() => setLanguage("ru")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all ${
            language === "ru"
              ? "text-white bg-emerald-500/25 border border-emerald-400/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
              : "text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇷🇺</span>
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Русский</span>
          </div>
          {language === "ru" && <Check className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage("tg")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all mt-1 ${
            language === "tg"
              ? "text-white bg-emerald-500/25 border border-emerald-400/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
              : "text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇹🇯</span>
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">Тоҷикӣ</span>
          </div>
          {language === "tg" && <Check className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-xl font-semibold transition-all mt-1 ${
            language === "en"
              ? "text-white bg-emerald-500/25 border border-emerald-400/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
              : "text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇬🇧</span>
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">English</span>
          </div>
          {language === "en" && <Check className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
