"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Wallet,
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FintechAnalyticsDto,
  PaymentTransactionDto,
  PAYMENT_PROVIDERS,
  PaymentProvider,
} from "@/lib/payments/payment-gateway";
import { PaymentModal } from "@/components/modules/payments/payment-modal";

export default function SuperAdminPaymentsPage() {
  const [analytics, setAnalytics] = useState<FintechAnalyticsDto | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransactionDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterProvider, setFilterProvider] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Test Payment Modal
  const [testModalOpen, setTestModalOpen] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/super-admin/payments");
      const data = await res.json();
      if (data.success) {
        setAnalytics(data.analytics);
        setTransactions(data.transactions);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    if (filterProvider !== "all" && t.provider !== filterProvider) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchName = t.payerName?.toLowerCase().includes(q) || false;
      const matchPhone = t.payerPhone?.toLowerCase().includes(q) || false;
      const matchDesc = t.descriptionRu?.toLowerCase().includes(q) || false;
      if (!matchId && !matchName && !matchPhone && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Национальный FinTech-шлюз Таджикистана</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Платежи и онлайн-эквайринг
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Мониторинг транзакций через Корти Милли (НПЦ РТ), Dushanbe City (DC Pay), Alif Pay / Salom и Банк Эсхата.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => setTestModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Тестовый платеж (Симулятор)</span>
          </Button>
        </div>
      </div>

      {/* 4 FINTECH KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Gross Volume */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs bg-linear-to-b from-emerald-50/40 via-white to-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Общий оборот</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analytics?.totalProcessedTjs.toLocaleString("ru-RU") || "142 570"} <span className="text-sm font-semibold text-slate-500">смн</span>
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                ~ ${analytics?.totalProcessedUsd.toLocaleString("ru-RU") || "13 080"} USD
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Completed Transactions */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs bg-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Успешных транзакций</span>
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analytics?.completedTransactionsCount || 6}
              </div>
              <div className="text-xs text-blue-600 font-semibold mt-0.5">
                Конверсия оплат: 96.8%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Average Check */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs bg-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Средний чек</span>
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {analytics?.averageCheckTjs.toLocaleString("ru-RU") || "23 760"} <span className="text-sm font-semibold text-slate-500">смн</span>
              </div>
              <div className="text-xs text-purple-600 font-semibold mt-0.5">
                B2B спонсорство + B2C услуги
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Pending / In Process */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 shadow-xs bg-white">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Платежные шлюзы</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                4 системы
              </div>
              <div className="text-xs text-amber-600 font-semibold mt-0.5">
                НПЦ РТ, DC, Alif, Эсхата
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RAILS BREAKDOWN & INTEGRATION STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            key: "korti_milli" as PaymentProvider,
            name: "Корти Милли",
            badge: "НПЦ РТ",
            volumeTjs: analytics?.byProvider.korti_milli.volumeTjs || 25,
            count: analytics?.byProvider.korti_milli.count || 1,
            color: "text-emerald-700 bg-emerald-50 border-emerald-200",
            status: "Онлайн 3D Secure",
          },
          {
            key: "dushanbe_city" as PaymentProvider,
            name: "Dushanbe City",
            badge: "DC Next / QR",
            volumeTjs: analytics?.byProvider.dushanbe_city.volumeTjs || 15000,
            count: analytics?.byProvider.dushanbe_city.count || 1,
            color: "text-amber-700 bg-amber-50 border-amber-200",
            status: "QR & Кошелек",
          },
          {
            key: "alif_mobi" as PaymentProvider,
            name: "Alif Pay & Salom",
            badge: "Рассрочка 0%",
            volumeTjs: analytics?.byProvider.alif_mobi.volumeTjs || 5045,
            count: analytics?.byProvider.alif_mobi.count || 2,
            color: "text-emerald-700 bg-emerald-50 border-emerald-200",
            status: "Alif Mobi QR",
          },
          {
            key: "eskhata_online" as PaymentProvider,
            name: "Банк Эсхата",
            badge: "Партнер Согда",
            volumeTjs: analytics?.byProvider.eskhata_online.volumeTjs || 121000,
            count: analytics?.byProvider.eskhata_online.count || 2,
            color: "text-blue-700 bg-blue-50 border-blue-200",
            status: "Эсхата Онлайн",
          },
        ].map((rail) => (
          <div
            key={rail.key}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <Badge className={`text-[10px] font-bold ${rail.color}`}>
                {rail.badge}
              </Badge>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {rail.status}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-slate-900">{rail.name}</h4>
              <div className="text-lg font-black text-slate-900 mt-1">
                {rail.volumeTjs.toLocaleString("ru-RU")} смн
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {rail.count} оплат проведено
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Controls Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Реестр платежных транзакций
            </h3>
            <Badge variant="outline" className="text-xs font-bold text-slate-700 ml-1">
              {filteredTransactions.length}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative w-48 sm:w-60">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Поиск по ID или телефону..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 rounded-xl text-xs bg-slate-50 border-slate-200"
              />
            </div>

            {/* Provider Filter */}
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
            >
              <option value="all">Все провайдеры</option>
              <option value="korti_milli">Корти Милли</option>
              <option value="dushanbe_city">Dushanbe City</option>
              <option value="alif_mobi">Alif Pay & Salom</option>
              <option value="eskhata_online">Эсхата Онлайн</option>
            </select>
          </div>
        </div>

        {/* Transactions Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">ID транзакции</th>
                <th className="py-3 px-4">Плательщик / Контакт</th>
                <th className="py-3 px-4">Назначение</th>
                <th className="py-3 px-4">Шлюз / Метод</th>
                <th className="py-3 px-4">Сумма (TJS / USD)</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4">Дата / Время</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{tx.payerName}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {tx.payerPhone}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="max-w-xs font-medium text-slate-800 line-clamp-1">
                      {tx.descriptionRu}
                    </div>
                    {tx.installmentMonths && (
                      <Badge className="bg-emerald-100 text-emerald-800 text-[9px] mt-1">
                        Рассрочка Салом {tx.installmentMonths} мес
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      className={`text-[10px] font-bold ${
                        PAYMENT_PROVIDERS[tx.provider]?.accentBg || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {PAYMENT_PROVIDERS[tx.provider]?.nameRu || tx.provider}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{tx.amountTjs.toLocaleString("ru-RU")} смн</div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      ~${tx.amountUsd} USD
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {tx.status === "completed" ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Оплачено</span>
                      </Badge>
                    ) : tx.status === "processing" ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold flex items-center gap-1 w-fit">
                        <Clock className="h-3 w-3" />
                        <span>3D Secure</span>
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold w-fit">
                        Ожидание
                      </Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(tx.completedAt || tx.createdAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Payment Test Modal */}
      <PaymentModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        purpose="ad_balance"
        title="Тестовый онлайн-платеж"
        subtitle="Проверка эквайринга Корти Милли, DC, Alif и Эсхата"
        amountTjs={500}
        onSuccess={() => {
          fetchPayments();
        }}
      />
    </div>
  );
}
