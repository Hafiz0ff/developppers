"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCurrency } from "@/context/currency-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  Eye,
  PhoneCall,
  MessageCircle,
  MessagesSquare,
  Heart,
  Download,
  Calendar,
  Key,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Building,
  Home,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Layers,
} from "lucide-react";

type PeriodFilter = "today" | "7d" | "30d" | "all";

interface DayStat {
  date: string;
  views: number;
  phones: number;
  whatsapp: number;
  chats: number;
  favs: number;
  leads: number;
}

interface PropertyMetric {
  id: string;
  title: string;
  city: string;
  dealType: string;
  priceTjs: number;
  priceUsd: number;
  views: number;
  phones: number;
  whatsapp: number;
  chats: number;
  favs: number;
  ctr: string;
  status: "active" | "archived" | "deal";
}

// Демо-данные объявлений маклера в Согдийской области
const INITIAL_PROPERTIES: PropertyMetric[] = [
  {
    id: "c1",
    title: "3-комнатная квартира с евроремонтом (18 мкр, Худжанд)",
    city: "г. Худжанд",
    dealType: "Продажа",
    priceTjs: 536550,
    priceUsd: 49000,
    views: 482,
    phones: 38,
    whatsapp: 62,
    chats: 14,
    favs: 41,
    ctr: "23.6%",
    status: "active",
  },
  {
    id: "c2",
    title: "Благоустроенный дом (Ҳавлӣ) 6.5 соток, Унчи",
    city: "Б. Гафуров",
    dealType: "Продажа",
    priceTjs: 711750,
    priceUsd: 65000,
    views: 345,
    phones: 29,
    whatsapp: 41,
    chats: 9,
    favs: 32,
    ctr: "22.9%",
    status: "active",
  },
  {
    id: "c3",
    title: "Торговое помещение у рынка «Панчшанбе»",
    city: "г. Худжанд",
    dealType: "Аренда",
    priceTjs: 8500,
    priceUsd: 776,
    views: 210,
    phones: 19,
    whatsapp: 28,
    chats: 8,
    favs: 18,
    ctr: "26.2%",
    status: "active",
  },
  {
    id: "c4",
    title: "2-комнатная новостройка в ЖК «Сирдарё Плаза» (19 мкр)",
    city: "г. Худжанд",
    dealType: "Продажа",
    priceTjs: 348210,
    priceUsd: 31800,
    views: 520,
    phones: 44,
    whatsapp: 73,
    chats: 18,
    favs: 58,
    ctr: "26.0%",
    status: "active",
  },
];

export default function BrokerAnalyticsPage() {
  const { formatPrice } = useCurrency();
  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("all");
  const [copiedKey, setCopiedKey] = useState(false);
  const [apiKey, setApiKey] = useState("sr_live_9b4e72f0a1c6e482390d4");
  const [isGenerating, setIsGenerating] = useState(false);

  // Множитель для симуляции выбранного периода
  const periodMultiplier = useMemo(() => {
    switch (period) {
      case "today":
        return 0.08;
      case "7d":
        return 0.3;
      case "30d":
        return 1.0;
      case "all":
        return 2.4;
    }
  }, [period]);

  // Фильтрация объектов
  const displayedProperties = useMemo(() => {
    if (selectedPropertyId === "all") return INITIAL_PROPERTIES;
    return INITIAL_PROPERTIES.filter((p) => p.id === selectedPropertyId);
  }, [selectedPropertyId]);

  // Сводные метрики
  const totals = useMemo(() => {
    let views = 0;
    let phones = 0;
    let whatsapp = 0;
    let chats = 0;
    let favs = 0;

    displayedProperties.forEach((p) => {
      views += Math.round(p.views * periodMultiplier);
      phones += Math.round(p.phones * periodMultiplier);
      whatsapp += Math.round(p.whatsapp * periodMultiplier);
      chats += Math.round(p.chats * periodMultiplier);
      favs += Math.round(p.favs * periodMultiplier);
    });

    const totalLeads = phones + whatsapp + chats;
    const conversion = views > 0 ? ((totalLeads / views) * 100).toFixed(1) : "0.0";

    return {
      views,
      phones,
      whatsapp,
      chats,
      favs,
      totalLeads,
      conversion,
    };
  }, [displayedProperties, periodMultiplier]);

  // Генерация дневных срезов для мини-графика
  const dailyStats = useMemo<DayStat[]>(() => {
    const daysCount = period === "today" ? 1 : period === "7d" ? 7 : period === "30d" ? 14 : 30;
    const result: DayStat[] = [];
    const now = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });

      const dayViews = Math.max(5, Math.round((totals.views / daysCount) * (0.7 + Math.sin(i * 1.2) * 0.4)));
      const dayPhones = Math.max(1, Math.round(dayViews * 0.08));
      const dayWhatsapp = Math.max(1, Math.round(dayViews * 0.13));
      const dayChats = Math.round(dayViews * 0.03);
      const dayFavs = Math.max(1, Math.round(dayViews * 0.09));
      const dayLeads = dayPhones + dayWhatsapp + dayChats;

      result.push({
        date: dateStr,
        views: dayViews,
        phones: dayPhones,
        whatsapp: dayWhatsapp,
        chats: dayChats,
        favs: dayFavs,
        leads: dayLeads,
      });
    }

    return result;
  }, [period, totals]);

  // Экспорт данных в CSV / Excel с UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Название объекта",
      "Город",
      "Тип сделки",
      "Цена (USD)",
      "Просмотры",
      "Звонки (Показать номер)",
      "Переходы в WhatsApp",
      "Чаты на портале",
      "В избранном",
      "Всего откликов",
      "Конверсия (CTR)",
    ];

    const rows = displayedProperties.map((p) => {
      const v = Math.round(p.views * periodMultiplier);
      const ph = Math.round(p.phones * periodMultiplier);
      const wa = Math.round(p.whatsapp * periodMultiplier);
      const ch = Math.round(p.chats * periodMultiplier);
      const f = Math.round(p.favs * periodMultiplier);
      const leads = ph + wa + ch;
      const ctr = v > 0 ? `${((leads / v) * 100).toFixed(1)}%` : "0%";

      return [
        `"${p.id}"`,
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.city}"`,
        `"${p.dealType}"`,
        p.priceUsd,
        v,
        ph,
        wa,
        ch,
        f,
        leads,
        `"${ctr}"`,
      ].join(";");
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `sogd_realty_analytics_${period}_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomHex = Array.from({ length: 24 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setApiKey(`sr_live_${randomHex}`);
      setIsGenerating(false);
    }, 400);
  };

  // Максимальное значение для высоты столбиков графиков
  const maxViews = Math.max(...dailyStats.map((d) => d.views), 1);
  const maxLeads = Math.max(...dailyStats.map((d) => d.leads), 1);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Личный кабинет маклера и агентства (B2B CRM)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Аналитика и отчётность по объектам
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Отслеживайте воронку конверсий, звонки, переходы в WhatsApp и синхронизируйте данные со своей CRM через Open API.
          </p>
        </div>

        {/* PERIOD SELECTOR & EXPORT BUTTON */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-muted/60 p-1 rounded-lg border text-xs font-semibold">
            {(
              [
                { id: "today", label: "Сегодня" },
                { id: "7d", label: "7 дней" },
                { id: "30d", label: "30 дней" },
                { id: "all", label: "За всё время" },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setPeriod(btn.id)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  period === btn.id
                    ? "bg-background text-emerald-600 shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-semibold h-9 px-3.5 border-emerald-600/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            Экспорт в Excel (CSV)
          </Button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Views */}
        <Card className="border-emerald-500/20 bg-gradient-to-br from-card to-emerald-500/5">
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Просмотры</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {totals.views.toLocaleString("ru-RU")}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +14.2% к прошлому периоду
            </p>
          </CardContent>
        </Card>

        {/* Total Leads (All channels) */}
        <Card className="border-emerald-500/30 bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-100">
              <span>Всего откликов (Лиды)</span>
              <div className="h-7 w-7 rounded-lg bg-white/20 text-white flex items-center justify-center">
                <PhoneCall className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {totals.totalLeads.toLocaleString("ru-RU")}
            </div>
            <p className="text-[11px] text-emerald-100 font-medium">
              Конверсия в контакт: <strong>{totals.conversion}%</strong>
            </p>
          </CardContent>
        </Card>

        {/* WhatsApp Clicks */}
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>WhatsApp диалоги</span>
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {totals.whatsapp.toLocaleString("ru-RU")}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {totals.totalLeads > 0
                ? `${Math.round((totals.whatsapp / totals.totalLeads) * 100)}% от всех лидов`
                : "Основной канал связи"}
            </p>
          </CardContent>
        </Card>

        {/* Phone Views */}
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Звонки (Показать тел.)</span>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <PhoneCall className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {totals.phones.toLocaleString("ru-RU")}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {totals.totalLeads > 0
                ? `${Math.round((totals.phones / totals.totalLeads) * 100)}% прямые звонки`
                : "Прямые звонки"}
            </p>
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card>
          <CardContent className="p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>В избранном</span>
              <div className="h-7 w-7 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Heart className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {totals.favs.toLocaleString("ru-RU")}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Отложенный спрос клиентов
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DYNAMIC TIMELINE CHART & CHANNEL BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Динамика просмотров и откликов
                </CardTitle>
                <CardDescription className="text-xs">
                  Ежедневное распределение трафика по вашим объявлениям в Согде
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 inline-block" />
                  <span>Просмотры</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-400 inline-block" />
                  <span>Лиды (Звонки/WA)</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {/* Visual Bar Graph */}
            <div className="h-48 flex items-end gap-1.5 sm:gap-2 pt-6 border-b pb-2">
              {dailyStats.map((d, idx) => {
                const viewHeightPct = Math.min(100, Math.max(12, (d.views / maxViews) * 100));
                const leadHeightPct = Math.min(100, Math.max(8, (d.leads / maxLeads) * 60));

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 bg-foreground text-background text-[10px] font-semibold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {d.date}: {d.views} просм., {d.leads} лидов
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5 h-full">
                      {/* Views bar */}
                      <div
                        style={{ height: `${viewHeightPct}%` }}
                        className="w-1/2 bg-emerald-600/80 group-hover:bg-emerald-600 rounded-t-sm transition-all"
                      />
                      {/* Leads bar */}
                      <div
                        style={{ height: `${leadHeightPct}%` }}
                        className="w-1/2 bg-teal-400 group-hover:bg-teal-300 rounded-t-sm transition-all"
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                      {d.date.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Lead Channels Breakdown (Donut/Progress style) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">
              Каналы обращений покупателей
            </CardTitle>
            <CardDescription className="text-xs">
              Куда чаще всего обращаются клиенты из Худжанда и Согда
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* WhatsApp */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-foreground">
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  WhatsApp сообщения
                </span>
                <span className="font-mono text-emerald-600">
                  {totals.whatsapp} (
                  {totals.totalLeads > 0 ? Math.round((totals.whatsapp / totals.totalLeads) * 100) : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${
                      totals.totalLeads > 0 ? (totals.whatsapp / totals.totalLeads) * 100 : 0
                    }%`,
                  }}
                  className="h-full bg-emerald-600 rounded-full"
                />
              </div>
            </div>

            {/* Direct Phone Calls */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-foreground">
                  <PhoneCall className="h-3.5 w-3.5 text-blue-600" />
                  Звонки по телефону
                </span>
                <span className="font-mono text-blue-600">
                  {totals.phones} (
                  {totals.totalLeads > 0 ? Math.round((totals.phones / totals.totalLeads) * 100) : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${
                      totals.totalLeads > 0 ? (totals.phones / totals.totalLeads) * 100 : 0
                    }%`,
                  }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            </div>

            {/* Portal Chats */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-foreground">
                  <MessagesSquare className="h-3.5 w-3.5 text-amber-600" />
                  Сообщения на портале
                </span>
                <span className="font-mono text-amber-600">
                  {totals.chats} (
                  {totals.totalLeads > 0 ? Math.round((totals.chats / totals.totalLeads) * 100) : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${
                      totals.totalLeads > 0 ? (totals.chats / totals.totalLeads) * 100 : 0
                    }%`,
                  }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 p-3 text-[11px] text-muted-foreground leading-relaxed">
                💡 <strong>Совет маклеру:</strong> 60%+ клиентов в Согдийской области предпочитают сразу писать в WhatsApp для получения геолокации и видео рум-тура. Держите номер WhatsApp всегда активным!
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PROPERTIES PERFORMANCE TABLE */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground">
                Статистика по объектам недвижимости
              </CardTitle>
              <CardDescription className="text-xs">
                Показатели просмотров, кликов по номеру телефона и конверсий по каждому объявлению
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="h-9 rounded-lg border bg-background px-3 text-xs font-medium outline-hidden"
              >
                <option value="all">Все объекты ({INITIAL_PROPERTIES.length})</option>
                {INITIAL_PROPERTIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title.slice(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 border-y text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Объект недвижимости</th>
                  <th className="py-3 px-3">Цена</th>
                  <th className="py-3 px-3 text-center">Просмотры</th>
                  <th className="py-3 px-3 text-center">Звонки</th>
                  <th className="py-3 px-3 text-center">WhatsApp</th>
                  <th className="py-3 px-3 text-center">Избранное</th>
                  <th className="py-3 px-3 text-center">Конверсия (CTR)</th>
                  <th className="py-3 px-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {displayedProperties.map((p) => {
                  const v = Math.round(p.views * periodMultiplier);
                  const ph = Math.round(p.phones * periodMultiplier);
                  const wa = Math.round(p.whatsapp * periodMultiplier);
                  const f = Math.round(p.favs * periodMultiplier);
                  const leads = ph + wa;
                  const ctr = v > 0 ? `${((leads / v) * 100).toFixed(1)}%` : "0%";

                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-foreground line-clamp-1">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <span>{p.city}</span> • <span>{p.dealType}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-foreground whitespace-nowrap">
                        {formatPrice(p.priceTjs, p.priceUsd)}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium">
                        {v}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-blue-600">
                        {ph}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-emerald-600">
                        {wa}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium text-rose-500">
                        {f}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-300 font-mono text-[10px]"
                        >
                          {ctr}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`#classifieds`}>
                          <Button variant="ghost" size="xs" className="gap-1 text-xs">
                            Смотреть
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* OPEN API & EXTERNAL CRM INTEGRATION BOX */}
      <Card className="border-emerald-500/20 bg-muted/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-foreground">
                  Интеграция с внешней CRM (AmoCRM, Bitrix24, 1C)
                </CardTitle>
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  Open API v1 Active
                </Badge>
              </div>
              <CardDescription className="text-xs mt-1">
                Подключите автоматическую выгрузку аналитики и публикацию объявлений из вашей существующей CRM-системы
              </CardDescription>
            </div>
            <Link
              href="/api/v1/external/analytics"
              target="_blank"
              className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
            >
              Проверить JSON в браузере
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* API Key management */}
          <div className="bg-background border rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-foreground block">
                  Ваш секретный API-токен:
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Используйте в заголовке: <code>Authorization: Bearer sr_live_...</code> или <code>X-API-Key: ...</code>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyKey}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-semibold gap-1.5"
                >
                  {copiedKey ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Скопировано!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Копировать ключ
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleRegenerateKey}
                  variant="ghost"
                  size="sm"
                  disabled={isGenerating}
                  className="h-8 text-xs text-muted-foreground gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  Перевыпустить
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={apiKey}
                className="font-mono text-xs bg-muted/50 border h-9"
              />
            </div>
          </div>

          {/* Quick Endpoints Reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-background border rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                <span className="text-emerald-700 dark:text-emerald-400">GET /api/v1/external/analytics</span>
                <Badge variant="outline" className="text-[10px]">Read</Badge>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Получение агрегированных отчетов, просмотров, звонков и детализации по дням (поддерживает <code>?period=today|7d|30d|all</code>).
              </p>
            </div>

            <div className="bg-background border rounded-xl p-3.5 space-y-1.5">
              <div className="flex items-center justify-between font-mono font-bold text-[11px]">
                <span className="text-blue-700 dark:text-blue-400">POST /api/v1/external/feed/import</span>
                <Badge variant="outline" className="text-[10px]">Write</Badge>
              </div>
              <p className="text-muted-foreground text-[11px]">
                Пакетный импорт и авто-публикация объектов недвижимости из вашей внешней CRM без ручного переноса.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
