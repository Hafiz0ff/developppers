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
  Car,
  Waves,
  Flame,
} from "lucide-react";

// Демонстрационные данные каталога новостроек (CIAN Style)
const FEATURED_PROJECTS = [
  {
    id: "proj_sirdaryo_plaza",
    name: "ЖК «Сирдарё Плаза»",
    slug: "sirdaryo-plaza",
    developerName: "Рахш Сохтмон",
    developerInitials: "РС",
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
    developerInitials: "СД",
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

  const togglePhone = (id: string) => {
    setRevealedPhones((prev) => ({ ...prev, [id]: !prev[id] }));
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
    <div className="flex flex-col gap-14 pb-24">
      {/* 1. HERO SECTION WITH VIBRANT LIVING SHADER (CIAN STYLE) */}
      <section className="relative min-h-[580px] sm:min-h-[640px] pt-14 pb-16 flex flex-col justify-center overflow-hidden bg-[#022c22]">
        {/* Dynamic WebGL Simplex Noise Aurora Mesh Layer */}
        <ShaderBackground
          variant="aurora"
          speed={0.65}
          intensity={1.0}
          className="absolute inset-0 -z-10 h-full w-full"
        />

        {/* Ambient Overlay for High Text Contrast */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] -z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-9">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Единый портал недвижимости Согдийской области
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Недвижимость в Худжанде и Согде
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-xs">
              Новостройки напрямую от застройщиков без комиссии, а также вторичное жильё,
              традиционные дома (ҳавлӣ) и коммерческие объекты.
            </p>
          </div>

          {/* 2. CIAN-STYLE SEARCH CARD WITH GLASSMORPHISM */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/95 dark:bg-card/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-emerald-950/40">
              {/* Segment Tabs (CIAN Style) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 border-b">
                <button
                  type="button"
                  onClick={() => setActiveTab("new")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === "new"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Building2 className="h-4 w-4" />
                  Новостройки (ЖК)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("resale")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === "resale"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Купить вторичку
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("houses")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === "houses"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Trees className="h-4 w-4" />
                  Дома и Ҳавлӣ
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("rent")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === "rent"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Store className="h-4 w-4" />
                  Аренда & Коммерция
                </button>
              </div>

              {/* Filter Inputs Grid (CIAN Layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
                {/* 1. City / Region (col-span-3) */}
                <div className="lg:col-span-3">
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                    Город / Район
                  </label>
                  <Select
                    value={selectedCity}
                    onValueChange={(val) => {
                      if (val) setSelectedCity(val);
                    }}
                  >
                    <SelectTrigger className="w-full h-11 rounded-xl bg-background border">
                      <SelectValue />
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

                {/* 2. Room Multi-buttons (col-span-3) */}
                <div className="lg:col-span-3">
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                    Комнатность
                  </label>
                  <div className="flex items-center h-11 border rounded-xl p-1 bg-muted/40 gap-1">
                    {roomOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedRooms(opt.id)}
                        className={`flex-1 h-full rounded-lg text-xs font-bold transition-all ${
                          selectedRooms === opt.id
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Price Range From - To (col-span-3) */}
                <div className="lg:col-span-3">
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                    Цена ({currency === "TJS" ? "сомони" : "$"})
                  </label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      placeholder="от"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                      className="h-11 rounded-xl bg-background text-xs"
                    />
                    <Input
                      placeholder="до"
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                      className="h-11 rounded-xl bg-background text-xs"
                    />
                  </div>
                </div>

                {/* 4. Action Button (col-span-3) */}
                <div className="lg:col-span-3">
                  <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 gap-2 text-sm">
                    <Search className="h-4 w-4" />
                    Найти 342 объекта
                  </Button>
                </div>
              </div>

              {/* Quick Filter Chips (CIAN Style) */}
              <div className="mt-4 pt-3.5 border-t flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-muted-foreground mr-1 text-[11px] uppercase tracking-wider">
                  Быстрый выбор:
                </span>
                {[
                  { label: "🔥 Рассрочка 0%", icon: Flame },
                  { label: "🌊 Вид на Сырдарью", icon: Waves },
                  { label: "📍 18 и 19 мкр", icon: MapPin },
                  { label: "🏡 Дома с хаузом", icon: Trees },
                  { label: "🏢 Сданные ЖК", icon: CheckCircle2 },
                  { label: "🚗 С паркингом", icon: Car },
                ].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all text-xs font-medium"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NEW BUILDINGS & RESIDENTIAL COMPLEXES (CIAN STYLE) */}
      <section id="new-buildings" className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              Каталог новостроек Согда
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Премиальные ЖК и застройщики Худжанда
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Жилые комплексы с официальной документацией, беспроцентной рассрочкой и интерактивной шахматкой
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
              className="overflow-hidden border border-border/80 hover:border-emerald-500/50 transition-all hover:shadow-xl group rounded-2xl"
            >
              <div className="relative h-72 w-full overflow-hidden bg-muted">
                {/* Photo with hover zoom */}
                <img
                  src={proj.coverImage}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Status Badges */}
                <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                  <Badge className="bg-emerald-600 text-white font-bold text-xs shadow-md">
                    {proj.status}
                  </Badge>
                  <Badge variant="secondary" className="backdrop-blur-md bg-background/85 text-foreground font-semibold text-xs shadow-xs">
                    {proj.buildingClass}
                  </Badge>
                </div>

                {/* Installment Badge */}
                <div className="absolute bottom-3.5 left-3.5 bg-background/95 backdrop-blur-md text-emerald-700 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5" />
                  {proj.installment} ({proj.downPayment})
                </div>

                {/* Developer tag with Avatar */}
                <div className="absolute top-3.5 right-3.5 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-foreground shadow-md flex items-center gap-2">
                  <DeveloperAvatar name={proj.developerName} size="sm" className="h-6 w-6 text-[10px]" />
                  <span>{proj.developerName}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-foreground group-hover:text-emerald-600 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {proj.city}, {proj.district} • {proj.floors} этажей
                  </p>
                </div>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price block (CIAN Style) */}
                <div className="pt-3.5 border-t flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-muted-foreground">Цена за м²:</div>
                    <div className="text-base font-bold text-foreground">
                      от{" "}
                      {formatPrice(
                        proj.pricePerMeterTjs,
                        proj.pricePerMeterUsd
                      )}{" "}
                      / м²
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-muted-foreground">Квартиры от:</div>
                    <div className="text-xl font-extrabold text-emerald-600">
                      от {formatPrice(proj.minPriceTjs, proj.minPriceUsd)}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <Link href={`/projects/${proj.slug}`} className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-xs">
                      Смотреть {proj.availableUnitsCount} квартир
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/992927005555"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" className="text-xs font-semibold h-10 px-3.5 rounded-xl gap-1.5">
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
      <section id="classifieds" className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              <Home className="h-3.5 w-3.5" />
              Вторичный рынок и дома
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Свежие объявления в Худжанде и пригороде
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
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
              className="overflow-hidden border border-border/80 hover:border-emerald-500/50 transition-all hover:shadow-lg flex flex-col justify-between rounded-2xl group"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge className="bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                      {item.dealType}
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/85 text-[11px] font-semibold">
                      {item.propertyType}
                    </Badge>
                  </div>
                  {item.isNegotiable && (
                    <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                      Торг уместен
                    </div>
                  )}
                </div>

                <CardContent className="p-5 space-y-3">
                  <div>
                    <div className="text-xl font-extrabold text-emerald-600">
                      {formatPrice(item.priceTjs, item.priceUsd)}
                    </div>
                    <h4 className="font-bold text-sm text-foreground line-clamp-1 mt-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {item.city}, {item.district} ({item.landmark})
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground border-y py-2.5 font-medium">
                    <span className="font-bold text-foreground">{item.rooms} комн.</span>
                    <span>•</span>
                    <span className="font-bold text-foreground">{item.area} м²</span>
                    <span>•</span>
                    <span>{item.floor || item.landArea}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {item.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              {/* Contacts with Interactive Show Phone Button */}
              <div className="p-5 pt-0 border-t mt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-medium">
                    {item.sellerType}
                  </span>
                  <span className="font-bold text-foreground font-mono text-xs">
                    {revealedPhones[item.id] ? item.phone : `${item.phone.slice(0, 8)} •• ••`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant={revealedPhones[item.id] ? "secondary" : "outline"}
                    onClick={() => togglePhone(item.id)}
                    className="h-8 px-2.5 text-xs font-semibold gap-1 rounded-lg"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    {revealedPhones[item.id] ? "Скрыть" : "Показать"}
                  </Button>
                  <a
                    href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. PLATFORM B2B SERVICES BANNER (CIAN ECOSYSTEM) */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mb-8 relative z-10">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 mb-3 text-xs font-semibold">
              Экосистема Sogd Realty
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Инструменты для всех участников рынка недвижимости
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-2 leading-relaxed">
              Мы объединяем покупателей, застройщиков и частных маклеров в единую современную цифровую среду.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {/* 1. For Buyers */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/15 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base">Для покупателей</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Поиск новостроек и вторички без переплат. Интерактивная поэтажная шахматка и прямой контакт с отделами продаж.
              </p>
              <Link href="#new-buildings" className="inline-flex items-center text-xs font-bold text-emerald-300 hover:underline gap-1 pt-1">
                Перейти в каталог ЖК
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 2. For Developers */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/15 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base">Для застройщиков</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Цифровой кабинет застройщика: визуальное управление шахматкой квартир, бронирование и автоматические заявки в Telegram.
              </p>
              <Link href="/developer-admin" className="inline-flex items-center text-xs font-bold text-teal-300 hover:underline gap-1 pt-1">
                Кабинет застройщика
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3. For Realtors & CRM */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-3 hover:bg-white/15 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-400/20 text-emerald-200 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base">Для маклеров и CRM</h4>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                Личный кабинет с аналитикой просмотров и звонков, выгрузка отчетов в Excel и Open API для связки с AmoCRM/Bitrix24.
              </p>
              <Link href="/profile/analytics" className="inline-flex items-center text-xs font-bold text-emerald-200 hover:underline gap-1 pt-1">
                Открыть аналитику и API
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED DEVELOPERS */}
      <section id="developers" className="container mx-auto px-4">
        <div className="bg-muted/40 border rounded-2xl p-6 sm:p-8">
          <div className="max-w-2xl mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Проверенные застройщики Согдийской области
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Компании, строящие жилые комплексы с официальной проектной документацией,
              гарантиями и беспроцентной рассрочкой в Худжанде.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background border rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
              <DeveloperAvatar name="Рахш Сохтмон" size="md" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-foreground">Рахш Сохтмон</h4>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                    Верифицирован
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  8 сданных объектов • 3 в процессе строительства • Рейтинг 4.9
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Офис: г. Худжанд, пр. И. Сомони 142 • Тел: +992 92 700 5555
                </p>
              </div>
            </div>

            <div className="bg-background border rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
              <DeveloperAvatar name="Сайҳун Девелопмент" size="md" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-foreground">Сайҳун Девелопмент</h4>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">
                    Верифицирован
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  5 сданных объектов • 2 строящихся проекта • Рейтинг 4.85
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Офис: г. Худжанд, 19 мкр (набережная) • Тел: +992 92 811 4444
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STRUCTURED SEO FOOTER (CIAN.RU STYLE GRID) */}
      <footer className="border-t pt-12 mt-6 text-xs text-muted-foreground bg-muted/20">
        <div className="container mx-auto px-4 space-y-10">
          {/* SEO Grid on 4 Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* By Cities */}
            <div>
              <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">
                Города Согдийской области
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Недвижимость в Худжанде (Хуҷанд)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Дома в Б. Гафурове (Бобоҷон Ғафуров)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Квартиры в Исфаре (Исфара)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Недвижимость в Истаравшане</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Квартиры в Гулистоне (Қайроққум)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Участки в Канибадаме (Конибодом)</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Дома в Пенджикенте (Панҷакент)</Link></li>
              </ul>
            </div>

            {/* By Districts of Khujand */}
            <div>
              <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">
                Микрорайоны Худжанда
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Новостройки в 19 микрорайоне</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Квартиры в 18 микрорайоне</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Жилье на Набережной Сырдарьи</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Квартиры в 20 и 34 мкр</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Район рынка «Панчшанбе»</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Шелкокомбинат и Правый берег</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Махалля Раззок и Центр</Link></li>
              </ul>
            </div>

            {/* By Property Categories */}
            <div>
              <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">
                Категории недвижимости
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="#new-buildings" className="hover:text-emerald-600 transition-colors">Каталог ЖК с поэтажной шахматкой</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">1-комнатные квартиры в Худжанде</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">2-комнатные квартиры с евроремонтом</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Традиционные дома (Ҳавлӣ) с садом</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Земельные участки под застройку</Link></li>
                <li><Link href="#classifieds" className="hover:text-emerald-600 transition-colors">Коммерческие помещения и магазины</Link></li>
                <li><Link href="/profile/analytics" className="hover:text-emerald-600 transition-colors">B2B Open API для риелторов</Link></li>
              </ul>
            </div>

            {/* Contacts & Support */}
            <div>
              <h5 className="font-bold text-foreground mb-3 uppercase tracking-wider text-[11px]">
                Контакты и офис
              </h5>
              <p className="text-xs mb-2 leading-relaxed">
                Центральный офис по Согдийской области:
              </p>
              <p className="font-semibold text-foreground">г. Худжанд, пр. И. Сомони 142</p>
              <p className="font-mono font-bold text-emerald-600 text-sm mt-2">+992 92 777 0001</p>
              <p className="font-mono text-muted-foreground mt-0.5">support@sogd-realty.tj</p>
              <div className="pt-3">
                <Badge variant="outline" className="text-[10px] bg-background">
                  🇹🇯 Худжанд • Согд • Таджикистан
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <div>
              © 2026 SOGD REALTY. Все права защищены. Разработано по стандартам CIAN.ru и Avito.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/developer-admin" className="hover:underline">Кабинет застройщика</Link>
              <Link href="/profile/analytics" className="hover:underline">Аналитика & Open API</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
