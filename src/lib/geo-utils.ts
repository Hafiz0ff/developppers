/**
 * Geo Utilities for Maskani.tj Interactive Map
 * Calculates distances, bounds, city presets, and navigation deep links
 */

import { CATALOG_PROPERTIES } from "./catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS } from "./data/mock-db";

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface CityMapPreset {
  id: string;
  nameRu: string;
  nameTg: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
}

export const SOGD_MAP_PRESETS: CityMapPreset[] = [
  {
    id: "khujand",
    nameRu: "Худжанд",
    nameTg: "Хуҷанд",
    center: [40.2825, 69.625],
    zoom: 13,
  },
  {
    id: "guliston",
    nameRu: "Гулистон (Кайраккум)",
    nameTg: "Гулистон (Қайроққум)",
    center: [40.2925, 69.795],
    zoom: 13,
  },
  {
    id: "gafurov",
    nameRu: "Б. Гафуров",
    nameTg: "Б. Ғафуров",
    center: [40.215, 69.725],
    zoom: 14,
  },
  {
    id: "istaravshan",
    nameRu: "Истаравшан",
    nameTg: "Истаравшан",
    center: [39.9142, 69.0036],
    zoom: 13,
  },
  {
    id: "dushanbe",
    nameRu: "Душанбе",
    nameTg: "Душанбе",
    center: [38.5598, 68.787],
    zoom: 12,
  },
  {
    id: "all-sughd",
    nameRu: "Весь Согд",
    nameTg: "Тамоми Суғд",
    center: [40.265, 69.66],
    zoom: 11,
  },
];

export function getCityMapPreset(presetId: string): CityMapPreset {
  const found = SOGD_MAP_PRESETS.find((p) => p.id === presetId);
  return found || SOGD_MAP_PRESETS[0]; // Default to Khujand
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  coord1: GeoCoordinates,
  coord2: GeoCoordinates
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Checks if a coordinate is within a bounding box
 */
export function isPointInBounds(
  point: GeoCoordinates,
  bounds: BoundingBox
): boolean {
  return (
    point.lat <= bounds.north &&
    point.lat >= bounds.south &&
    point.lng <= bounds.east &&
    point.lng >= bounds.west
  );
}

/**
 * Formats distance for display in Russian or Tajik
 */
export function formatDistance(
  distanceKm: number,
  language: "ru" | "tg" = "ru"
): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return language === "tg" ? `${meters} м` : `${meters} м`;
  }
  return language === "tg" ? `${distanceKm} км` : `${distanceKm} км`;
}

/**
 * Generates direct deep link to Yandex Maps with route destination
 */
export function generateYandexMapsRouteUrl(lat: number, lng: number): string {
  return `https://yandex.ru/maps/?rtext=~${lat},${lng}&rtt=auto`;
}

/**
 * Generates direct point view link in Yandex Maps
 */
export function generateYandexMapsPointUrl(lat: number, lng: number): string {
  return `https://yandex.ru/maps/?pt=${lng},${lat}&z=16&l=map`;
}

/**
 * Generates direct point view link in Google Maps
 */
export function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/**
 * Unified model for all map pins (complexes, apartments, houses)
 */
export interface MapPropertyItem {
  id: string;
  slug: string;
  title: string;
  titleTg?: string;
  category: "complex" | "apartment" | "house" | "commercial";
  dealType: "sale" | "rent";
  city: string;
  cityTg?: string;
  district: string;
  districtTg?: string;
  lat: number;
  lng: number;
  priceTjs: number;
  priceUsd: number;
  rooms?: number;
  areaM2: number;
  landAreaSotki?: string;
  floorInfo?: string;
  floorInfoTg?: string;
  coverImage: string;
  phone: string;
  whatsapp: string;
  url: string;
  developerName?: string;
  developerLogo?: string;
  stage?: string;
  stageTg?: string;
  isVerified?: boolean;
}

/**
 * Returns all normalized properties (complexes and classifieds) ready for map rendering
 */
export function getAllMapProperties(): MapPropertyItem[] {
  const items: MapPropertyItem[] = [];

  // 1. Residential Complexes (Новостройки)
  for (const project of INITIAL_PROJECTS) {
    const lat = project.coordinates?.lat ?? project.latitude;
    const lng = project.coordinates?.lng ?? project.longitude;

    if (lat && lng) {
      const dev = INITIAL_DEVELOPERS.find((d) => d.id === project.developerId);
      items.push({
        id: `project-${project.id}`,
        slug: project.slug,
        title: project.name,
        titleTg: project.nameTg || project.name,
        category: "complex",
        dealType: "sale",
        city: project.city,
        cityTg: project.city === "guliston" ? "Гулистон" : "Хуҷанд",
        district: project.district || project.address,
        districtTg: project.districtTg || project.addressTg || project.address,
        lat,
        lng,
        priceTjs: project.minTotalPriceTjs || 450000,
        priceUsd: project.minTotalPriceUsd || 41000,
        areaM2: 54, // min starting area
        rooms: 1, // starting room
        coverImage: project.coverImageUrl || project.images?.[0] || "/images/qayroqum/qayroqum-1.jpg",
        phone: dev?.phone || "+992 92 888 7766",
        whatsapp: dev?.whatsapp || "+992928887766",
        url: `/projects/${project.slug}`,
        developerName: dev?.name || "Девелопер Согда",
        developerLogo: dev?.logoUrl,
        stage: project.status === "ready" ? "Сдан" : "Строится",
        stageTg: project.status === "ready" ? "Ба истифода дода шудааст" : "Дар ҳоли сохтмон",
        isVerified: true,
      });
    }
  }

  // 2. Secondary market and traditional houses from Somon.tj
  for (const prop of CATALOG_PROPERTIES) {
    if (prop.lat && prop.lng) {
      const isHouse = prop.propertyType.toLowerCase().includes("дом") || prop.propertyType.toLowerCase().includes("ҳавлӣ");
      const category: "apartment" | "house" = isHouse ? "house" : "apartment";

      items.push({
        id: `classified-${prop.id}`,
        slug: prop.slug,
        title: prop.title,
        titleTg: prop.titleTg || prop.title,
        category,
        dealType: prop.dealType === "Аренда" ? "rent" : "sale",
        city: prop.city,
        cityTg: prop.cityTg || prop.city,
        district: prop.district,
        districtTg: prop.districtTg || prop.district,
        lat: prop.lat,
        lng: prop.lng,
        priceTjs: prop.priceTjs,
        priceUsd: prop.priceUsd,
        rooms: prop.rooms,
        areaM2: prop.area,
        landAreaSotki: prop.landArea,
        floorInfo: prop.floor,
        floorInfoTg: prop.floorTg,
        coverImage: prop.image,
        phone: prop.phone,
        whatsapp: prop.whatsapp,
        url: `/classifieds/${prop.slug}`,
        isVerified: true,
      });
    }
  }

  return items;
}
