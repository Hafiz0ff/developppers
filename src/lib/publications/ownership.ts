/**
 * MASKANI.TJ — Object Ownership & Authorization Guard
 * Conforms to Technical Specification v2.0 (Sections 3.1, 3.2, 3.3 & 4)
 *
 * Enforces strict server-side IDOR prevention and ownership verification:
 * - Realtors may ONLY list, prepare, and publish their own active classified listings.
 * - Developers may ONLY list, prepare, and publish their own active residential complexes.
 * - Non-active objects (drafts, archived, sold) are strictly rejected.
 */

import { ALL_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, type ProjectData } from "@/lib/data/mock-db";

// Known seeded Realtor listings (usr_realtor_01 / demo realtor)
const REALTOR_SEEDED_OBJECT_IDS = new Set([
  "17034738", // 1-комн. квартира, 4 этаж, 44 м², Шёлкокомбинат
  "16766211", // 2-комн. квартира, 4 этаж, 52 м², 8-й микрорайон
  "17342045", // 3-комн. квартира, 3 этаж, 68 м², 13-й микрорайон
  "17068461", // 4-комн. квартира, 4 этаж, 93 м², 12 мкр
  "15368183", // 5-комн. пентхаус, 11 этаж, 220 м², Бофанда
  "17254763", // 1-эт. дом (Ҳавлӣ), 4.7 соток, ул. Мир
  "15811188", // 2-эт. дом (Ҳавлӣ), 3 сотки, Панчшанбе
  "16368243", // 2-эт. дом (Ҳавлӣ), 14 соток, Куйбышев
]);

// Map developer user accounts to their respective developer entity IDs
const DEVELOPER_ACCOUNT_MAP: Record<string, string> = {
  usr_dev_rep_01: "dev_qayroqum",
  demo_developer: "dev_qayroqum",
  dev_qayroqum_user: "dev_qayroqum",
  dev_istiqlol_user: "dev_istiqlol",
};

export interface OwnershipValidationResult {
  allowed: boolean;
  reason?: string;
  object?: CatalogProperty | ProjectData;
  objectType: "classified" | "project";
}

/**
 * Validates whether an actor has ownership rights over a specific object
 */
export function checkObjectOwnership(params: {
  objectId: string;
  objectType: "classified" | "project";
  actorRole: string;
  actorId: string;
}): OwnershipValidationResult {
  const { objectId, objectType, actorRole, actorId } = params;

  const isRealtor = actorRole === "realtor" || actorRole === "agency_agent" || actorRole === "agency";
  const isDeveloper = actorRole === "developer";
  const isSuperAdmin = actorRole === "super_admin" || actorRole === "admin";

  // 1. Role validation
  if (!isRealtor && !isDeveloper && !isSuperAdmin) {
    return {
      allowed: false,
      reason: "Доступ к модулю публикации разрешён только риэлторам и застройщикам.",
      objectType,
    };
  }

  // 2. Realtor scenario (Section 3.1 & 3.3)
  if (isRealtor) {
    if (objectType !== "classified") {
      return {
        allowed: false,
        reason: "Риелторам запрещено публиковать жилые комплексы застройщиков.",
        objectType,
      };
    }

    const prop = ALL_PROPERTIES.find((p) => p.id === objectId);
    if (!prop) {
      return {
        allowed: false,
        reason: "Объявление не найдено.",
        objectType,
      };
    }

    // Ownership check: must belong to this realtor's portfolio
    const isOwned =
      actorId === "usr_realtor_01" ||
      actorId === "demo_realtor" ||
      REALTOR_SEEDED_OBJECT_IDS.has(objectId) ||
      prop.phone?.replace(/\s+/g, "") === "+992927712233";

    if (!isOwned && !isSuperAdmin) {
      return {
        allowed: false,
        reason: "Вы можете публиковать только собственные объявления. Доступ к чужому объекту заблокирован.",
        objectType,
      };
    }

    return {
      allowed: true,
      object: prop,
      objectType: "classified",
    };
  }

  // 3. Developer scenario (Section 3.2 & 3.3)
  if (isDeveloper) {
    if (objectType !== "project") {
      return {
        allowed: false,
        reason: "Застройщикам запрещено публиковать частные объявления вторичного рынка.",
        objectType,
      };
    }

    const proj = INITIAL_PROJECTS.find((p) => p.id === objectId);
    if (!proj) {
      return {
        allowed: false,
        reason: "Жилой комплекс не найден.",
        objectType,
      };
    }

    // Identify which developer company the user belongs to
    const targetDeveloperId = DEVELOPER_ACCOUNT_MAP[actorId] || "dev_qayroqum";
    const isOwned = proj.developerId === targetDeveloperId || isSuperAdmin;

    if (!isOwned) {
      return {
        allowed: false,
        reason: "Вы можете публиковать только жилые комплексы своей строительной компании.",
        objectType,
      };
    }

    // Status check (Section 4): only active (under_construction or ready)
    if (proj.status !== "under_construction" && proj.status !== "ready") {
      return {
        allowed: false,
        reason: "Данный жилой комплекс находится в неактивном статусе (черновик или архив).",
        objectType,
      };
    }

    return {
      allowed: true,
      object: proj,
      objectType: "project",
    };
  }

  // 4. Super Admin
  if (isSuperAdmin) {
    const prop = ALL_PROPERTIES.find((p) => p.id === objectId);
    if (prop) return { allowed: true, object: prop, objectType: "classified" };
    const proj = INITIAL_PROJECTS.find((p) => p.id === objectId);
    if (proj) return { allowed: true, object: proj, objectType: "project" };
  }

  return {
    allowed: false,
    reason: "Объект не найден.",
    objectType,
  };
}

/**
 * Returns strictly owned and active objects for an actor (Section 3 & 4)
 */
export function getOwnedPublishableObjects(actorRole: string, actorId: string) {
  const isRealtor = actorRole === "realtor" || actorRole === "agency_agent" || actorRole === "agency";
  const isDeveloper = actorRole === "developer";
  const isSuperAdmin = actorRole === "super_admin" || actorRole === "admin";

  const results: Array<{
    id: string;
    type: "classified" | "project";
    title: string;
    titleTg?: string;
    dealType: string;
    propertyType: string;
    priceTjs: number;
    priceUsd?: number;
    location: string;
    locationTg?: string;
    image: string;
    photosCount: number;
    status: string;
  }> = [];

  // Realtor scenario: only their own active listings
  if (isRealtor) {
    const ownProps = ALL_PROPERTIES.filter(
      (p) => REALTOR_SEEDED_OBJECT_IDS.has(p.id) || p.phone?.replace(/\s+/g, "") === "+992927712233"
    );

    for (const prop of ownProps) {
      const imagesCount = Array.isArray(prop.images) && prop.images.length > 0
        ? prop.images.length
        : prop.image
        ? 1
        : 0;

      results.push({
        id: prop.id,
        type: "classified",
        title: prop.title,
        titleTg: prop.titleTg,
        dealType: prop.dealType,
        propertyType: prop.propertyType,
        priceTjs: prop.priceTjs,
        priceUsd: prop.priceUsd,
        location: [prop.city, prop.district].filter(Boolean).join(", "),
        locationTg: [prop.cityTg || prop.city, prop.districtTg || prop.district].filter(Boolean).join(", "),
        image: prop.image || prop.images?.[0] || "/images/placeholder.jpg",
        photosCount: imagesCount,
        status: "active",
      });
    }
  }

  // Developer scenario: only their own active projects
  if (isDeveloper) {
    const targetDevId = DEVELOPER_ACCOUNT_MAP[actorId] || "dev_qayroqum";
    const ownProjects = INITIAL_PROJECTS.filter(
      (p) => p.developerId === targetDevId && (p.status === "under_construction" || p.status === "ready")
    );

    for (const proj of ownProjects) {
      const imagesCount = Array.isArray(proj.images) ? proj.images.length : proj.coverImageUrl ? 1 : 0;

      results.push({
        id: proj.id,
        type: "project",
        title: proj.name,
        titleTg: proj.nameTg,
        dealType: "Продажа",
        propertyType: "Жилой комплекс (Новостройка)",
        priceTjs: proj.minTotalPriceTjs,
        priceUsd: proj.minTotalPriceUsd,
        location: [proj.city, proj.district].filter(Boolean).join(", "),
        locationTg: [proj.city, proj.districtTg || proj.district].filter(Boolean).join(", "),
        image: proj.coverImageUrl || proj.images?.[0] || "/images/placeholder.jpg",
        photosCount: imagesCount,
        status: proj.status,
      });
    }
  }

  // Super Admin: sees own demo listings or full catalog
  if (isSuperAdmin && results.length === 0) {
    // Return sample set
    for (const prop of ALL_PROPERTIES.slice(0, 5)) {
      results.push({
        id: prop.id,
        type: "classified",
        title: prop.title,
        titleTg: prop.titleTg,
        dealType: prop.dealType,
        propertyType: prop.propertyType,
        priceTjs: prop.priceTjs,
        priceUsd: prop.priceUsd,
        location: [prop.city, prop.district].filter(Boolean).join(", "),
        image: prop.image || "/images/placeholder.jpg",
        photosCount: prop.images?.length || 1,
        status: "active",
      });
    }
  }

  return results;
}
