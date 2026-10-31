/**
 * MASKANI.TJ — Module «Object Publication» (Модуль «Публикация объектов»)
 * Conforms to Technical Specification v2.0 (Sections 5, 6, 7, 8, 11)
 *
 * Single Source of Truth for generating universal and Telegram-optimized
 * publications from existing listings. Pure programmatic logic without AI hallucinations.
 */

import { type Locale } from "@/lib/seo/taxonomy-store";
import { resolveListingUrl, type ResolvableListing } from "@/lib/seo/url-resolver";
import { type CatalogProperty } from "@/lib/catalog-data";
import { type ProjectData, type DeveloperData } from "@/lib/data/mock-db";

export type PublishableObjectType = "classified" | "project";

export interface PublicationTargetOptions {
  telegram?: boolean;
}

export interface PublicationLimits {
  maxTotal: number; // 1024
  reservedChars: number; // length of contacts + CTA + separators
  maxBodyChars: number; // 1024 - reservedChars
}

export interface PublicationParts {
  title: string;
  editableBody: string;
  protectedContacts: string;
  mandatoryCtaHtml: string;
  mandatoryCtaText: string;
  canonicalUrl: string;
}

export interface PreparedPublicationMaterial {
  objectId: string;
  objectType: PublishableObjectType;
  locale: Locale;
  title: string;
  text: string; // Complete combined text (for copy/legacy)
  editableBody: string; // Permitted for editing by user
  protectedContacts: string; // Locked contacts block
  mandatoryCtaHtml: string; // Locked CTA HTML with anchor
  mandatoryCtaText: string; // Visible CTA anchor text
  canonicalUrl: string;
  images: string[];
  selectedPhoto?: string; // Single selected cover photo
  contacts: {
    phone?: string;
    whatsapp?: string;
  };
  hasPhotos: boolean;
  photosCount: number;
  statusNotice: string;
  limits: PublicationLimits;
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
    const hasTitleEn = "titleEn" in item && Boolean((item as unknown as Record<string, unknown>).titleEn);
    const hasNameEn = "nameEn" in item && Boolean((item as unknown as Record<string, unknown>).nameEn);
    return hasTitleEn || hasNameEn;
  }

  return false;
}

/**
 * Returns the non-editable mandatory Call-to-Action text according to Section 5.2 & 5.3
 */
export function getMandatoryCtaText(role: "realtor" | "developer", locale: Locale = "ru"): string {
  if (role === "realtor") {
    if (locale === "tg") return "Ҳамаи аксҳо ва тафсилоти амвол — дар Maskani.tj";
    if (locale === "en") return "All photos and property details on Maskani.tj";
    return "Все фотографии и подробности объекта — на Maskani.tj";
  } else {
    if (locale === "tg") return "Хонадонро интихоб намуда, тарҳҳо ва шартҳои харидро дар Maskani.tj омӯзед";
    if (locale === "en") return "Choose an apartment, explore floor plans and terms on Maskani.tj";
    return "Выбирайте квартиру, изучайте планировки и условия покупки на Maskani.tj";
  }
}

/**
 * Builds structured publication parts for a Classified Listing (Вторичка, Дома, Аренда)
 * Conforms to TZ v2.0 Sections 5.1 & 5.2.
 */
export function buildClassifiedPublicationParts(
  property: CatalogProperty,
  locale: Locale = "ru",
  origin: string = "https://maskani.tj"
): PublicationParts {
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

  // Resolve Canonical URL via central URL-service (TZ Section 8.2 & 5.2)
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

  const labels = {
    price: isTg ? "Нарх" : isEn ? "Price" : "Цена",
    area: isTg ? "Масоҳат" : isEn ? "Area" : "Площадь",
    rooms: isTg ? "Ҳуҷраҳо" : isEn ? "Rooms" : "Комнат",
    floor: isTg ? "Ошёна" : isEn ? "Floor" : "Этаж",
    location: isTg ? "Макон" : isEn ? "Location" : "Местоположение",
    description: isTg ? "Тавсиф" : isEn ? "Description" : "Описание",
    contacts: isTg ? "Тамос" : isEn ? "Контакты" : "Контакты",
  };

  // 1. Editable Body (Title, Price, Location, Characteristics, Description)
  const bodyLines: string[] = [];
  bodyLines.push(title);
  bodyLines.push("");
  bodyLines.push(`${labels.price}: ${priceStr}`);

  const locParts = [city, district, landmark].filter(Boolean);
  if (locParts.length > 0) {
    bodyLines.push(`${labels.location}: ${locParts.join(", ")}`);
  }

  if (property.area) {
    bodyLines.push(`${labels.area}: ${property.area} м²`);
  }
  if (property.rooms) {
    bodyLines.push(`${labels.rooms}: ${property.rooms}`);
  }
  const floorVal = isTg ? property.floorTg || property.floor : property.floor;
  if (floorVal) {
    bodyLines.push(`${labels.floor}: ${floorVal}`);
  }
  const landVal = isTg ? property.landAreaTg || property.landArea : property.landArea;
  if (landVal) {
    bodyLines.push(`${isTg ? "Қитъаи замин" : isEn ? "Land Plot" : "Участок"}: ${landVal}`);
  }

  const desc = isTg ? property.descriptionTg || property.description : property.description;
  if (desc && desc.trim().length > 0) {
    bodyLines.push("");
    bodyLines.push(`${labels.description}:`);
    bodyLines.push(desc.trim());
  }

  const editableBody = bodyLines.join("\n");

  // 2. Protected Contacts (Section 5.1)
  const phoneVal = property.phone;
  const protectedContacts = phoneVal ? `${labels.contacts}: ${phoneVal}` : "";

  // 3. Mandatory Protected CTA (Section 5.2)
  const ctaText = getMandatoryCtaText("realtor", locale);
  const mandatoryCtaHtml = `<a href="${canonicalUrl}">${ctaText}</a>`;

  return {
    title,
    editableBody,
    protectedContacts,
    mandatoryCtaHtml,
    mandatoryCtaText: ctaText,
    canonicalUrl,
  };
}

/**
 * Builds structured publication parts for a Developer Project (Новостройки / ЖК)
 * Conforms to TZ v2.0 Sections 5.1 & 5.3.
 */
export function buildProjectPublicationParts(
  project: ProjectData,
  developer?: DeveloperData,
  locale: Locale = "ru",
  origin: string = "https://maskani.tj"
): PublicationParts {
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

  // 1. Editable Body
  const bodyLines: string[] = [];
  bodyLines.push(title);
  bodyLines.push("");

  if (developer) {
    bodyLines.push(`${labels.developer}: ${isTg ? developer.nameTg || developer.name : developer.name}`);
  }

  bodyLines.push(`${labels.status}: ${statusMap[project.status] || project.status}`);

  if (project.minTotalPriceTjs > 0) {
    const minPriceFormatted = formatPublicationPrice(project.minTotalPriceTjs, project.minTotalPriceUsd, locale);
    bodyLines.push(`${labels.priceFrom}: ${minPriceFormatted}`);
  }
  if (project.minPricePerMeterTjs > 0) {
    const meterPriceFormatted = formatPublicationPrice(project.minPricePerMeterTjs, project.minPricePerMeterUsd, locale);
    bodyLines.push(`${labels.pricePerMeter}: ${meterPriceFormatted}`);
  }

  if (project.hasInstallment) {
    const instStr = isTg
      ? `то ${project.installmentMonths} моҳ (пешпардохт аз ${project.installmentDownPaymentPercent}%)`
      : isEn
      ? `up to ${project.installmentMonths} months (down payment from ${project.installmentDownPaymentPercent}%)`
      : `до ${project.installmentMonths} мес. (взнос от ${project.installmentDownPaymentPercent}%)`;
    bodyLines.push(`${labels.installment}: ${instStr}`);
  }

  const city = project.city;
  const district = isTg ? project.districtTg || project.district : project.district;
  const address = isTg ? project.addressTg || project.address : project.address;
  bodyLines.push(`${labels.location}: ${[city, district, address].filter(Boolean).join(", ")}`);

  const rawDesc = isTg
    ? project.shortDescriptionTg || project.descriptionTg || project.description
    : project.shortDescription || project.description;
  let desc = (rawDesc || "").trim();
  if (desc.length > 400) {
    const dotIndex = desc.indexOf(".", 250);
    if (dotIndex !== -1 && dotIndex <= 380) {
      desc = desc.slice(0, dotIndex + 1);
    } else {
      desc = `${desc.slice(0, 360)}...`;
    }
  }
  if (desc && desc.length > 0) {
    bodyLines.push("");
    bodyLines.push(`${labels.description}:`);
    bodyLines.push(desc);
  }

  const editableBody = bodyLines.join("\n");

  // 2. Protected Contacts (Section 5.1)
  const phone = developer?.phone || developer?.whatsapp;
  const protectedContacts = phone ? `${labels.contacts}: ${phone}` : "";

  // 3. Mandatory Protected CTA (Section 5.3)
  const ctaText = getMandatoryCtaText("developer", locale);
  const mandatoryCtaHtml = `<a href="${canonicalUrl}">${ctaText}</a>`;

  return {
    title,
    editableBody,
    protectedContacts,
    mandatoryCtaHtml,
    mandatoryCtaText: ctaText,
    canonicalUrl,
  };
}

/**
 * Escapes characters for Telegram HTML parse mode
 */
export function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Assembles final Telegram caption HTML from editable body, protected contacts, and mandatory CTA
 */
export function assembleFinalTelegramCaption(
  editableBody: string,
  protectedContacts: string,
  mandatoryCtaHtml: string
): string {
  const parts: string[] = [];

  const cleanBody = editableBody.trim();
  if (cleanBody) {
    parts.push(escapeTelegramHtml(cleanBody));
  }

  const cleanContacts = protectedContacts.trim();
  if (cleanContacts) {
    parts.push(escapeTelegramHtml(cleanContacts));
  }

  if (mandatoryCtaHtml.trim()) {
    parts.push(mandatoryCtaHtml.trim());
  }

  return parts.join("\n\n");
}

/**
 * Calculates character usage against the strict 1,024 Telegram limit (Section 6 & 6.1)
 */
export function calculateTelegramCharCount(
  editableBody: string,
  protectedContacts: string,
  mandatoryCtaText: string
): {
  totalVisibleChars: number;
  remainingChars: number;
  isOverLimit: boolean;
  reservedChars: number;
  maxAllowedBodyChars: number;
} {
  const bodyLen = editableBody.trim().length;
  const contactsLen = protectedContacts.trim().length;
  const ctaLen = mandatoryCtaText.trim().length;

  // Telegram separates blocks with double newlines
  const separatorsLen = (contactsLen > 0 ? 2 : 0) + (ctaLen > 0 ? 2 : 0);
  const reservedChars = contactsLen + ctaLen + separatorsLen;
  const maxAllowedBodyChars = Math.max(0, 1024 - reservedChars);

  const totalVisibleChars = bodyLen + reservedChars;
  const remainingChars = 1024 - totalVisibleChars;
  const isOverLimit = totalVisibleChars > 1024;

  return {
    totalVisibleChars,
    remainingChars,
    isOverLimit,
    reservedChars,
    maxAllowedBodyChars,
  };
}

/**
 * Backward-compatible full text builder for Classified Listing (v1.1 compatibility)
 */
export function buildClassifiedPublicationText(
  property: CatalogProperty,
  locale: Locale = "ru",
  origin: string = "https://maskani.tj"
): { text: string; title: string; canonicalUrl: string } {
  const parts = buildClassifiedPublicationParts(property, locale, origin);
  const labels = {
    more: locale === "tg" ? "Маълумоти бештар дар сомона" : locale === "en" ? "View on Maskani" : "Подробнее на Maskani.tj",
  };
  const fullText = `${parts.editableBody}\n\n${parts.protectedContacts}\n\n${labels.more}: ${parts.canonicalUrl}`;
  return {
    text: fullText,
    title: parts.title,
    canonicalUrl: parts.canonicalUrl,
  };
}

/**
 * Backward-compatible full text builder for Developer Project (v1.1 compatibility)
 */
export function buildProjectPublicationText(
  project: ProjectData,
  developer?: DeveloperData,
  locale: Locale = "ru",
  origin: string = "https://maskani.tj"
): { text: string; title: string; canonicalUrl: string } {
  const parts = buildProjectPublicationParts(project, developer, locale, origin);
  const labels = {
    more: locale === "tg" ? "Маълумоти бештар ва ҷадвали шоҳмотӣ" : locale === "en" ? "Project details & floor plans" : "Подробнее и шахматка на Maskani.tj",
  };
  const fullText = `${parts.editableBody}\n\n${parts.protectedContacts}\n\n${labels.more}: ${parts.canonicalUrl}`;
  return {
    text: fullText,
    title: parts.title,
    canonicalUrl: parts.canonicalUrl,
  };
}

/**
 * Prepares complete publication materials for an object with safety, ownership and language checks
 */
export function preparePublicationMaterial(params: {
  objectType: PublishableObjectType;
  classified?: CatalogProperty;
  project?: ProjectData;
  developer?: DeveloperData;
  locale: Locale;
  origin?: string;
  selectedPhoto?: string;
}): PreparedPublicationMaterial | PublicationBuildError {
  const { objectType, classified, project, developer, locale, origin = "https://maskani.tj" } = params;

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

    const parts = buildClassifiedPublicationParts(classified, locale, origin);
    const images = Array.isArray(classified.images) && classified.images.length > 0
      ? classified.images
      : classified.image
      ? [classified.image]
      : [];

    const selectedPhoto = params.selectedPhoto || images[0] || "";
    const counts = calculateTelegramCharCount(parts.editableBody, parts.protectedContacts, parts.mandatoryCtaText);

    return {
      objectId: classified.id,
      objectType: "classified",
      locale,
      title: parts.title,
      text: `${parts.editableBody}\n\n${parts.protectedContacts}\n\n${parts.mandatoryCtaText}: ${parts.canonicalUrl}`,
      editableBody: parts.editableBody,
      protectedContacts: parts.protectedContacts,
      mandatoryCtaHtml: parts.mandatoryCtaHtml,
      mandatoryCtaText: parts.mandatoryCtaText,
      canonicalUrl: parts.canonicalUrl,
      images,
      selectedPhoto,
      contacts: {
        phone: classified.phone,
        whatsapp: classified.whatsapp,
      },
      hasPhotos: images.length > 0,
      photosCount: images.length,
      statusNotice: "Материалы готовы к публикации в Telegram",
      limits: {
        maxTotal: 1024,
        reservedChars: counts.reservedChars,
        maxBodyChars: counts.maxAllowedBodyChars,
      },
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

    const parts = buildProjectPublicationParts(project, developer, locale, origin);
    const images: string[] = [];
    if (project.coverImageUrl) images.push(project.coverImageUrl);
    if (Array.isArray(project.images)) {
      for (const img of project.images) {
        if (!images.includes(img)) images.push(img);
      }
    }

    const selectedPhoto = params.selectedPhoto || images[0] || "";
    const counts = calculateTelegramCharCount(parts.editableBody, parts.protectedContacts, parts.mandatoryCtaText);

    return {
      objectId: project.id,
      objectType: "project",
      locale,
      title: parts.title,
      text: `${parts.editableBody}\n\n${parts.protectedContacts}\n\n${parts.mandatoryCtaText}: ${parts.canonicalUrl}`,
      editableBody: parts.editableBody,
      protectedContacts: parts.protectedContacts,
      mandatoryCtaHtml: parts.mandatoryCtaHtml,
      mandatoryCtaText: parts.mandatoryCtaText,
      canonicalUrl: parts.canonicalUrl,
      images,
      selectedPhoto,
      contacts: {
        phone: developer?.phone,
        whatsapp: developer?.whatsapp,
      },
      hasPhotos: images.length > 0,
      photosCount: images.length,
      statusNotice: "Материалы готовы к публикации в Telegram",
      limits: {
        maxTotal: 1024,
        reservedChars: counts.reservedChars,
        maxBodyChars: counts.maxAllowedBodyChars,
      },
    };
  }

  return { error: "invalid_data", message: "Некорректный тип объекта" };
}
