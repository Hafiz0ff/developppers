import { NextRequest, NextResponse } from "next/server";
import { getClassifiedsActor } from "@/lib/classifieds/session";
import { ALL_PROPERTIES } from "@/lib/catalog-data";
import { INITIAL_PROJECTS } from "@/lib/data/mock-db";
import {
  collectPublicImagesForZip,
  buildZipArchive,
} from "@/lib/publications/zip-builder";

export async function GET(req: NextRequest) {
  try {
    const actor = await getClassifiedsActor();
    const { searchParams } = new URL(req.url);

    const objectId = searchParams.get("objectId");
    const objectType = searchParams.get("objectType") || "classified";
    const demoRole = searchParams.get("demoRole");

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
          message: "Доступ к скачиванию фотографий разрешён только риэлторам и застройщикам",
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

    const imagePaths: string[] = [];

    if (objectType === "classified") {
      const prop = ALL_PROPERTIES.find((p) => p.id === objectId);
      if (!prop) {
        return NextResponse.json(
          { success: false, error: "not_found", message: "Объявление не найдено" },
          { status: 404 }
        );
      }
      if (Array.isArray(prop.images) && prop.images.length > 0) {
        imagePaths.push(...prop.images);
      } else if (prop.image) {
        imagePaths.push(prop.image);
      }
    } else if (objectType === "project") {
      const proj = INITIAL_PROJECTS.find((p) => p.id === objectId);
      if (!proj) {
        return NextResponse.json(
          { success: false, error: "not_found", message: "Жилой комплекс не найден" },
          { status: 404 }
        );
      }
      if (proj.coverImageUrl) imagePaths.push(proj.coverImageUrl);
      if (Array.isArray(proj.images)) {
        for (const img of proj.images) {
          if (!imagePaths.includes(img)) imagePaths.push(img);
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: "invalid_type", message: "Некорректный тип объекта" },
        { status: 400 }
      );
    }

    if (imagePaths.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "no_photos",
          message: "У объявления пока нет доступных фотографий",
        },
        { status: 400 }
      );
    }

    // Collect safe public images and build ZIP buffer
    const files = collectPublicImagesForZip(imagePaths, `maskani-${objectId}`);
    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "no_photos_on_disk",
          message: "Фотографии не найдены в публичном хранилище",
        },
        { status: 404 }
      );
    }

    const zipBuffer = buildZipArchive(files);

    return new NextResponse(zipBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="maskani-${objectId}-photos.zip"`,
        "Cache-Control": "no-store, private",
      },
    });
  } catch (error) {
    console.error("Publications Download Photos GET error:", error);
    return NextResponse.json(
      { success: false, error: "internal_error", message: "Ошибка при формировании архива" },
      { status: 500 }
    );
  }
}
