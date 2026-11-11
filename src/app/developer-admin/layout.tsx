"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Grid3X3,
  Building,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Share2,
} from "lucide-react";

import { INITIAL_DEVELOPERS } from "@/lib/data/mock-db";

function AdminNavList() {
  const pathname = usePathname();
  const { tDual } = useLanguage();

  const navItems = [
    {
      title: tDual("Панель управления", "Панели идоракунӣ"),
      href: "/developer-admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: tDual("Жилые комплексы (ЖК)", "Маҷмааҳои истиқоматӣ (МИ)"),
      href: "/developer-admin/projects",
      icon: FolderKanban,
    },
    {
      title: tDual("Создать новый ЖК", "Иловаи МИ нав"),
      href: "/developer-admin/projects/new",
      icon: PlusCircle,
    },
    {
      title: tDual("Шахматка квартир", "Ҷадвали шоҳмотии хонаҳо"),
      href: "/developer-admin/projects/proj_qayroqum/units",
      icon: Grid3X3,
    },
    {
      title: tDual("Публикация ЖК", "Нашри МИ"),
      href: "/developer-admin/publications",
      icon: Share2,
    },
    {
      title: tDual("⚡ Управление стройкой (ERP)", "⚡ Идоракунии сохтмон (ERP)"),
      href: "/erp",
      icon: Sparkles,
      badge: "PRO",
    },
    {
      title: tDual("Профиль застройщика", "Профили сохтмончӣ"),
      href: "/developer-admin/profile",
      icon: Building,
    },
  ];

  return (
    <nav className="p-3 space-y-1 flex-1">
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              active
                ? "bg-primary/10 text-primary font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </div>
            {"badge" in item && item.badge && (
              <Badge
                variant="outline"
                className="text-xs font-semibold px-1.5 py-0.2 rounded"
              >
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DeveloperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tDual } = useLanguage();
  const developer = INITIAL_DEVELOPERS[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Admin Notice Bar */}
      <div className="bg-card text-foreground text-xs py-2 px-4 flex items-center justify-between border-b border-border/80">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-semibold text-xs px-2 py-0.5">
            {tDual("КАБИНЕТ ЗАСТРОЙЩИКА", "КАБИНЕТИ СОХТМОНЧӢ")}
          </Badge>
          <span className="text-muted-foreground">
            {tDual(
              `Кабинет застройщика: ${developer.name} (г. Гулистон / Согд)`,
              `Кабинети сохтмончӣ: ${developer.name} (ш. Гулистон / Суғд)`
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/developers/${developer.slug}`}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            {tDual("Публичная витрина", "Витринаи кушод")}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-card border-r border-border/80 flex flex-col shrink-0">
          <div className="p-4 border-b border-border/80">
            <Link href={`/developers/${developer.slug}`} className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted border border-border/80 shrink-0 shadow-2xs">
                <img
                  src={developer.logoUrl}
                  alt={developer.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                  {developer.name}
                </span>
                <span className="text-xs text-primary flex items-center gap-1 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {tDual("Верифицирован", "Тасдиқшуда")}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links wrapped in Suspense */}
          <Suspense fallback={<div className="p-3 text-xs text-muted-foreground">{tDual("Загрузка навигации...", "Боргирии меню...")}</div>}>
            <AdminNavList />
          </Suspense>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border/80 bg-muted/20 text-xs space-y-2">
            <div className="text-xs text-muted-foreground">
              {tDual("Отдел продаж в Согде:", "Шуъбаи фурӯш дар Суғд:")}
            </div>
            <div className="font-mono font-semibold text-foreground text-xs">
              {developer.phone}
            </div>
            <Link
              href="/"
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium pt-1"
            >
              {tDual("Вернуться на главный портал", "Бозгашт ба саҳифаи аслӣ")}
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">{tDual("Загрузка...", "Боргирӣ...")}</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
