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
} from "lucide-react";


// Демонстрационные данные каталога новостроек
const FEATURED_PROJECTS = [
  {
    id: "proj_sirdaryo_plaza",
    name: "ЖК «Сирдарё Плаза»",
    slug: "sirdaryo-plaza",
    developerName: "Рахш Сохтмон",
    developerLogo:
      "https://images.unsplash.com/photo-1541888946425-d0fbb186241b?w=100&h=100&fit=crop",
    status: "Строится (4 кв. 2026)",
    buildingClass: "Бизнес-класс",
    city: "г. Худжанд",
    district: "19 мкр, Набережная Сырдарьи",
    floors: 16,
    coverImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&h=650&fit=crop",
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
    developerLogo:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop",
    status: "Строится (2 кв. 2027)",
    buildingClass: "Комфорт-класс",
    city: "г. Худжанд",
    district: "18 мкр, пр. Гафурова",
    floors: 12,
    coverImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&h=650&fit=crop",
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

// Демонстрационные данные частных объявлений (вторичка, дома, коммерция)
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
  const [roomsFilter, setRoomsFilter] = useState("all");

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* HERO SECTION WITH SHADER BACKGROUND */}
      <section className="relative pt-16 pb-14 border-b overflow-hidden">
        {/* Living Fluid Aurora Shader Layer */}
        <ShaderBackground
          variant="aurora"
          speed={0.7}
          intensity={0.95}
          className="absolute inset-0 -z-10 h-full w-full"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Единый портал недвижимости Согдийской области
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Недвижимость в Худжанде и Согдийской области
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-normal">
              Каталог современных новостроек от надежных застройщиков без комиссии, а также
              частные объявления вторичного жилья, домов (ҳавлӣ) и участков.
            </p>
          </div>

          {/* Interactive Search Card with Glassmorphism */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card/90 dark:bg-card/85 backdrop-blur-md border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-5 sm:p-7 shadow-xl shadow-emerald-900/5">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 border-b">
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "new"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Новостройки (ЖК)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("resale")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "resale"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Home className="h-4 w-4" />
                Купить вторичку
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("houses")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "houses"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Trees className="h-4 w-4" />
                Дома и Ҳавлӣ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rent")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === "rent"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Store className="h-4 w-4" />
                Аренда и коммерция
              </button>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* City selector */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Город / Район Согда
                </label>
                <Select
                  value={selectedCity}
                  onValueChange={(val) => {
                    if (val) setSelectedCity(val);
                  }}
                >
                  <SelectTrigger className="w-full h-10">
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

              {/* Rooms count */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Комнаты
                </label>
                <Select
                  value={roomsFilter}
                  onValueChange={(val) => {
                    if (val) setRoomsFilter(val);
                  }}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Любая" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любая комнатность</SelectItem>
                    <SelectItem value="1">1-комнатные</SelectItem>
                    <SelectItem value="2">2-комнатные</SelectItem>
                    <SelectItem value="3">3-комнатные</SelectItem>
                    <SelectItem value="4">4+ комнат</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price range */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                  Цена до ({currency === "TJS" ? "сомони" : "$"})
                </label>
                <Input
                  placeholder={currency === "TJS" ? "до 500 000 сом." : "до $50 000"}
                  className="w-full h-10"
                />
              </div>

              {/* Submit button */}
              <div className="flex items-end">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-10 shadow-md shadow-emerald-600/20 gap-2">
                  <Search className="h-4 w-4" />
                  Найти
                </Button>
              </div>
            </div>

            {/* Quick district tags for Khujand */}
            {selectedCity === "khujand" && (
              <div className="mt-4 pt-3.5 border-t flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground mr-1">Микрорайоны:</span>
                {[
                  "18 мкр",
                  "19 мкр",
                  "20 мкр",
                  "34 мкр",
                  "Панчшанбе",
                  "Шелкокомбинат",
                  "Правый берег",
                ].map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    className="px-2.5 py-1 rounded-md bg-muted/60 hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {dist}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </section>


      {/* NEW BUILDINGS CATALOG (НОВОСТРОЙКИ) */}
      <section id="new-buildings" className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              Каталог ЖК Согда
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Новостройки от застройщиков
            </h2>
          </div>
          <Link
            href="#new-buildings"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Все 14 комплексов в Согде
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURED_PROJECTS.map((proj) => (
            <Card
              key={proj.id}
              className="overflow-hidden border hover:border-emerald-500/50 transition-all hover:shadow-lg group"
            >
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                {/* Image */}
                <img
                  src={proj.coverImage}
                  alt={proj.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge className="bg-emerald-600 text-white font-semibold text-xs shadow-xs">
                    {proj.status}
                  </Badge>
                  <Badge variant="secondary" className="backdrop-blur-md bg-background/80 text-foreground font-semibold text-xs">
                    {proj.buildingClass}
                  </Badge>
                </div>

                {/* Installment Badge */}
                <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-md text-emerald-700 dark:text-emerald-400 font-semibold text-xs px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5" />
                  {proj.installment} ({proj.downPayment})
                </div>

                {/* Developer tag */}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold text-foreground shadow-xs flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                  {proj.developerName}
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {proj.city}, {proj.district}
                  </p>
                </div>

                {/* Amenities pills */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price block */}
                <div className="pt-3 border-t flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-muted-foreground">Цена за м²:</div>
                    <div className="text-sm font-semibold text-foreground">
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
                    <div className="text-lg font-extrabold text-emerald-600">
                      от {formatPrice(proj.minPriceTjs, proj.minPriceUsd)}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Link href={`/projects/${proj.slug}`} className="flex-1">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4">
                      Смотреть {proj.availableUnitsCount} квартир
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-xs font-semibold h-9 px-3.5">
                    Отдел продаж
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SECONDARY MARKET & HOUSES (ВТОРИЧКА И ЧАСТНЫЕ ОБЪЯВЛЕНИЯ) */}
      <section id="classifieds" className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              Частные объявления
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Вторичное жилье, дома (ҳавлӣ) и аренда
            </h2>
          </div>
          <Link
            href="#classifieds"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Смотреть все объявления
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECENT_CLASSIFIEDS.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border hover:border-emerald-500/50 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    <Badge className="bg-emerald-600 text-white text-[11px] font-semibold">
                      {item.dealType}
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80 text-[11px]">
                      {item.propertyType}
                    </Badge>
                  </div>
                  {item.isNegotiable && (
                    <div className="absolute bottom-2.5 right-2.5 bg-background/90 backdrop-blur-md text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                      Торг уместен
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <div className="text-lg font-extrabold text-emerald-600">
                      {formatPrice(item.priceTjs, item.priceUsd)}
                    </div>
                    <h4 className="font-bold text-sm text-foreground line-clamp-1 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {item.city}, {item.district} ({item.landmark})
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground border-y py-2">
                    <span className="font-medium text-foreground">{item.rooms} комн.</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">{item.area} м²</span>
                    <span>•</span>
                    <span>{item.floor || item.landArea}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              {/* Contacts */}
              <div className="p-4 pt-0 border-t mt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block">
                    {item.sellerType}
                  </span>
                  <span className="font-semibold text-foreground font-mono">
                    {item.phone}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                  <a
                    href={`tel:${item.phone}`}
                    className="h-8 w-8 rounded-full bg-muted hover:bg-foreground hover:text-background flex items-center justify-center transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* DEVELOPERS SECTION (ЗАСТРОЙЩИКИ СОГДА) */}
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
              <DeveloperAvatar
                name="Рахш Сохтмон"
                size="md"
              />
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
              <DeveloperAvatar
                name="Сайҳун Девелопмент"
                size="md"
              />
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

      {/* FOOTER */}
      <footer className="border-t pt-10 mt-10 text-xs text-muted-foreground">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-foreground text-sm tracking-tight">
                SOGD<span className="text-emerald-600">REALTY</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Главный портал недвижимости Согдийской области Таджикистана. Новостройки,
              квартиры от собственников, дома (хавли) и коммерческие площади.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-3">Города и центры</h5>
            <ul className="space-y-1.5 text-xs">
              <li>Худжанд (Хуҷанд)</li>
              <li>Бободжон Гафуров (Б. Ғафуров)</li>
              <li>Исфара (Исфара)</li>
              <li>Истаравшан (Истаравшан)</li>
              <li>Канибадам (Конибодом)</li>
              <li>Гулистон (Қайроққум)</li>
              <li>Пенджикент (Панҷакент)</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-3">Разделы портала</h5>
            <ul className="space-y-1.5 text-xs">
              <li>Каталог новостроек и ЖК</li>
              <li>Квартиры во вторичном фонде</li>
              <li>Традиционные дома (Ҳавлӣ)</li>
              <li>Земельные участки (Замин)</li>
              <li>База застройщиков Согда</li>
              <li>Ипотека и рассрочка от 0%</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-foreground mb-3">Контакты и поддержка</h5>
            <p className="text-xs mb-2">Техническая поддержка и сотрудничество для застройщиков и агентств:</p>
            <p className="font-mono font-semibold text-foreground">+992 92 777 0001</p>
            <p className="font-mono text-muted-foreground">support@sogd-realty.tj</p>
            <div className="mt-3">
              <Badge variant="outline" className="text-[10px]">
                Худжанд • Согдийская область • Таджикистан
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-4 border-t text-center text-[11px] text-muted-foreground">
          © 2026 SOGD REALTY. Все права защищены. Разработано на Next.js, Tailwind CSS, Shadcn UI и Drizzle ORM.
        </div>
      </footer>
    </div>
  );
}
