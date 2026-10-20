"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Megaphone,
  TrendingUp,
  Building2,
  Users,
  Eye,
  MousePointerClick,
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { serveAdBanner, ServedBannerResult } from "@/lib/ads/ad-engine";

export default function SuperAdminOverviewPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Simulator state
  const [simCity, setSimCity] = useState("all");
  const [simCategory, setSimCategory] = useState("all");
  const [simLang, setSimLang] = useState<"ru" | "tg">("ru");
  const [simulatedBanner, setSimulatedBanner] = useState<ServedBannerResult | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/super-admin/ads/overview");
        const json = await res.json();
        if (json.success && json.analytics) {
          setAnalytics(json.analytics);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // Run initial simulation
    setSimulatedBanner(
      serveAdBanner({ city: "all", category: "all", slot: "catalog_banner", language: "ru" })
    );
  }, []);

  const handleRunSimulation = () => {
    const banner = serveAdBanner({
      city: simCity,
      category: simCategory,
      slot: "catalog_banner",
      language: simLang,
    });
    setSimulatedBanner(banner);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Панель управления порталом</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Сводка и монетизация
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Управление спонсорскими пакетами гигантов Таджикистана, аукционом показов и активными кампаниями.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/super-admin/ads">
            <Button className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm gap-2">
              <Megaphone className="h-4 w-4" />
              <span>Управление рекламой</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Financial & Traffic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Annual Sponsorship Contracts */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs bg-linear-to-b from-emerald-50/40 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Годовые спонсоры</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics?.totalAnnualContractValueTjs?.toLocaleString() || "305 000"} сомони
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span>≈ ${analytics?.totalAnnualContractValueUsd?.toLocaleString() || "27 980"} в год</span>
              <span className="text-slate-400 font-normal">• 3 генеральных партнера</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Active Advertisers */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Рекламодатели</span>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics?.totalAdvertisers || 6} брендов
            </div>
            <p className="text-[11px] text-slate-500">
              Эсхата, МегаФон, Tcell, Фаровон, Сомон Сохтмон
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Total Impressions */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Показы баннеров</span>
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics?.totalImpressions?.toLocaleString() || "64 340"}
            </div>
            <p className="text-[11px] text-slate-500">
              Каталог, поиск, брендовые блоки
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Clicks & CTR */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Клики и средний CTR</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <MousePointerClick className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {analytics?.totalClicks?.toLocaleString() || "3 350"} кликов
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
              CTR: {analytics?.averageCtr || "5.21%"} (высокая вовлеченность)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Simulator: Live Ad Auction & Placement Engine */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-0.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Интерактивный симулятор показа</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Проверка алгоритма выдачи баннера
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={handleRunSimulation}
              className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Запустить ротацию</span>
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Геолокация пользователя (Город Согда)
            </label>
            <select
              value={simCity}
              onChange={(e) => setSimCity(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800"
            >
              <option value="all">Все города Согдийской области</option>
              <option value="khujand">Худжанд (Khujand)</option>
              <option value="istaravshan">Истаравшан (Istaravshan)</option>
              <option value="isfara">Исфара (Isfara)</option>
              <option value="guliston">Гулистон (Guliston)</option>
              <option value="buston">Бустон (Buston)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Категория недвижимости
            </label>
            <select
              value={simCategory}
              onChange={(e) => setSimCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800"
            >
              <option value="all">Все категории</option>
              <option value="new_buildings">Новостройки (Жилые комплексы)</option>
              <option value="secondary">Вторичный рынок (Квартиры)</option>
              <option value="commercial">Коммерческая недвижимость</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              Язык интерфейса
            </label>
            <select
              value={simLang}
              onChange={(e) => setSimLang(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-xs text-slate-800"
            >
              <option value="ru">Русский (ru)</option>
              <option value="tg">Тоҷикӣ (tg)</option>
            </select>
          </div>
        </div>

        {/* Live Banner Preview Box */}
        {simulatedBanner && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">
                Выигравший баннер в ротации:
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    simulatedBanner.tier === "sponsor_annual"
                      ? "bg-emerald-600 text-white"
                      : simulatedBanner.tier === "auction_bidder"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-white"
                  }
                >
                  {simulatedBanner.tier === "sponsor_annual"
                    ? "Годовой спонсор (60% приоритет)"
                    : simulatedBanner.tier === "auction_bidder"
                    ? "Победитель аукциона ставок"
                    : "Самореклама (Заглушка)"}
                </Badge>
                <span className="font-mono text-slate-400">Рекламодатель: {simulatedBanner.advertiserName}</span>
              </div>
            </div>

            {/* Rendered Live Banner */}
            <div
              style={{ backgroundColor: simulatedBanner.bgColorHex }}
              className="p-5 sm:p-6 rounded-2xl text-white shadow-md relative overflow-hidden transition-all"
            >
              <div className="max-w-3xl space-y-2 relative z-10">
                {simulatedBanner.badgeText && (
                  <span
                    style={{ backgroundColor: simulatedBanner.accentColorHex }}
                    className="inline-block px-2.5 py-0.5 rounded-md text-slate-950 font-bold text-[10px] uppercase tracking-wider mb-1"
                  >
                    {simulatedBanner.badgeText}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  {simulatedBanner.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                  {simulatedBanner.subtitle}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={simulatedBanner.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ backgroundColor: simulatedBanner.accentColorHex }}
                    className="px-4 py-2 rounded-xl text-slate-950 font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
                  >
                    {simulatedBanner.ctaText}
                  </a>

                  {simulatedBanner.phone && (
                    <span className="text-xs font-mono text-slate-300">
                      Тел: {simulatedBanner.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Decorative background glow */}
              <div
                style={{ backgroundColor: simulatedBanner.accentColorHex }}
                className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Corporate Partners & Annual Sponsors Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Крупные корпоративные партнеры Таджикистана
            </h2>
            <p className="text-xs text-slate-500">
              Спонсорские пакеты, баланс и статус сотрудничества
            </p>
          </div>
          <Link
            href="/super-admin/ads"
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>Все кампании</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Компания / Бренд</th>
                <th className="py-3 px-3">Отрасль</th>
                <th className="py-3 px-3">Тип пакета</th>
                <th className="py-3 px-3">Годовой контракт / Баланс</th>
                <th className="py-3 px-3">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {analytics?.advertisers?.map((adv: any) => (
                <tr key={adv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {adv.brandName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {adv.companyName}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 capitalize text-slate-600 dark:text-slate-300">
                    {adv.industry === "bank"
                      ? "Банки и финансы"
                      : adv.industry === "telecom"
                      ? "Телеком и связь"
                      : adv.industry === "developer"
                      ? "Строительство"
                      : adv.industry === "manufacturing"
                      ? "Производство"
                      : "Ритейл"}
                  </td>
                  <td className="py-3.5 px-3">
                    {adv.tier === "sponsor_annual" ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                        Годовой спонсор 365д
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-600 border-slate-300 text-[10px]">
                        Аукцион ставок
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {adv.annualContractValueTjs
                      ? `${adv.annualContractValueTjs.toLocaleString()} сомони`
                      : `${adv.balanceTjs?.toLocaleString() || 0} сомони`}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Активен</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
