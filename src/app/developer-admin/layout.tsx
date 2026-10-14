"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  Grid3X3,
  Building,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { useLanguage } from "@/context/language-context";

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
      href: "/developer-admin/projects/proj_sirdaryo_plaza/units",
      icon: Grid3X3,
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
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              active
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.title}</span>
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

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      {/* Top Admin Notice Bar */}
      <div className="bg-emerald-950 text-white text-xs py-1.5 px-4 flex items-center justify-between border-b border-emerald-900">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5">
            {tDual("КАБИНЕТ ЗАСТРОЙЩИКА", "КАБИНЕТИ СОХТМОНЧӢ")}
          </Badge>
          <span className="text-emerald-200">
            {tDual(
              "Кабинет застройщика: ООО «Рахш Сохтмон» (г. Худжанд)",
              "Кабинети сохтмончӣ: ҶДММ «Рахш Сохтмон» (ш. Хуҷанд)"
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/developers/rahsh-sohtmon"
            className="hover:text-emerald-300 flex items-center gap-1 transition-colors text-emerald-200"
          >
            {tDual("Публичная витрина", "Витринаи кушод")}
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-card border-r flex flex-col shrink-0">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-foreground leading-tight">
                  Рахш Сохтмон
                </span>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {tDual("Верифицирован", "Тасдиқшуда")}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links wrapped in Suspense */}
          <Suspense fallback={<div className="p-3 text-xs text-muted-foreground">{tDual("Загрузка навигации...", "Боргирии меню...")}</div>}>
            <AdminNavList />
          </Suspense>

          {/* Sidebar Footer */}
          <div className="p-4 border-t bg-muted/30 text-xs space-y-2">
            <div className="text-[11px] text-muted-foreground">
              {tDual("Отдел продаж в Худжанде:", "Шуъбаи фурӯш дар Хуҷанд:")}
            </div>
            <div className="font-mono font-semibold text-foreground text-xs">
              +992 92 700 5555
            </div>
            <Link
              href="/"
              className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-medium pt-1"
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
