"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import {
  getAllMapProperties,
  MapPropertyItem,
  SOGD_MAP_PRESETS,
  generateYandexMapsRouteUrl,
  calculateDistanceKm,
} from "@/lib/geo-utils";
import { InteractiveMapWrapper } from "@/components/modules/interactive-map-wrapper";
import {
  Search,
  Building2,
  Home,
  MapPin,
  SlidersHorizontal,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  List,
  Map as MapIcon,
  Phone,
  Navigation,
  Compass,
  X,
  ExternalLink,
  ArrowUpDown,
  Locate,
  Check,
  RotateCcw,
} from "lucide-react";

export default function MapPage() {
  const { language, tDual } = useLanguage();
  const { currency } = useCurrency();
  const isTg = language === "tg";

  // Data
  const allProperties = useMemo(() => getAllMapProperties(), []);

  // Filter & UI State
  const [activeCityId, setActiveCityId] = useState("khujand");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "complex" | "apartment" | "house"
  >("all");
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "area-desc"
  >("default");

  // Advanced Stage 5 Filters
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [areaMin, setAreaMin] = useState<number | null>(null);
  const [areaMax, setAreaMax] = useState<number | null>(null);
  const [selectedStage, setSelectedStage] = useState<"all" | "ready" | "building">(
    "all"
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [radiusKm, setRadiusKm] = useState<number | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Selection & View State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  const carouselRef = useRef<HTMLDivElement>(null);

  // Count active filters (beyond city preset)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedRooms !== null) count++;
    if (priceMin !== null || priceMax !== null) count++;
    if (areaMin !== null || areaMax !== null) count++;
    if (selectedStage !== "all") count++;
    if (radiusKm !== null && userLocation !== null) count++;
    return count;
  }, [
    selectedCategory,
    selectedRooms,
    priceMin,
    priceMax,
    areaMin,
    areaMax,
    selectedStage,
    radiusKm,
    userLocation,
  ]);

  // Read URL query parameters on initial mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const city = params.get("city");
    const type = params.get("type");
    const rooms = params.get("rooms");
    const sort = params.get("sort");
    const pMin = params.get("minPrice");
    const pMax = params.get("maxPrice");
    const aMin = params.get("minArea");
    const aMax = params.get("maxArea");
    const stage = params.get("stage");
    const rad = params.get("radius");

    if (city && SOGD_MAP_PRESETS.some((p) => p.id === city)) setActiveCityId(city);
    if (type && ["all", "complex", "apartment", "house"].includes(type)) {
      setSelectedCategory(type as any);
    }
    if (rooms) setSelectedRooms(Number(rooms));
    if (sort && ["default", "price-asc", "price-desc", "area-desc"].includes(sort)) {
      setSortBy(sort as any);
    }
    if (pMin) setPriceMin(Number(pMin));
    if (pMax) setPriceMax(Number(pMax));
    if (aMin) setAreaMin(Number(aMin));
    if (aMax) setAreaMax(Number(aMax));
    if (stage && ["all", "ready", "building"].includes(stage)) {
      setSelectedStage(stage as any);
    }
    if (rad) setRadiusKm(Number(rad));
  }, []);

  // Update URL query parameters on state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (activeCityId !== "khujand") params.set("city", activeCityId);
    if (selectedCategory !== "all") params.set("type", selectedCategory);
    if (selectedRooms !== null) params.set("rooms", String(selectedRooms));
    if (sortBy !== "default") params.set("sort", sortBy);
    if (priceMin !== null) params.set("minPrice", String(priceMin));
    if (priceMax !== null) params.set("maxPrice", String(priceMax));
    if (areaMin !== null) params.set("minArea", String(areaMin));
    if (areaMax !== null) params.set("maxArea", String(areaMax));
    if (selectedStage !== "all") params.set("stage", selectedStage);
    if (radiusKm !== null) params.set("radius", String(radiusKm));

    const queryString = params.toString();
    const newUrl = queryString ? `/map?${queryString}` : "/map";
    window.history.replaceState(null, "", newUrl);
  }, [
    activeCityId,
    selectedCategory,
    selectedRooms,
    sortBy,
    priceMin,
    priceMax,
    areaMin,
    areaMax,
    selectedStage,
    radiusKm,
  ]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return allProperties.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // 2. City Filter (unless all-sughd)
      if (activeCityId !== "all-sughd") {
        if (
          activeCityId === "khujand" &&
          !item.city.toLowerCase().includes("худжанд") &&
          !item.city.toLowerCase().includes("хуҷанд")
        ) {
          return false;
        }
        if (
          activeCityId === "guliston" &&
          !item.city.toLowerCase().includes("гулистон") &&
          !item.city.toLowerCase().includes("қайроққум") &&
          !item.district.toLowerCase().includes("таджикского моря") &&
          !item.district.toLowerCase().includes("баҳри тоҷик")
        ) {
          return false;
        }
        if (
          activeCityId === "gafurov" &&
          !item.city.toLowerCase().includes("ғафуров") &&
          !item.city.toLowerCase().includes("гафуров") &&
          !item.district.toLowerCase().includes("ғафуров")
        ) {
          return false;
        }
        if (
          activeCityId === "istaravshan" &&
          !item.city.toLowerCase().includes("истаравшан")
        ) {
          return false;
        }
      }

      // 3. Rooms Filter
      if (selectedRooms !== null) {
        if (selectedRooms >= 4) {
          if (!item.rooms || item.rooms < 4) return false;
        } else {
          if (item.rooms !== selectedRooms) return false;
        }
      }

      // 4. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle =
          item.title.toLowerCase().includes(query) ||
          (item.titleTg && item.titleTg.toLowerCase().includes(query));
        const matchDistrict =
          item.district.toLowerCase().includes(query) ||
          (item.districtTg && item.districtTg.toLowerCase().includes(query));
        const matchCity =
          item.city.toLowerCase().includes(query) ||
          (item.cityTg && item.cityTg.toLowerCase().includes(query));
        if (!matchTitle && !matchDistrict && !matchCity) return false;
      }

      // 5. Budget Filter (USD or TJS)
      const currentPrice = currency === "USD" ? item.priceUsd : item.priceTjs;
      if (priceMin !== null && currentPrice < priceMin) return false;
      if (priceMax !== null && currentPrice > priceMax) return false;

      // 6. Area Filter (m²)
      if (areaMin !== null && item.areaM2 < areaMin) return false;
      if (areaMax !== null && item.areaM2 > areaMax) return false;

      // 7. Stage Filter (for residential complexes)
      if (selectedStage !== "all" && item.category === "complex") {
        if (selectedStage === "ready" && item.stage !== "Сдан") return false;
        if (selectedStage === "building" && item.stage !== "Строится") return false;
      }

      // 8. Radius Filter from User Location
      if (userLocation && radiusKm !== null && radiusKm > 0) {
        const dist = calculateDistanceKm(userLocation, {
          lat: item.lat,
          lng: item.lng,
        });
        if (dist > radiusKm) return false;
      }

      return true;
    });
  }, [
    allProperties,
    selectedCategory,
    activeCityId,
    selectedRooms,
    searchQuery,
    currency,
    priceMin,
    priceMax,
    areaMin,
    areaMax,
    selectedStage,
    userLocation,
    radiusKm,
  ]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const list = [...filteredProperties];
    if (sortBy === "price-asc") {
      list.sort((a, b) =>
        currency === "USD" ? a.priceUsd - b.priceUsd : a.priceTjs - b.priceTjs
      );
    } else if (sortBy === "price-desc") {
      list.sort((a, b) =>
        currency === "USD" ? b.priceUsd - a.priceUsd : b.priceTjs - a.priceTjs
      );
    } else if (sortBy === "area-desc") {
      list.sort((a, b) => b.areaM2 - a.areaM2);
    }
    return list;
  }, [filteredProperties, sortBy, currency]);

  const selectedProperty = useMemo(() => {
    return allProperties.find((p) => p.id === selectedPropertyId) || null;
  }, [allProperties, selectedPropertyId]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSelectedRooms(null);
    setSearchQuery("");
    setPriceMin(null);
    setPriceMax(null);
    setAreaMin(null);
    setAreaMax(null);
    setSelectedStage("all");
    setRadiusKm(null);
    setSortBy("default");
    setSelectedPropertyId(null);
  };

  // Scroll left desktop list to selected item
  useEffect(() => {
    if (selectedPropertyId) {
      const cardEl = document.getElementById(`property-card-${selectedPropertyId}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      // Also scroll mobile carousel
      const carouselEl = document.getElementById(
        `carousel-card-${selectedPropertyId}`
      );
      if (carouselEl) {
        carouselEl.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [selectedPropertyId]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-50">
      {/* Top Filter Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 z-30 shrink-0">
        <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          {/* City Presets Chips */}
          <div className="flex items-center gap-1.5 shrink-0">
            {SOGD_MAP_PRESETS.map((preset) => {
              const isActive = activeCityId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActiveCityId(preset.id);
                    setSelectedPropertyId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {isTg ? preset.nameTg : preset.nameRu}
                </button>
              );
            })}
          </div>

          {/* Quick Category Filters & Advanced Modal Trigger */}
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: "all", labelRu: "Все объекты", labelTg: "Ҳама" },
              { id: "complex", labelRu: "🏢 Новостройки", labelTg: "🏢 МҶ Нав" },
              { id: "apartment", labelRu: "🏠 Вторичка", labelTg: "🏠 Хонадонҳо" },
              { id: "house", labelRu: "🏡 Ҳавлӣ", labelTg: "🏡 Ҳавлиҳо" },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setSelectedPropertyId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white"
                  }`}
                >
                  {isTg ? cat.labelTg : cat.labelRu}
                </button>
              );
            })}

            {/* Advanced Filters Modal Button */}
            <button
              onClick={() => setShowFiltersModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                activeFiltersCount > 0
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700 bg-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isTg ? "Филтрҳо" : "Фильтры"}</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile View Toggle Button */}
          <div className="md:hidden shrink-0">
            <button
              onClick={() => setMobileView(mobileView === "map" ? "list" : "map")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {mobileView === "map" ? (
                <>
                  <List className="w-3.5 h-3.5" />
                  <span>
                    {isTg
                      ? `Рӯйхат (${sortedProperties.length})`
                      : `Списком (${sortedProperties.length})`}
                  </span>
                </>
              ) : (
                <>
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>{isTg ? "Дар харита" : "На карте"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Desktop Split-View (List 40% / Map 60%) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Properties List (Desktop) */}
        <div
          className={`w-full md:w-[420px] lg:w-[460px] xl:w-[490px] shrink-0 bg-white border-r border-slate-200 flex flex-col z-20 transition-all ${
            mobileView === "list" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Search, Sort & Rooms Bar */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/60 space-y-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  isTg
                    ? "Ҷустуҷӯ аз рӯи микрорайон, кӯча..."
                    : "Поиск по микрорайону, улице..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Room Selector & Sort Row */}
            <div className="flex items-center justify-between gap-2">
              {/* Room Selector Chips */}
              <div className="flex items-center gap-1">
                {[
                  { val: null, label: isTg ? "Ҳама" : "Все" },
                  { val: 1, label: "1" },
                  { val: 2, label: "2" },
                  { val: 3, label: "3" },
                  { val: 4, label: "4+" },
                ].map((r) => {
                  const isActive = selectedRooms === r.val;
                  return (
                    <button
                      key={String(r.val)}
                      onClick={() => setSelectedRooms(r.val)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-600 text-white"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="default">{isTg ? "Стандартӣ" : "По умолчанию"}</option>
                  <option value="price-asc">{isTg ? "Арзонтар" : "Сначала дешевле"}</option>
                  <option value="price-desc">{isTg ? "Гаронтар" : "Сначала дороже"}</option>
                  <option value="area-desc">{isTg ? "Масоҳат" : "По площади"}</option>
                </select>
              </div>
            </div>

            {/* Results counter & Active Filters Badges */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
              <span>
                {isTg
                  ? `${sortedProperties.length} амвол дар харита ёфт шуд`
                  : `Найдено ${sortedProperties.length} объектов на карте`}
              </span>
              {(selectedPropertyId || activeFiltersCount > 0) && (
                <button
                  onClick={resetAllFilters}
                  className="text-emerald-600 hover:underline text-[11px] font-bold cursor-pointer"
                >
                  {isTg ? "Тоза кардани ҳама" : "Сбросить фильтры"}
                </button>
              )}
            </div>
          </div>

          {/* Cards Scrollable Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
            {sortedProperties.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-700">
                  {isTg ? "Ҳеҷ чиз ёфт нашуд" : "Ничего не найдено"}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {isTg
                    ? "Филтрҳоро тағйир диҳед ё тоза кунед"
                    : "Попробуйте изменить или сбросить фильтры"}
                </div>
                <button
                  onClick={resetAllFilters}
                  className="mt-3 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {isTg ? "Сброси филтрҳо" : "Сбросить все"}
                </button>
              </div>
            ) : (
              sortedProperties.map((prop) => {
                const isSelected = prop.id === selectedPropertyId;
                const isHovered = prop.id === hoveredPropertyId;

                const primaryPrice =
                  currency === "USD"
                    ? `$${prop.priceUsd.toLocaleString()}`
                    : `${prop.priceTjs.toLocaleString()} TJS`;

                const secondaryPrice =
                  currency === "USD"
                    ? `${prop.priceTjs.toLocaleString()} TJS`
                    : `$${prop.priceUsd.toLocaleString()}`;

                const title = isTg && prop.titleTg ? prop.titleTg : prop.title;
                const district = isTg && prop.districtTg ? prop.districtTg : prop.district;

                let categoryBadge = "ЖК";
                let categoryBg = "bg-emerald-600";
                if (prop.category === "apartment") {
                  categoryBadge = `${prop.rooms || 1}-комн.`;
                  categoryBg = "bg-sky-600";
                } else if (prop.category === "house") {
                  categoryBadge = "Ҳавлӣ";
                  categoryBg = "bg-amber-600";
                }

                return (
                  <div
                    key={prop.id}
                    id={`property-card-${prop.id}`}
                    onMouseEnter={() => setHoveredPropertyId(prop.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                    onClick={() => {
                      setSelectedPropertyId(prop.id);
                      if (typeof window !== "undefined" && window.innerWidth < 768) {
                        setMobileView("map");
                      }
                    }}
                    className={`pt-2.5 first:pt-0 cursor-pointer rounded-xl transition-all ${
                      isSelected
                        ? "bg-emerald-50/90 ring-2 ring-emerald-500 p-2.5 shadow-sm"
                        : isHovered
                        ? "bg-slate-50 p-2.5"
                        : "p-2 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Image Thumbnail */}
                      <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <img
                          src={prop.coverImage}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase text-white ${categoryBg}`}
                          >
                            {categoryBadge}
                          </span>
                        </div>
                      </div>

                      {/* Info Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="text-[11px] text-slate-500 font-medium truncate">
                            📍 {district}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                            {title}
                          </h4>
                          <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {prop.category === "house"
                              ? `${prop.rooms || 0} комн. · ${
                                  prop.landAreaSotki || "6"
                                } сот.`
                              : `${prop.rooms || 0} комн. · ${prop.areaM2} м²`}
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-sm font-extrabold text-emerald-600">
                            {primaryPrice}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {secondaryPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        <div
          className={`flex-1 h-full relative ${
            mobileView === "map" ? "flex" : "hidden md:flex"
          }`}
        >
          <InteractiveMapWrapper
            properties={sortedProperties}
            selectedPropertyId={selectedPropertyId}
            hoveredPropertyId={hoveredPropertyId}
            onSelectProperty={(prop) => setSelectedPropertyId(prop.id)}
            activePresetId={activeCityId}
            currency={currency}
            language={language}
            userLocation={userLocation}
            radiusKm={radiusKm}
            onLocateUser={(coords) => setUserLocation(coords)}
            className="w-full h-full"
          />

          {/* Mobile Bottom Sheet: Floating Interactive Carousel & Detail Card */}
          <div className="md:hidden absolute bottom-3 left-2 right-2 z-30">
            {selectedProperty ? (
              // Selected Single Property Card
              <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    <img
                      src={selectedProperty.coverImage}
                      alt={selectedProperty.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {selectedProperty.city} · {selectedProperty.district}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {isTg && selectedProperty.titleTg
                          ? selectedProperty.titleTg
                          : selectedProperty.title}
                      </h4>
                      <div className="text-sm font-extrabold text-emerald-600 mt-1">
                        {currency === "USD"
                          ? `$${selectedProperty.priceUsd.toLocaleString()}`
                          : `${selectedProperty.priceTjs.toLocaleString()} TJS`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPropertyId(null)}
                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                  <Link
                    href={selectedProperty.url}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>{isTg ? "Муфассал" : "Подробнее"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={generateYandexMapsRouteUrl(
                      selectedProperty.lat,
                      selectedProperty.lng
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-red-500" />
                    <span>{isTg ? "Хатсайр" : "Маршрут"}</span>
                  </a>
                </div>
              </div>
            ) : (
              // Swipeable Horizontal Bottom Carousel
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-2.5">
                <div className="flex items-center justify-between px-1.5 mb-2">
                  <span className="text-[11px] font-bold text-slate-600">
                    📍{" "}
                    {isTg
                      ? `${sortedProperties.length} объект дар харита`
                      : `${sortedProperties.length} объектов на карте`}
                  </span>
                  <button
                    onClick={() => setMobileView("list")}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    {isTg ? "Ҳамааш дар рӯйхат" : "Показать списком"}
                  </button>
                </div>

                <div
                  ref={carouselRef}
                  className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-0.5"
                >
                  {sortedProperties.slice(0, 15).map((prop) => {
                    const title = isTg && prop.titleTg ? prop.titleTg : prop.title;
                    const price =
                      currency === "USD"
                        ? `$${prop.priceUsd.toLocaleString()}`
                        : `${(prop.priceTjs / 1000).toFixed(0)} тыс. TJS`;

                    return (
                      <div
                        key={prop.id}
                        id={`carousel-card-${prop.id}`}
                        onClick={() => setSelectedPropertyId(prop.id)}
                        className="w-56 shrink-0 snap-start bg-slate-50 hover:bg-emerald-50/50 p-2 rounded-xl border border-slate-200/80 cursor-pointer transition-all"
                      >
                        <div className="flex gap-2 items-center">
                          <img
                            src={prop.coverImage}
                            alt={title}
                            className="w-14 h-14 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-bold text-slate-900 truncate">
                              {title}
                            </h5>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              {prop.district}
                            </div>
                            <div className="text-xs font-black text-emerald-600 mt-1">
                              {price}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal (Stage 5) */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {isTg ? "Филтрҳои пешрафта" : "Расширенные фильтры"}
                </h3>
              </div>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* 1. Price Budget Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {isTg ? `Буҷет (${currency})` : `Бюджет (${currency})`}
                </label>
                <div className="grid grid-cols-2 gap-2.5 mb-2">
                  <div>
                    <input
                      type="number"
                      placeholder={isTg ? "Аз" : "От"}
                      value={priceMin ?? ""}
                      onChange={(e) =>
                        setPriceMin(e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder={isTg ? "То" : "До"}
                      value={priceMax ?? ""}
                      onChange={(e) =>
                        setPriceMax(e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Quick budget chips */}
                <div className="flex flex-wrap gap-1.5">
                  {(currency === "USD"
                    ? [
                        { label: "до $40k", max: 40000 },
                        { label: "до $70k", max: 70000 },
                        { label: "до $120k", max: 120000 },
                        { label: "от $120k", min: 120000 },
                      ]
                    : [
                        { label: "то 400 ҳ.", max: 400000 },
                        { label: "то 800 ҳ.", max: 800000 },
                        { label: "то 1.3 млн", max: 1300000 },
                        { label: "аз 1.3 млн", min: 1300000 },
                      ]
                  ).map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (preset.max) setPriceMax(preset.max);
                        if (preset.min) setPriceMin(preset.min);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Area Range (m²) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {isTg ? "Масоҳат (м²)" : "Площадь (м²)"}
                </label>
                <div className="grid grid-cols-2 gap-2.5 mb-2">
                  <input
                    type="number"
                    placeholder={isTg ? "Аз м²" : "От м²"}
                    value={areaMin ?? ""}
                    onChange={(e) =>
                      setAreaMin(e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder={isTg ? "То м²" : "До м²"}
                    value={areaMax ?? ""}
                    onChange={(e) =>
                      setAreaMax(e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "до 50 м²", max: 50 },
                    { label: "50–80 м²", min: 50, max: 80 },
                    { label: "80–120 м²", min: 80, max: 120 },
                    { label: "от 120 м²", min: 120 },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAreaMin(preset.min ?? null);
                        setAreaMax(preset.max ?? null);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Construction Stage (for residential complexes) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {isTg ? "Марҳилаи сохтмон" : "Этап строительства (ЖК)"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "all", labelRu: "Все", labelTg: "Ҳама" },
                    { id: "ready", labelRu: "Сдан", labelTg: "Сдан" },
                    { id: "building", labelRu: "Строится", labelTg: "Строится" },
                  ].map((stage) => {
                    const isActive = selectedStage === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => setSelectedStage(stage.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {isTg ? stage.labelTg : stage.labelRu}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Radius Search from User Location */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isTg ? "Ҷустуҷӯ аз рӯи радиус" : "Поиск по радиусу от меня"}
                  </label>
                  {userLocation && (
                    <span className="text-[11px] font-semibold text-emerald-600">
                      📍 {isTg ? "Макон фаъол" : "Геопозиция определена"}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: null, label: isTg ? "Ҳама" : "Любой" },
                    { val: 2, label: "2 км" },
                    { val: 5, label: "5 км" },
                    { val: 10, label: "10 км" },
                  ].map((rad) => {
                    const isActive = radiusKm === rad.val;
                    return (
                      <button
                        key={String(rad.val)}
                        onClick={() => setRadiusKm(rad.val)}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {rad.label}
                      </button>
                    );
                  })}
                </div>

                {!userLocation && (
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    {isTg
                      ? "Барои филтр аз рӯи радиус тугмаи геолокатсияро дар харита пахш кунед"
                      : "Для радиуса включите кнопку геолокации 📍 на карте"}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isTg ? "Тоза кардан" : "Сбросить"}</span>
              </button>

              <button
                onClick={() => setShowFiltersModal(false)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                {isTg
                  ? `Нишон додани ${filteredProperties.length} амвол`
                  : `Показать ${filteredProperties.length} объектов`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
