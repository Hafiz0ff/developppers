import { NextRequest, NextResponse } from "next/server";
import { getPublicationsActor } from "@/lib/publications/auth-guard";
import { getOwnedPublishableObjects } from "@/lib/publications/ownership";

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
    const actor = await getPublicationsActor(req);

    if (!actor) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized",
          message: "Требуется авторизация для доступа к модулю публикации",
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
          message: "Доступ к модулю публикации разрешён только риэлторам и застройщикам",
        },
        { status: 403 }
      );
    }

    // Strict ownership filtering: returns ONLY objects owned by this actor
    const items = await getOwnedPublishableObjects(actor.role, actor.id);

    return NextResponse.json({
      success: true,
      role: actor.role,
      actorId: actor.id,
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
