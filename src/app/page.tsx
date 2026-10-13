"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/currency-context";
import { SOGD_CITIES } from "@/lib/constants/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShaderBackground } from "@/components/ui/shader-background";
import { DeveloperAvatar } from "@/components/ui/developer-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Home,
  MapPin,
  Search,
  CheckCircle2,
  Calendar,
  Percent,
  Phone,
  MessageCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Trees,
  Store,
  Layers,
  Sparkles,
  TrendingUp,
  KeyRound,
  FileSpreadsheet,
  Check,
} from "lucide-react";

// Демонстрационные данные каталога новостроек (CIAN Style)
const FEATURED_PROJECTS = [
  {
    id: "proj_sirdaryo_plaza",
    name: "ЖК «Сирдарё Плаза»",
    slug: "sirdaryo-plaza",
    developerName: "Рахш Сохтмон",
    status: "Строится (4 кв. 2026)",
    buildingClass: "Бизнес-класс",
    city: "г. Худжанд",
    district: "19 мкр, Набережная Сырдарьи",
    floors: 16,
    coverImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=750&fit=crop",
    pricePerMeterTjs: 6570,
    pricePerMeterUsd: 600,
    minPriceTjs: 348210,
    minPriceUsd: 31800,
    installment: "Рассрочка 0% до 24 мес",
    downPayment: "Взнос от 30%",
    tags: ["Вид на Сырдарью", "Подземный паркинг", "Автономное отопление"],
    availableUnitsCount: 34,
  },
  {
    id: "proj_sugdiyon",
    name: "ЖК «Суғдиён Сити»",
    slug: "sugdiyon-city",
    developerName: "Сайҳун Девелопмент",
    status: "Строится (2 кв. 2027)",
    buildingClass: "Комфорт-класс",
    city: "г. Худжанд",
    district: "18 мкр, пр. Гафурова",
    floors: 12,
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=750&fit=crop",
    pricePerMeterTjs: 5475,
    pricePerMeterUsd: 500,
    minPriceTjs: 262800,
    minPriceUsd: 24000,
    installment: "Рассрочка до 36 мес",
    downPayment: "Взнос от 20%",
    tags: ["Рядом школа №28", "Супермаркет «Амид»", "Закрытый двор"],
    availableUnitsCount: 52,
  },
];

// Частные объявления (Avito / CIAN Style)
const RECENT_CLASSIFIEDS = [
  {
    id: "c1",
    title: "3-комнатная квартира с евроремонтом",
    dealType: "Продажа",
    propertyType: "Квартира",
    city: "г. Худжанд",
    district: "18 мкр",
    landmark: "Напротив школы №28",
    rooms: 3,
    area: 76,
    floor: "3 из 5",
    priceTjs: 536550,
    priceUsd: 49000,
    sellerType: "Риелтор (Сугд-Инвест)",
    phone: "+992 92 888 1234",
    whatsapp: "+992928881234",
    isNegotiable: true,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=550&fit=crop",
    features: ["Евроремонт", "С мебелью", "Отопление"],
  },
  {
    id: "c2",
    title: "Благоустроенный дом (Ҳавлӣ) 6.5 соток",
    dealType: "Продажа",
    propertyType: "Дом / Ҳавлӣ",
    city: "Б. Гафуров",
    district: "Джамоат Унчи",
    landmark: "Около мечети Унчи",
    rooms: 5,
    area: 180,
    landArea: "6.5 сот.",
    priceTjs: 711750,
    priceUsd: 65000,
    sellerType: "Собственник",
    phone: "+992 92 999 4321",
    whatsapp: "+992929994321",
    isNegotiable: true,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=550&fit=crop",
    features: ["Фруктовый сад", "Хауз 10т", "Гараж 2 авто"],
  },
  {
    id: "c3",
    title: "Торговое помещение у рынка «Панчшанбе»",
    dealType: "Аренда",
    propertyType: "Коммерция",
    city: "г. Худжанд",
    district: "Центр / Панчшанбе",
    landmark: "50 м от главных ворот рынка",
    rooms: 1,
    area: 65,
    floor: "1 этаж",
    priceTjs: 8500,
    priceUsd: 776,
    sellerType: "Агентство",
    phone: "+992 92 888 1234",
    whatsapp: "+992928881234",
    isNegotiable: false,
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=550&fit=crop",
    features: ["Первая линия", "Витринные окна", "Кондиционер"],
  },
];

export default function HomePage() {
  const { formatPrice, currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<"new" | "resale" | "rent" | "houses">("new");
  const [selectedCity, setSelectedCity] = useState("khujand");
  const [selectedRooms, setSelectedRooms] = useState<string>("all");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  const togglePhone = async (item: (typeof RECENT_CLASSIFIEDS)[0]) => {
    const isRevealing = !revealedPhones[item.id];
    setRevealedPhones((prev) => ({ ...prev, [item.id]: isRevealing }));

    if (isRevealing) {
      try {
        fetch("/api/crm/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: "Посетитель сайта (Звонок)",
            clientPhone: "+992 (просмотр номера)",
            classifiedId: item.id,
            classifiedTitle: item.title,
            budget: item.priceUsd,
            commissionPercent: 2,
            source: "phone_click",
            notes: `Посетитель открыл номер телефона на объявлении: ${item.title} (${item.city}, ${item.district}).`,
          }),
        }).catch(() => {});
      } catch {
        // Ignored
      }
    }
  };

  const handleWhatsappLead = (item: (typeof RECENT_CLASSIFIEDS)[0]) => {
    try {
      fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "Посетитель сайта (WhatsApp)",
          clientPhone: "+992 (переход в WA)",
          classifiedId: item.id,
          classifiedTitle: item.title,
          budget: item.priceUsd,
          commissionPercent: 2,
          source: "whatsapp_click",
          notes: `Посетитель нажал кнопку WhatsApp для связи по объекту: ${item.title}.`,
        }),
      }).catch(() => {});
    } catch {
      // Ignored
    }
  };

  const roomOptions = [
    { id: "all", label: "Все" },
    { id: "studio", label: "Студия" },
    { id: "1", label: "1" },
    { id: "2", label: "2" },
    { id: "3", label: "3" },
    { id: "4+", label: "4+" },
  ];

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-24 bg-[#F8FAFC]">
      {/* 1. COMPACT HERO SECTION WITH PANORAMIC BACKGROUND */}
      <section className="relative pt-6 pb-8 md:pt-8 md:pb-10 border-b border-slate-200/80 bg-slate-900 overflow-hidden">
        {/* Background Layer: Panoramic Landscape with Soft Contrast Overlay */}
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden">
          <img
            src="/images/hero-bg.png"
            alt="Maskani Real Estate Panorama"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle contrast overlay preserving natural warmth and mountain visibility */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* 2. CIAN-STYLE SEARCH CARD WITH CLEAN GLASSMORPHISM (51% TRANSPARENCY / 49% OPACITY) */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/[0.49] backdrop-blur-2xl border border-white/60 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-slate-950/20">
              {/* Segment Tabs (CIAN Underline Style) */}
              <div className="flex items-center gap-6 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-0 mb-5 border-b border-slate-200/80">
                {[
                  { id: "new", label: "Новостройки (ЖК)", icon: Building2 },
                  { id: "resale", label: "Купить вторичку", icon: Home },
                  { id: "houses", label: "Дома и Ҳавлӣ", icon: Trees },
                  { id: "rent", label: "Аренда & Коммерция", icon: Store },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`flex items-center gap-2 pb-3 px-1 text-sm transition-all whitespace-nowrap border-b-2 -mb-px ${
                        isActive
                          ? "text-emerald-700 border-emerald-600 font-semibold"
                          : "text-slate-500 hover:text-slate-800 border-transparent font-medium"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Filter Inputs Grid - Strict h-12 (48px) alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                {/* 1. City / Region (col-span-3) */}
                <div className="lg:col-span-3">
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Город
                  </label>
                  <Select
                    value={selectedCity}
                    onValueChange={(val) => {
                      if (val) setSelectedCity(val);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl bg-white/90 border border-slate-200 text-sm font-medium px-3.5 shadow-2xs">
                      <SelectValue placeholder="Худжанд">
                        {SOGD_CITIES.find((c) => c.value === selectedCity)?.nameRu || "Худжанд"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {SOGD_CITIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.nameRu}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Room Buttons (col-span-3) */}
                <div className="lg:col-span-3">
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Комнатность
                  </label>
                  <div className="flex items-center h-12 border border-slate-200 rounded-xl bg-white/90 p-1 gap-1 shadow-2xs">
                    {roomOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedRooms(opt.id)}
                        className={`flex-1 h-full rounded-lg text-xs font-semibold transition-all ${
                          selectedRooms === opt.id
                            ? "bg-emerald-600 text-white shadow-xs font-bold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Price Range From - To (col-span-3) */}
                <div className="lg:col-span-3">
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    Цена
                  </label>
                  <div className="flex items-center gap-2 h-12">
                    <Input
                      placeholder="от"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                      className="h-12 rounded-xl bg-white/90 border border-slate-200 text-xs px-3 shadow-2xs"
                    />
                    <Input
                      placeholder="до"
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                      className="h-12 rounded-xl bg-white/90 border border-slate-200 text-xs px-3 shadow-2xs"
                    />
                  </div>
                </div>

                {/* 4. Action Button (col-span-3) */}
                <div className="lg:col-span-3">
                  <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 gap-2 text-sm transition-all active:scale-[0.99]">
                    <Search className="h-4 w-4" />
                    Найти 342 объекта
                  </Button>
                </div>
              </div>

              {/* Quick Filter Chips (Text-only, compact) */}
              <div className="mt-4 pt-3.5 border-t border-slate-200/50 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 mr-1 text-[11px] uppercase tracking-wider">
                  Быстрый выбор:
                </span>
                {[
                  "Рассрочка 0%",
                  "Вид на Сырдарью",
                  "18 и 19 мкр",
                  "Дома с хаузом",
                  "Сданные ЖК",
                  "С паркингом",
                ].map((chipText) => (
                  <button
                    key={chipText}
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white hover:text-emerald-700 hover:border-emerald-300 border border-slate-200/60 text-slate-700 text-xs font-medium transition-all shadow-2xs"
                  >
                    {chipText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEW BUILDINGS & RESIDENTIAL COMPLEXES (CIAN STYLE) */}
      <section id="new-buildings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              Каталог новостроек Согда
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Премиальные ЖК и застройщики Худжанда
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Жилые комплексы с официальной документацией, беспроцентной рассрочкой и поэтажной шахматкой
            </p>
          </div>
          <Link
            href="#new-buildings"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
          >
            Все 14 комплексов
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_PROJECTS.map((proj) => (
            <Card
              key={proj.id}
              className="bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                <img
                  src={proj.coverImage}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                  <Badge className="bg-emerald-600 text-white font-medium text-xs shadow-sm">
                    {proj.status}
                  </Badge>
                  <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-800 font-medium text-xs shadow-xs">
                    {proj.buildingClass}
                  </Badge>
                </div>

                <div className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-md text-emerald-700 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 border border-slate-200/50">
                  <Percent className="h-3.5 w-3.5 text-emerald-600" />
                  {proj.installment} ({proj.downPayment})
                </div>

                <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 shadow-sm flex items-center gap-2 border border-slate-200/50">
                  <DeveloperAvatar name={proj.developerName} size="sm" className="h-5 w-5 text-[9px]" />
                  <span>{proj.developerName}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              </div>

              <CardContent className="p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {proj.city}, {proj.district} • {proj.floors} этажей
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Цена за м²:</div>
                    <div className="text-sm font-semibold text-slate-800">
                      от{" "}
                      {formatPrice(
                        proj.pricePerMeterTjs,
                        proj.pricePerMeterUsd
                      )}{" "}
                      / м²
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Квартиры от:</div>
                    <div className="text-lg font-bold text-emerald-600">
                      от {formatPrice(proj.minPriceTjs, proj.minPriceUsd)}
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-3">
                  <Link href={`/projects/${proj.slug}`} className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-10 px-4 rounded-xl shadow-xs">
                      Смотреть {proj.availableUnitsCount} квартир
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/992927005555"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" className="text-xs font-semibold h-10 px-3.5 rounded-xl gap-1.5 border-slate-200">
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      Отдел продаж
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. SECONDARY MARKET & HOUSES (AVITO / CIAN STYLE) */}
      <section id="classifieds" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              <Home className="h-3.5 w-3.5" />
              Вторичный рынок и дома
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Свежие объявления в Худжанде и пригороде
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Квартиры от собственников, традиционные дома (ҳавлӣ), дачи и коммерция
            </p>
          </div>
          <Link
            href="#classifieds"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
          >
            Смотреть все 186 объявлений
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECENT_CLASSIFIEDS.map((item) => (
            <Card
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg flex flex-col justify-between overflow-hidden transition-all duration-200 group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge className="bg-emerald-600 text-white text-[11px] font-medium shadow-xs">
                      {item.dealType}
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-800 text-[11px] font-medium">
                      {item.propertyType}
                    </Badge>
                  </div>
                  {item.isNegotiable && (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[10px] font-semibold text-slate-700 px-2.5 py-1 rounded-md shadow-xs">
                      Торг уместен
                    </div>
                  )}
                </div>

                <CardContent className="p-4 sm:p-5 space-y-2.5">
                  <div>
                    <div className="text-lg font-bold text-emerald-600">
                      {formatPrice(item.priceTjs, item.priceUsd)}
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 line-clamp-1 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {item.city}, {item.district} ({item.landmark})
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 border-y border-slate-100 py-2 font-medium">
                    <span className="font-bold text-slate-900">{item.rooms} комн.</span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">{item.area} м²</span>
                    <span>•</span>
                    <span>{item.floor || item.landArea}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {item.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              {/* Contacts */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {item.sellerType}
                  </span>
                  <span className="font-semibold text-slate-900 font-mono text-xs">
                    {revealedPhones[item.id] ? item.phone : `${item.phone.slice(0, 8)} •• ••`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant={revealedPhones[item.id] ? "secondary" : "outline"}
                    onClick={() => togglePhone(item)}
                    className="h-8 px-2.5 text-xs font-semibold gap-1 rounded-lg border-slate-200"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    {revealedPhones[item.id] ? "Скрыть" : "Показать"}
                  </Button>
                  <a
                    href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleWhatsappLead(item)}
                    className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors border border-emerald-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. ELEGANT LIGHT B2B ECOSYSTEM BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="max-w-2xl mb-8">
            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 mb-2.5 text-xs font-semibold">
              Экосистема Sogd Realty
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Инструменты для всех участников рынка
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Мы объединяем покупателей, застройщиков и частных маклеров в единую современную цифровую среду.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. For Buyers */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3 hover:border-emerald-300 hover:bg-white hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Для покупателей</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Поиск новостроек и вторички без переплат. Интерактивная поэтажная шахматка и прямой контакт с отделами продаж.
              </p>
              <Link href="#new-buildings" className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:underline gap-1 pt-1">
                Перейти в каталог ЖК
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 2. For Developers */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3 hover:border-emerald-300 hover:bg-white hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Для застройщиков</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Цифровой кабинет застройщика: визуальное управление шахматкой квартир, бронирование и заявки в Telegram.
              </p>
              <Link href="/developer-admin" className="inline-flex items-center text-xs font-semibold text-teal-700 hover:underline gap-1 pt-1">
                Кабинет застройщика
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3. For Realtors & CRM */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3 hover:border-emerald-300 hover:bg-white hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Для маклеров и агентств</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Легкая Канбан-воронка лидов, персональные подборки объектов в WhatsApp без контактов собственников и Open API.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Link href="/profile/crm" className="inline-flex items-center text-xs font-bold text-emerald-700 hover:underline gap-1">
                  Канбан CRM & Подборки
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/profile/analytics" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:underline gap-1">
                  Open API
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED DEVELOPERS */}
      <section id="developers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Проверенные застройщики Согдийской области
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Компании, строящие жилые комплексы с официальной проектной документацией,
              гарантиями и беспроцентной рассрочкой в Худжанде.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-emerald-300 transition-colors">
              <DeveloperAvatar name="Рахш Сохтмон" size="md" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">Рахш Сохтмон</h4>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                    Верифицирован
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  8 сданных объектов • 3 в процессе строительства • Рейтинг 4.9
                </p>
                <p className="text-[11px] text-slate-400">
                  Офис: г. Худжанд, пр. И. Сомони 142 • Тел: +992 92 700 5555
                </p>
              </div>
            </div>

            <div className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-4 flex items-center gap-4 hover:border-emerald-300 transition-colors">
              <DeveloperAvatar name="Сайҳун Девелопмент" size="md" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">Сайҳун Девелопмент</h4>
                  <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px]">
                    Верифицирован
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  5 сданных объектов • 2 строящихся проекта • Рейтинг 4.85
                </p>
                <p className="text-[11px] text-slate-400">
                  Офис: г. Худжанд, 19 мкр (набережная) • Тел: +992 92 811 4444
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STRUCTURED SEO FOOTER */}
      <footer className="border-t border-slate-200/80 pt-12 mt-4 text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* SEO Grid on 4 Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* By Cities */}
            <div>
              <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                Города Согдийской области
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Недвижимость в Худжанде (Хуҷанд)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Дома в Б. Гафурове (Бобоҷон Ғафуров)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Квартиры в Исфаре (Исфара)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Недвижимость в Истаравшане</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Квартиры в Гулистоне (Қайроққум)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Участки в Канибадаме (Конибодом)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Дома в Пенджикенте (Панҷакент)</Link></li>
              </ul>
            </div>

            {/* By Districts of Khujand */}
            <div>
              <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                Микрорайоны Худжанда
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Новостройки в 19 микрорайоне</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Квартиры в 18 микрорайоне</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Жилье на Набережной Сырдарьи</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Квартиры в 20 и 34 мкр</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Район рынка «Панчшанбе»</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Шелкокомбинат и Правый берег</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Махалля Раззок и Центр</Link></li>
              </ul>
            </div>

            {/* By Property Categories */}
            <div>
              <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                Категории недвижимости
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="#new-buildings" className="hover:text-emerald-700 transition-colors">Каталог ЖК с поэтажной шахматкой</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">1-комнатные квартиры в Худжанде</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">2-комнатные квартиры с евроремонтом</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Традиционные дома (Ҳавлӣ) с садом</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Земельные участки под застройку</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-700 transition-colors">Коммерческие помещения и магазины</Link></li>
                <li><Link href="/profile/analytics" className="hover:text-emerald-700 transition-colors">B2B Open API для риелторов</Link></li>
              </ul>
            </div>

            {/* Contacts & Support */}
            <div>
              <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                Контакты и офис
              </h5>
              <p className="text-xs mb-2 leading-relaxed text-slate-600">
                Центральный офис по Согдийской области:
              </p>
              <p className="font-semibold text-slate-900">г. Худжанд, пр. И. Сомони 142</p>
              <p className="font-mono font-bold text-emerald-700 text-sm mt-2">+992 92 777 0001</p>
              <p className="font-mono text-slate-500 mt-0.5">support@sogd-realty.tj</p>
              <div className="pt-3">
                <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
                  🇹🇯 Худжанд • Согд • Таджикистан
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © 2026 Maskani.tj. Все права защищены.
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <Link href="/developer-admin" className="hover:text-emerald-700">Кабинет застройщика</Link>
              <Link href="/profile/analytics" className="hover:text-emerald-700">Аналитика & Open API</Link>
              <Link href="/profile/crm" className="hover:text-emerald-700 font-medium text-emerald-700/70">Маклерам и Агентствам (B2B CRM)</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
