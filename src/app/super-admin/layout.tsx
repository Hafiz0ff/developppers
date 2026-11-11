"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Megaphone,
  CreditCard,
  Building2,
  FileCheck2,
  Sliders,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Globe,
  FolderTree,
  LayoutGrid,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Сводка и метрики",
      href: "/super-admin",
      icon: BarChart3,
      exact: true,
    },
    {
      title: "Реклама и спонсоры",
      href: "/super-admin/ads",
      icon: Megaphone,
      badge: "Эсхата, Мегафон",
    },
    {
      title: "Платежи и FinTech",
      href: "/super-admin/payments",
      icon: CreditCard,
      badge: "Корти Милли, DC",
    },
    {
      title: "Категории и SEO",
      href: "/super-admin/categories",
      icon: Globe,
      badge: "v1.7",
    },
    {
      title: "Фасеты и фильтры",
      href: "/super-admin/facets",
      icon: Sliders,
      badge: "ТЗ v1.1",
    },
    {
      title: "Меню и навигация",
      href: "/super-admin/navigation",
      icon: FolderTree,
      badge: "ТЗ v1.1",
    },
    {
      title: "Витрина главной",
      href: "/super-admin/showcase",
      icon: LayoutGrid,
      badge: "Этап 2",
    },
    {
      title: "Справочник характеристик",
      href: "/super-admin/listing-attributes",
      icon: Sparkles,
      badge: "ТЗ v1.0",
    },
    {
      title: "Кабинет рекламодателя",
      href: "/advertiser",
      icon: ExternalLink,
      badge: "Портал",
    },
    {
      title: "Застройщики",
      href: "/developer-admin",
      icon: Building2,
    },
    {
      title: "Каталог вторички",
      href: "/classifieds",
      icon: FileCheck2,
    },
    {
      title: "Карта Согда",
      href: "/map",
      icon: Sliders,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Admin Header */}
      <header className="h-16 bg-card border-b border-border/80 text-foreground px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/super-admin"
            className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black shadow-xs">
              M
            </div>
            <span>Maskani</span>
            <Badge variant="secondary" className="font-semibold text-xs uppercase px-1.5 py-0.5 tracking-wider">
              Super Admin
            </Badge>
          </Link>

          <span className="text-border hidden sm:inline">|</span>

          <span className="text-xs text-muted-foreground hidden sm:inline font-mono">
            Согдийская область · Панель управления
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/80 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">На главный сайт</span>
          </Link>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-card border-r border-border/80 p-4 shrink-0">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-3">
            Управление платформой
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-2xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="text-xs py-0 px-1.5 font-mono text-muted-foreground border-border/80"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Info Box */}
          <div className="mt-8 p-3.5 rounded-xl bg-muted/40 border border-border/80 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Рекламный движок</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Годовые спонсоры получают 60% гарантированных показов. Остальной объем распределяется через аукцион ставок.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
