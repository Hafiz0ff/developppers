"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
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
import { HomepageShowcaseMatrix } from "@/components/modules/homepage-showcase-matrix";
import { formatNewBuildingPricePerMeter, getPricePerMeterLabel } from "@/lib/pricing/new-building-price";
import { NewBuildingPriceBlock } from "@/components/modules/new-building-price-block";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  ChevronDown,
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
  X,
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
  const [hoveredSearchTab, setHoveredSearchTab] = useState<string | null>(null);
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
      {/* 1. PANORAMIC HERO SECTION STARTING FROM TOP OF SCREEN (Covering Header, Search Card & Marquee at bottom) */}
      <section className="relative pt-24 sm:pt-28 pb-0 border-b border-white/20 bg-slate-900 overflow-hidden">
        {/* Background Layer: Panoramic Landscape with Soft Contrast Overlay */}
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden">
          <img
            src="/images/hero-bg.png"
            alt="Maskani Real Estate Panorama"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle contrast overlay preserving natural warmth and mountain visibility */}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/35" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-8 sm:pb-10">

          {/* 2. APPLE-STYLE LIQUID GLASS SEARCH CARD (Luminous Transparent Glass: 2.5% Opacity + Crisp Glowing Edges) */}
          <div className="relative mx-auto w-full max-w-5xl">
            <div className="bg-white/[0.025] backdrop-blur-2xl backdrop-saturate-150 border border-white/20 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.20),inset_0_1px_1.5px_rgba(255,255,255,0.35)]">
              {/* Segment Tabs (Apple Liquid Glass Style with Dynamic Word-Length Underline & Forward Scale) */}
              <div
                onMouseLeave={() => setHoveredSearchTab(null)}
                className="flex items-center gap-1 sm:gap-2 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 mb-5 border-b border-white/20 select-none"
              >
                {[
                  { id: "new", label: t.catalog.tabNew, icon: Building2 },
                  { id: "resale", label: t.catalog.tabResale, icon: Home },
                  { id: "houses", label: t.catalog.tabHouses, icon: Trees },
                  { id: "rent", label: t.catalog.tabRent, icon: Store },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  const isHovered = hoveredSearchTab === tab.id;
                  const currentActive = hoveredSearchTab ?? activeTab;
                  const isHighlighted = currentActive === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      onMouseEnter={() => setHoveredSearchTab(tab.id)}
                      className="relative px-3 sm:px-4 py-2.5 flex items-center select-none cursor-pointer outline-hidden group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05, y: -1 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        className="relative z-10 flex items-center gap-2 text-sm font-semibold whitespace-nowrap text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                      >
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isHighlighted
                              ? "text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                              : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                          }`}
                        />
                        <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{tab.label}</span>
                      </motion.div>

                      {/* Soft Glass Hover Backing */}
                      {isHovered && (
                        <motion.div
                          layoutId="search-tab-hover-bg"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          className="absolute inset-0 rounded-xl bg-white/15 dark:bg-slate-800/40 backdrop-blur-md border border-white/25 -z-0"
                        />
                      )}

                      {/* Apple-Style Dynamic Glowing Underline adapting to exact word length */}
                      {isHighlighted && (
                        <motion.div
                          layoutId="search-tab-underline"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                          className="absolute -bottom-1 left-2.5 right-2.5 h-[3px] rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9),0_2px_4px_rgba(0,0,0,0.3)] z-20"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Filter Inputs Grid - Unified Sleek Height h-[38px] & Header-Style Animated Dropdown */}
              <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1fr)_minmax(220px,1.2fr)_minmax(200px,1.1fr)_minmax(190px,1.1fr)]">
                {/* 1. City / Region - Header-Style Animated Dropdown & Clean Frosted Glass */}
                <div className="flex flex-col min-w-0">
                  <label className="h-5 flex items-center text-xs font-bold text-white mb-2 tracking-wide select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {t.catalog.city}
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-[38px] w-full items-center justify-between gap-1.5 rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/10 active:bg-white/15 backdrop-blur-xl px-4 text-white text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all cursor-pointer outline-hidden select-none box-border">
                      <span className="truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        {selectedCity === "all"
                          ? t.catalog.allCities
                          : (() => {
                              const c = SOGD_CITIES.find((item) => item.value === selectedCity);
                              return language === "tg" ? c?.nameTj : language === "en" ? (c?.nameEn || c?.nameRu) : c?.nameRu || "Худжанд";
                            })()}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-white shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={6}
                      className="w-64 max-h-80 overflow-y-auto p-1.5 rounded-2xl bg-white/[0.04] backdrop-blur-3xl backdrop-saturate-150 shadow-[0_20px_50px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.4)] border border-white/20 z-50 text-white ring-0 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full"
                    >
                      <DropdownMenuItem
                        onClick={() => setSelectedCity("all")}
                        className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          selectedCity === "all"
                            ? "text-white bg-emerald-500/25 border border-emerald-400/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                            : "text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 font-semibold"
                        }`}
                      >
                        <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{t.catalog.allCities}</span>
                        {selectedCity === "all" && <Check className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />}
                      </DropdownMenuItem>
                      {SOGD_CITIES.map((c) => {
                        const isCitySelected = selectedCity === c.value;
                        return (
                          <DropdownMenuItem
                            key={c.value}
                            onClick={() => setSelectedCity(c.value)}
                            className={`cursor-pointer text-xs flex items-center justify-between px-3 py-2 rounded-xl transition-all mt-0.5 ${
                              isCitySelected
                                ? "text-white bg-emerald-500/25 border border-emerald-400/50 font-bold shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.3)]"
                                : "text-white/90 hover:text-white hover:bg-white/15 focus:text-white focus:bg-white/15 font-semibold"
                            }`}
                          >
                            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                              {language === "tg" ? c.nameTj : language === "en" ? (c.nameEn || c.nameRu) : c.nameRu}
                            </span>
                            {isCitySelected && <Check className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)]" />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* 2. Room Buttons - Unified Height h-[38px] */}
                <div className="flex flex-col min-w-0">
                  <label className="h-5 flex items-center text-xs font-bold text-white mb-2 tracking-wide select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {t.catalog.roomsCount}
                  </label>
                  <div className="flex h-[38px] w-full box-border min-w-0 items-center gap-1 rounded-2xl border border-white/15 bg-white/[0.05] backdrop-blur-xl p-1 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                    {roomOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedRooms(opt.id)}
                        className={`h-full flex-1 rounded-xl px-2 text-xs transition-all cursor-pointer select-none ${
                          selectedRooms === opt.id
                            ? "bg-emerald-500/80 text-white shadow-[0_0_14px_rgba(16,185,129,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-emerald-300/60 font-bold backdrop-blur-md drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                            : "text-white hover:bg-white/10 font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Price Range From - To - Unified Height h-[38px] */}
                <div className="flex flex-col min-w-0">
                  <label className="h-5 flex items-center text-xs font-bold text-white mb-2 tracking-wide select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    {t.catalog.priceRange}
                  </label>
                  <div className="flex h-[38px] w-full box-border items-center gap-2">
                    <Input
                      placeholder={t.common.from}
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                      className="h-[38px] flex-1 min-w-0 box-border rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/10 focus:bg-white/15 backdrop-blur-xl px-3 text-sm font-semibold text-white placeholder:text-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] outline-none focus:border-emerald-400/80 transition-all text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                    />
                    <Input
                      placeholder={t.common.to}
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                      className="h-[38px] flex-1 min-w-0 box-border rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/10 focus:bg-white/15 backdrop-blur-xl px-3 text-sm font-semibold text-white placeholder:text-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] outline-none focus:border-emerald-400/80 transition-all text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                </div>

                {/* 4. Action Button - Unified Height h-[38px] Frosted Emerald Glass */}
                <div className="flex flex-col min-w-0">
                  <div className="h-5 mb-2 select-none pointer-events-none hidden sm:block" aria-hidden="true" />
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    type="button"
                    onClick={handleSearchSubmit}
                    className="flex h-[38px] w-full box-border items-center justify-center gap-2 rounded-2xl bg-emerald-500/25 hover:bg-emerald-500/40 active:bg-emerald-500/50 backdrop-blur-xl border border-emerald-400/50 text-white font-bold text-xs shadow-[0_8px_24px_rgba(16,185,129,0.30),inset_0_1px_1.5px_rgba(255,255,255,0.45)] transition-all cursor-pointer select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  >
                    <Search className="h-3.5 w-3.5 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                    <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                      {activeTab === "new"
                        ? t.catalog.searchProjects.replace("{count}", String(filteredProjects.length))
                        : t.catalog.searchProperties}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Quick Filter Chips - iOS 18 Control Center Liquid Glass (Compact -1pt) */}
              <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center gap-2 text-xs">
                {/* Frosted Glass Badge for "Быстрый выбор" (Reduced by 1 step) */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.06] backdrop-blur-xl border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] select-none">
                  <Sparkles className="h-3 w-3 text-emerald-300 animate-pulse" />
                  <span>{t.catalog.quickFilters}</span>
                </div>

                {[
                  { id: "installment_0", ru: "Рассрочка 0%", tg: "Пардохти қисм-қисм 0%", en: "0% Installment" },
                  { id: "sirdaryo_view", ru: "Вид на Сырдарью / Море", tg: "Манзара ба Сирдарё / Баҳр", en: "Syr Darya / Sea view" },
                  { id: "district_18_19", ru: "18 и 19 мкр", tg: "микрорайонҳои 18 ва 19", en: "18th & 19th Districts" },
                  { id: "with_parking", ru: "С паркингом", tg: "Бо таваққуфгоҳ", en: "With parking" },
                  { id: "ready", ru: "Сданные ЖК", tg: "Биноҳои супоридашуда", en: "Completed complexes" },
                ].map((chip) => {
                  const isActive = activeQuickChip === chip.id;
                  return (
                    <motion.button
                      key={chip.id}
                      type="button"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25 }}
                      onClick={() => {
                        setActiveQuickChip(isActive ? null : chip.id);
                        const el = document.getElementById("new-buildings");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`relative inline-flex items-center rounded-xl border px-2.5 py-1 text-[11px] transition-all cursor-pointer select-none backdrop-blur-xl ${
                        isActive
                          ? "bg-emerald-500/25 border-emerald-400/60 text-white font-bold shadow-[0_0_14px_rgba(16,185,129,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.4)]"
                          : "border-white/15 bg-white/[0.05] hover:bg-white/10 active:bg-white/15 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]"
                      }`}
                    >
                      <span className="relative z-10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                        {language === "en" ? chip.en : language === "tg" ? chip.tg : chip.ru}
                      </span>

                      {/* Apple-Style Dynamic Glowing Underline for Active Quick Filter Chip */}
                      {isActive && (
                        <motion.div
                          layoutId="quick-chip-underline"
                          transition={{ type: "spring", stiffness: 450, damping: 30 }}
                          className="absolute -bottom-0.5 left-2 right-2 h-[2px] rounded-full bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 shadow-[0_0_8px_rgba(52,211,153,1)] z-20"
                        />
                      )}
                    </motion.button>
                  );
                })}

                {/* Reset Active Filter */}
                {activeQuickChip && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setActiveQuickChip(null)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-white text-[10px] font-bold backdrop-blur-xl transition-all cursor-pointer select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  >
                    <X className="h-2.5 w-2.5 text-white" />
                    <span>{language === "en" ? "Reset" : isTg ? "Тоза кардан" : "Сбросить"}</span>
                  </motion.button>
                )}

                {/* Map Link - iOS Control Center Frosted Glass Pill (Reduced by 1 step & renamed to "Показать на карте") */}
                <motion.div
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 450, damping: 25 }}
                  className="ml-auto"
                >
                  <Link
                    href="/map"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/15 active:bg-white/20 text-white font-bold px-2.5 py-1 text-[11px] transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  >
                    <MapPin className="h-3 w-3 text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span>{t.catalog.showOnMap}</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FULL-WIDTH CONTINUOUS MARQUEE TICKER (At bottom boundary of Khujand Panorama) */}
        <div className="w-full overflow-hidden bg-black/25 backdrop-blur-md border-t border-white/15 py-2 select-none relative z-10 shadow-[0_-2px_12px_rgba(0,0,0,0.2)]">
          <div className="flex whitespace-nowrap animate-marquee">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="inline-flex items-center gap-6 px-6 text-[11px] font-semibold tracking-widest uppercase text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
              >
                <span><span className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] mr-2">✦</span>{t.marquee.portalTitle}</span>
                <span><span className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] mr-2">✦</span>{t.marquee.directDev}</span>
                <span><span className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] mr-2">✦</span>{t.marquee.chessboards}</span>
                <span><span className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] mr-2">✦</span>{t.marquee.resaleHomes}</span>
                <span><span className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] mr-2">✦</span>{t.marquee.dualCurrency}</span>
                <span><span className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] mr-2">✦</span>{t.marquee.b2bCrm}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5. 9-BLOCK HOMEPAGE SHOWCASE MATRIX (TZ Section 9) */}
      <HomepageShowcaseMatrix activeCity={selectedCity === "all" ? "khujand" : selectedCity} />

      {/* 3. NEW BUILDINGS & RESIDENTIAL COMPLEXES (CIAN STYLE) */}
      <section id="new-buildings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-emerald-600 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              {tDual("Каталог новостроек Согда", "Феҳристи биноҳои навсохти Суғд", "Sughd New Buildings Catalog")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {tDual(
                "Премиальные ЖК и застройщики Худжанда",
                "Маҷмааҳои истиқоматии дараҷаи олӣ ва сохтмончиёни Суғд",
                "Premium Complexes & Developers of Khujand"
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {tDual(
                "Жилые комплексы с официальной документацией, беспроцентной рассрочкой и поэтажной шахматкой",
                "Маҷмааҳои истиқоматӣ бо ҳуҷҷатҳои расмӣ, пардохти қисм-қисми бефоиз ва ҷадвали шоҳмотии ошёнаҳо",
                "Residential complexes with official documentation, 0% installments, and floor plans"
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAllProjects(!showAllProjects)}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {showAllProjects
              ? tDual("Показать первые 6", "Нишон додани 6-тои аввал", "Show first 6")
              : tDual(`Все ${filteredProjects.length} комплексов`, `Ҳамаи ${filteredProjects.length} маҷмаа`, `All ${filteredProjects.length} complexes`)}
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
                <motion.div
                  key={proj.id}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-[0_22px_45px_-12px_rgba(16,185,129,0.18)] flex flex-col"
                >
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                    <img
                      src={coverImage}
                      alt={projName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/40 backdrop-blur-xl border border-emerald-400/50 text-white font-bold text-xs shadow-[0_4px_16px_rgba(16,185,129,0.30),inset_0_1px_1.5px_rgba(255,255,255,0.45)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] select-none transition-all">
                        {projStatus}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-black/25 hover:bg-black/35 backdrop-blur-xl border border-white/25 text-white font-bold text-xs shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.35)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] select-none transition-all">
                        {projClass}
                      </span>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/35 backdrop-blur-xl border border-white/25 text-white font-bold text-xs shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.35)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] select-none transition-all">
                      <Percent className="h-3.5 w-3.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] shrink-0" />
                      <span className="text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">{projInstallment} {projDownPayment ? `(${projDownPayment})` : ""}</span>
                    </div>

                    <div className="absolute bottom-3.5 right-3.5 z-10">
                      <ProjectCatalogCardBadge slug={proj.slug} />
                    </div>

                    <Link
                      href={developer ? `/developers/${developer.slug}` : "#"}
                      className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/35 backdrop-blur-xl border border-white/25 text-xs font-bold text-white shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.35)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] transition-all hover:scale-105 select-none"
                    >
                      <DeveloperAvatar name={projDevName} size="sm" className="h-5 w-5 text-[9px]" />
                      <span className="truncate max-w-[130px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">{projDevName}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.9)] shrink-0" />
                    </Link>
                  </div>

                  <CardContent className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
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
                          <motion.span
                            key={tag}
                            whileHover={{ scale: 1.05, y: -1 }}
                            transition={{ type: "spring", stiffness: 450, damping: 25 }}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg glass-amenity-card text-slate-700 dark:text-slate-200 select-none cursor-default"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>

                      <NewBuildingPriceBlock
                        minTotalPriceTjs={proj.minTotalPriceTjs}
                        minTotalPriceUsd={proj.minTotalPriceUsd}
                        minPricePerMeterTjs={proj.minPricePerMeterTjs}
                        minPricePerMeterUsd={proj.minPricePerMeterUsd}
                        variant="card"
                      />
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <Link href={`/projects/${proj.slug}`} className="flex-1">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs h-10 px-4 rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer">
                            {tDual(`Смотреть ${availableUnitsCount} квартир`, `Дидани ${availableUnitsCount} хонадон`)}
                          </Button>
                        </motion.div>
                      </Link>
                      <a
                        href={`https://wa.me/${devWhatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }}>
                          <Button variant="outline" size="sm" className="text-xs font-semibold h-10 px-3.5 rounded-xl gap-1.5 glass-pill border-slate-200/80 hover:border-emerald-500/50 hover:text-emerald-700 cursor-pointer">
                            <MessageCircle className="h-4 w-4 text-emerald-600" />
                            {tDual("Отдел продаж", "Шӯъбаи фурӯш")}
                          </Button>
                        </motion.div>
                      </a>
                    </div>
                  </CardContent>
                </motion.div>
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
