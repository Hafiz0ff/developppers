/**
 * MASKANI.TJ — Module «Object Publication» (Модуль «Публикация объектов»)
 * Conforms to Specification v1.1 (Sections 4, 7, 8, 11)
 *
 * Single Source of Truth for generating universal text publications from existing listings.
 * Pure programmatic logic without AI hallucinations or external LLM dependencies.
 */

import { type Locale } from "@/lib/seo/taxonomy-store";
import { resolveListingUrl, type ResolvableListing } from "@/lib/seo/url-resolver";
import { type CatalogProperty } from "@/lib/catalog-data";
import { type ProjectData, type DeveloperData } from "@/lib/data/mock-db";

export type PublishableObjectType = "classified" | "project";

export interface PublicationTargetOptions {
  telegram?: boolean;
  whatsapp?: boolean;
  instagram?: boolean;
  vkontakte?: boolean;
}

export interface PreparedPublicationMaterial {
  objectId: string;
  objectType: PublishableObjectType;
  locale: Locale;
  title: string;
  text: string;
  canonicalUrl: string;
  images: string[];
  contacts: {
    phone?: string;
    whatsapp?: string;
  };
  hasPhotos: boolean;
  photosCount: number;
  statusNotice: string;
}

export interface PublicationBuildError {
  error: "not_found" | "forbidden" | "not_published" | "no_translation" | "invalid_data";
  message: string;
}

/**
 * Formats standard price with currency symbol and thousands separator
 */
export function formatPublicationPrice(priceTjs: number, priceUsd?: number, locale: Locale = "ru"): string {
  const tjsFormatted = new Intl.NumberFormat(locale === "tg" ? "tg-TJ" : locale === "en" ? "en-US" : "ru-RU").format(priceTjs);
  const currencyLabel = locale === "tg" ? "сомонӣ" : locale === "en" ? "TJS" : "сомони";

  if (priceUsd && priceUsd > 0) {
    const usdFormatted = new Intl.NumberFormat("en-US").format(priceUsd);
    return `${tjsFormatted} ${currencyLabel} (~$${usdFormatted})`;
  }

  return `${tjsFormatted} ${currencyLabel}`;
}

/**
 * Checks whether an object has an authentic published translation for the requested locale
 * Rule TZ 8.1: Do not mix languages or machine-translate. Reject if translation is missing.
 */
export function hasPublishedTranslation(
  item: CatalogProperty | ProjectData,
  locale: Locale
): boolean {
  if (locale === "ru") {
    // Russian is the base published version for all seeded items
    return true;
  }

  if (locale === "tg") {
    if ("titleTg" in item && item.titleTg && item.titleTg.trim().length > 0) {
      return true;
    }
    if ("nameTg" in item && item.nameTg && item.nameTg.trim().length > 0) {
      return true;
    }
    return false;
  }

  if (locale === "en") {
    // Check if English translation fields exist
    const hasTitleEn = "titleEn" in item && Boolean((item as unknown as Record<string, unknown>).titleEn);
    const hasNameEn = "nameEn" in item && Boolean((item as unknown as Record<string, unknown>).nameEn);
    // In our system, if English is published, titleEn / nameEn must be non-empty
    return hasTitleEn || hasNameEn;
  }

  return false;
}

/**
 * Builds universal publication text for a Classified Listing (Вторичка, Дома, Аренда)
 * Structure according to TZ Section 7.1:
 * 1. Заголовок
 * 2. Цена и валюта
 * 3. Местоположение
 * 4. Основные характеристики
 * 5. Исходное описание
 * 6. Контакты
 * 7. Актуальная ссылка Maskani.tj
 */
export function buildClassifiedPublicationText(
  property: CatalogProperty,
  locale: Locale = "ru",
  origin: string = "https://maskani.tj"
): { text: string; title: string; canonicalUrl: string } {
  const isTg = locale === "tg";
  const isEn = locale === "en";

  const title = isTg
    ? property.titleTg || property.title
    : isEn
    ? (property as unknown as Record<string, string>).titleEn || property.title
    : property.title;

  const priceStr = formatPublicationPrice(property.priceTjs, property.priceUsd, locale);

  const city = isTg ? property.cityTg || property.city : property.city;
  const district = isTg ? property.districtTg || property.district : property.district;
  const landmark = isTg ? property.landmarkTg || property.landmark : property.landmark;

  // Resolve Canonical URL via central URL-service (TZ Section 8.2)
  const resolvable: ResolvableListing = {
    id: property.id,
    title: property.title,
    dealType: property.dealType,
    propertyType: property.propertyType,
    city: property.city,
    district: property.district,
    priceTjs: property.priceTjs,
    priceUsd: property.priceUsd,
  };
  const canonicalPath = resolveListingUrl(resolvable, locale);
  const canonicalUrl = `${origin.replace(/\/$/, "")}${canonicalPath}`;

  // Localized Labels
  const labels = {
    price: isTg ? "Нарх" : isEn ? "Price" : "Цена",
    area: isTg ? "Масоҳат" : isEn ? "Area" : "Площадь",
    rooms: isTg ? "Ҳуҷраҳо" : isEn ? "Rooms" : "Комнат",
    floor: isTg ? "Ошёна" : isEn ? "Floor" : "Этаж",
    location: isTg ? "Макон" : isEn ? "Location" : "Местоположение",
    description: isTg ? "Тавсиф" : isEn ? "Description" : "Описание",
    contacts: isTg ? "Тамос" : isEn ? "Contacts" : "Контакты",
    more: isTg ? "Маълумоти бештар дар сомона" : isEn ? "View on Maskani" : "Подробнее на Maskani.tj",
  };

  const lines: string[] = [];

  // 1. Title
  lines.push(title);
  lines.push("");

  // 2. Price
  lines.push(`${labels.price}: ${priceStr}`);

  // 3. Location
  const locParts = [city, district, landmark].filter(Boolean);
  if (locParts.length > 0) {
    lines.push(`${labels.location}: ${locParts.join(", ")}`);
  }

  // 4. Characteristics
  if (property.area) {
    lines.push(`${labels.area}: ${property.area} м²`);
  }
  if (property.rooms) {
    lines.push(`${labels.rooms}: ${property.rooms}`);
  }
  const floorVal = isTg ? property.floorTg || property.floor : property.floor;
  if (floorVal) {
    lines.push(`${labels.floor}: ${floorVal}`);
  }
  const landVal = isTg ? property.landAreaTg || property.landArea : property.landArea;
  if (landVal) {
    lines.push(`${isTg ? "Қитъаи замин" : isEn ? "Land Plot" : "Участок"}: ${landVal}`);
  }

  // 5. Description
  const desc = isTg ? property.descriptionTg || property.description : property.description;
  if (desc && desc.trim().length > 0) {
    lines.push("");
    lines.push(`${labels.description}:`);
    lines.push(desc.trim());
  }

  // 6. Public Contacts
  const phoneVal = property.phone;
  if (phoneVal) {
    lines.push("");
    lines.push(`${labels.contacts}: ${phoneVal}`);
  }

  // 7. Canonical URL
  lines.push("");
  lines.push(`${labels.more}: ${canonicalUrl}`);

  return {
    text: lines.join("\n"),
    title,
    canonicalUrl,
  };
}

/**
 * Builds universal publication text for a Developer Project (Новостройки / ЖК)
 */
export function buildProjectPublicationText(
  project: ProjectData,
  developer?: DeveloperData,
  locale: Locale = "ru",
  origin: string = "https://maskani.tj"
): { text: string; title: string; canonicalUrl: string } {
  const isTg = locale === "tg";
  const isEn = locale === "en";

  const title = isTg ? project.nameTg || project.name : project.name;
  const localePrefix = locale === "ru" ? "" : `/${locale}`;
  const canonicalUrl = `${origin.replace(/\/$/, "")}${localePrefix}/projects/${project.slug}`;

  const labels = {
    developer: isTg ? "Сохтмончӣ" : isEn ? "Developer" : "Застройщик",
    priceFrom: isTg ? "Нарх аз" : isEn ? "Price from" : "Цена от",
    pricePerMeter: isTg ? "Нархи 1 м²" : isEn ? "Price per sq.m" : "Цена за метр",
    location: isTg ? "Макон" : isEn ? "Location" : "Местоположение",
    status: isTg ? "Ҳолати сохтмон" : isEn ? "Status" : "Статус",
    installment: isTg ? "Пардохти қисм-қисм" : isEn ? "Installment plan" : "Рассрочка",
    description: isTg ? "Тавсифи лоиҳа" : isEn ? "Project Overview" : "Описание проекта",
    contacts: isTg ? "Шӯъбаи фурӯш" : isEn ? "Sales Office" : "Отдел продаж",
    more: isTg ? "Маълумоти бештар ва ҷадвали шоҳмотӣ" : isEn ? "Project details & floor plans" : "Подробнее и шахматка на Maskani.tj",
  };

  const statusMap = {
    ready: isTg ? "Супорида шудааст" : isEn ? "Ready" : "Сдан",
    under_construction: isTg
      ? `Дар ҳоли сохтмон (${project.deadlineQuarter}-кв. ${project.deadlineYear})`
      : isEn
      ? `Under Construction (Q${project.deadlineQuarter} ${project.deadlineYear})`
      : `Строится (${project.deadlineQuarter} кв. ${project.deadlineYear})`,
    planned: isTg ? "Дар нақша" : isEn ? "Planned" : "В проекте",
  };

  const lines: string[] = [];

  // 1. Title
  lines.push(title);
  lines.push("");

  // 2. Developer
  if (developer) {
    lines.push(`${labels.developer}: ${isTg ? developer.nameTg || developer.name : developer.name}`);
  }

  // 3. Status
  lines.push(`${labels.status}: ${statusMap[project.status] || project.status}`);

  // 4. Price
  if (project.minTotalPriceTjs > 0) {
    const minPriceFormatted = formatPublicationPrice(project.minTotalPriceTjs, project.minTotalPriceUsd, locale);
    lines.push(`${labels.priceFrom}: ${minPriceFormatted}`);
  }
  if (project.minPricePerMeterTjs > 0) {
    const meterPriceFormatted = formatPublicationPrice(project.minPricePerMeterTjs, project.minPricePerMeterUsd, locale);
    lines.push(`${labels.pricePerMeter}: ${meterPriceFormatted}`);
  }

  // 5. Installment terms
  if (project.hasInstallment) {
    const instStr = isTg
      ? `то ${project.installmentMonths} моҳ (пешпардохт аз ${project.installmentDownPaymentPercent}%)`
      : isEn
      ? `up to ${project.installmentMonths} months (down payment from ${project.installmentDownPaymentPercent}%)`
      : `до ${project.installmentMonths} мес. (взнос от ${project.installmentDownPaymentPercent}%)`;
    lines.push(`${labels.installment}: ${instStr}`);
  }

  // 6. Location
  const city = isTg ? project.city : project.city;
  const district = isTg ? project.districtTg || project.district : project.district;
  const address = isTg ? project.addressTg || project.address : project.address;
  lines.push(`${labels.location}: ${[city, district, address].filter(Boolean).join(", ")}`);

  // 7. Description
  const desc = isTg ? project.descriptionTg || project.description : project.description;
  if (desc && desc.trim().length > 0) {
    lines.push("");
    lines.push(`${labels.description}:`);
    lines.push(desc.trim());
  }

  // 8. Contacts
  const phone = developer?.phone || developer?.whatsapp;
  if (phone) {
    lines.push("");
    lines.push(`${labels.contacts}: ${phone}`);
  }

  // 9. Canonical URL
  lines.push("");
  lines.push(`${labels.more}: ${canonicalUrl}`);

  return {
    text: lines.join("\n"),
    title,
    canonicalUrl,
  };
}

/**
 * Prepares complete publication materials for an object with safety and language checks
 */
export function preparePublicationMaterial(params: {
  objectType: PublishableObjectType;
  classified?: CatalogProperty;
  project?: ProjectData;
  developer?: DeveloperData;
  locale: Locale;
  origin?: string;
}): PreparedPublicationMaterial | PublicationBuildError {
  const { objectType, classified, project, developer, locale, origin } = params;

  if (objectType === "classified") {
    if (!classified) {
      return { error: "not_found", message: "Объявление не найдено" };
    }

    if (!hasPublishedTranslation(classified, locale)) {
      return {
        error: "no_translation",
        message:
          locale === "tg"
            ? "Барои забони тоҷикӣ нусхаи нашршуда мавҷуд нест. Лутфан нусхаи дастраси забониро интихоб намоед."
            : locale === "en"
            ? "There is no published version for English. Please select an available language."
            : "Для выбранного языка нет опубликованной версии этого объявления. Выберите доступную языковую версию.",
      };
    }

    const { text, title, canonicalUrl } = buildClassifiedPublicationText(classified, locale, origin);
    const images = Array.isArray(classified.images) && classified.images.length > 0
      ? classified.images
      : classified.image
      ? [classified.image]
      : [];

    return {
      objectId: classified.id,
      objectType: "classified",
      locale,
      title,
      text,
      canonicalUrl,
      images,
      contacts: {
        phone: classified.phone,
        whatsapp: classified.whatsapp,
      },
      hasPhotos: images.length > 0,
      photosCount: images.length,
      statusNotice: "Материалы готовы к публикации",
    };
  }

  if (objectType === "project") {
    if (!project) {
      return { error: "not_found", message: "Жилой комплекс не найден" };
    }

    if (!hasPublishedTranslation(project, locale)) {
      return {
        error: "no_translation",
        message:
          locale === "tg"
            ? "Барои забони тоҷикӣ нусхаи нашршуда мавҷуд нест. Лутфан нусхаи дастраси забониро интихоб намоед."
            : locale === "en"
            ? "There is no published version for English. Please select an available language."
            : "Для выбранного языка нет опубликованной версии этого объявления. Выберите доступную языковую версию.",
      };
    }

    const { text, title, canonicalUrl } = buildProjectPublicationText(project, developer, locale, origin);
    const images: string[] = [];
    if (project.coverImageUrl) images.push(project.coverImageUrl);
    if (Array.isArray(project.images)) {
      for (const img of project.images) {
        if (!images.includes(img)) images.push(img);
      }
    }

    return {
      objectId: project.id,
      objectType: "project",
      locale,
      title,
      text,
      canonicalUrl,
      images,
      contacts: {
        phone: developer?.phone,
        whatsapp: developer?.whatsapp,
      },
      hasPhotos: images.length > 0,
      photosCount: images.length,
      statusNotice: "Материалы готовы к публикации",
    };
  }

  return { error: "invalid_data", message: "Некорректный тип объекта" };
}
