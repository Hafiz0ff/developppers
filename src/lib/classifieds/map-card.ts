import { SOGD_CITIES } from "@/lib/constants/locations";
import type { Classified } from "@/db/schema";
import type { CatalogProperty } from "@/lib/catalog-data";
import type { FilterableClassified } from "./filters";

const DEAL_LABELS: Record<string, CatalogProperty["dealType"]> = {
  sale: "Продажа",
  rent_long: "Аренда",
  rent_daily: "Аренда",
};

const PROPERTY_LABELS: Record<string, CatalogProperty["propertyType"]> = {
  apartment: "Квартира",
  house: "Дом / Ҳавлӣ",
  commercial: "Коммерция",
  land: "Дом / Ҳавлӣ",
  garage: "Коммерция",
};

export type ClassifiedCard = CatalogProperty & {
  slug: string;
  status: string;
  viewsCount: number;
  userId: string;
};

export function toNumber(value: string | number | null | undefined): number {
  if (value == null || value === "") return 0;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

export function firstPhoto(photos: string[] | null | undefined): string {
  return photos?.[0] || "/images/hero-bg.png";
}

export function cityLabel(city: string): string {
  return SOGD_CITIES.find((c) => c.value === city)?.nameRu || city;
}

export function dealTypeLabel(dealType: string): CatalogProperty["dealType"] {
  return DEAL_LABELS[dealType] || "Продажа";
}

export function propertyTypeLabel(propertyType: string): CatalogProperty["propertyType"] {
  return PROPERTY_LABELS[propertyType] || "Квартира";
}

export function classifiedPhotos(row: Classified): string[] {
  return Array.isArray(row.photos) ? row.photos : [];
}

export function toFilterable(row: Classified): FilterableClassified {
  return {
    id: row.id,
    status: row.status,
    city: row.city,
    propertyType: row.propertyType,
    dealType: row.dealType,
    roomsCount: row.roomsCount,
    priceUsd: toNumber(row.priceUsd),
    title: row.title,
    district: row.district,
  };
}

export function mapClassifiedToCard(row: Classified): ClassifiedCard {
  const photos = classifiedPhotos(row);
  const area = toNumber(row.totalArea);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dealType: dealTypeLabel(row.dealType),
    propertyType: propertyTypeLabel(row.propertyType),
    city: cityLabel(row.city),
    district: row.district || "",
    landmark: row.landmark || "",
    rooms: row.roomsCount ?? 0,
    area,
    floor: row.floor != null ? String(row.floor) : undefined,
    landArea: row.landAreaSotka ? `${toNumber(row.landAreaSotka)} сот.` : undefined,
    priceTjs: toNumber(row.priceTjs),
    priceUsd: toNumber(row.priceUsd),
    sellerType: "Собственник",
    phone: row.contactPhone,
    whatsapp: row.contactWhatsapp || row.contactPhone.replace(/\s/g, ""),
    isNegotiable: row.isNegotiable,
    image: firstPhoto(photos),
    images: photos,
    features: [],
    description: row.description,
    status: row.status,
    viewsCount: row.viewsCount,
    userId: row.userId,
  };
}
