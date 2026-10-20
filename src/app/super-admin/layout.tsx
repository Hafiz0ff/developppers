"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  BarChart3,
  Megaphone,
  CreditCard,
  Building2,
  FileCheck2,
  Sliders,
  History,
  ArrowLeft,
  ExternalLink,
  Sparkles,
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col">
      {/* Top Admin Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/super-admin"
            className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black">
              M
            </div>
            <span>Maskani</span>
            <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase px-1.5 py-0.5 tracking-wider">
              Super Admin
            </Badge>
          </Link>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <span className="text-xs text-slate-400 hidden sm:inline font-mono">
            Согдийская область · Панель управления
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-xl transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">На главный сайт</span>
          </Link>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 p-4 shrink-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                      }`}
                    />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="outline"
                      className="text-[9px] py-0 px-1.5 font-mono text-slate-500 border-slate-200"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Info Box */}
          <div className="mt-8 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Рекламный движок</span>
            </div>
            <p className="text-slate-500 text-[10px] leading-relaxed">
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
