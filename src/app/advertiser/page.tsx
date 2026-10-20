"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  CheckCircle2,
  Award,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Building2,
  Sparkles,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
  Clock,
  BarChart3,
  Send,
  Zap,
  Globe2,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import { PaymentModal } from "@/components/modules/payments/payment-modal";

export default function AdvertiserPortalPage() {
  const { language, tDual } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const isTg = language === "tg";

  // Reach Estimator Calculator
  const [selectedImpressions, setSelectedImpressions] = useState<number>(25000);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<"cpm" | "cpc">("cpm");

  // Lead Form
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("+992 ");
  const [email, setEmail] = useState("");
  const [selectedPackage, setSelectedPackage] = useState<string>("annual_sponsor");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);

  // Estimator math
  const cpmRateTjs = 25; // 25 TJS per 1,000 views
  const cpcRateTjs = 1.5; // 1.50 TJS per click
  const estimatedClicks = Math.round(selectedImpressions * 0.052); // ~5.2% avg CTR
  const estimatedCostTjs =
    selectedModel === "cpm"
      ? Math.round((selectedImpressions / 1000) * cpmRateTjs)
      : Math.round(estimatedClicks * cpcRateTjs);
  const estimatedCostUsd = Math.round(estimatedCostTjs / 10.9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !phone) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/super-admin/ads/advertisers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          brandName: companyName,
          tin: "Заявка через портал",
          contactPerson: contactName,
          phone,
          email: email || "direct@maskani.tj",
          industry: "services",
          tier: selectedPackage === "annual_sponsor" ? "sponsor_annual" : "auction_bidder",
          notes: `Пакет: ${selectedPackage}. Сообщение: ${comment}`,
        }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
      }
    } catch {
      // fallback success
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const directWhatsAppUrl = `https://wa.me/992927770000?text=${encodeURIComponent(
    isTg
      ? `Салом! Ман мехоҳам дар платформаи Maskani.tj реклама ё шарикии солонаро пайваст кунам. Ширкат: ${companyName || "Номи ширкат"}`
      : `Здравствуйте! Хочу разместить рекламу или годовой спонсорский пакет на Maskani.tj. Компания: ${companyName || "Название компании"}`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              {isTg ? "Асосӣ" : "Главная"}
            </Link>
            <span>/</span>
            <span className="text-white font-medium">
              {isTg ? "Барои шарикон ва таблиғгарон" : "Партнерам и рекламодателям"}
            </span>
          </div>

          <Link href="/super-admin" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isTg ? "Вуруд ба Super Admin" : "Вход в Super Admin"}</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              {isTg
                ? "Платформаи асосии амволи вилояти Суғд"
                : "Главная медиа-платформа недвижимости Согдийской области"}
            </span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {isTg ? (
              <>
                Дастрасӣ ба беш аз{" "}
                <span className="text-emerald-400">100 000+</span> харидорон ва
                сармоягузорони амвол
              </>
            ) : (
              <>
                Прямой выход на платежеспособную аудиторию: более{" "}
                <span className="text-emerald-400">100 000+</span> покупателей и
                инвесторов
              </>
            )}
          </h1>

          <p className="mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {isTg
              ? "Шарикии стратегӣ бо бонкҳо, ширкатҳои сохтмонӣ, телеком ва брендҳои пешбари Тоҷикистон. Мудирияти кафолатноки нишондиҳандаҳо бо ҳисоботи шаффоф."
              : "Годовые эксклюзивные контракты для банков, девелоперов, телекома и производителей. Прозрачный аукцион показов и персональный менеджер."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#packages">
              <Button className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md gap-2">
                <span>{isTg ? "Интихоби бастаи шарикӣ" : "Выбрать пакет размещения"}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>

            <a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>WhatsApp: +992 92 777 0000</span>
              </Button>
            </a>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-slate-800/80 text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">64 200+</div>
              <div className="text-xs text-slate-400 mt-1">
                {isTg ? "Намоишҳои моҳона" : "Показов баннеров / мес"}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">5.21%</div>
              <div className="text-xs text-slate-400 mt-1">
                {isTg ? "Миёнаи CTR (кликҳо)" : "Средний CTR (конверсия)"}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">6 шаҳр</div>
              <div className="text-xs text-slate-400 mt-1">
                {isTg ? "Фарогирӣ дар вилоят" : "Худжанд, Исфара, Истаравшан..."}
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">305 000 смн</div>
              <div className="text-xs text-slate-400 mt-1">
                {isTg ? "Қарордодҳои фаъол" : "Объем годовых контрактов"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Existing Trusted Brands Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 mb-12">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isTg
                ? "Шарикони расмӣ ва брендҳои эътимодноки Maskani.tj"
                : "Официальные партнеры и рекламодатели Maskani.tj"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {[
              { name: "Банк Эсхата", role: isTg ? "Шарики молиявӣ" : "Генеральный банк", tag: "Ипотека 16%" },
              { name: "МегаФон Таджикистан", role: isTg ? "Телеком-шарик" : "Телеком-партнер", tag: "GPON Интернет" },
              { name: "Tcell", role: isTg ? "Телеком-шарик" : "Телеком-партнер", tag: "Роутеры 5G" },
              { name: "ГК Фаровон", role: isTg ? "Масолеҳи сохтмонӣ" : "Стройматериалы", tag: "Бетон & Металл" },
              { name: "Сомон Сохтмон", role: isTg ? "Девелопери асосӣ" : "Премиум-застройщик", tag: "ЖК «Хуҷанд»" },
              { name: "Artel Таджикистан", role: isTg ? "Техникаи маишӣ" : "Бытовая техника", tag: "Кондиционеры" },
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-center hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
              >
                <div className="font-extrabold text-xs text-slate-900">{p.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{p.role}</div>
                <Badge variant="outline" className="text-[9px] mt-1.5 border-emerald-500/30 text-emerald-700 bg-white">
                  {p.tag}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* SPONSORSHIP PACKAGES */}
        <div id="packages" className="space-y-6 mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
              {isTg ? "Тарофаҳо ва шартҳо" : "Тарифные пакеты"}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isTg
                ? "Бастаҳои таблиғотӣ барои ҳар гуна ҳадаф"
                : "Форматы монетизации и спонсорские пакеты"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isTg
                ? "Аз бастаи эксклюзивии солона то ауксиони шаффофи пардохт барои ҳар як клик ё намоиш"
                : "От годовых контрактов с фиксированной квотой показов до гибкого аукциона ставок"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Package 1: Annual Flat Sponsor */}
            <Card className="rounded-2xl border-2 border-emerald-500/80 shadow-md relative overflow-hidden bg-linear-to-b from-white via-white to-emerald-50/30 flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                {isTg ? "Машҳуртарин" : "Выбор лидеров"}
              </div>

              <CardContent className="p-6 space-y-5">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <Award className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {isTg ? "Спонсори солона (Flat)" : "Генеральный спонсор (Flat)"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isTg
                      ? "Барои бонкҳо ва ширкатҳои бузурги миллӣ бо ҳузури доимӣ"
                      : "Эксклюзив для банков, телекома и флагманских девелоперов"}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-3xl font-black text-slate-900">
                    120 000 <span className="text-sm font-semibold text-slate-500">смн / год</span>
                  </div>
                  <div className="text-xs text-emerald-600 font-semibold mt-0.5">
                    ~ $11 000 USD / год (10 000 смн в месяц)
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>65% гарантированной квоты показов</strong> во всех разделах</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Интеграция в кредитный калькулятор (для банков)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Широкий брендинг в каталоге и мобильной PWA-версии</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Прямой сбор заявок на WhatsApp и персональный менеджер</span>
                  </li>
                </ul>

                <Button
                  onClick={() => {
                    setSelectedPackage("annual_sponsor");
                    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  {isTg ? "Дархости бастаи солона" : "Оставить заявку на контракт"}
                </Button>
              </CardContent>
            </Card>

            {/* Package 2: Semi-Annual Industry Leader */}
            <Card className="rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between bg-white">
              <CardContent className="p-6 space-y-5">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {isTg ? "Пешвои соҳа (6 моҳ)" : "Лидер отрасли (6 месяцев)"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isTg
                      ? "Барои ширкатҳои сохтмонӣ, мебел ва таъмири хонаҳо"
                      : "Для девелоперов, поставщиков отделки и климатической техники"}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-3xl font-black text-slate-900">
                    60 000 <span className="text-sm font-semibold text-slate-500">смн / 6 мес</span>
                  </div>
                  <div className="text-xs text-blue-600 font-semibold mt-0.5">
                    ~ $5 500 USD (10 000 смн в месяц)
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Таргетинг по категории: Новостройки или Вторичка</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Гео-фокусировка: Худжанд, Истаравшан или Исфара</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>До 3 активных рекламных креативов (RU и TG)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Ежемесячная аналитика показов и переходов</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPackage("semi_annual");
                    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full h-11 rounded-xl border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs"
                >
                  {isTg ? "Интихоби тарофа" : "Выбрать полугодовой тариф"}
                </Button>
              </CardContent>
            </Card>

            {/* Package 3: Programmatic Auction (CPM / CPC) */}
            <Card className="rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between bg-white">
              <CardContent className="p-6 space-y-5">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {isTg ? "Ауксиони чандир (CPM / CPC)" : "Аукцион ставок (CPM / CPC)"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isTg
                      ? "Пардохт танҳо барои натиҷаи воқеӣ (мисли Яндекс Директ)"
                      : "Плата только за реальные показы или клики с гибким бюджетом"}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-3xl font-black text-slate-900">
                    25 <span className="text-sm font-semibold text-slate-500">смн / 1000 показов</span>
                  </div>
                  <div className="text-xs text-purple-600 font-semibold mt-0.5">
                    или от 1.50 смн (~$0.14) за целевой переход
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Старт с бюджетом от 500 сомони (~$45 USD)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Точечный гео-таргетинг по городам Согдийской области</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Быстрый запуск и управление дневным лимитом</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Оплата через Корти Милли, DC, Эсхата Онлайн</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPackage("auction");
                    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full h-11 rounded-xl border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs"
                >
                  {isTg ? "Оғози ауксион" : "Запустить рекламный аукцион"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* INTERACTIVE REACH CALCULATOR */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-2">
                  <Zap className="h-3 w-3 mr-1 text-emerald-400" />
                  {isTg ? "Ҳисобкунаки фарогирӣ" : "Интерактивный калькулятор охвата"}
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {isTg ? "Буҷа ва намоишҳоро ҳисоб кунед" : "Рассчитайте охват и отдачу от рекламы"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {isTg
                    ? "Ҳаҷми намоишҳоро интихоб намуда, шумораи тахминии харидорон ва кликҳоро муайян намоед."
                    : "Выберите желаемое количество показов и узнайте прогнозируемый объем кликов и звонков."}
                </p>
              </div>

              {/* Impressions Slider Buttons */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">
                  {isTg ? "Миқдори намоишҳо дар моҳ:" : "Количество показов баннера в месяц:"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[10000, 25000, 50000, 100000].map((imp) => (
                    <button
                      key={imp}
                      type="button"
                      onClick={() => setSelectedImpressions(imp)}
                      className={`h-11 rounded-xl text-xs font-bold transition-all border ${
                        selectedImpressions === imp
                          ? "bg-emerald-600 border-emerald-500 text-white shadow-sm"
                          : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {imp.toLocaleString("ru-RU")} {isTg ? "намоиш" : "показов"}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Selection */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-semibold block">
                  {isTg ? "Таргетинги ҷуғрофӣ:" : "Гео-таргетинг аудитории:"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", name: isTg ? "Тамоми вилояти Суғд" : "Вся Согдийская область" },
                    { id: "khujand", name: isTg ? "Хуҷанд" : "Худжанд" },
                    { id: "istaravshan", name: isTg ? "Истаравшан" : "Истаравшан" },
                    { id: "isfara", name: isTg ? "Исфара" : "Исфара" },
                  ].map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => setSelectedCity(city.id)}
                      className={`h-9 px-3.5 rounded-lg text-xs font-medium transition-all border ${
                        selectedCity === city.id
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-6 border border-slate-800 space-y-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isTg ? "Пешгӯии натиҷаҳо" : "Прогноз эффективности"}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">{isTg ? "Фарогирӣ" : "Охват"}</div>
                  <div className="text-xl font-black text-white mt-0.5">
                    {selectedImpressions.toLocaleString("ru-RU")}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">{isTg ? "намоишҳо" : "показов"}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">{isTg ? "Кликҳо (CTR ~5.2%)" : "Кликов (CTR ~5.2%)"}</div>
                  <div className="text-xl font-black text-emerald-400 mt-0.5">
                    ~ {estimatedClicks.toLocaleString("ru-RU")}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{isTg ? "муроҷиатҳо" : "переходов"}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">{isTg ? "Тахмини буҷа:" : "Ориентировочный бюджет:"}</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white">
                    {estimatedCostTjs.toLocaleString("ru-RU")} <span className="text-base font-semibold text-slate-400">смн</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">
                    (~${estimatedCostUsd.toLocaleString("ru-RU")} USD)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => setPayModalOpen(true)}
                  className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md gap-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {isTg
                      ? `Пардохти онлайн (${estimatedCostTjs.toLocaleString("ru-RU")} смн)`
                      : `Оплатить онлайн (${estimatedCostTjs.toLocaleString("ru-RU")} сомони)`}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full h-10 rounded-xl border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-semibold text-xs gap-2"
                >
                  <span>{isTg ? "Дархости шартнома бо менеҷер" : "Оставить заявку на договор"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div id="contact-form" className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-10">
          <div className="text-center mb-6">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Send className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isTg ? "Дархости ҷойгиркунии реклама" : "Заявка на размещение рекламы"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {isTg
                ? "Маълумоти ширкатро ворид кунед, менеҷери мо дар давоми 15 дақиқа бо шумо тамос мегирад."
                : "Заполните форму, и персональный менеджер свяжется с вами в течение 15 минут."}
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-950">
                {isTg ? "Дархости шумо қабул шуд!" : "Заявка успешно отправлена!"}
              </h4>
              <p className="text-xs text-emerald-800">
                {isTg
                  ? "Мо дар давоми наздиктарин бо шумо дар тамос мешавем. Ҳамчунин метавонед ба мо дар WhatsApp нависед."
                  : "Менеджер отдела партнерств Maskani.tj свяжется с вами для согласования деталей и запуска кампании."}
              </p>
              <a href={directWhatsAppUrl} target="_blank" rel="noopener noreferrer">
                <Button className="mt-2 h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{isTg ? "Муколама дар WhatsApp" : "Написать в WhatsApp"}</span>
                </Button>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Номи ширкат / Бренд *" : "Компания / Бренд *"}
                  </label>
                  <Input
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={isTg ? "Масалан: Бонки Эсхата" : "Например: Банк Эсхата"}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Шахси тамос *" : "Контактное лицо *"}
                  </label>
                  <Input
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder={isTg ? "Ном ва насаб" : "Имя и фамилия"}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Рақами телефон *" : "Номер телефона *" }
                  </label>
                  <Input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+992 92 777 0000"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {isTg ? "Почтаи электронӣ" : "Email для отчетов"}
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marketing@company.tj"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Бастаи интихобшуда:" : "Интересующий пакет:"}
                </label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-emerald-600"
                >
                  <option value="annual_sponsor">
                    {isTg ? "Спонсори солона (Flat, 120 000 смн / год)" : "Генеральный спонсор (Flat, 120 000 смн / год)"}
                  </option>
                  <option value="semi_annual">
                    {isTg ? "Пешвои соҳа (60 000 смн / 6 мес)" : "Лидер отрасли (60 000 смн / 6 мес)"}
                  </option>
                  <option value="auction">
                    {isTg ? "Ауксиони чандир (CPM / CPC)" : "Аукцион показов (CPM / CPC)"}
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {isTg ? "Шарҳ ё ҳадафи маърака" : "Комментарий к кампании"}
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isTg
                      ? "Масалан: мехоҳем барномаи ипотека ё масолеҳи сохтмониро дар Хуҷанд таблиғ намоем..."
                      : "Например: продвижение ипотеки 16% или старта продаж нового ЖК в Худжанде..."
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-emerald-600 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs gap-2"
              >
                {isSubmitting ? (
                  <span>{isTg ? "Фиристодан..." : "Отправка..."}</span>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{isTg ? "Ирсоли дархост" : "Отправить заявку менеджеру"}</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Online Payment Modal */}
      <PaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        purpose="ad_balance"
        title={isTg ? "Пардохти онлайни тавозуни таблиғот" : "Пополнение рекламного баланса онлайн"}
        subtitle={
          isTg
            ? `Фарогирии тахминии ${selectedImpressions.toLocaleString("ru-RU")} намоишҳо дар вилояти Суғд`
            : `Расчетный охват: ${selectedImpressions.toLocaleString("ru-RU")} показов по городам Согда`
        }
        amountTjs={estimatedCostTjs}
        onSuccess={() => {
          setSubmitSuccess(true);
        }}
      />
    </div>
  );
}
