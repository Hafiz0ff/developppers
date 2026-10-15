"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/currency-context";
import { useLanguage } from "@/context/language-context";
import { SOGD_CITIES } from "@/lib/constants/locations";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, INITIAL_UNITS } from "@/lib/data/mock-db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeveloperAvatar } from "@/components/ui/developer-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectCatalogCardBadge } from "@/components/modules/project-engagement-pills";
import { PropertyMetricsBadge } from "@/components/modules/common/property-metrics-badge";
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

// Реальные объявления вторичного рынка и домов (Somon.tj, Согдийская область)
const RECENT_CLASSIFIEDS = [
  {
    id: "17034738",
    slug: "17034738-1-komn-kvartira-4-etazh-44-m2-sholkombinat",
    title: "1-комн. квартира, 4 этаж, 44 м², Шёлкокомбинат",
    titleTg: "Хонадони 1-ҳуҷрагӣ, ошёнаи 4, 44 м², Комбинати абрешим",
    dealType: "Продажа",
    dealTypeTg: "Фурӯш",
    propertyType: "Квартира",
    propertyTypeTg: "Хонадон",
    city: "г. Худжанд",
    cityTg: "ш. Хуҷанд",
    district: "Шёлкокомбинат",
    districtTg: "Комбинати абрешим",
    landmark: "Район Шёлкокомбинат",
    landmarkTg: "Маҳаллаи Комбинати абрешим",
    rooms: 1,
    area: 44,
    floor: "4 из 5",
    floorTg: "Ошёнаи 4 аз 5",
    priceTjs: 360000,
    priceUsd: 32876,
    sellerType: "Собственник",
    sellerTypeTg: "Соҳибмулк",
    phone: "+992 92 771 2233",
    whatsapp: "+992927712233",
    isNegotiable: true,
    image: "https://cdntj.somon.tj/media/cache1/9b/c7/9bc7c439558fa7c280cfb5ec74dd04b7.webp",
    features: ["Евроремонт", "Кухонная гарнитура", "Пластиковые окна"],
    featuresTg: ["Таъмири аврупоӣ", "Мебели ошхона", "Тирезаҳои пластикӣ"],
  },
  {
    id: "16766211",
    slug: "16766211-2-komn-kvartira-4-etazh-52-m2-8mkr",
    title: "2-комн. квартира, 4 этаж, 52 м², 8-й микрорайон",
    titleTg: "Хонадони 2-ҳуҷрагӣ, ошёнаи 4, 52 м², микрорайони 8",
    dealType: "Продажа",
    dealTypeTg: "Фурӯш",
    propertyType: "Квартира",
    propertyTypeTg: "Хонадон",
    city: "г. Худжанд",
    cityTg: "ш. Хуҷанд",
    district: "8-й микрорайон",
    districtTg: "микрорайони 8",
    landmark: "Новостройка с лифтом",
    landmarkTg: "Бинои нав бо лифт",
    rooms: 2,
    area: 52,
    floor: "4 из 9",
    floorTg: "Ошёнаи 4 аз 9",
    priceTjs: 439000,
    priceUsd: 40091,
    sellerType: "Собственник",
    sellerTypeTg: "Соҳибмулк",
    phone: "+992 92 884 5566",
    whatsapp: "+992928845566",
    isNegotiable: true,
    image: "https://cdntj.somon.tj/media/cache1/0c/06/0c0649a1e353ebed09d618483c815ea4.webp",
    features: ["Теплый пол", "Лифт работает", "Детская площадка"],
    featuresTg: ["Фарши гарм", "Лифти фаъол", "Майдончаи кӯдакона"],
  },
  {
    id: "15911344",
    slug: "15911344-4-komn-kvartira-2-etazh-110-m2-18",
    title: "4-комн. квартира, 2 этаж, 110 м², 18 мкр",
    titleTg: "Хонадони 4-ҳуҷрагӣ, ошёнаи 2, 110 м², микрорайони 18",
    dealType: "Продажа",
    dealTypeTg: "Фурӯш",
    propertyType: "Квартира",
    propertyTypeTg: "Хонадон",
    city: "г. Худжанд",
    cityTg: "ш. Хуҷанд",
    district: "18-й микрорайон",
    districtTg: "микрорайони 18",
    landmark: "Рядом с супермаркетом «Айём»",
    landmarkTg: "Назди мағозаи «Айём»",
    rooms: 4,
    area: 110,
    floor: "2 из 5",
    floorTg: "Ошёнаи 2 аз 5",
    priceTjs: 710000,
    priceUsd: 64840,
    sellerType: "Собственник",
    sellerTypeTg: "Соҳибмулк",
    phone: "+992 92 650 3322",
    whatsapp: "+992926503322",
    isNegotiable: true,
    image: "https://cdntj.somon.tj/media/cache1/b1/9d/b19dc379b04c8887c87406550235519b.webp",
    features: ["Престижный район", "Частично с мебелью", "Панельный дом"],
    featuresTg: ["Ноҳияи бонуфуз", "Қисман бо мебел", "Бинои панелӣ"],
  },
  {
    id: "16419531",
    slug: "16419531-2-etazhn-5-komn-dom-6-sotok-ul-gagarina",
    title: "2-этажный 5-комн. дом (Ҳавлӣ), 6 соток, ул. Гагарина",
    titleTg: "Ҳавлии 2-ошёнаи 5-ҳуҷрагӣ, 6 сотих, кӯчаи Гагарин",
    dealType: "Продажа",
    dealTypeTg: "Фурӯш",
    propertyType: "Дом / Ҳавлӣ",
    propertyTypeTg: "Ҳавлӣ",
    city: "г. Худжанд",
    cityTg: "ш. Хуҷанд",
    district: "ул. Гагарина",
    districtTg: "кӯчаи Гагарин",
    landmark: "Центральная часть Худжанда",
    landmarkTg: "Қисми марказии Хуҷанд",
    rooms: 5,
    area: 260,
    landArea: "6 сот.",
    landAreaTg: "6 сотих",
    priceTjs: 3000000,
    priceUsd: 273972,
    sellerType: "Собственник",
    sellerTypeTg: "Соҳибмулк",
    phone: "+992 92 701 5588",
    whatsapp: "+992927015588",
    isNegotiable: true,
    image: "https://cdntj.somon.tj/media/cache1/c7/47/c7476556910f23a5da6e106fd58e222c.webp",
    features: ["2 этажа", "6 соток", "Свет и вода 24/7", "Гараж"],
    featuresTg: ["2 ошёна", "6 сотих", "Барқ ва об доимӣ", "Гараж"],
  },
  {
    id: "17254763",
    slug: "17254763-1-etazhn-6-komn-dom-5-sotok-kuchai-mir-orientir-poioni-optika",
    title: "1-этажный 6-комн. дом (Ҳавлӣ), 4.7 соток, ул. Мир",
    titleTg: "Ҳавлии 1-ошёнаи 6-ҳуҷрагӣ, 4.7 сотих, кӯчаи Мир",
    dealType: "Продажа",
    dealTypeTg: "Фурӯш",
    propertyType: "Дом / Ҳавлӣ",
    propertyTypeTg: "Ҳавлӣ",
    city: "г. Худжанд",
    cityTg: "ш. Хуҷанд",
    district: "кӯчаи Мир / Поёни оптика",
    districtTg: "кӯчаи Мир / Поёни оптика",
    landmark: "Поёни оптика, 100м от трассы",
    landmarkTg: "Поёни оптика, 100м аз шоҳроҳ",
    rooms: 6,
    area: 160,
    landArea: "4.7 сот.",
    landAreaTg: "4.7 сотих",
    priceTjs: 1760000,
    priceUsd: 160730,
    sellerType: "Собственник",
    sellerTypeTg: "Соҳибмулк",
    phone: "+992 92 888 7766",
    whatsapp: "+992928887766",
    isNegotiable: true,
    image: "https://cdntj.somon.tj/media/cache1/83/d1/83d18a66b2054656f160336f3433dfb2_dDHiX9r.webp",
    features: ["6 комнат", "Техпаспорт готов", "Готов к проживанию"],
    featuresTg: ["6 ҳуҷра", "Шиносномаи техникӣ тайёр", "Омода барои зист"],
  },
  {
    id: "15811188",
    slug: "15811188-2-etazhn-7-komn-dom-3-sotok-panchshanbe",
    title: "2-этажный дом (Ҳавлӣ) с сауной, 3 сотки, Панчшанбе",
    titleTg: "Ҳавлии 2-ошёна бо сауна ва шипанг, 3 сотих, Панҷшанбе",
    dealType: "Продажа",
    dealTypeTg: "Фурӯш",
    propertyType: "Дом / Ҳавлӣ",
    propertyTypeTg: "Ҳавлӣ",
    city: "г. Худжанд",
    cityTg: "ш. Хуҷанд",
    district: "Центр / Панчшанбе",
    districtTg: "Марказ / Панҷшанбе",
    landmark: "Рядом с мечетью Шейх Муслихиддин",
    landmarkTg: "Назди масҷиди Шайх Муслиҳиддин",
    rooms: 7,
    area: 240,
    landArea: "3 сот.",
    landAreaTg: "3 сотих",
    priceTjs: 2000555,
    priceUsd: 182700,
    sellerType: "Собственник",
    sellerTypeTg: "Соҳибмулк",
    phone: "+992 92 777 8899",
    whatsapp: "+992927778899",
    isNegotiable: true,
    image: "https://cdntj.somon.tj/media/cache1/72/6c/726c72e2422fda6d7899133c05cf6382.webp",
    features: ["Российская сауна", "Теплый пол", "Джакузи", "Шипанг"],
    featuresTg: ["Сауна", "Фарши гарм", "Ҷакузи", "Шипанг"],
  },
];

export default function HomePage() {
  const { formatPrice, currency } = useCurrency();
  const { t, tDual, language } = useLanguage();
  const isTg = language === "tg";
  const [activeTab, setActiveTab] = useState<"new" | "resale" | "rent" | "houses">("new");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedRooms, setSelectedRooms] = useState<string>("all");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeQuickChip, setActiveQuickChip] = useState<string | null>(null);
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (activeTab === "new") {
      const el = document.getElementById("new-buildings");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      const el = document.getElementById("classifieds");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredProjects = useMemo(() => {
    return INITIAL_PROJECTS.filter((proj) => {
      // 1. City filter
      if (selectedCity && selectedCity !== "all") {
        if (proj.city !== selectedCity) return false;
      }

      // 2. Price filter
      const pFrom = parseFloat(priceFrom);
      const pTo = parseFloat(priceTo);
      if (!isNaN(pFrom) && pFrom > 0) {
        if (proj.minTotalPriceTjs < pFrom && proj.minTotalPriceUsd < pFrom) return false;
      }
      if (!isNaN(pTo) && pTo > 0) {
        if (proj.minTotalPriceTjs > pTo && proj.minTotalPriceUsd > pTo) return false;
      }

      // 3. Rooms filter
      if (selectedRooms && selectedRooms !== "all") {
        const targetRooms = selectedRooms === "studio" ? 0 : parseInt(selectedRooms);
        const matchingUnits = INITIAL_UNITS.filter((u) => u.projectId === proj.id);
        if (matchingUnits.length > 0) {
          const hasRooms = matchingUnits.some((u) =>
            selectedRooms === "4+" ? u.roomsCount >= 4 : u.roomsCount === targetRooms
          );
          if (!hasRooms) return false;
        }
      }

      // 4. Quick chip filter
      if (activeQuickChip) {
        if (activeQuickChip === "installment_0") {
          const hasZeroDown =
            proj.installmentDownPaymentPercent === 0 ||
            proj.amenities.some((a) => a.includes("0%")) ||
            proj.amenitiesTg?.some((a) => a.includes("0%"));
          if (!hasZeroDown) return false;
        } else if (activeQuickChip === "sirdaryo_view") {
          const hasRiverSea =
            proj.amenities.some((a) => a.includes("Сырдарь") || a.includes("моря") || a.includes("Таджик")) ||
            proj.amenitiesTg?.some((a) => a.includes("Сирдарё") || a.includes("Баҳри")) ||
            proj.district.includes("моря") ||
            Boolean(proj.districtTg && proj.districtTg.includes("Баҳри"));
          if (!hasRiverSea) return false;
        } else if (activeQuickChip === "district_18_19") {
          const is1819 =
            proj.district.includes("18") ||
            proj.district.includes("19") ||
            Boolean(proj.districtTg && (proj.districtTg.includes("18") || proj.districtTg.includes("19"))) ||
            proj.address.includes("18") ||
            proj.address.includes("19");
          if (!is1819) return false;
        } else if (activeQuickChip === "with_parking") {
          if (!proj.hasUndergroundParking && !proj.parkingConfig?.isEnabled) return false;
        } else if (activeQuickChip === "ready") {
          if (proj.status !== "ready") return false;
        }
      }

      return true;
    });
  }, [selectedCity, selectedRooms, priceFrom, priceTo, activeQuickChip]);

  const displayedProjects = showAllProjects
    ? filteredProjects
    : filteredProjects.slice(0, 6);

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
    { id: "all", label: t.common.all },
    { id: "studio", label: t.catalog.studio },
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
          <div className="relative mx-auto w-full max-w-5xl">
            <div className="bg-white/[0.49] backdrop-blur-2xl border border-white/60 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-slate-950/20">
              {/* Segment Tabs (CIAN Underline Style) */}
              <div className="flex items-center gap-6 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-0 mb-5 border-b border-slate-200/80">
                {[
                  { id: "new", label: tDual("Новостройки (ЖК)", "Биноҳои навсохт (Маҷмааҳо)"), icon: Building2 },
                  { id: "resale", label: tDual("Купить вторичку", "Хонаҳои пешина (Вторичка)"), icon: Home },
                  { id: "houses", label: tDual("Дома и Ҳавлӣ", "Ҳавлиҳо ва бӯстонсароҳо"), icon: Trees },
                  { id: "rent", label: tDual("Аренда & Коммерция", "Иҷора ва амволи тиҷоратӣ"), icon: Store },
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

              {/* Filter Inputs Grid - fixed control height and enough room for every option */}
              <div className="grid grid-cols-1 items-end gap-3.5 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1fr)_minmax(220px,1.2fr)_minmax(200px,1.1fr)_minmax(200px,1.15fr)]">
                {/* 1. City / Region */}
                <div className="min-w-0">
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    {t.catalog.city}
                  </label>
                  <Select
                    value={selectedCity}
                    onValueChange={(val) => {
                      if (val) setSelectedCity(val);
                    }}
                  >
                    <SelectTrigger className="w-full h-10 rounded-xl bg-white border border-slate-200 text-sm font-medium px-3 shadow-none">
                      <SelectValue placeholder={tDual("Все города Согда", "Ҳамаи шаҳрҳои Суғд")}>
                        {(() => {
                          if (selectedCity === "all") return tDual("Все города Согда", "Ҳамаи шаҳрҳои Суғд");
                          const c = SOGD_CITIES.find((item) => item.value === selectedCity);
                          return language === "tg" ? c?.nameTj : c?.nameRu || "Худжанд";
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {tDual("Все города Согда", "Ҳамаи шаҳрҳои Суғд")}
                      </SelectItem>
                      {SOGD_CITIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {language === "tg" ? c.nameTj : c.nameRu}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Room Buttons */}
                <div className="min-w-0">
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    {t.catalog.roomsCount}
                  </label>
                  <div className="flex h-10 min-w-0 items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                    {roomOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedRooms(opt.id)}
                        className={`h-full flex-1 rounded-lg px-2.5 text-xs font-medium transition-all cursor-pointer ${
                          selectedRooms === opt.id
                            ? "bg-emerald-600 text-white shadow-xs font-semibold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Price Range From - To */}
                <div className="min-w-0">
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                    {t.catalog.priceRange}
                  </label>
                  <div className="flex h-10 items-center gap-2">
                    <Input
                      placeholder={t.common.from}
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                      className="h-10 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                    />
                    <Input
                      placeholder={t.common.to}
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                      className="h-10 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* 4. Action Button */}
                <div className="min-w-0">
                  <Button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 cursor-pointer"
                  >
                    <Search className="h-4 w-4" />
                    {tDual(
                      activeTab === "new"
                        ? `Найти ${filteredProjects.length} ЖК`
                        : "Найти объекты",
                      activeTab === "new"
                        ? `Ҷустуҷӯи ${filteredProjects.length} МИ`
                        : "Ҷустуҷӯи амвол"
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Filter Chips (Text-only, compact) */}
              <div className="mt-4 pt-3.5 border-t border-slate-200/50 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500 mr-1 text-[11px] uppercase tracking-wider">
                  {tDual("Быстрый выбор:", "Интихоби фаврӣ:")}
                </span>
                {[
                  { id: "installment_0", ru: "Рассрочка 0%", tg: "Пардохти қисм-қисм 0%" },
                  { id: "sirdaryo_view", ru: "Вид на Сырдарью / Море", tg: "Манзара ба Сирдарё / Баҳр" },
                  { id: "district_18_19", ru: "18 и 19 мкр", tg: "микрорайонҳои 18 ва 19" },
                  { id: "with_parking", ru: "С паркингом", tg: "Бо таваққуфгоҳ" },
                  { id: "ready", ru: "Сданные ЖК", tg: "Биноҳои супоридашуда" },
                ].map((chip) => {
                  const isActive = activeQuickChip === chip.id;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => {
                        setActiveQuickChip(isActive ? null : chip.id);
                        const el = document.getElementById("new-buildings");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold"
                          : "border-slate-200/80 bg-white/80 text-slate-700 hover:bg-white"
                      }`}
                    >
                      {tDual(chip.ru, chip.tg)}
                    </button>
                  );
                })}
                {activeQuickChip && (
                  <button
                    type="button"
                    onClick={() => setActiveQuickChip(null)}
                    className="text-[11px] text-muted-foreground hover:text-red-600 underline ml-1 cursor-pointer font-medium"
                  >
                    {isTg ? "Тоза кардан" : "Сбросить"}
                  </button>
                )}
                <Link
                  href="/map"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1 text-xs transition-all ml-auto shadow-xs"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{tDual("Показать на карте Согда", "Дар харитаи Суғд дидан")}</span>
                </Link>
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
              {tDual("Каталог новостроек Согда", "Феҳристи биноҳои навсохти Суғд")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {tDual(
                "Премиальные ЖК и застройщики Худжанда",
                "Маҷмааҳои истиқоматии дараҷаи олӣ ва сохтмончиёни Суғд"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {tDual(
                "Жилые комплексы с официальной документацией, беспроцентной рассрочкой и поэтажной шахматкой",
                "Маҷмааҳои истиқоматӣ бо ҳуҷҷатҳои расмӣ, пардохти қисм-қисми бефоиз ва ҷадвали шоҳмотии ошёнаҳо"
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAllProjects(!showAllProjects)}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {showAllProjects
              ? tDual("Показать первые 6", "Нишон додани 6-тои аввал")
              : tDual(`Все ${filteredProjects.length} комплексов`, `Ҳамаи ${filteredProjects.length} маҷмаа`)}
            <ChevronRight className={`h-4 w-4 transition-transform ${showAllProjects ? "rotate-90" : ""}`} />
          </button>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8 shadow-xs">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-800 font-bold text-base">
              {tDual("Комплексы не найдены", "Маҷмааҳо ёфт нашуданд")}
            </h3>
            <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
              {tDual(
                "Попробуйте изменить параметры фильтра (город, бюджет или комнаты), чтобы увидеть доступные новостройки.",
                "Лутфан танзимоти филтрро (шаҳр, маблағ ё теъдоди ҳуҷраҳо) дигар кунед, то биноҳои навсохти дастрас намоён шаванд."
              )}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCity("all");
                setSelectedRooms("all");
                setPriceFrom("");
                setPriceTo("");
                setActiveQuickChip(null);
              }}
              className="mt-4 text-xs font-semibold rounded-xl border-slate-200 cursor-pointer"
            >
              {tDual("Сбросить все фильтры", "Тоза кардани ҳамаи филтрҳо")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedProjects.map((proj) => {
              const projName = tDual(proj.name, proj.nameTg || proj.name);
              const developer = INITIAL_DEVELOPERS.find((d) => d.id === proj.developerId);
              const projDevName = developer ? developer.name : "Застройщик";
              const devWhatsapp = (developer?.whatsapp || "+992920000000").replace(/\D/g, "");

              const projStatus = (() => {
                if (proj.status === "ready") {
                  return tDual("Сдан", "Супорида шудааст");
                }
                if (proj.status === "planned") {
                  return tDual(`В проекте (${proj.deadlineYear})`, `Лоиҳакашӣ (${proj.deadlineYear})`);
                }
                return tDual(
                  `Строится (${proj.deadlineQuarter} кв. ${proj.deadlineYear})`,
                  `Дар ҳоли сохтмон (${proj.deadlineQuarter}-кв. ${proj.deadlineYear})`
                );
              })();

              const projClass = (() => {
                switch (proj.buildingClass) {
                  case "premium":
                    return tDual("Премиум-класс", "Дараҷаи олӣ (Премиум)");
                  case "business":
                    return tDual("Бизнес-класс", "Дараҷаи бизнес");
                  case "comfort":
                    return tDual("Комфорт-класс", "Дараҷаи бароҳат");
                  default:
                    return tDual("Эконом-класс", "Дараҷаи эконом");
                }
              })();

              const cityObj = SOGD_CITIES.find((c) => c.value === proj.city);
              const projCity = isTg
                ? (cityObj?.nameTj || proj.city)
                : (cityObj?.nameRu || proj.city);
              const projDistrict = tDual(proj.district, proj.districtTg || proj.district);

              const projInstallment = proj.hasInstallment
                ? tDual(`Рассрочка до ${proj.installmentMonths} мес.`, `Пардохти қисм-қисм то ${proj.installmentMonths} моҳ`)
                : tDual("100% оплата", "100% пардохт");
              const projDownPayment = proj.hasInstallment
                ? tDual(`Взнос от ${proj.installmentDownPaymentPercent}%`, `Пешпардохт аз ${proj.installmentDownPaymentPercent}%`)
                : "";

              const projTags = (isTg && proj.amenitiesTg && proj.amenitiesTg.length > 0)
                ? proj.amenitiesTg.slice(0, 3)
                : proj.amenities.slice(0, 3);

              const coverImage = proj.coverImageUrl || proj.images?.[0] || "/images/placeholder.jpg";

              const projectUnits = INITIAL_UNITS.filter((u) => u.projectId === proj.id);
              const availableUnitsCount = projectUnits.length > 0
                ? projectUnits.filter((u) => u.status === "available").length || projectUnits.length
                : Math.max(24, proj.floorsCount * proj.sectionsCount * 2);

              return (
                <Card
                  key={proj.id}
                  className="bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                    <img
                      src={coverImage}
                      alt={projName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                      <Badge className="bg-emerald-600 text-white font-medium text-xs shadow-sm">
                        {projStatus}
                      </Badge>
                      <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-800 font-medium text-xs shadow-xs">
                        {projClass}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-md text-emerald-700 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 border border-slate-200/50">
                      <Percent className="h-3.5 w-3.5 text-emerald-600" />
                      {projInstallment} {projDownPayment ? `(${projDownPayment})` : ""}
                    </div>

                    <div className="absolute bottom-3.5 right-3.5 z-10">
                      <ProjectCatalogCardBadge slug={proj.slug} />
                    </div>

                    <Link
                      href={developer ? `/developers/${developer.slug}` : "#"}
                      className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900 shadow-sm flex items-center gap-2 border border-slate-200/50 hover:bg-white transition-colors"
                    >
                      <DeveloperAvatar name={projDevName} size="sm" className="h-5 w-5 text-[9px]" />
                      <span className="truncate max-w-[130px]">{projDevName}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </Link>
                  </div>

                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <div>
                      <Link href={`/projects/${proj.slug}`}>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                          {projName}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{projCity}, {projDistrict} • {proj.floorsCount} {tDual("этажей", "ошёна")}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {projTags.map((tag) => (
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
                        <div className="text-[11px] text-slate-400">{tDual("Цена за м²:", "Нархи 1 м²:")}</div>
                        <div className="text-sm font-semibold text-slate-800">
                          {t.common.from}{" "}
                          {formatPrice(
                            proj.minPricePerMeterTjs,
                            proj.minPricePerMeterUsd
                          )}{" "}
                          / {t.common.sqm}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] text-slate-400">{tDual("Квартиры от:", "Хонадон аз:")}</div>
                        <div className="text-lg font-bold text-emerald-600">
                          {t.common.from} {formatPrice(proj.minTotalPriceTjs, proj.minTotalPriceUsd)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-3">
                      <Link href={`/projects/${proj.slug}`} className="flex-1">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-10 px-4 rounded-xl shadow-xs cursor-pointer">
                          {tDual(`Смотреть ${availableUnitsCount} квартир`, `Дидани ${availableUnitsCount} хонадон`)}
                        </Button>
                      </Link>
                      <a
                        href={`https://wa.me/${devWhatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="outline" size="sm" className="text-xs font-semibold h-10 px-3.5 rounded-xl gap-1.5 border-slate-200 cursor-pointer">
                          <MessageCircle className="h-4 w-4 text-emerald-600" />
                          {tDual("Отдел продаж", "Шӯъбаи фурӯш")}
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredProjects.length > 6 && !showAllProjects && (
          <div className="mt-8 text-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAllProjects(true)}
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-6 py-2.5 rounded-xl cursor-pointer"
            >
              {tDual(
                `Показать еще ${filteredProjects.length - 6} комплексов из ${filteredProjects.length}`,
                `Нишон додани боз ${filteredProjects.length - 6} маҷмаа аз ${filteredProjects.length}`
              )}
            </Button>
          </div>
        )}
      </section>

      {/* 4. SECONDARY MARKET & HOUSES (AVITO / CIAN STYLE) */}
      <section id="classifieds" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        <div id="houses" className="absolute -top-24 pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              <Home className="h-3.5 w-3.5" />
              {isTg ? "Бозори дуюмдараҷа ва ҳавлиҳо" : "Вторичный рынок и дома"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isTg
                ? "Эълонҳои тоза дар ш. Хуҷанд ва атрофи он"
                : "Свежие объявления в Худжанде и пригороде"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isTg
                ? "Хонадонҳо аз соҳибмулкон, ҳавлиҳои анъанавӣ, бӯстонсароҳо ва амволи тиҷоратӣ"
                : "Квартиры от собственников, традиционные дома (ҳавлӣ), дачи и коммерция"}
            </p>
          </div>
          <Link
            href="/classifieds"
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
          >
            {isTg ? "Дидани ҳамаи 186 эълон" : "Смотреть все 186 объявлений"}
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
                <Link href={`/classifieds/${item.slug || item.id}`} className="block relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={isTg ? item.titleTg || item.title : item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge className="bg-emerald-600 text-white text-[11px] font-medium shadow-xs">
                      {isTg ? item.dealTypeTg || item.dealType : item.dealType}
                    </Badge>
                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-slate-800 text-[11px] font-medium">
                      {isTg ? item.propertyTypeTg || item.propertyType : item.propertyType}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 z-10">
                    <PropertyMetricsBadge idOrSlug={item.slug || item.id} />
                  </div>
                  {item.isNegotiable && (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[10px] font-semibold text-slate-700 px-2.5 py-1 rounded-md shadow-xs">
                      {isTg ? "Савдо мешавад" : "Торг уместен"}
                    </div>
                  )}
                </Link>

                <CardContent className="p-4 sm:p-5 space-y-2.5">
                  <div>
                    <div className="text-lg font-bold text-emerald-600">
                      {formatPrice(item.priceTjs, item.priceUsd)}
                    </div>
                    <Link href={`/classifieds/${item.slug || item.id}`}>
                      <h4 className="font-semibold text-sm text-slate-900 line-clamp-1 mt-0.5 hover:text-emerald-600 transition-colors">
                        {isTg ? item.titleTg || item.title : item.title}
                      </h4>
                    </Link>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      {isTg
                        ? `${item.cityTg || item.city}, ${item.districtTg || item.district} (${item.landmarkTg || item.landmark})`
                        : `${item.city}, ${item.district} (${item.landmark})`}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 border-y border-slate-100 py-2 font-medium">
                    <span className="font-bold text-slate-900">
                      {item.rooms} {isTg ? "ҳуҷр." : "комн."}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-slate-900">{item.area} м²</span>
                    <span>•</span>
                    <span>
                      {isTg
                        ? item.floorTg || item.landAreaTg || item.floor || item.landArea
                        : item.floor || item.landArea}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {(isTg ? item.featuresTg || item.features : item.features).map((f) => (
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
                    {isTg ? item.sellerTypeTg || item.sellerType : item.sellerType}
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
                    className="h-8 px-2.5 text-xs font-semibold gap-1 rounded-lg border-slate-200 cursor-pointer"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    {revealedPhones[item.id]
                      ? isTg
                        ? "Пӯшидан"
                        : "Скрыть"
                      : isTg
                      ? "Нишон додан"
                      : "Показать"}
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
              {isTg ? "Экосистемаи Maskani" : "Экосистема Maskani"}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isTg
                ? "Воситаҳо барои тамоми иштирокдорони бозор"
                : "Инструменты для всех участников рынка"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              {isTg
                ? "Мо харидорон, сохтмончиён ва мутахассисони амволро дар як фазои ягонаи рақамӣ муттаҳид месозем."
                : "Мы объединяем покупателей, застройщиков и частных маклеров в единую современную цифровую среду."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. For Buyers */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3 hover:border-emerald-300 hover:bg-white hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {isTg ? "Барои харидорон" : "Для покупателей"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTg
                  ? "Ҷустуҷӯи биноҳои навсохт ва бозори дуюмдараҷа. Ҷадвали шоҳмотии ошёнаҳо ва робитаи мустақим бо шуъбаи фурӯш."
                  : "Поиск новостроек и вторички без переплат. Интерактивная поэтажная шахматка и прямой контакт с отделами продаж."}
              </p>
              <Link href="#new-buildings" className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:underline gap-1 pt-1">
                {isTg ? "Гузариш ба феҳристи МИ" : "Перейти в каталог ЖК"}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 2. For Developers */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3 hover:border-emerald-300 hover:bg-white hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {isTg ? "Барои сохтмончиён" : "Для застройщиков"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTg
                  ? "Кабинети рақамии сохтмончӣ: идоракунии ҷадвали шоҳмотии хонаҳо, бронкунӣ ва огоҳиномаҳои Telegram."
                  : "Цифровой кабинет застройщика: визуальное управление шахматкой квартир, бронирование и заявки в Telegram."}
              </p>
              <Link href="/developer-admin" className="inline-flex items-center text-xs font-semibold text-teal-700 hover:underline gap-1 pt-1">
                {isTg ? "Кабинети сохтмончӣ" : "Кабинет застройщика"}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* 3. For Realtors & CRM */}
            <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-5 sm:p-6 space-y-3 hover:border-emerald-300 hover:bg-white hover:shadow-sm transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {isTg ? "Барои даллалҳо ва агентиҳо" : "Для маклеров и агентств"}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isTg
                  ? "Канбан-CRM-и муосир, интихоби инфиродии хонаҳо дар WhatsApp ва Open API."
                  : "Легкая Канбан-воронка лидов, персональные подборки объектов в WhatsApp без контактов собственников и Open API."}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <Link href="/profile/crm" className="inline-flex items-center text-xs font-bold text-emerald-700 hover:underline gap-1">
                  {isTg ? "Канбан CRM ва интихобҳо" : "Канбан CRM & Подборки"}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isTg
                  ? "Ширкатҳои сохтмонии тасдиқшудаи вилояти Суғд"
                  : "Проверенные застройщики Согдийской области"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isTg
                  ? "Ширкатҳое, ки маҷмааҳои истиқоматиро бо ҳуҷҷатҳои пурраи расмӣ, кафолат ва пардохти қисм-қисми бефоиз дар Хуҷанд ва Гулистон месозанд."
                  : "Компании, строящие жилые комплексы с официальной проектной документацией, гарантиями и беспроцентной рассрочкой в Худжанде и Гулистоне."}
              </p>
            </div>
            <Link
              href="/developers"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
            >
              {isTg ? "Ҳамаи ширкатҳо" : "Все застройщики"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {INITIAL_DEVELOPERS.map((dev) => (
              <Link
                key={dev.id}
                href={`/developers/${dev.slug}`}
                className="bg-slate-50/60 border border-slate-200/70 rounded-xl p-5 flex flex-col justify-between hover:border-emerald-300 hover:bg-white hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 shadow-xs">
                    <img
                      src={dev.logoUrl}
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {dev.name}
                      </h4>
                      {dev.isVerified && (
                        <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] px-1.5 py-0 h-4">
                          {isTg ? "Тасдиқшуда" : "Верифицирован"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="font-semibold text-amber-600 flex items-center gap-0.5">
                        ★ {dev.rating}
                      </span>
                      <span>•</span>
                      <span>
                        {dev.completedProjectsCount} {isTg ? "супоридашуда" : "сдано"}
                      </span>
                      <span>•</span>
                      <span>
                        {dev.activeProjectsCount} {isTg ? "сохташаванда" : "строятся"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                  <p className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{dev.officeAddress}</span>
                  </p>
                  <p className="flex items-center gap-1 text-emerald-700 font-medium">
                    <Phone className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{dev.phone}</span>
                  </p>
                </div>
              </Link>
            ))}
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
                {isTg ? "Шаҳру ноҳияҳои вилояти Суғд" : "Города Согдийской области"}
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="/classifieds?city=khujand" className="hover:text-emerald-700 transition-colors">{isTg ? "Амвол дар ш. Хуҷанд" : "Недвижимость в Худжанде (Хуҷанд)"}</Link></li>
                <li><Link href="/classifieds?city=gafurov" className="hover:text-emerald-700 transition-colors">{isTg ? "Хонаҳо дар н. Б. Ғафуров" : "Дома в Б. Гафурове (Бобоҷон Ғафуров)"}</Link></li>
                <li><Link href="/classifieds?city=isfara" className="hover:text-emerald-700 transition-colors">{isTg ? "Хонадонҳо дар ш. Исфара" : "Квартиры в Исфаре (Исфара)"}</Link></li>
                <li><Link href="/classifieds?city=istaravshan" className="hover:text-emerald-700 transition-colors">{isTg ? "Амвол дар ш. Истаравшан" : "Недвижимость в Истаравшане"}</Link></li>
                <li><Link href="/classifieds?city=guliston" className="hover:text-emerald-700 transition-colors">{isTg ? "Хонадонҳо дар ш. Гулистон" : "Квартиры в Гулистоне (Қайроққум)"}</Link></li>
                <li><Link href="/classifieds?city=konibodom" className="hover:text-emerald-700 transition-colors">{isTg ? "Қитъаҳои замин дар ш. Конибодом" : "Участки в Канибадаме (Конибодом)"}</Link></li>
                <li><Link href="/classifieds?city=panjakent" className="hover:text-emerald-700 transition-colors">{isTg ? "Хонаҳо дар ш. Панҷакент" : "Дома в Пенджикенте (Панҷакент)"}</Link></li>
              </ul>
            </div>

            {/* By Districts of Khujand */}
            <div>
              <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                {isTg ? "Маҳаллаҳои шаҳри Хуҷанд" : "Микрорайоны Худжанда"}
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="/classifieds?q=19" className="hover:text-emerald-700 transition-colors">{isTg ? "Биноҳои нав дар микрорайони 19" : "Новостройки в 19 микрорайоне"}</Link></li>
                <li><Link href="/classifieds?q=18" className="hover:text-emerald-700 transition-colors">{isTg ? "Хонадонҳо дар микрорайони 18" : "Квартиры в 18 микрорайоне"}</Link></li>
                <li><Link href="/classifieds?q=набережная" className="hover:text-emerald-700 transition-colors">{isTg ? "Манзил дар соҳили Сирдарё" : "Жилье на Набережной Сырдарьи"}</Link></li>
                <li><Link href="/classifieds?q=20" className="hover:text-emerald-700 transition-colors">{isTg ? "Хонадонҳо дар мкр 20 ва 34" : "Квартиры в 20 и 34 мкр"}</Link></li>
                <li><Link href="/classifieds?q=панчшанбе" className="hover:text-emerald-700 transition-colors">{isTg ? "Атрофи бозори «Панҷшанбе»" : "Район рынка «Панчшанбе»"}</Link></li>
                <li><Link href="/classifieds?q=абрешим" className="hover:text-emerald-700 transition-colors">{isTg ? "Комбинати абрешим ва Соҳили рост" : "Шелкокомбинат и Правый берег"}</Link></li>
                <li><Link href="/classifieds?q=раззок" className="hover:text-emerald-700 transition-colors">{isTg ? "Маҳаллаи Раззоқ ва Марказ" : "Махалля Раззок и Центр"}</Link></li>
              </ul>
            </div>

            {/* By Property Categories */}
            <div>
              <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                {isTg ? "Гурӯҳҳои амволи ғайриманқул" : "Категории недвижимости"}
              </h5>
              <ul className="space-y-2 text-xs">
                <li><Link href="#new-buildings" className="hover:text-emerald-700 transition-colors">{isTg ? "Феҳристи МИ бо ҷадвали шоҳмотӣ" : "Каталог ЖК с поэтажной шахматкой"}</Link></li>
                <li><Link href="/classifieds?rooms=1" className="hover:text-emerald-700 transition-colors">{isTg ? "Хонадонҳои 1-ҳуҷрагӣ дар Хуҷанд" : "1-комнатные квартиры в Худжанде"}</Link></li>
                <li><Link href="/classifieds?rooms=2" className="hover:text-emerald-700 transition-colors">{isTg ? "Хонадонҳои 2-ҳуҷрагӣ бо таъмир" : "2-комнатные квартиры с евроремонтом"}</Link></li>
                <li><Link href="/classifieds?propertyType=house" className="hover:text-emerald-700 transition-colors">{isTg ? "Ҳавлиҳои анъанавӣ бо боғ" : "Традиционные дома (Ҳавлӣ) с садом"}</Link></li>
                <li><Link href="/classifieds?propertyType=land" className="hover:text-emerald-700 transition-colors">{isTg ? "Қитъаҳои замин барои сохтмон" : "Земельные участки под застройку"}</Link></li>
                <li><Link href="/classifieds?propertyType=commercial" className="hover:text-emerald-700 transition-colors">{isTg ? "Биноҳои тиҷоратӣ ва мағозаҳо" : "Коммерческие помещения и магазины"}</Link></li>
                <li><Link href="/profile/analytics" className="hover:text-emerald-700 transition-colors">{isTg ? "B2B Open API барои даллалҳо ва шарикон" : "B2B Open API для риелторов"}</Link></li>
              </ul>
            </div>

            {/* Contacts & Support */}
            <div>
              <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
                {isTg ? "Тамос ва шуъбаи марказӣ" : "Контакты и офис"}
              </h5>
              <p className="text-xs mb-2 leading-relaxed text-slate-600">
                {isTg ? "Шуъбаи марказӣ дар вилояти Суғд:" : "Центральный офис по Согдийской области:"}
              </p>
              <p className="font-semibold text-slate-900">
                {isTg ? "ш. Хуҷанд, хиёбони И. Сомонӣ 142" : "г. Худжанд, пр. И. Сомони 142"}
              </p>
              <p className="font-mono font-bold text-emerald-700 text-sm mt-2">+992 92 777 0001</p>
              <p className="font-mono text-slate-500 mt-0.5">support@sogd-realty.tj</p>
              <div className="pt-3">
                <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
                  🇹🇯 Хуҷанд • Суғд • Тоҷикистон
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              {isTg
                ? "© 2026 Maskani.tj. Ҳамаи ҳуқуқҳо маҳфузанд."
                : "© 2026 Maskani.tj. Все права защищены."}
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <Link href="/developer-admin" className="hover:text-emerald-700">
                {isTg ? "Кабинети сохтмончӣ" : "Кабинет застройщика"}
              </Link>
              <Link href="/profile/analytics" className="hover:text-emerald-700">
                {isTg ? "Таҳлил ва Open API" : "Аналитика & Open API"}
              </Link>
              <Link href="/profile/crm" className="hover:text-emerald-700 font-medium text-emerald-700/70">
                {isTg ? "Барои даллалҳо ва агентиҳо (B2B CRM)" : "Маклерам и Агентствам (B2B CRM)"}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
