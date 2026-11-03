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
import { HomepageShowcaseSections } from "@/components/modules/homepage-showcase-sections";
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

          {/* Hero H1 & Subtitle Strictly Conforming to TZ Section 15.1 & AC-55 */}
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 pt-2 sm:pt-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              {isTg
                ? "Амволи ғайриманқул дар Тоҷикистон"
                : language === "en"
                ? "Real Estate in Tajikistan"
                : "Недвижимость в Таджикистане"}
            </h1>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-200/90 font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] max-w-2xl mx-auto">
              {isTg
                ? "Эълонҳои фурӯш ва иҷораи хонадонҳо, ҳавлиҳо ва амволи тиҷоратӣ дар саросари Тоҷикистон"
                : language === "en"
                ? "Listings for sale and rent of apartments, houses and commercial real estate across Tajikistan"
                : "Объявления о продаже и аренде квартир, домов и коммерческой недвижимости по всему Таджикистану"}
            </p>
          </div>

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
                      className="w-64 max-h-80 overflow-y-auto p-1.5 rounded-2xl glass-dropdown-panel z-50 text-white ring-0 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full"
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

      {/* 2. UPPER BLOCK: 7 CATEGORY MINI-CARDS (Stage 2) */}
      <HomepageShowcaseMatrix activeCity={selectedCity === "all" ? "khujand" : selectedCity} />

      {/* 3. 8 SHOWCASE SECTIONS (Stage 2: 4x1 Desktop Grid, Clickable Headers, Photo Switcher) */}
      <HomepageShowcaseSections activeCity={selectedCity === "all" ? "khujand" : selectedCity} />

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
