import { NextRequest, NextResponse } from "next/server";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { ALL_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, type ProjectData } from "@/lib/data/mock-db";

export interface PublishableObjectSummary {
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
}

export async function GET(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const { searchParams } = new URL(req.url);

    // Support demoRole or x-demo-role header if not logged in via session
    const demoRole = searchParams.get("demoRole") || req.headers.get("x-demo-role");
    const role = actor?.role || demoRole || null;

    // Rule TZ Section 5 & 11: Only Realtor, Agency, Developer, and Super Admin are allowed
    const isRealtor = role === "realtor" || role === "agency_agent" || role === "agency";
    const isDeveloper = role === "developer";
    const isSuperAdmin = role === "super_admin" || role === "admin";

    if (!role || (!isRealtor && !isDeveloper && !isSuperAdmin)) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "Доступ к модулю публикации разрешён только риэлторам и застройщикам",
        },
        { status: 403 }
      );
    }

    const items: PublishableObjectSummary[] = [];

    // 1. If Realtor or Super Admin: gather active published classifieds
    if (isRealtor || isSuperAdmin) {
      for (const prop of ALL_PROPERTIES) {
        const imagesCount = Array.isArray(prop.images) && prop.images.length > 0
          ? prop.images.length
          : prop.image
          ? 1
          : 0;

        items.push({
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

    // 2. If Developer or Super Admin: gather active published projects
    if (isDeveloper || isSuperAdmin) {
      for (const proj of INITIAL_PROJECTS) {
        // Exclude planned/draft if required; only under_construction or ready
        const imagesCount = Array.isArray(proj.images) ? proj.images.length : proj.coverImageUrl ? 1 : 0;

        items.push({
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
          status: proj.status === "ready" ? "ready" : "under_construction",
        });
      }
    }

    return NextResponse.json({
      success: true,
      role,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error("Publications Objects GET error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Ошибка при получении списка объектов" },
      { status: 500 }
    );
  }
}
