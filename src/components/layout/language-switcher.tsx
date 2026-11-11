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
        className={`flex h-8 box-border items-center gap-1.5 px-2.5 rounded-lg border border-border/80 bg-background hover:bg-muted active:bg-muted/80 text-foreground text-xs font-semibold shadow-2xs transition-all outline-hidden cursor-pointer shrink-0 ${className}`}
        aria-label={
          language === "ru"
            ? "Русский язык"
            : language === "tg"
            ? "Забони тоҷикӣ"
            : "English language"
        }
      >
        <span className="text-base leading-none select-none">{getFlag(language)}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl border border-border/80 bg-background shadow-lg z-50 text-foreground ring-0">
        <DropdownMenuItem
          onClick={() => setLanguage("ru")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all ${
            language === "ru"
              ? "text-primary bg-primary/10 font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted focus:text-foreground focus:bg-muted"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇷🇺</span>
            <span>Русский</span>
          </div>
          {language === "ru" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage("tg")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all mt-1 ${
            language === "tg"
              ? "text-primary bg-primary/10 font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted focus:text-foreground focus:bg-muted"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇹🇯</span>
            <span>Тоҷикӣ</span>
          </div>
          {language === "tg" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all mt-1 ${
            language === "en"
              ? "text-primary bg-primary/10 font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-muted focus:text-foreground focus:bg-muted"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🇬🇧</span>
            <span>English</span>
          </div>
          {language === "en" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
