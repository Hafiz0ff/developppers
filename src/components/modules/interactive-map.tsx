"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  MapPropertyItem,
  BoundingBox,
  CityMapPreset,
  getCityMapPreset,
  generateYandexMapsRouteUrl,
  generateGoogleMapsUrl,
  clusterMapProperties,
  formatPriceShort,
  MapCluster,
  MapPinOrCluster,
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
  userLocation?: { lat: number; lng: number } | null;
  radiusKm?: number | null;
  onLocateUser?: (coords: { lat: number; lng: number }) => void;
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
  userLocation,
  radiusKm,
  onLocateUser,
}: InteractiveMapProps) {
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);

  const [tileMode, setTileMode] = useState<"street" | "google" | "satellite" | "hybrid">("street");
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

      // Google Maps Roadmap Layer (Crisp, bilingual, high-res)
      const streetLayer = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        {
          maxZoom: 20,
          subdomains: ["0", "1", "2", "3"],
        }
      );

      streetLayer.addTo(map);
      tileLayerRef.current = streetLayer;

      // Attribution control in bottom-right
      L.control
        .attribution({ position: "bottomright", prefix: false })
        .addAttribution(
          '&copy; <a href="https://maps.google.com/" target="_blank" rel="noopener noreferrer">Google Maps</a>'
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
      // Google Maps Roadmap (Clean, sharp streets and labels, no watermarks)
      const streetLayer = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        { maxZoom: 20, subdomains: ["0", "1", "2", "3"] }
      );
      streetLayer.addTo(map);
      tileLayerRef.current = streetLayer;
    } else if (tileMode === "google" || tileMode === "hybrid") {
      // Google Hybrid (High-Resolution Satellite + Roads & Place Names, no watermarks)
      const googleLayer = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          maxZoom: 20,
          subdomains: ["0", "1", "2", "3"],
        }
      );
      googleLayer.addTo(map);
      tileLayerRef.current = googleLayer;
    } else if (tileMode === "satellite") {
      // Google Satellite (Pure High-Resolution Satellite, no watermarks)
      const satLayer = L.tileLayer(
        "https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        { maxZoom: 20, subdomains: ["0", "1", "2", "3"] }
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

  // Render Markers and Clusters
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Group properties into clusters or standalone pins based on current zoom
    const mapItems: MapPinOrCluster[] = clusterMapProperties(properties, currentZoom);

    mapItems.forEach((item) => {
      if (item.isCluster) {
        // --- CLUSTER PIN ---
        const minPriceFormatted = formatPriceShort(
          item.minPriceUsd,
          item.minPriceTjs,
          currency,
          language
        );

        const clusterHtml = `
          <div class="group relative cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl border-2 border-white text-xs font-bold backdrop-blur-md">
              <span class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black shadow-sm text-white">
                ${item.count}
              </span>
              <span>${isTg ? "аз" : "от"} ${minPriceFormatted}</span>
            </div>
            <div class="w-2.5 h-2.5 bg-slate-900 rotate-45 mx-auto -mt-1 shadow-sm border-r border-b border-white"></div>
          </div>
        `;

        const clusterIcon = L.divIcon({
          html: clusterHtml,
          className: "custom-map-cluster-pin",
          iconSize: [120, 36],
          iconAnchor: [60, 36],
          popupAnchor: [0, -36],
        });

        const clusterMarker = L.marker([item.lat, item.lng], { icon: clusterIcon });

        // Click on cluster: zoom in and center
        clusterMarker.on("click", () => {
          if (map.getZoom() < 15) {
            map.flyTo([item.lat, item.lng], Math.min(map.getZoom() + 2, 16), {
              duration: 0.6,
            });
          }
        });

        // If zoom is high (zoom >= 14) and properties are still in cluster, show list popup
        const clusterListHtml = `
          <div class="w-72 sm:w-80 p-0 overflow-hidden font-sans">
            <div class="bg-slate-900 text-white px-3.5 py-2.5 flex items-center justify-between">
              <div class="text-xs font-bold flex items-center gap-1.5">
                <span>📍</span>
                <span>${isTg ? "Объектҳо дар ин ҷо" : "Объекты в этой локации"}</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                ${item.count}
              </span>
            </div>
            <div class="max-h-64 overflow-y-auto divide-y divide-slate-100 p-2 space-y-2">
              ${item.properties
                .map((p) => {
                  const pTitle = isTg && p.titleTg ? p.titleTg : p.title;
                  const pPrice =
                    currency === "USD"
                      ? `$${p.priceUsd.toLocaleString()}`
                      : `${(p.priceTjs / 1000).toFixed(0)} тыс. TJS`;
                  return `
                    <a href="${p.url}" class="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors group">
                      <img src="${p.coverImage}" alt="${pTitle}" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div class="min-w-0 flex-1">
                        <div class="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                          ${pTitle}
                        </div>
                        <div class="text-[11px] font-extrabold text-emerald-600">
                          ${pPrice}
                        </div>
                      </div>
                    </a>
                  `;
                })
                .join("")}
            </div>
          </div>
        `;

        clusterMarker.bindPopup(clusterListHtml, {
          maxWidth: 320,
          className: "custom-leaflet-popup",
        });

        markersLayer.addLayer(clusterMarker);
      } else {
        // --- STANDALONE PROPERTY PIN ---
        const prop = item.property;
        const isSelected = prop.id === selectedPropertyId;
        const isHovered = prop.id === hoveredPropertyId;

        // Color scheme and badge based on category
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

        const priceText = formatPriceShort(
          prop.priceUsd,
          prop.priceTjs,
          currency,
          language
        );

        const badgeLabel = isTg ? categoryBadgeTg : categoryBadge;

        // Pin HTML
        const pinHtml = `
          <div class="group relative cursor-pointer transition-all duration-200 ${
            isSelected ? "scale-115 z-50 -translate-y-1" : isHovered ? "scale-110 z-40 -translate-y-0.5" : "scale-100 z-10"
          }">
            <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg border border-white/95 text-white font-bold text-xs tracking-tight ${categoryBg} ${
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
        const googleRouteUrl = generateGoogleMapsUrl(prop.lat, prop.lng);

        const specsLabel = prop.category === "house"
          ? `${prop.rooms || 0} ${isTg ? "ҳуҷра" : "комн."} · ${prop.landAreaSotki || "6"} сот.`
          : `${prop.rooms || 0} ${isTg ? "ҳуҷра" : "комн."} · ${prop.areaM2} м²`;

        const cleanPhone = prop.phone.replace(/[^0-9+]/g, "");
        const cleanWa = (prop.whatsapp || prop.phone).replace(/[^0-9]/g, "");

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
              <div class="text-xs text-slate-600 font-medium pb-2.5 mb-2.5 border-b border-slate-100 flex items-center gap-2">
                <span>📐 ${specsLabel}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 mb-2">
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
                  class="flex items-center justify-center gap-1 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  title="${isTg ? "Хатсайр дар Харитаи Яндекс" : "Маршрут в Яндекс.Картах"}"
                >
                  <svg class="w-3.5 h-3.5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                  <span>Яндекс</span>
                </a>
              </div>
              <div class="flex items-center gap-1.5">
                <a 
                  href="tel:${cleanPhone}" 
                  class="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors"
                >
                  <svg class="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>${isTg ? "Занг" : "Звонок"}</span>
                </a>
                <a 
                  href="${googleRouteUrl}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors"
                  title="Google Maps"
                >
                  <svg class="w-3 h-3 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Google</span>
                </a>
                <a 
                  href="https://wa.me/${cleanWa}" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold border border-emerald-200 transition-colors"
                >
                  <svg class="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  <span>WhatsApp</span>
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
      }
    });
  }, [properties, selectedPropertyId, hoveredPropertyId, currency, language, currentZoom]);

  // Handle Radius Circle Visualizer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (radiusCircleRef.current) {
      radiusCircleRef.current.remove();
      radiusCircleRef.current = null;
    }

    if (userLocation && radiusKm && radiusKm > 0) {
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: radiusKm * 1000,
        color: "#059669",
        fillColor: "#10b981",
        fillOpacity: 0.12,
        weight: 2,
        dashArray: "6, 6",
      }).addTo(map);

      radiusCircleRef.current = circle;
    }
  }, [userLocation, radiusKm]);

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

        // Notify parent callback
        if (onLocateUser) {
          onLocateUser({ lat: latitude, lng: longitude });
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
                tileMode === "hybrid" || tileMode === "google"
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
