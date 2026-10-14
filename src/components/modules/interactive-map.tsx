"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  MapPropertyItem,
  BoundingBox,
  CityMapPreset,
  getCityMapPreset,
  generateYandexMapsRouteUrl,
} from "@/lib/geo-utils";
import {
  Layers,
  Locate,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  ExternalLink,
  Phone,
  Navigation,
  Compass,
} from "lucide-react";

export interface InteractiveMapProps {
  properties: MapPropertyItem[];
  selectedPropertyId?: string | null;
  hoveredPropertyId?: string | null;
  onSelectProperty?: (property: MapPropertyItem) => void;
  activePresetId?: string;
  currency?: "TJS" | "USD";
  language?: "ru" | "tg";
  className?: string;
  showControls?: boolean;
  onBoundsChange?: (bounds: BoundingBox, visibleItems: MapPropertyItem[]) => void;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export function InteractiveMap({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  onSelectProperty,
  activePresetId = "khujand",
  currency = "USD",
  language = "ru",
  className = "w-full h-full min-h-[500px]",
  showControls = true,
  onBoundsChange,
  defaultCenter,
  defaultZoom,
}: InteractiveMapProps) {
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);

  const [tileMode, setTileMode] = useState<"street" | "hybrid" | "satellite">("street");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(defaultZoom || 13);

  const isTg = language === "tg";

  // Initial Map Setup
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const preset = getCityMapPreset(activePresetId);
      const initialCenter = defaultCenter || preset.center;
      const initialZoom = defaultZoom || preset.zoom;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false, // We use custom styled controls
        attributionControl: false,
      });

      // CartoDB Voyager Tile Layer (Crisp, bilingual)
      const streetLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      );

      streetLayer.addTo(map);
      tileLayerRef.current = streetLayer;

      // Attribution control in bottom-right
      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addAttribution(
          '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>'
        )
        .addTo(map);

      // Metric scale control in bottom-left
      L.control
        .scale({
          metric: true,
          imperial: false,
          position: "bottomleft",
        })
        .addTo(map);

      // Markers Layer Group
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Track zoom level
      map.on("zoomend", () => {
        setCurrentZoom(map.getZoom());
      });

      // Track moveend / bounds
      map.on("moveend", () => {
        if (onBoundsChange) {
          const bounds = map.getBounds();
          const bbox: BoundingBox = {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          };
          const visible = properties.filter(
            (p) =>
              p.lat <= bbox.north &&
              p.lat >= bbox.south &&
              p.lng <= bbox.east &&
              p.lng >= bbox.west
          );
          onBoundsChange(bbox, visible);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Fullscreen state change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    };

    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const wrapper = mapWrapperRef.current;
    if (!wrapper) return;

    if (!document.fullscreenElement) {
      wrapper.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Handle Tile Mode (Street vs Hybrid vs Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
      tileLayerRef.current = null;
    }
    if (labelLayerRef.current) {
      labelLayerRef.current.remove();
      labelLayerRef.current = null;
    }

    if (tileMode === "street") {
      const streetLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, subdomains: "abcd" }
      );
      streetLayer.addTo(map);
      tileLayerRef.current = streetLayer;
    } else if (tileMode === "hybrid") {
      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18 }
      );
      satLayer.addTo(map);
      tileLayerRef.current = satLayer;

      const labelLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, subdomains: "abcd", pane: "overlayPane" }
      );
      labelLayer.addTo(map);
      labelLayerRef.current = labelLayer;
    } else if (tileMode === "satellite") {
      const satLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18 }
      );
      satLayer.addTo(map);
      tileLayerRef.current = satLayer;
    }
  }, [tileMode]);

  // Handle City Preset Changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activePresetId) return;

    const preset = getCityMapPreset(activePresetId);
    map.flyTo(preset.center, preset.zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [activePresetId]);

  // Handle Selected Property FlyTo
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPropertyId) return;

    const selectedProp = properties.find((p) => p.id === selectedPropertyId);
    if (selectedProp) {
      map.flyTo([selectedProp.lat, selectedProp.lng], Math.max(map.getZoom(), 15), {
        duration: 0.8,
      });
    }
  }, [selectedPropertyId, properties]);

  // Render Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    properties.forEach((prop) => {
      const isSelected = prop.id === selectedPropertyId;
      const isHovered = prop.id === hoveredPropertyId;

      // Color scheme based on category
      let categoryBg = "bg-emerald-600";
      let categoryBadge = "ЖК";
      let categoryBadgeTg = "МҶ";

      if (prop.category === "apartment") {
        categoryBg = "bg-sky-600";
        categoryBadge = `${prop.rooms || 1}-к`;
        categoryBadgeTg = `${prop.rooms || 1}-ҳ`;
      } else if (prop.category === "house") {
        categoryBg = "bg-amber-600";
        categoryBadge = "Ҳавлӣ";
        categoryBadgeTg = "Ҳавлӣ";
      } else if (prop.category === "commercial") {
        categoryBg = "bg-purple-600";
        categoryBadge = "Коммерция";
        categoryBadgeTg = "Тиҷоратӣ";
      }

      // Price Formatting
      const priceText =
        currency === "USD"
          ? `$${prop.priceUsd.toLocaleString()}`
          : `${(prop.priceTjs / 1000).toFixed(0)} тыс. TJS`;

      const badgeLabel = isTg ? categoryBadgeTg : categoryBadge;

      // Pin HTML
      const pinHtml = `
        <div class="group relative cursor-pointer transition-all duration-200 ${
          isSelected ? "scale-110 z-50" : isHovered ? "scale-105 z-40" : "scale-100 z-10"
        }">
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg border border-white/90 text-white font-bold text-xs tracking-tight ${categoryBg} ${
            isSelected
              ? "ring-4 ring-emerald-400 ring-offset-2 ring-offset-white shadow-2xl scale-105"
              : isHovered
              ? "shadow-xl ring-2 ring-white"
              : ""
          }">
            <span class="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-black/20">
              ${badgeLabel}
            </span>
            <span>${priceText}</span>
          </div>
          <div class="w-2 h-2 ${categoryBg} rotate-45 mx-auto -mt-1 shadow-sm border-r border-b border-white"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: "custom-map-pin",
        iconSize: [110, 36],
        iconAnchor: [55, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon });

      // Build rich popup HTML
      const title = isTg && prop.titleTg ? prop.titleTg : prop.title;
      const district = isTg && prop.districtTg ? prop.districtTg : prop.district;
      const primaryPrice =
        currency === "USD"
          ? `$${prop.priceUsd.toLocaleString()}`
          : `${prop.priceTjs.toLocaleString()} TJS`;
      const secondaryPrice =
        currency === "USD"
          ? `${prop.priceTjs.toLocaleString()} TJS`
          : `$${prop.priceUsd.toLocaleString()}`;

      const yandexRouteUrl = generateYandexMapsRouteUrl(prop.lat, prop.lng);

      const specsLabel = prop.category === "house"
        ? `${prop.rooms || 0} ${isTg ? "ҳуҷра" : "комн."} · ${prop.landAreaSotki || "6"} сот.`
        : `${prop.rooms || 0} ${isTg ? "ҳуҷра" : "комн."} · ${prop.areaM2} м²`;

      const popupHtml = `
        <div class="w-64 sm:w-72 p-0 overflow-hidden font-sans">
          <div class="relative h-32 w-full bg-slate-100">
            <img src="${prop.coverImage}" alt="${title}" class="w-full h-full object-cover" />
            <div class="absolute top-2 left-2">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white ${categoryBg}">
                ${badgeLabel}
              </span>
            </div>
            ${
              prop.stage
                ? `<div class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium text-white">
                    ${isTg && prop.stageTg ? prop.stageTg : prop.stage}
                  </div>`
                : ""
            }
          </div>
          <div class="p-3.5">
            <div class="text-xs text-slate-500 font-medium truncate mb-1">
              📍 ${district}
            </div>
            <h4 class="text-sm font-bold text-slate-900 line-clamp-1 mb-1.5 leading-snug">
              ${title}
            </h4>
            <div class="flex items-baseline justify-between gap-2 mb-2">
              <div class="text-base font-extrabold text-emerald-600">
                ${primaryPrice}
              </div>
              <div class="text-[11px] text-slate-400 font-medium">
                ${secondaryPrice}
              </div>
            </div>
            <div class="text-xs text-slate-600 font-medium pb-3 mb-3 border-b border-slate-100 flex items-center gap-2">
              <span>📐 ${specsLabel}</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <a 
                href="${prop.url}" 
                class="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <span>${isTg ? "Муфассал" : "Подробнее"}</span>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a 
                href="${yandexRouteUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                title="${isTg ? "Хатсайр дар Харитаи Яндекс" : "Маршрут в Яндекс.Картах"}"
              >
                <span>Маршрут</span>
                <svg class="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
              </a>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 320,
        className: "custom-leaflet-popup",
      });

      marker.on("click", () => {
        if (onSelectProperty) {
          onSelectProperty(prop);
        }
      });

      markersLayer.addLayer(marker);
    });
  }, [properties, selectedPropertyId, hoveredPropertyId, currency, language]);

  // Geolocation Handler
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert(isTg ? "Ҷойгиршавӣ дастгирӣ намешавад" : "Геолокация не поддерживается вашим браузером");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const map = mapInstanceRef.current;
        if (!map) return;

        map.flyTo([latitude, longitude], 15, { duration: 1.5 });

        // Add or update user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          const userIcon = L.divIcon({
            html: `
              <div class="relative flex items-center justify-center w-6 h-6">
                <div class="absolute w-6 h-6 rounded-full bg-blue-500/30 animate-ping"></div>
                <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
              </div>
            `,
            className: "user-loc-pin",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          const marker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
          userMarkerRef.current = marker;
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn("Geolocation error:", err);
        alert(isTg ? "Муайян кардани макон муяссар нашуд" : "Не удалось определить местоположение");
      },
      { timeout: 10000 }
    );
  };

  return (
    <div
      ref={mapWrapperRef}
      className={`relative ${className} overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm`}
    >
      {/* Map DOM Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px] z-0" />

      {/* Floating Map Controls */}
      {showControls && (
        <>
          {/* Top-Right: Layer Switcher (Street / Hybrid / Satellite) */}
          <div className="absolute top-4 right-4 z-20 flex items-center bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200 text-xs font-semibold text-slate-700">
            <button
              onClick={() => setTileMode("street")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                tileMode === "street"
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isTg ? "Харита" : "Схема"}</span>
            </button>
            <button
              onClick={() => setTileMode("hybrid")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                tileMode === "hybrid"
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isTg ? "Гибрид" : "Гибрид"}</span>
            </button>
            <button
              onClick={() => setTileMode("satellite")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                tileMode === "satellite"
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isTg ? "Моҳвора" : "Спутник"}</span>
            </button>
          </div>

          {/* Bottom-Right: Zoom, Fullscreen & Geolocation Actions */}
          <div className="absolute bottom-6 right-4 z-20 flex flex-col items-center gap-2">
            <button
              onClick={toggleFullscreen}
              title={
                isFullscreen
                  ? isTg
                    ? "Баромадан аз тамоми экран"
                    : "Свернуть карту"
                  : isTg
                  ? "Тамоми экран"
                  : "На весь экран"
              }
              className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleLocateUser}
              disabled={isLocating}
              title={isTg ? "Макони ман" : "Моё местоположение"}
              className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Locate
                className={`w-5 h-5 ${
                  isLocating ? "animate-spin text-emerald-600" : ""
                }`}
              />
            </button>

            <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 overflow-hidden divide-y divide-slate-100">
              <button
                onClick={() => mapInstanceRef.current?.zoomIn()}
                title={isTg ? "Наздик кардан" : "Приблизить"}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={() => mapInstanceRef.current?.zoomOut()}
                title={isTg ? "Дур кардан" : "Отдалить"}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
