/**
 * MASKANI.TJ — Object Ownership & Authorization Guard (Hardened v2.0)
 * Conforms to Technical Specification v2.0 (Sections 3.1, 3.2, 3.3 & 4)
 *
 * Enforces strict server-side IDOR prevention and ownership verification:
 * - Realtors may ONLY list, prepare, and publish their own active classified listings.
 * - Developers may ONLY list, prepare, and publish their own active residential complexes.
 * - Cross-account access is strictly forbidden (403 Forbidden).
 * - Non-active objects (drafts, archived, sold) are strictly rejected.
 * - Zero global allowlists; zero default company fallbacks.
 */

import { ALL_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, type ProjectData } from "@/lib/data/mock-db";
import { db } from "@/db";
import { classifieds, developers, projects, developerMembers } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Explicit owner assignment for catalog properties in fallback/seed mode
// (matches database seed.ts strictly)
const CATALOG_PROPERTY_OWNERSHIP: Record<string, string> = {
  "16766211": "usr_realtor_01",
  "17342045": "usr_realtor_01",
  "17068461": "usr_realtor_01",
  "15368183": "usr_realtor_01",
  "17254763": "usr_realtor_01",
  "15811188": "usr_realtor_01",
  "16368243": "usr_realtor_01",
  "17034738": "usr_private_01", // Private owner
  // Assign second realtor distinct properties for negative IDOR tests
  "16999001": "usr_realtor_02",
  "16999002": "usr_realtor_02",
};

// Explicit developer company associations for developer accounts
// (strictly 1:1, no default fallbacks for unknown users)
const DEVELOPER_ACCOUNT_MAP: Record<string, string> = {
  usr_dev_rep_01: "dev_qayroqum", // Sales rep of Qayroqum Avenue
  usr_dev_istiqlol: "dev_istiqlol", // Sales rep of Istiqlol Group
  usr_dev_toch: "dev_toch_sohtmon", // Sales rep of Toj Sohtmon
};

export interface OwnershipValidationResult {
  allowed: boolean;
  reason?: string;
  statusCode?: number;
  object?: CatalogProperty | ProjectData;
  objectType: "classified" | "project";
  validPhotos: string[];
}

/**
 * Extracts all valid photo URLs belonging to a verified object
 */
export function getObjectPhotos(item: CatalogProperty | ProjectData): string[] {
  const photos: string[] = [];

  if ("propertyType" in item && "priceTjs" in item) {
    const prop = item as CatalogProperty;
    if (Array.isArray(prop.images) && prop.images.length > 0) {
      for (const img of prop.images) {
        if (img && !photos.includes(img)) photos.push(img);
      }
    } else if (prop.image) {
      photos.push(prop.image);
    }
  } else if ("developerId" in item) {
    const proj = item as ProjectData;
    if (proj.coverImageUrl) photos.push(proj.coverImageUrl);
    if (Array.isArray(proj.images)) {
      for (const img of proj.images) {
        if (img && !photos.includes(img)) photos.push(img);
      }
    }
  }

  return photos;
}

/**
 * Checks whether an actor owns a specific object and whether the object is in an active status.
 * Queries database first, falling back to mock catalog with strict ownership checks.
 */
export async function checkObjectOwnership(params: {
  objectId: string;
  objectType: "classified" | "project";
  actorRole: string;
  actorId: string;
}): Promise<OwnershipValidationResult> {
  const { objectId, objectType, actorRole, actorId } = params;

  const isRealtor = actorRole === "realtor" || actorRole === "agency_agent" || actorRole === "agency";
  const isDeveloper = actorRole === "developer";
  const isSuperAdmin = actorRole === "super_admin" || actorRole === "admin";

  // 1. Role validation
  if (!isRealtor && !isDeveloper && !isSuperAdmin) {
    return {
      allowed: false,
      reason: "Доступ к модулю публикации разрешён только риэлторам и застройщикам.",
      statusCode: 403,
      objectType,
      validPhotos: [],
    };
  }

  // 2. Realtor scenario (Section 3.1 & 3.3)
  if (isRealtor) {
    if (objectType !== "classified") {
      return {
        allowed: false,
        reason: "Риелторам запрещено публиковать жилые комплексы застройщиков.",
        statusCode: 403,
        objectType,
        validPhotos: [],
      };
    }

    // Try database first
    try {
      const dbRows = await db
        .select()
        .from(classifieds)
        .where(eq(classifieds.id, objectId))
        .limit(1);

      if (dbRows.length > 0) {
        const row = dbRows[0];
        if (row.userId !== actorId && !isSuperAdmin) {
          return {
            allowed: false,
            reason: "Вы можете публиковать только собственные объявления. Доступ к чужому объекту заблокирован.",
            statusCode: 403,
            objectType: "classified",
            validPhotos: [],
          };
        }
        if (row.status !== "active") {
          return {
            allowed: false,
            reason: "Данное объявление находится в неактивном статусе (черновик, архив или продано).",
            statusCode: 400,
            objectType: "classified",
            validPhotos: [],
          };
        }

        // Convert DB row to CatalogProperty structure for publication builder
        const photos = Array.isArray(row.photos) ? (row.photos as string[]) : [];
        const convertedProp: CatalogProperty = {
          id: row.id,
          lat: Number(row.latitude) || 40.28,
          lng: Number(row.longitude) || 69.62,
          alias: row.id,
          slug: row.slug,
          title: row.title,
          dealType: row.dealType === "sale" ? "Продажа" : "Аренда",
          propertyType: row.propertyType === "house" ? "Дом / Ҳавлӣ" : "Квартира",
          city: "г. Худжанд",
          district: row.district || "",
          landmark: row.landmark || "",
          rooms: row.roomsCount || 1,
          area: Number(row.totalArea) || 0,
          floor: `${row.floor || 1} из ${row.floorsCount || 5} этаж`,
          priceTjs: Number(row.priceTjs) || 0,
          priceUsd: Number(row.priceUsd) || 0,
          sellerType: "Риелтор",
          phone: row.contactPhone || "",
          whatsapp: row.contactWhatsapp || "",
          isNegotiable: row.isNegotiable,
          features: [],
          description: row.description,
          image: photos.length > 0 ? photos[0] : "/images/placeholder.jpg",
          images: photos,
        };

        return {
          allowed: true,
          object: convertedProp,
          objectType: "classified",
          validPhotos: getObjectPhotos(convertedProp),
        };
      }
    } catch {
      // In case DB is offline/unavailable, continue to catalog fallback
    }

    // Catalog fallback with strict user ownership check
    const prop = ALL_PROPERTIES.find((p) => p.id === objectId);
    if (!prop) {
      return {
        allowed: false,
        reason: "Объявление не найдено.",
        statusCode: 404,
        objectType,
        validPhotos: [],
      };
    }

    // Strict ownership verification:
    // Check if this property belongs to this actorId specifically
    const ownerId = CATALOG_PROPERTY_OWNERSHIP[objectId];
    const isOwner = isSuperAdmin || (ownerId !== undefined && ownerId === actorId);

    if (!isOwner) {
      return {
        allowed: false,
        reason: "Вы можете публиковать только собственные объявления. Доступ к чужому объекту заблокирован.",
        statusCode: 403,
        objectType,
        validPhotos: [],
      };
    }

    return {
      allowed: true,
      object: prop,
      objectType: "classified",
      validPhotos: getObjectPhotos(prop),
    };
  }

  // 3. Developer scenario (Section 3.2 & 3.3)
  if (isDeveloper) {
    if (objectType !== "project") {
      return {
        allowed: false,
        reason: "Застройщикам запрещено публиковать частные объявления вторичного рынка.",
        statusCode: 403,
        objectType,
        validPhotos: [],
      };
    }

    // Determine the developer company associated with this user
    let userDevCompanyId: string | null = DEVELOPER_ACCOUNT_MAP[actorId] || null;

    // Check DB for developer company relationship
    try {
      if (!userDevCompanyId) {
        const devMembers = await db
          .select({ developerId: developerMembers.developerId })
          .from(developerMembers)
          .where(eq(developerMembers.userId, actorId))
          .limit(1);

        if (devMembers.length > 0) {
          userDevCompanyId = devMembers[0].developerId;
        } else {
          const devCreated = await db
            .select({ id: developers.id })
            .from(developers)
            .where(eq(developers.createdById, actorId))
            .limit(1);
          if (devCreated.length > 0) {
            userDevCompanyId = devCreated[0].id;
          }
        }
      }
    } catch {
      // DB offline, rely on DEVELOPER_ACCOUNT_MAP
    }

    // If developer user is not mapped to any developer company, deny access!
    if (!userDevCompanyId && !isSuperAdmin) {
      return {
        allowed: false,
        reason: "Ваш аккаунт не привязан ни к одной компании-застройщику.",
        statusCode: 403,
        objectType,
        validPhotos: [],
      };
    }

    // Try DB for project
    try {
      const dbProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.id, objectId))
        .limit(1);

      if (dbProjects.length > 0) {
        const projRow = dbProjects[0];
        if (projRow.developerId !== userDevCompanyId && !isSuperAdmin) {
          return {
            allowed: false,
            reason: "Вы можете публиковать только жилые комплексы своей строительной компании.",
            statusCode: 403,
            objectType: "project",
            validPhotos: [],
          };
        }
        if (projRow.status !== "under_construction" && projRow.status !== "ready") {
          return {
            allowed: false,
            reason: "Жилой комплекс находится в неактивном статусе (черновик или архив).",
            statusCode: 400,
            objectType: "project",
            validPhotos: [],
          };
        }
      }
    } catch {
      // DB offline
    }

    // Catalog fallback
    const proj = INITIAL_PROJECTS.find((p) => p.id === objectId);
    if (!proj) {
      return {
        allowed: false,
        reason: "Жилой комплекс не найден.",
        statusCode: 404,
        objectType,
        validPhotos: [],
      };
    }

    const isOwner = isSuperAdmin || (userDevCompanyId !== null && proj.developerId === userDevCompanyId);

    if (!isOwner) {
      return {
        allowed: false,
        reason: "Вы можете публиковать только жилые комплексы своей строительной компании.",
        statusCode: 403,
        objectType,
        validPhotos: [],
      };
    }

    // Status check (Section 4): only active (under_construction or ready)
    if (proj.status !== "under_construction" && proj.status !== "ready") {
      return {
        allowed: false,
        reason: "Данный жилой комплекс находится в неактивном статусе (черновик или архив).",
        statusCode: 400,
        objectType,
        validPhotos: [],
      };
    }

    return {
      allowed: true,
      object: proj,
      objectType: "project",
      validPhotos: getObjectPhotos(proj),
    };
  }

  // 4. Super Admin
  if (isSuperAdmin) {
    const prop = ALL_PROPERTIES.find((p) => p.id === objectId);
    if (prop) return { allowed: true, object: prop, objectType: "classified", validPhotos: getObjectPhotos(prop) };
    const proj = INITIAL_PROJECTS.find((p) => p.id === objectId);
    if (proj) return { allowed: true, object: proj, objectType: "project", validPhotos: getObjectPhotos(proj) };
  }

  return {
    allowed: false,
    reason: "Объект не найден.",
    statusCode: 404,
    objectType,
    validPhotos: [],
  };
}

/**
 * Returns strictly owned and active objects for an actor (Section 3 & 4)
 */
export async function getOwnedPublishableObjects(actorRole: string, actorId: string) {
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
    // 1. Try DB first
    try {
      const dbRows = await db
        .select()
        .from(classifieds)
        .where(and(eq(classifieds.userId, actorId), eq(classifieds.status, "active")));

      if (dbRows.length > 0) {
        for (const row of dbRows) {
          const imgs = Array.isArray(row.photos) ? (row.photos as string[]) : [];
          results.push({
            id: row.id,
            type: "classified",
            title: row.title,
            dealType: row.dealType === "sale" ? "Продажа" : "Аренда",
            propertyType: row.propertyType === "house" ? "Дом / Ҳавлӣ" : "Квартира",
            priceTjs: Number(row.priceTjs) || 0,
            priceUsd: Number(row.priceUsd) || 0,
            location: [row.city, row.district].filter(Boolean).join(", "),
            image: imgs[0] || "/images/placeholder.jpg",
            photosCount: imgs.length,
            status: "active",
          });
        }
        return results;
      }
    } catch {
      // DB offline, fallback to catalog
    }

    // 2. Catalog fallback: strictly match CATALOG_PROPERTY_OWNERSHIP
    const ownProps = ALL_PROPERTIES.filter(
      (p) => CATALOG_PROPERTY_OWNERSHIP[p.id] === actorId
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
    let targetDevId = DEVELOPER_ACCOUNT_MAP[actorId] || null;

    // Try DB for company relationship
    try {
      if (!targetDevId) {
        const devMembers = await db
          .select({ developerId: developerMembers.developerId })
          .from(developerMembers)
          .where(eq(developerMembers.userId, actorId))
          .limit(1);

        if (devMembers.length > 0) {
          targetDevId = devMembers[0].developerId;
        }
      }
    } catch {
      // DB offline
    }

    if (!targetDevId && !isSuperAdmin) {
      return []; // No company mapped, returns empty list
    }

    const ownProjects = INITIAL_PROJECTS.filter(
      (p) => (targetDevId ? p.developerId === targetDevId : false) && (p.status === "under_construction" || p.status === "ready")
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

  // Super Admin: sees catalog sample
  if (isSuperAdmin && results.length === 0) {
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
