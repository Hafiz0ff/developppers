"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { useCurrency } from "@/context/currency-context";
import {
  getAllMapProperties,
  MapPropertyItem,
  SOGD_MAP_PRESETS,
  generateYandexMapsRouteUrl,
} from "@/lib/geo-utils";
import { InteractiveMapWrapper } from "@/components/modules/interactive-map-wrapper";
import {
  Search,
  Building2,
  Home,
  MapPin,
  SlidersHorizontal,
  ChevronRight,
  List,
  Map as MapIcon,
  Phone,
  Navigation,
  Compass,
  X,
  ExternalLink,
} from "lucide-react";

export default function MapPage() {
  const { language, tDual } = useLanguage();
  const { currency } = useCurrency();
  const isTg = language === "tg";

  // Data & State
  const allProperties = useMemo(() => getAllMapProperties(), []);

  const [activeCityId, setActiveCityId] = useState("khujand");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "complex" | "apartment" | "house"
  >("all");
  const [selectedRooms, setSelectedRooms] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return allProperties.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // 2. City Filter (unless all-sughd)
      if (activeCityId !== "all-sughd") {
        if (activeCityId === "khujand" && !item.city.toLowerCase().includes("худжанд") && !item.city.toLowerCase().includes("хуҷанд")) {
          return false;
        }
        if (activeCityId === "guliston" && !item.city.toLowerCase().includes("гулистон") && !item.city.toLowerCase().includes("қайроққум") && !item.district.toLowerCase().includes("таджикского моря") && !item.district.toLowerCase().includes("баҳри тоҷик")) {
          return false;
        }
        if (activeCityId === "gafurov" && !item.city.toLowerCase().includes("ғафуров") && !item.city.toLowerCase().includes("гафуров") && !item.district.toLowerCase().includes("ғафуров")) {
          return false;
        }
        if (activeCityId === "istaravshan" && !item.city.toLowerCase().includes("истаравшан")) {
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
        const matchTitle = item.title.toLowerCase().includes(query) || (item.titleTg && item.titleTg.toLowerCase().includes(query));
        const matchDistrict = item.district.toLowerCase().includes(query) || (item.districtTg && item.districtTg.toLowerCase().includes(query));
        const matchCity = item.city.toLowerCase().includes(query) || (item.cityTg && item.cityTg.toLowerCase().includes(query));
        if (!matchTitle && !matchDistrict && !matchCity) return false;
      }

      return true;
    });
  }, [allProperties, selectedCategory, activeCityId, selectedRooms, searchQuery]);

  const selectedProperty = useMemo(() => {
    return allProperties.find((p) => p.id === selectedPropertyId) || null;
  }, [allProperties, selectedPropertyId]);

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

          {/* Quick Category Filters */}
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
                  <span>{isTg ? `Рӯйхат (${filteredProperties.length})` : `Списком (${filteredProperties.length})`}</span>
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

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Column: Properties List (Desktop) */}
        <div
          className={`w-full md:w-[420px] lg:w-[460px] xl:w-[490px] shrink-0 bg-white border-r border-slate-200 flex flex-col z-20 transition-all ${
            mobileView === "list" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Search & Rooms Filter Bar */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 space-y-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isTg ? "Ҷустуҷӯ аз рӯи микрорайон, кӯча..." : "Поиск по микрорайону, улице..."}
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

            {/* Room Selector Chips */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                {isTg ? "Ҳуҷраҳо:" : "Комнат:"}
              </span>
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

            {/* Results counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
              <span>
                {isTg
                  ? `${filteredProperties.length} амвол дар харита ёфт шуд`
                  : `Найдено ${filteredProperties.length} объектов на карте`}
              </span>
              {selectedPropertyId && (
                <button
                  onClick={() => setSelectedPropertyId(null)}
                  className="text-emerald-600 hover:underline text-[11px] font-bold"
                >
                  {isTg ? "Тоза кардани интихоб" : "Сбросить выбор"}
                </button>
              )}
            </div>
          </div>

          {/* Cards Scrollable Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100">
            {filteredProperties.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-700">
                  {isTg ? "Ҳеҷ чиз ёфт нашуд" : "Ничего не найдено"}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {isTg ? "Филтрҳоро тағйир диҳед" : "Попробуйте изменить параметры поиска"}
                </div>
              </div>
            ) : (
              filteredProperties.map((prop) => {
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
                    onMouseEnter={() => setHoveredPropertyId(prop.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                    onClick={() => {
                      setSelectedPropertyId(prop.id);
                      if (window.innerWidth < 768) {
                        setMobileView("map");
                      }
                    }}
                    className={`pt-2.5 first:pt-0 cursor-pointer rounded-xl transition-all ${
                      isSelected
                        ? "bg-emerald-50/90 ring-2 ring-emerald-500 p-2.5"
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
                              ? `${prop.rooms || 0} комн. · ${prop.landAreaSotki || "6"} сот.`
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
            properties={filteredProperties}
            selectedPropertyId={selectedPropertyId}
            hoveredPropertyId={hoveredPropertyId}
            onSelectProperty={(prop) => setSelectedPropertyId(prop.id)}
            activePresetId={activeCityId}
            currency={currency}
            language={language}
            className="w-full h-full"
          />

          {/* Mobile Bottom Sheet Card: Displays when an item is selected on mobile map view */}
          {selectedProperty && (
            <div className="md:hidden absolute bottom-4 left-3 right-3 z-30 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-3.5 animate-in fade-in slide-in-from-bottom-6 duration-300">
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
                      {isTg && selectedProperty.titleTg ? selectedProperty.titleTg : selectedProperty.title}
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
                  href={generateYandexMapsRouteUrl(selectedProperty.lat, selectedProperty.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-500" />
                  <span>{isTg ? "Хатсайр" : "Маршрут"}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
