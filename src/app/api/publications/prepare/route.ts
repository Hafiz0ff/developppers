import { NextRequest, NextResponse } from "next/server";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { ALL_PROPERTIES, type CatalogProperty } from "@/lib/catalog-data";
import { INITIAL_PROJECTS, INITIAL_DEVELOPERS, type ProjectData, type DeveloperData } from "@/lib/data/mock-db";
import {
  preparePublicationMaterial,
  type PublishableObjectType,
} from "@/lib/publications/publication-builder";
import { type Locale } from "@/lib/seo/taxonomy-store";

export async function POST(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const body = await req.json();

    const { objectId, objectType = "classified", locale = "ru", demoRole } = body;

    // Support demoRole or x-demo-role header if not logged in via session
    const effectiveDemoRole = demoRole || req.headers.get("x-demo-role");
    const role = actor?.role || effectiveDemoRole || null;

    const isRealtor = role === "realtor" || role === "agency_agent" || role === "agency";
    const isDeveloper = role === "developer";
    const isSuperAdmin = role === "super_admin" || role === "admin";

    if (!role || (!isRealtor && !isDeveloper && !isSuperAdmin)) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "Доступ разрешён только риэлторам и застройщикам",
        },
        { status: 403 }
      );
    }

    if (!objectId) {
      return NextResponse.json(
        { success: false, error: "bad_request", message: "Параметр objectId обязателен" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "maskani.tj";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    let classifiedItem: CatalogProperty | undefined = undefined;
    let projectItem: ProjectData | undefined = undefined;
    let developerItem: DeveloperData | undefined = undefined;

    if (objectType === "classified") {
      classifiedItem = ALL_PROPERTIES.find((p) => p.id === objectId);
      if (!classifiedItem) {
        return NextResponse.json(
          { success: false, error: "not_found", message: "Объявление не найдено" },
          { status: 404 }
        );
      }
    } else if (objectType === "project") {
      const foundProject = INITIAL_PROJECTS.find((p) => p.id === objectId);
      if (!foundProject) {
        return NextResponse.json(
          { success: false, error: "not_found", message: "Жилой комплекс не найден" },
          { status: 404 }
        );
      }
      projectItem = foundProject;
      developerItem = INITIAL_DEVELOPERS.find((d) => d.id === foundProject.developerId);
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
    });
  } catch (error) {
    console.error("Publications Prepare POST error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Ошибка подготовки публикации" },
      { status: 500 }
    );
  }
}
