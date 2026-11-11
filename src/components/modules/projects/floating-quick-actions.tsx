"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Phone, Grid3X3, ArrowUp, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

interface FloatingQuickActionsProps {
  projectName: string;
  phone: string;
  whatsapp: string;
  onScrollToChessboard?: () => void;
}

export function FloatingQuickActions({
  projectName,
  phone,
  whatsapp,
  onScrollToChessboard,
}: FloatingQuickActionsProps) {
  const { language, tDual } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 350px
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChessboardClick = () => {
    if (onScrollToChessboard) {
      onScrollToChessboard();
    } else {
      const el = document.getElementById("chessboard-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label={tDual("Панель быстрых действий", "Панели амалҳои зуд")}
      className="fixed bottom-6 right-4 sm:right-6 z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="glass-island rounded-full p-1.5 shadow-2xl border border-white/70 dark:border-white/15 backdrop-blur-2xl flex items-center gap-1.5 animate-float-gentle">
        {/* Scroll to Chessboard button */}
        <button
          type="button"
          onClick={handleChessboardClick}
          className="h-10 px-3.5 rounded-full bg-background/80 hover:bg-background text-foreground/80 hover:text-foreground text-xs font-bold flex items-center gap-1.5 border border-border/60 tactile-press shadow-xs cursor-pointer transition-colors"
          title={tDual("Перейти к планировкам", "Гузариш ба нақшаҳо")}
        >
          <Grid3X3 className="h-4 w-4 text-emerald-600" />
          <span className="hidden sm:inline">
            {tDual("Планировки", "Тарҳҳо")}
          </span>
        </button>

        {/* WhatsApp direct contact */}
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
            language === "tg"
              ? `Салом! Ба ман маълумоти бештар дар бораи МИ «${projectName}» лозим аст. Лутфан шартҳои харидро фиристед.`
              : `Здравствуйте! Интересует подробная консультация по ЖК «${projectName}». Отправьте условия рассрочки.`
          )}`}
          target="_blank"
          rel="noreferrer"
          className="h-10 px-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
        >
          <MessageCircle className="h-4 w-4 fill-white text-transparent" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Phone dial button */}
        <a
          href={`tel:${phone}`}
          className="h-10 w-10 rounded-full bg-background/80 hover:bg-background text-foreground flex items-center justify-center border border-border/60 shadow-xs cursor-pointer transition-colors"
          title={tDual(`Позвонить: ${phone}`, `Занг задан: ${phone}`)}
        >
          <Phone className="h-4 w-4 text-primary" />
        </a>

        {/* Scroll to top */}
        <button
          type="button"
          onClick={scrollToTop}
          className="h-10 w-10 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground flex items-center justify-center border border-border/60 tactile-press shadow-xs cursor-pointer transition-colors"
          title={tDual("Наверх страницы", "Ба болои саҳифа")}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
