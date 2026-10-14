"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
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
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-muted/50 text-xs font-semibold hover:bg-muted transition-colors outline-hidden ${className}`}
        aria-label="Переключить язык / Забонро иваз кунед"
      >
        <span>{language === "ru" ? "🇷🇺 РУ" : "🇹🇯 ТҶ"}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => setLanguage("ru")}
          className={`cursor-pointer text-xs flex items-center gap-2 ${
            language === "ru" ? "text-emerald-700 font-semibold bg-emerald-50/50 dark:bg-emerald-950/20" : ""
          }`}
        >
          <span>🇷🇺</span>
          <span>Русский</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("tg")}
          className={`cursor-pointer text-xs flex items-center gap-2 ${
            language === "tg" ? "text-emerald-700 font-semibold bg-emerald-50/50 dark:bg-emerald-950/20" : ""
          }`}
        >
          <span>🇹🇯</span>
          <span>Тоҷикӣ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
