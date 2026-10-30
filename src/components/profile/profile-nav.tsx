"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  Settings,
  PlusCircle,
  Home,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Send,
  Share2,
} from "lucide-react";

export function ProfileNav() {
  const pathname = usePathname();
  const { language, tDual } = useLanguage();
  const isTg = language === "tg";

  const navItems = [
    {
      title: tDual("Канбан CRM и подборки", "Канбан CRM ва интихобҳо"),
      href: "/profile/crm",
      icon: Users,
    },
    {
      title: tDual("Публикация объектов", "Нашри амвол"),
      href: "/profile/publications",
      icon: Share2,
    },
    {
      title: tDual("Аналитика и Open API", "Таҳлил ва Open API"),
      href: "/profile/analytics",
      icon: TrendingUp,
    },
    {
      title: tDual("Telegram-бот и настройки", "Telegram-бот ва танзимот"),
      href: "/profile/settings",
      icon: Send,
    },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-600 text-white font-semibold text-[10px] px-2 py-0.5">
              {tDual("КАБИНЕТ МАКЛЕРА", "КАБИНЕТИ МАКЛЕР")}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {tDual("Вилояти Суғд • Худжанд / Гулистон / Б. Гафуров", "Вилояти Суғд • Хуҷанд / Гулистон / Б. Ғафуров")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {tDual("Рабочее место специалиста по недвижимости", "Ҷойи кори мутахассиси амволи ғайриманқул")}
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href="/classifieds/new">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 shadow-xs">
              <PlusCircle className="h-4 w-4" />
              <span>{tDual("Подать объявление", "Иловаи эълон")}</span>
            </Button>
          </Link>
          <Link href="/classifieds">
            <Button size="sm" variant="outline" className="text-xs gap-1">
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tDual("Все объявления", "Ҳамаи эълонҳо")}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-card border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
