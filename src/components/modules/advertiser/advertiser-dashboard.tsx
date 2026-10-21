"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Wallet,
  TrendingUp,
  BarChart3,
  Target,
  Sparkles,
  Layers,
  ArrowRight,
  LogOut,
  RefreshCw,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Eye,
  MousePointerClick,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentModal } from "@/components/modules/payments/payment-modal";
import { ReconciliationModal } from "./reconciliation-modal";
import { NewBannerModal } from "./new-banner-modal";
import type { AdvertiserDto, AdCampaignDto, ReconciliationAct } from "@/lib/ads/ad-engine";
import { formatTJS, formatUSD } from "@/lib/currency";

interface AdvertiserDashboardProps {
  advertiser: AdvertiserDto;
  onLogout: () => void;
}

export function AdvertiserDashboard({ advertiser, onLogout }: AdvertiserDashboardProps) {
  const [currentAdv, setCurrentAdv] = useState<AdvertiserDto>(advertiser);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [newBannerOpen, setNewBannerOpen] = useState(false);
  const [reconciliationOpen, setReconciliationOpen] = useState(false);
  const [reconciliationAct, setReconciliationAct] = useState<ReconciliationAct | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/advertiser/stats?advertiserId=${currentAdv.id}`);
      const json = await res.json();
      if (json.success) {
        setStatsData(json.data);
        if (json.data.advertiser) {
          setCurrentAdv(json.data.advertiser);
        }
      }
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [currentAdv.id]);

  const handleOpenReconciliation = async () => {
    try {
      const res = await fetch(`/api/advertiser/reconciliation?advertiserId=${currentAdv.id}`);
      const json = await res.json();
      if (json.success) {
        setReconciliationAct(json.act);
        setReconciliationOpen(true);
      }
    } catch {}
  };

  const campaigns: AdCampaignDto[] = statsData?.campaigns || [];
  const totalImpressions: number = statsData?.totalImpressions || 0;
  const totalClicks: number = statsData?.totalClicks || 0;
  const ctr: string = statsData?.ctr || "0.00%";
  const cityBreakdown = statsData?.cityBreakdown || [];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20 shrink-0">
              {currentAdv.brandName.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentAdv.brandName}
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  {currentAdv.tier === "sponsor_annual" ? "Генеральный спонсор" : "Аукционный рекламодатель"}
                </Badge>
              </div>

              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{currentAdv.companyName}</span>
                <span>•</span>
                <span>Контакт: {currentAdv.contactPerson}</span>
                <span>•</span>
                <span className="font-mono">{currentAdv.phone}</span>
              </p>
            </div>
          </div>

          {/* Balance & Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl px-5 py-3 text-left min-w-[180px]">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Рекламный баланс
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                {currentAdv.balanceTjs.toLocaleString("ru-RU")} сомони
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                ≈ ${currentAdv.balanceUsd.toLocaleString("en-US")}
              </span>
            </div>

            <Button
              onClick={() => setPayModalOpen(true)}
              className="h-12 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <Wallet className="h-4 w-4" />
              <span>Пополнить баланс</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="h-12 px-4 rounded-2xl border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold gap-1.5 cursor-pointer"
              title="Выйти из кабинета"
            >
              <LogOut className="h-4 w-4" />
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Всего показов</span>
            <Eye className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {totalImpressions.toLocaleString("ru-RU")}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            +12.4% за последние 30 дней
          </span>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Кликов по баннерам</span>
            <MousePointerClick className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {totalClicks.toLocaleString("ru-RU")}
          </div>
          <span className="text-[11px] text-blue-700 font-medium mt-1 block">
            Целевые переходы на сайт / WhatsApp
          </span>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Средний CTR</span>
            <Percent className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 mt-2">
            {ctr}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Выше рынка по Согду в 2.4 раза
          </span>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Израсходовано</span>
            <BarChart3 className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-mono">
            {currentAdv.totalSpentTjs.toLocaleString("ru-RU")} TJS
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            ≈ ${currentAdv.totalSpentUsd.toLocaleString("en-US")}
          </span>
        </Card>
      </div>

      {/* Geographic Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Geographic coverage */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                География показов и кликов (Вилояти Суғд)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Автоматическое распределение по городам с высокой покупательской активностью
              </p>
            </div>
            <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-800 bg-emerald-50">
              5 городов Согда
            </Badge>
          </div>

          <div className="space-y-3 pt-2">
            {cityBreakdown.map((city: any) => (
              <div key={city.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {city.nameRu} <span className="text-slate-400 font-normal font-sans">({city.nameTg})</span>
                  </span>
                  <div className="flex items-center gap-3 text-slate-600 font-mono text-[11px]">
                    <span>{city.impressions.toLocaleString("ru-RU")} показов</span>
                    <span className="font-bold text-emerald-600">{city.clicks} кликов</span>
                    <span className="font-bold text-slate-900 w-10 text-right">{city.percent}%</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${city.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Accounting and Closing documents */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Бухгалтерские документы
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Электронные акты сверки взаимных расчетов, счета-фактуры и квитанции об оплате с цифровой подписью.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Последний акт:</span>
                <span className="font-semibold text-slate-900">№ ACT-Q3-2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Период:</span>
                <span className="font-semibold text-slate-900">01.07 - 30.09.2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Статус:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Подписан
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={handleOpenReconciliation}
              className="w-full h-10 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
            >
              <FileText className="h-3.5 w-3.5 text-blue-600" />
              <span>Посмотреть и распечатать Акт сверки</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Campaigns & Banners Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Управление рекламными баннерами и A/B тестами
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Активные креативы, ставки за показ/клик и статистика конверсий
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchStats}
              className="h-9 px-3 rounded-xl border-slate-200 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Обновить</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setNewBannerOpen(true)}
              className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Запустить новый баннер</span>
            </Button>
          </div>
        </div>

        {/* Banners List */}
        <div className="space-y-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              У вас пока нет запущенных баннеров. Нажмите «Запустить новый баннер», чтобы начать показы.
            </div>
          ) : (
            campaigns.map((camp) => (
              <div key={camp.id} className="border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-sm text-slate-900">{camp.name}</span>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                      {camp.billingModel === "annual_sponsorship" ? "Спонсорский контракт" : "Аукцион показов"}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-500 font-mono">
                    Ставка: {camp.bidAmountTjs} TJS ({camp.billingModel === "auction_cpc" ? "за клик" : "за 1000 показов"})
                  </div>
                </div>

                {/* Creatives in Campaign */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {camp.creatives.map((cr) => (
                    <div
                      key={cr.id}
                      className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/50 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-700 bg-white">
                            {cr.isActive ? "🟢 В ротации" : "⚪ На паузе"}
                          </Badge>
                          <span className="text-[11px] text-slate-500 font-mono">ID: {cr.id}</span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                          {cr.titleRu}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {cr.subtitleRu}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">
                            👁 {cr.impressionsCount.toLocaleString("ru-RU")}
                          </span>
                          <span className="font-bold text-emerald-600">
                            🎯 {cr.clicksCount} кликов
                          </span>
                        </div>

                        <a
                          href={cr.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-800 font-sans font-semibold flex items-center gap-1 text-[11px]"
                        >
                          <span>{cr.ctaTextRu}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        purpose="ad_balance"
        title="Пополнение рекламного баланса онлайн"
        subtitle={`Пополнение баланса аккаунта ${currentAdv.brandName}`}
        amountTjs={1000}
        advertiserId={currentAdv.id}
        onSuccess={() => {
          fetchStats();
        }}
      />

      <NewBannerModal
        open={newBannerOpen}
        onOpenChange={setNewBannerOpen}
        advertiserId={currentAdv.id}
        onSuccess={() => {
          fetchStats();
        }}
      />

      <ReconciliationModal
        open={reconciliationOpen}
        onOpenChange={setReconciliationOpen}
        act={reconciliationAct}
      />
    </div>
  );
}
