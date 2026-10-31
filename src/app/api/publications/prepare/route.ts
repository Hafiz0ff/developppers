import { NextRequest, NextResponse } from "next/server";
import { getPublicationsActor } from "@/lib/publications/auth-guard";
import { ALL_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, type ProjectData, type DeveloperData } from "@/lib/data/mock-db";
import {
  preparePublicationMaterial,
  type PublishableObjectType,
} from "@/lib/publications/publication-builder";
import { checkObjectOwnership } from "@/lib/publications/ownership";
import { getCanonicalSiteOrigin } from "@/lib/publications/site-origin";
import { type Locale } from "@/lib/seo/taxonomy-store";

export async function POST(req: NextRequest) {
  try {
    const actor = await getPublicationsActor(req);

    if (!actor) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized",
          message: "Требуется авторизация для подготовки публикации",
        },
        { status: 401 }
      );
    }

    const isRealtor = actor.role === "realtor" || actor.role === "agency_agent" || actor.role === "agency";
    const isDeveloper = actor.role === "developer";
    const isSuperAdmin = actor.role === "super_admin" || actor.role === "admin";

    if (!isRealtor && !isDeveloper && !isSuperAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "Доступ разрешён только риэлторам и застройщикам",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { objectId, objectType = "classified", locale = "ru", selectedPhoto } = body;

    if (!objectId) {
      return NextResponse.json(
        { success: false, error: "bad_request", message: "Параметр objectId обязателен" },
        { status: 400 }
      );
    }

    // Strict server-side ownership check (IDOR Protection per Section 3.3)
    const ownership = await checkObjectOwnership({
      objectId,
      objectType: objectType as "classified" | "project",
      actorRole: actor.role,
      actorId: actor.id,
    });

    if (!ownership.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: ownership.reason || "Доступ к чужому объекту заблокирован",
        },
        { status: ownership.statusCode || 403 }
      );
    }

    // Trusted origin from environment (Point 8 - Prevents Host spoofing)
    const origin = getCanonicalSiteOrigin();

    let classifiedItem: CatalogProperty | undefined = undefined;
    let projectItem: ProjectData | undefined = undefined;
    let developerItem: DeveloperData | undefined = undefined;

    if (objectType === "classified") {
      classifiedItem = ownership.object as CatalogProperty;
    } else if (objectType === "project") {
      projectItem = ownership.object as ProjectData;
      developerItem = INITIAL_DEVELOPERS.find((d) => d.id === projectItem?.developerId);
    } else {
      return NextResponse.json(
        { success: false, error: "invalid_type", message: "Некорректный тип объекта" },
        { status: 400 }
      );
    }

    const result = preparePublicationMaterial({
      objectType: objectType as PublishableObjectType,
      classified: classifiedItem,
      project: projectItem,
      developer: developerItem,
      locale: locale as Locale,
      origin,
      selectedPhoto,
    });

    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      material: result,
      validPhotos: ownership.validPhotos,
    });
  } catch (error) {
    console.error("Publications Prepare POST error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Ошибка подготовки публикации" },
      { status: 500 }
    );
  }
}
